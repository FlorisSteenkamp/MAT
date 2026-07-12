import type { Circle } from '../geometry/circle.js';
import type { PointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
import { getInitialCurvePieces } from './get-initial-bezier-pieces.js';
import { getMedial } from './get-medial/get-medial.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullCurvePieces2 } from './cull-bezier-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { calcSeperationTolerance } from './calc-seperation-tolerance.js';
import { cullCurvePieces1 } from '../closest-boundary-point/cull-bezier-pieces.js';
import { getInitialX } from './get-initial-x.js';
import { ddNormal, ddTangent } from 'flo-bezier3';
import { interpolate, rotate } from 'flo-vector2d';

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
 * @param loops A shape represented by path loops
 * @param maxCoordinate The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape 
 * bounding box.
 * @param yPos the source point of the 2-prong to be found
 * @param isHoleClosing `true` if this is a hole-closing two-prong, `false` otherwise
 * @param loopIdx the loop array index
 */
function find2Prong(
        meta: MatMeta,
        isHoleClosing: boolean,
        for1Prong: boolean,
        angle: number,
        yPos: PointOnShape): { circle: Circle, zs: PointOnShape[] } | undefined {

    const { loops, maxCoordinate, squaredDiagonalLength } = meta;

    const { loop } = yPos.curve;

    const minSquaredSeperationTolerance = ((2**-21)*maxCoordinate)**2;
    const errorTolerance = (2**-46)*maxCoordinate;
    const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
    const oneProngTolerance = (2**-16)*maxCoordinate;   // TODO try change to 2**32

    const { curve: { ps }, t, p: y } = yPos;
    // if (t > 0 && t < 2**16*Number.EPSILON) {
    if (y[0] === 156.2483156376363 && y[1] === 2277.909545802332) {
        console.log(ps);
        console.log(y);
        console.log(t);
    }
    const normDd = ddNormal(ps, t);
    const _nnorm = [-normDd[0][1], -normDd[1][1]];  // Left-handed system
    const nnorm = isHoleClosing
        ? [0, -maxOsculatingCircleRadius]
        : (angle !== 0 ? rotate(sin(angle), cos(angle))(_nnorm) : _nnorm);

    let [xO,rO] = getInitialX(
        angle, isHoleClosing, maxOsculatingCircleRadius, yPos, nnorm
    );

    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).
    let curvePieces = getInitialCurvePieces(
        angle, isHoleClosing, loop, loops, meta, yPos, xO
    );

    // The lines below is an optimization.
    const xy2 = reduceRadius(maxCoordinate, curvePieces, y, nnorm);
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

    const pow = max(0,ceil(log2(maxCoordinate/xy))) + 1;  // determines accuracy

    const result = getMedial(
        pow, nnorm, yPos,
        // for1Prong && rO !== 1/minCurvature,
        for1Prong, angle,
        curvePiecesF2
    );

    if (result?._zs.length === 0) { return undefined; }

    const { xs, _zs: __zs, ds } = result;

    /** The antipode of the two-prong */
    const _zs = __zs.map(info => createPos(info.curve, info.t, false));
    const x = xs[0];

    const z = _zs[0];
    if (z === undefined) { return undefined; }

    const yz = squaredDistanceBetweenDd(yPos.p, z.p);
    if (z === undefined || yz === 0) {
        return undefined;
    }

    const xz = squaredDistanceBetweenDd(x, z.p);

    if (!isHoleClosing) {
        const squaredSeperationTolerance = max(calcSeperationTolerance(
            rO, sqrt(xz), 2**2*errorTolerance
        ), minSquaredSeperationTolerance);
        if (yz <= squaredSeperationTolerance) {
            return undefined;
        } 
    }

    const circle = { center: x, radius: ds[0] };

    return { circle, zs: [z] };
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
