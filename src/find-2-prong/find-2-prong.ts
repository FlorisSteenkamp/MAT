import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
import type { AntipodalPoint } from './get-medial/antipodal-point.js';
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


const { sin, cos, max, sqrt } = Math;


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
function find2Prong(
        meta: MatMeta) {

    const { loops, maxCoordPowerOf2, squaredDiagonalLength } = meta;

    //----------------------------
    // Initialize some tolerances
    //----------------------------
    const minSquaredSeperationTolerance = (2**(maxCoordPowerOf2 - 21))**2;
    const errorTolerance = 2**(maxCoordPowerOf2 - 46);
    const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
    const oneProngTolerance = 2**(maxCoordPowerOf2 - 32);

    return function find2ProngInner(
            isHoleClosing: boolean,
            for1Prong: boolean,
            angle: number,
            yPos: PrePointOnShape): { circle: Circle, z: PrePointOnShape } | undefined {

        const { curve: { loop, ps }, t, p: y } = yPos;
        const normDd = ddNormal(ps, t);
        const _nnorm = [-normDd[0][1], -normDd[1][1]];  // Left-handed system (sorry)
        const nnorm = isHoleClosing
            ? [0, -maxOsculatingCircleRadius]
            : (angle !== 0 ? rotate(sin(angle), cos(angle))(_nnorm) : _nnorm);

        // Get initial kissing circle guess
        let [xO,rO] = getInitialX(
            angle, isHoleClosing, maxOsculatingCircleRadius, yPos, nnorm
        );


        // The boundary piece that should contain the other point of 
        // the 2-prong circle. (Defined by start and end points).
        const curvePieces = getInitialCurvePieces(
            angle, isHoleClosing, loop, loops, meta, yPos, xO
        );

        // The lines below is an optimization.
        const xy2 = reduceRadius(maxCoordPowerOf2, curvePieces, y, nnorm);
        const xy = sqrt(xy2);

        if (for1Prong && rO < (1 - oneProngTolerance)*xy) {
            add1Prong(meta, rO, xO, yPos);
            return undefined;
        }

        const l = sqrt(nnorm[0]**2 + nnorm[1]**2);
        xO = [y[0] + nnorm[0]/l*xy, y[1] + nnorm[1]/l*xy];

        cullCurvePieces(curvePieces, xO, xy2);

        const antipodalPoints = getAntipodalPoints(
            maxCoordPowerOf2, nnorm, yPos,
            for1Prong, angle,
            curvePieces
        );

        if (antipodalPoints.length !== 1) {
            if (antipodalPoints.length === 0) { return undefined; }
            if (!areAllAntipodesSame(antipodalPoints)) {
                // At this point there is multiple antipodal points (zs) for the given
                // source point so do not add the 2-prong, it will be caught when 
                // adding 3+-prongs.
                return undefined;
            }
        }

        const { x, d, curve, s } = antipodalPoints[0];
        const z: PrePointOnShape = {
            curve, t: s, isSource: false,
            p: toP(curve.ps, s)
        };

        const circle = { center: x, radius: d };

        const yz = squaredDistanceBetweenDd(yPos.p, z.p);
        const xz = squaredDistanceBetweenDd(x, z.p);

        if (!isHoleClosing) {
            if (yz === 0) { return undefined; }

            // The lines below eliminate cases where the found 2-prong is too
            // close to a one-prong
            const squaredSeperationTolerance = max(
                calcSeperationTolerance(rO, sqrt(xz), 2**2*errorTolerance),
                minSquaredSeperationTolerance
            );
            if (yz <= squaredSeperationTolerance) {
                return undefined;
            } 
        }

        return { circle, z };
    }
}


/** @internal */
function areAllAntipodesSame(
        app: AntipodalPoint[]): boolean {

    const { curve, s: t } = app[0];
    for (let i=1; i<app.length; i++) {
        const { curve: curve_, s: t_ } = app[i];

        if (curve !== curve_ || t !== t_) {
            return false;
        }
    }

    return true;
}


export { find2Prong }
