import type { Circle } from '../geometry/circle.js';
import type { PointOnShape, PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
import { getInitialCurvePieces } from './get-initial-bezier-pieces.js';
import { getMedial } from './get-medial/get-medial.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullCurvePieces2 } from './cull-bezier-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { /*createPos,*/ toP } from '../point-on-shape/create-pos.js';
import { calcSeperationTolerance } from './calc-seperation-tolerance.js';
import { cullCurvePieces1 } from '../closest-boundary-point/cull-bezier-pieces.js';
import { getInitialX } from './get-initial-x.js';
import { ddNormal, ddTangent } from 'flo-bezier3';
import { interpolate, rotate } from 'flo-vector2d';
import { radToDeg } from '../utils/rad-to-deg.js';
import { CurvePiece } from '../mat/curve-piece.js';

const { sin, cos, ceil, log2, max, sqrt } = Math;


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
 * @param meta
 * @param isHoleClosing `true` if this is a hole-closing two-prong, `false` otherwise
 * @param for1Prong
 * @param angle
  * @param yPos the source point of the 2-prong to be found
 * 
 */
function find2Prong(
        meta: MatMeta,
        isHoleClosing: boolean,
        for1Prong: boolean,
        angle: number,
        yPos: PrePointOnShape): { circle: Circle, z: PrePointOnShape } | undefined {

    const { loops, maxCoordPowerOf2, squaredDiagonalLength } = meta;

    const { loop } = yPos.curve;

    const minSquaredSeperationTolerance = (2**(maxCoordPowerOf2 - 21))**2;
    const errorTolerance = 2**(maxCoordPowerOf2 - 46);
    const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
    const oneProngTolerance = 2**(maxCoordPowerOf2 - 32);

    const { curve: { ps }, t, p: y } = yPos;
    const normDd = ddNormal(ps, t);
    const _nnorm = [-normDd[0][1], -normDd[1][1]];  // Left-handed system
    const nnorm = isHoleClosing
        ? [0, -maxOsculatingCircleRadius]
        : (angle !== 0 ? rotate(sin(angle), cos(angle))(_nnorm) : _nnorm);

    let [xO,rO] = getInitialX(
        angle, isHoleClosing, maxOsculatingCircleRadius, yPos, nnorm
    );

    // let test = yPos.t === 1 && angle === 0 && yPos.p[0] === 1045 && yPos.p[1] === 2261;
    // if (yPos.t === 0 && angle === 0 && yPos.p[0] === 557.7511111099739 && yPos.p[1] === 1629.2530999999726) {
    // let test = yPos.t === 1 && angle === 0 && yPos.p[0] === 1045.2573100000154 && yPos.p[1] === 2261.758998999954;

    // 0.92578125
    // 0.9259045247489803

    let test = yPos.t === 0.9259045247489803;
    if (test) {
        yPos.angle = radToDeg(angle);
        console.log(for1Prong);
        // console.log(angle);
        // console.log(nnorm);
        // console.log(angle);
        // console.log(curvePieces);
        // console.log(yPos);
        // console.log('-----');
        // console.log(y, angle);
        test = true;
    }

    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).
    let curvePieces = getInitialCurvePieces(
        angle, isHoleClosing, loop, loops, meta, yPos, xO, test
    );

    if (test) {
        yPos.curvePieces = curvePieces as CurvePiece[];
        // console.log(curvePieces);
    }

    // The lines below is an optimization.
    const xy2 = reduceRadius(maxCoordPowerOf2, curvePieces, y, nnorm);
    const xy = sqrt(xy2);

    if (for1Prong && Number.isFinite(xy) && rO < (1 - oneProngTolerance)*xy) {
        add1Prong(meta, rO, xO, yPos);
        return undefined;
    }

    // let _x = xO;
    if (Number.isFinite(xy)) {
        const l = sqrt(nnorm[0]**2 + nnorm[1]**2);
        xO = [y[0] + nnorm[0]/l*xy, y[1] + nnorm[1]/l*xy];
    }

    const curvePiecesF1 = cullCurvePieces2(curvePieces, xO, xy2);
    const curvePiecesF2 = cullCurvePieces1(curvePiecesF1, xO);

    const result = getMedial(
        maxCoordPowerOf2, nnorm, yPos,
        for1Prong, angle,
        curvePiecesF2
    );

    const { _zs } = result;
    if (_zs.length === 0) { return undefined; }
    if (_zs.length > 1) {
        // console.log(_zs);
        if (!allPossSame(_zs)) {
            // At this point there is multiple antipodal points (zs) for the given
            // source point so do not add the 2-prong, it will be caught when 
            // adding 3+-prongs.
            return undefined;
        }
        console.log(_zs);
    }
    // if (_zs.length > 1) { return undefined; }

    const { xs: [x], _zs: [__zs], ds: [d] } = result;

    const circle = { center: x, radius: d };

    /** The antipode of the two-prong */
    const z: PrePointOnShape = {
        curve: __zs.curve,
        t: __zs.t,
        isSource: false,
        p: toP(__zs.curve.ps, __zs.t),
    };

    if (z === undefined) { return undefined; }

    const yz = squaredDistanceBetweenDd(yPos.p, z.p);
    if (z === undefined || yz === 0) {
        return undefined;
    }

    const xz = squaredDistanceBetweenDd(x, z.p);

    if (!isHoleClosing) {
        // The lines below eliminate cases where the found 2-prong is too
        // close to a one-prong
        const squaredSeperationTolerance = max(calcSeperationTolerance(
            rO, sqrt(xz), 2**2*errorTolerance
        ), minSquaredSeperationTolerance);
        if (yz <= squaredSeperationTolerance) {
            return undefined;
        } 
    }

    return { circle, z };
}


function allPossSame(
        zs: PrePointOnShape[]): boolean {

    const { curve, t } = zs[0];
    for (let i=1; i<zs.length; i++) {
        const { curve: curve_, t: t_ } = zs[i];

        if (curve !== curve_ || t !== t_) {
            return false;
        }
    }

    return true;
}


export { find2Prong }



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
