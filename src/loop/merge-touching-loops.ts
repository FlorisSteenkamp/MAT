import type { Curve, Loop } from 'flo-boolean';
import { loopFromBeziers } from 'flo-boolean';
import { eDiff, eMult, eSign, twoDiff } from 'big-float-ts';
import { compareCurvaturesAtInterface } from '../corner/compare-curvatures-at-interface.js';


/**
 * @internal
 * A curve leaving (or, for an incoming curve, reversed so that it leaves) a
 * point where curves of different loops meet.
 */
interface Ray {
    readonly curve: Curve;
    /** `true` if `curve` ends at the point, `false` if it starts there */
    readonly isIn: boolean;
    /** the bezier, starting at the point */
    readonly ps: number[][];
    /** the exact (double-double) direction in which the ray leaves the point */
    readonly dir: number[][];
}


/**
 * @internal
 * Returns the given loops (of a single shape) with loops that touch at a point
 * (i.e. share a vertex) merged into a single boundary walk, e.g. a hole
 * touching the outer loop.
 *
 * Loops that touch at a point are returned separately (by `simplifyPaths`)
 * even when the material near the point lies in thin wedges each bounded by a
 * curve of *both* loops. The boundary walk must then go from the incoming curve
 * of one loop to the outgoing curve of the other so that every pair of
 * consecutive curves is a real corner of the material (and so that a touching
 * hole doesn't need a hole-closer; the medial axis has no cycle around it).
 *
 * At each such point the curves are sorted (exactly) by angle and each
 * incoming curve is followed by the next curve anti-clockwise, i.e. the one on
 * the other side of the material sector. If the loops' own pairing is already
 * correct (e.g. a material island inside a hole touching the hole's boundary)
 * nothing changes.
 *
 * Merges that would split a walk (e.g. a hole touching the outer loop at 2
 * points, which splits the material into 2 parts) are not supported - in that
 * case (or if the pairing cannot be determined) the loops are returned as is.
 *
 * Precondition: the loops are ordered by their topmost points (the order is
 * kept, a merged loop taking the place of its first constituent loop).
 *
 * @param loops
 */
function mergeTouchingLoops(
        loops: Loop[]): Loop[] {

    if (loops.length < 2) { return loops; }

    const raysAt = getRaysAtSharedPoints(loops);
    if (raysAt.length === 0) { return loops; }

    // The curve following each incoming curve where it differs from `next`
    const succ = new Map<Curve, Curve>();
    for (const rays of raysAt) {
        rays.sort(compareRays);
        for (let i=0; i<rays.length; i++) {
            const ray = rays[i];
            const ray_ = rays[(i+1) % rays.length];
            if (!ray.isIn) { continue; }
            if (ray_.isIn || compareRays(ray, ray_) === 0) {
                // inconsistent / unresolvable geometry
                return loops;
            }
            if (ray.curve.next !== ray_.curve) {
                succ.set(ray.curve, ray_.curve);
            }
        }
    }

    if (succ.size === 0) { return loops; }

    // Walk the new successor relation
    const walks: Curve[][] = [];
    const walkOf = new Map<Loop, number>();
    const visited = new Set<Curve>();
    for (const loop of loops) {
        for (const curve of loop.curves) {
            if (visited.has(curve)) { continue; }

            const walk: Curve[] = [];
            let c = curve;
            do {
                visited.add(c);
                walk.push(c);

                const w = walkOf.get(c.loop);
                if (w !== undefined && w !== walks.length) {
                    // the loop is split over 2 walks - not supported
                    return loops;
                }
                walkOf.set(c.loop, walks.length);

                c = succ.get(c) ?? c.next;
            } while (c !== curve);

            walks.push(walk);
        }
    }

    return walks.map((walk, i) => {
        // Unchanged loops are returned as is
        const loop = walk[0].loop;
        if (walk.length === loop.curves.length) { return loop; }

        return loopFromBeziers(walk.map(c => c.ps), i);
    });
}


/**
 * @internal
 * Returns the rays at each point where curves of 2 or more different loops
 * meet (only at curve endpoints).
 */
function getRaysAtSharedPoints(
        loops: Loop[]): Ray[][] {

    const raysAt = new Map<string, Ray[]>();
    const loopsAt = new Map<string, Set<Loop>>();

    const add = (curve: Curve, isIn: boolean) => {
        const ps = isIn ? curve.ps.slice().reverse() : curve.ps;
        const key = `${ps[0][0]},${ps[0][1]}`;

        let rays = raysAt.get(key);
        let loops_ = loopsAt.get(key);
        if (rays === undefined) {
            rays = []; raysAt.set(key, rays);
            loops_ = new Set(); loopsAt.set(key, loops_);
        }
        rays.push({ curve, isIn, ps, dir: getDirection(ps) });
        loops_!.add(curve.loop);
    }

    for (const loop of loops) {
        for (const curve of loop.curves) {
            add(curve, false);
            add(curve, true);
        }
    }

    return [...raysAt]
        .filter(([key]) => loopsAt.get(key)!.size > 1)
        .map(([,rays]) => rays);
}


/**
 * @internal
 * Returns the exact direction in which the given bezier leaves its first
 * point, i.e. `ps[k] - ps[0]` with `k` the first index for which it is not
 * the zero vector (the first non-vanishing derivative at `t = 0` points in
 * that direction).
 */
function getDirection(
        ps: number[][]): number[][] {

    const [x0,y0] = ps[0];
    for (let k=1; k<ps.length; k++) {
        const [x,y] = ps[k];
        if (x !== x0 || y !== y0) {
            return [twoDiff(x,x0), twoDiff(y,y0)];
        }
    }

    return [[0,0],[0,0]];  // a point - should not happen
}


/**
 * @internal
 * Anti-clockwise angular comparison of 2 rays leaving the same point, starting
 * from the positive x-axis.
 *
 * Returns `0` only if the order cannot be determined.
 */
function compareRays(
        a: Ray,
        b: Ray): number {

    const ha = halfPlane(a.dir);
    const hb = halfPlane(b.dir);
    if (ha !== hb) { return ha - hb; }

    const cross = eSign(eDiff(
        eMult(a.dir[0], b.dir[1]),
        eMult(a.dir[1], b.dir[0])
    ));
    if (cross !== 0) { return -cross; }

    // Same direction - the ray curving more anti-clockwise comes later
    return compareCurvaturesAtInterface(a.ps, b.ps);
}


/**
 * @internal
 * Returns `0` for directions with angle in `[0,π)` and `1` for those in
 * `[π,2π)`.
 */
function halfPlane(
        dir: number[][]): number {

    const x = dir[0][1];
    const y = dir[1][1];

    return y > 0 || (y === 0 && x > 0) ? 0 : 1;
}


export { mergeTouchingLoops }
