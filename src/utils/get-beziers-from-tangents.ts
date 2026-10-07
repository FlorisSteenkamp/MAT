import { 
    fromTo, dot, cross, rotate90Degrees, interpolate, translate,
    lineLineIntersection
} from 'flo-vector2d';

const { abs } = Math;


/** @internal */
const TOLERANCE_ADD_2PRONG = 0.01;
/** @internal */
const TOLERANCE_USE_LINE = 0.0001; // else 2 quadratics


/**
 * Returns an array of 1 or 2 bezier curves (each a line or a quadratic) that
 * together form a smooth curve from the start point of `l0` to the start point
 * of `l1` such that the curve is tangent to `l0` at its start and tangent to 
 * `l1` at its end.
 * 
 * * `l0` and `l1` are given as `[p, p + dir]` where `p` is the curve endpoint
 * and `dir` is the tangent direction pointing in the direction of travel along
 * the curve (i.e. into the curve at the start and out of the curve at the end)
 * * if the tangent lines are not 'twisted' a single quadratic is returned
 * * if the tangent lines are 'twisted' (the curve must have an inflection) 
 * either 2 quadratics joined smoothly at the inflection (or, if the deviation 
 * from a straight line is small enough, a single line) are returned as an 
 * approximation
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

    const mid = lineLineIntersection(l0, l1);

    const c = fromTo(p0,p1);

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
        
    const w0 = fromTo(l0[0], l0[1]);
    const w1 = fromTo(l1[0], l1[1]);

    const d0 = abs(cross(c, w0)) / (3*3); 
    const d1 = abs(cross(c, w1)) / (3*3); 

    if (d0 > TOLERANCE_ADD_2PRONG || d1 > TOLERANCE_ADD_2PRONG) {
        // FUTURE - not within tolerance - must add additional 2-prong
        return [[p0, p1]];
    } 

    if (d0 > TOLERANCE_USE_LINE || d1 > TOLERANCE_USE_LINE) {
        // Approximate with 2 quadratic beziers joined smoothly at the 
        // inflection. The control points lie on the tangent lines at 1/4 and
        // 3/4 along the chord (this is the midpoint degree reduction of the 
        // cubic having control points at 1/3 and 2/3 along the chord).
        const r = rotate90Degrees(c);
        const m0 = interpolate(p0,p1,1/4);
        const m1 = interpolate(p0,p1,3/4);
        const c0 = lineLineIntersection(l0, [m0, translate(r, m0)])!;
        const c1 = lineLineIntersection(l1, [m1, translate(r, m1)])!;
        const j = interpolate(c0, c1, 1/2);

        return [[p0, c0, j], [j, c1, p1]];
    } 

    // Within tolerance - approximate with a straight line.
    return [[p0, p1]];
}


export { getBeziersFromTangents }
