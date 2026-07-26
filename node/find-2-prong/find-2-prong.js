import { getInitialCurvePieces } from './get-initial-bezier-pieces.js';
import { getAntipodalPoints } from './get-medial/get-antipodal-points.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullCurvePieces } from './cull-bezier-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { toP } from '../point-on-shape/to-p.js';
import { calcSeperationTolerance } from './calc-seperation-tolerance.js';
import { getInitialX } from './get-initial-x.js';
import { ddNormal } from 'flo-bezier3';
import { rotate } from 'flo-vector2d';
const { abs, sin, cos, max, sqrt } = Math;
/**
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
 * @param meta
 * @param isHoleClosing `true` if this is a hole-closing two-prong, `false` otherwise
 * @param for1Prong
 * @param angle
 * @param yPos the source point of the 2-prong to be found
 *
 * @internal
 */
function find2Prong(meta) {
    const { loops, maxCoordPowerOf2, squaredDiagonalLength } = meta;
    //----------------------------
    // Initialize some tolerances
    //----------------------------
    const minSquaredSeperationTolerance = (2 ** (maxCoordPowerOf2 - 21)) ** 2;
    const errorTolerance = 2 ** (maxCoordPowerOf2 - 46);
    const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
    const oneProngTolerance = 2 ** (maxCoordPowerOf2 - 32);
    return function find2ProngInner(isHoleClosing, for1Prong, angle, yPos) {
        const { curve: { loop, ps }, t, p: y } = yPos;
        const normDd = ddNormal(ps, t);
        const _nnorm = [-normDd[0][1], -normDd[1][1]]; // Left-handed system (sorry)
        const nnorm = isHoleClosing
            ? [0, -maxOsculatingCircleRadius]
            : (angle !== 0 ? rotate(sin(angle), cos(angle))(_nnorm) : _nnorm);
        const nnormDd = isHoleClosing || angle !== 0
            ? [[0, nnorm[0]], [0, nnorm[1]]]
            : [[-normDd[0][0], -normDd[0][1]], [-normDd[1][0], -normDd[1][1]]];
        // Get initial kissing circle guess
        let [xO, rO] = getInitialX(angle, isHoleClosing, maxOsculatingCircleRadius, yPos, nnorm);
        // The boundary piece that should contain the other point of 
        // the 2-prong circle. (Defined by start and end points).
        const curvePieces = getInitialCurvePieces(angle, isHoleClosing, loop, loops, meta, yPos, xO);
        // The lines below is an optimization.
        const xy2 = reduceRadius(maxCoordPowerOf2, rO, curvePieces, y, nnorm);
        const xy = sqrt(xy2);
        const l = sqrt(nnorm[0] ** 2 + nnorm[1] ** 2);
        xO = [y[0] + nnorm[0] / l * xy, y[1] + nnorm[1] / l * xy];
        cullCurvePieces(curvePieces, xO, xy2);
        const antipodalPoints = getAntipodalPoints(maxCoordPowerOf2, nnorm, nnormDd, yPos, for1Prong, angle, curvePieces);
        // FUTURE - if antipodalPoints.length > 1 let's just add an n-prong;
        if (antipodalPoints.length !== 1) {
            if (antipodalPoints.length === 0) {
                if (isHoleClosing) {
                    console.log(yPos);
                }
                return undefined;
            }
            if (!isHoleClosing && !areAllAntipodesSame(antipodalPoints, maxCoordPowerOf2)) {
                // At this point there is multiple antipodal points (zs) for the given
                // source point so do not add the 2-prong, it will be caught when 
                // adding 3+-prongs.
                return undefined;
            }
        }
        const { x, d, curve, s } = antipodalPoints[0];
        if (for1Prong && rO < (1 - oneProngTolerance) * d) {
            add1Prong(meta, rO, xO, yPos);
            return undefined;
        }
        const pDd = toP(curve.ps, s);
        const p = pDd.map(c => c[0] + c[1]);
        const z = {
            curve, t: s, isSource: false,
            p, pDd
        };
        const circle = { center: x, radius: d };
        const yz = squaredDistanceBetweenDd(yPos.p, z.p);
        const xz = squaredDistanceBetweenDd(x, z.p);
        if (!isHoleClosing) {
            if (yz === 0) {
                return undefined;
            }
            // The lines below eliminate cases where the found 2-prong is too
            // close to a one-prong
            const squaredSeperationTolerance = max(calcSeperationTolerance(rO, sqrt(xz), (2 ** 2) * errorTolerance), minSquaredSeperationTolerance);
            if (yz <= squaredSeperationTolerance) {
                return undefined;
            }
        }
        return { circle, z };
    };
}
/** @internal */
function areAllAntipodesSame(point, maxCoordPowerOf2) {
    const { curve, s: t, x } = point[0];
    const tol = 2 ** (maxCoordPowerOf2 - 40);
    for (let i = 1; i < point.length; i++) {
        // const { curve: curve_, s: t_ } = point[i];
        // if (curve !== curve_ || t !== t_) {
        //     return false;
        // }
        const { x: x_ } = point[i];
        if (abs(x[0] - x_[0]) > tol || abs(x[0] - x_[0]) > tol) {
            return false;
        }
    }
    return true;
}
export { find2Prong };
//# sourceMappingURL=find-2-prong.js.map