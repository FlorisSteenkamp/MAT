import { distanceBetween, fromTo, interpolate, rotate, translate } from 'flo-vector2d';
import { getOsculatingCircle } from '../point-on-shape/get-osculating-circle.js';
import { addDebugInfo } from './add-debug-info.js';
import { findEquidistantPointOnLineDd } from './find-equidistant-point-on-line-dd.js';
import { getInitialBezierPieces } from './get-initial-bezier-pieces.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullBezierPieces2 } from './cull-bezier-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { createPos } from '../point-on-shape/create-pos.js';
const { sqrt, abs, sin, cos } = Math;
/**
 * @internal
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and
 * the second one is found by the algorithm.
 *
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2
 * points.
 *
 * Before any 2-prongs are added the entire shape is our δΩ.
 *
 * As per the paper by Choi, Choi, Moon and Wee:
 *   "The starting point of this algorithm is a choice of a circle Br(x)
 *    centered at an interior point x which contains two boundary portions c and
 *    d of dΩ as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand.
 * @param loops A shape represented by path loops
 * @param extreme The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape
 * bounding box.
 * @param y The source point of the 2-prong to be found
 * @param isHoleClosing True if this is a hole-closing two-prong, false otherwise
 * @param k The loop array index
 */
function find2Prong(angle, loops, extreme, squaredDiagonalLength, cpTrees, y, isHoleClosing, k, for1Prong) {
    const MAX_ITERATIONS = 25;
    const squaredSeperationTolerance = ((2 ** -21) * extreme) ** 2;
    const errorTolerance = (2 ** -46) * extreme;
    const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
    const minCurvature = 1 / maxOsculatingCircleRadius;
    let xO; // the original x to mitigate drift
    const p = y.p;
    let rO;
    if (isHoleClosing) {
        xO = [p[0], p[1] - maxOsculatingCircleRadius];
        rO = maxOsculatingCircleRadius;
    }
    else {
        if (angle === 0) {
            ({ center: xO, radius: rO } = getOsculatingCircle(minCurvature, y));
        }
        else {
            ({ center: xO, radius: rO } = getOsculatingCircle(minCurvature, y, true));
            const v = fromTo(y.p, xO);
            const v_ = rotate(sin(angle), cos(angle))(v);
            xO = translate(y.p)(v_);
        }
    }
    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).
    const { bezierPieces, δ } = getInitialBezierPieces(angle, isHoleClosing, k, loops, cpTrees, y, { center: xO, radius: rO });
    /** The center of the two-prong (successively refined) */
    let x = xO;
    // The lines below is an optimization.
    const r_ = sqrt(reduceRadius(extreme, bezierPieces, p, xO));
    if (rO > r_) {
        x = interpolate(p, xO, r_ / rO);
    }
    /** Trace the convergence (for debugging). */
    const xs = [];
    /** The antipode of the two-prong (successively refined) */
    let zs = undefined;
    let z = undefined;
    let bezierPieces_ = bezierPieces;
    let i = 0;
    while (i < MAX_ITERATIONS) {
        const xy = squaredDistanceBetweenDd(x, y.p);
        if (i < 5) {
            bezierPieces_ = cullBezierPieces2(bezierPieces_, x, xy);
        }
        zs = getCloseBoundaryPointsCertified(bezierPieces_, x, y.curve, y.t, for1Prong && i == 0 && rO !== 1 / minCurvature, angle).map(info => createPos(info.curve, info.t, false));
        z = zs[0];
        if (z === undefined) {
            addDebugInfo2(isHoleClosing);
            return undefined;
        }
        const xz = squaredDistanceBetweenDd(x, z.p);
        const yz = squaredDistanceBetweenDd(y.p, z.p);
        // if on first try
        if (i === 0) {
            if (rO < (1 - 2 ** -6) * sqrt(xz)) {
                add1Prong(rO, xO, cpTrees, y);
                return undefined;
            }
            // return undefined;
        }
        if (typeof _debug_ !== 'undefined') {
            xs.push({ x, y, z: createPos(z.curve, z.t, false), t: y.t });
        }
        if (!isHoleClosing) {
            if (yz <= squaredSeperationTolerance) {
                // if (typeof _debug_ !== 'undefined') { console.log(`failed: seperation too small - ${sqrt(yz)}`); }
                return undefined;
            }
        }
        // Find the point on the line connecting y with x that is  
        // equidistant from y and z. This will be our next x.
        const nextX = findEquidistantPointOnLineDd(x, y.p, z.p);
        const error = abs(sqrt(xy) - sqrt(xz));
        // if (xy < xz) { return undefined; }
        x = nextX;
        if (error < errorTolerance) {
            break;
        }
        i++;
        if (i === MAX_ITERATIONS) {
            // Convergence was too slow.
            if (typeof _debug_ !== 'undefined') {
                console.log('failed (slow): max iterations reached');
            }
            return undefined;
        }
    }
    const circle = { center: x, radius: distanceBetween(x, z.p) };
    if (typeof _debug_ !== 'undefined') {
        addDebugInfo(bezierPieces, false, x, y, z, circle, δ, xs, isHoleClosing);
    }
    return { circle, zs: [z] };
}
function addDebugInfo2(isHoleClosing) {
    if (typeof _debug_ !== 'undefined') {
        const elems = _debug_.generated.elems;
        const elem = isHoleClosing ? elems.twoProng_holeClosing : elems.twoProng_regular;
        const elemStr = isHoleClosing ? 'hole-closing: ' + elem.length : 'regular: ' + elem.length;
        console.log('failed: no closest point - ' + elemStr);
    }
}
export { find2Prong };
//# sourceMappingURL=find-2-prong.js.map