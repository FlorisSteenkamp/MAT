import { fromTo, dot, cross, lineLineIntersection } from 'flo-vector2d';

const { abs, sqrt } = Math;


/**
 * The maximum sine of the angle between the chord and either tangent for
 * which a 'twisted' (inflected) curve is approximated by a straight line -
 * the line then deviates from the true curve by only about a millionth of the
 * chord length.
 *
 * * a relative (angle) tolerance and thus independent of the scale of the
 *   shape and of the magnitude of the given tangents
 *
 * @internal
 */
const SIN_TOLERANCE_USE_LINE = 2**-16;


/**
 * Returns an array of 1 or 2 bezier curves (each a line or a quadratic) that
 * together form a smooth curve from the start point of `l0` to the start point
 * of `l1` such that the curve is tangent to `l0` at its start and tangent to
 * `l1` at its end.
 *
 * * `l0` and `l1` are given as `[p, p + dir]` where `p` is the curve endpoint
 * and `dir` is the tangent direction (of any magnitude; its orientation does
 * not matter)
 * * if the tangent lines are not 'twisted' (they meet strictly between the
 * endpoints along the chord) a single quadratic is returned
 * * if the tangent lines are 'twisted' (the curve must have an inflection)
 * 2 quadratics joined smoothly at the inflection are returned as an
 * approximation - or, if both tangents deviate from the chord by less than
 * `SIN_TOLERANCE_USE_LINE`, a single line
 * * if the endpoints coincide (or a tangent is degenerate) a (degenerate) line
 * is returned
 *
 * FUTURE: a strongly twisted MAT edge indicates that an additional 2-prong
 * should be added so that the edge is approximated by two less twisted ones.
 *
 * @param l0 the tangent line at the start of the curve
 * @param l1 the tangent line at the end of the curve
 *
 * @internal
 */
function getBeziersFromTangents(
        l0: number[][],
        l1: number[][]): number[][][] {

    const p0 = l0[0];
    const p1 = l1[0];

    const c = fromTo(p0,p1);
    if (c[0] === 0 && c[1] === 0) {
        return [[p0, p1]];  // coinciding endpoints - a degenerate line
    }

    const w0 = fromTo(l0[0], l0[1]);
    const w1 = fromTo(l1[0], l1[1]);
    const lc = sqrt(dot(c,c));
    const lw0 = sqrt(dot(w0,w0));
    const lw1 = sqrt(dot(w1,w1));
    if (lw0 === 0 || lw1 === 0) {
        return [[p0, p1]];  // a degenerate tangent - fall back to a line
    }

    const mid = lineLineIntersection(l0, l1);

    let twisted: boolean;
    if (!mid) {
        twisted = true;
    } else {
        const a = fromTo(p0, mid);
        const b = fromTo(p1, mid);

        // (`<= 0` / `>= 0`: an intersection *at* an endpoint, which happens for
        // collinear tangents, would give a degenerate quadratic with a zero
        // end tangent - treat it as twisted so a line results instead)
        twisted = dot(a,c) <= 0 || dot(b,c) >= 0;
    }

    if (!twisted) {
        return [[p0, mid!, p1]];
    }

    // the sines of the angles between the chord and the tangents
    const sin0 = abs(cross(c, w0)) / (lc*lw0);
    const sin1 = abs(cross(c, w1)) / (lc*lw1);

    if (sin0 <= SIN_TOLERANCE_USE_LINE && sin1 <= SIN_TOLERANCE_USE_LINE) {
        return [[p0, p1]];  // within tolerance - a straight line
    }

    // Approximate with 2 quadratic beziers joined smoothly at the inflection.
    // The control points lie on the tangent lines a quarter of the chord
    // length away from the endpoints, on the side facing the other endpoint
    // (for small angles this is the midpoint degree reduction of the cubic
    // having control points at 1/3 and 2/3 along the chord; unlike placing
    // them at 1/4 and 3/4 *along* the chord it stays bounded for any angle).
    const q0 = (dot(w0,c) < 0 ? -1 : 1) * lc/(4*lw0);
    const q1 = (dot(w1,c) < 0 ? 1 : -1) * lc/(4*lw1);
    const c0 = [p0[0] + q0*w0[0], p0[1] + q0*w0[1]];
    const c1 = [p1[0] + q1*w1[0], p1[1] + q1*w1[1]];
    const j = [(c0[0] + c1[0])/2, (c0[1] + c1[1])/2];

    return [[p0, c0, j], [j, c1, p1]];
}


export { getBeziersFromTangents }
