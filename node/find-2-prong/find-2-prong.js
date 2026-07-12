import { distanceBetween, fromTo, interpolate, rotate, translate } from 'flo-vector2d';
import { getOsculatingCircle } from '../point-on-shape/get-osculating-circle.js';
import { getInitialCurvePieces } from './get-initial-bezier-pieces.js';
import { getMedial } from './get-medial/get-medial.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullCurvePieces2 } from './cull-bezier-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { calcSeperationTolerance } from './calc-seperation-tolerance.js';
import { cullCurvePieces1 } from '../closest-boundary-point/cull-bezier-pieces.js';
const { ceil, log2, max, sqrt, abs, sin, cos } = Math;
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
 *
 * @param loops A shape represented by path loops
 * @param maxCoordinate The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape
 * bounding box.
 * @param yPos the source point of the 2-prong to be found
 * @param isHoleClosing `true` if this is a hole-closing two-prong, `false` otherwise
 * @param loopIdx the loop array index
 */
function find2Prong(meta, isHoleClosing, for1Prong, angle, yPos) {
    const { loops, maxCoordinate, squaredDiagonalLength } = meta;
    const { loop } = yPos.curve;
    const minSquaredSeperationTolerance = ((2 ** -21) * maxCoordinate) ** 2;
    const errorTolerance = (2 ** -46) * maxCoordinate;
    const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
    const minCurvature = 1 / maxOsculatingCircleRadius;
    const oneProngTolerance = (2 ** -16) * maxCoordinate;
    const [xO, rO] = getInitialX(angle, isHoleClosing, maxOsculatingCircleRadius, minCurvature, yPos);
    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).
    let curvePieces = getInitialCurvePieces(angle, isHoleClosing, loop, loops, meta, yPos, { center: xO, radius: rO });
    // console.log(curvePieces.length);
    /** The center of the two-prong */
    let _x = xO;
    const y = yPos.p;
    // The lines below is an optimization.
    const xy = sqrt(reduceRadius(maxCoordinate, curvePieces, y, xO));
    _x = interpolate(y, xO, xy / rO);
    /** The antipode of the two-prong */
    let z = undefined;
    curvePieces = cullCurvePieces2(curvePieces, _x, xy);
    curvePieces = cullCurvePieces1(curvePieces, _x);
    const pow = max(0, ceil(log2(maxCoordinate / xy))) + 1; // determines accuracy
    // console.log(pow);
    const { xs, _zs: __zs } = getMedial(pow, curvePieces, _x, yPos, // source point
    // for1Prong && i == 0 && rO !== 1/minCurvature,
    for1Prong, angle);
    const _zs = __zs.map(info => createPos(info.curve, info.t, false));
    const x = xs[0];
    // const _zs = getCloseBoundaryPointsCertified(
    //     pow,
    //     curvePieces,
    //     x,
    //     yPos.curve,  // source point curve
    //     yPos.t,      // source point `t` value
    //     // for1Prong && i == 0 && rO !== 1/minCurvature,
    //     for1Prong,
    //     angle
    // ).map(info => createPos(info.curve, info.t, false));
    z = _zs[0];
    // let maxD = -Infinity;
    // let maxPos: PointOnShape = undefined!;
    // for (const z of _zs) {
    //     if (z === undefined) { continue; }
    //     const _yz = squaredDistanceBetweenDd(yPos.p, z.p);
    //     if (_yz > maxD) {
    //         maxD = _yz;
    //         maxPos = z;
    //     }
    // }
    // const yz = maxD;
    // z = maxPos;
    const yz = squaredDistanceBetweenDd(yPos.p, z.p);
    if (z === undefined || yz === 0) {
        return undefined;
    }
    const xz = squaredDistanceBetweenDd(x, z.p);
    if (for1Prong) {
        if (rO < (1 - oneProngTolerance) * sqrt(xz)) {
            // console.log('1prong');
            add1Prong(meta, rO, xO, yPos);
            return undefined;
        }
    }
    if (!isHoleClosing) {
        const squaredSeperationTolerance = max(calcSeperationTolerance(rO, sqrt(xz), 2 ** 2 * errorTolerance), minSquaredSeperationTolerance);
        if (yz <= squaredSeperationTolerance) {
            // if (typeof _debug_ !== 'undefined') { console.log(`failed: seperation too small - ${sqrt(yz)}`); }
            return undefined;
        }
    }
    // Find the point on the line connecting y with x that is
    // equidistant from y and z. This will be our next x.
    // const nextX = findEquidistantPointOnLineDd(x, yPos.p, z.p);
    // const error = abs(sqrt(xy) - sqrt(xz));
    // x = nextX;
    const circle = { center: x, radius: distanceBetween(x, z.p) };
    return { circle, zs: [z] };
}
/**
 * @internal
*/
function getInitialX(angle, isHoleClosing, maxOsculatingCircleRadius, minCurvature, yPos) {
    let xO; // the original x to mitigate drift
    const p = yPos.p;
    let rO;
    if (isHoleClosing) {
        xO = [p[0], p[1] - maxOsculatingCircleRadius];
        rO = maxOsculatingCircleRadius;
    }
    else {
        if (angle === 0) {
            ({ center: xO, radius: rO } = getOsculatingCircle(minCurvature, yPos));
        }
        else {
            ({ center: xO, radius: rO } = getOsculatingCircle(minCurvature, yPos, true));
            const v = fromTo(yPos.p, xO);
            const v_ = rotate(sin(angle), cos(angle))(v);
            xO = translate(yPos.p)(v_);
        }
    }
    return [xO, rO];
}
export { find2Prong };
//# sourceMappingURL=find-2-prong.js.map