import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
import { getInitialCurvePieces } from './get-initial-bezier-pieces.js';
import { getAntipodalPoints } from './get-medial/get-antipodal-points.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullCurvePieces } from '../closest-boundary-point/cull-curve-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { toP } from '../point-on-shape/to-p.js';
import { calcSquaredSeparationTolerance } from './calc-separation-tolerance.js';
import { getInitialX } from './get-initial-x.js';
import { ddNormal2 } from 'flo-bezier3';
import { rotate } from 'flo-vector2d';


const { abs, sin, cos, max, sqrt, floor, log2 } = Math;


/**
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and 
 * the second one is found by the algorithm.
 * 
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2 
 * points.
 * 
 * If the circle touches the shape at more points (an n-prong, n > 2) all its
 * contact points (other than the source point) are returned.
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
    const POWER = 21;
    const minSquaredSeparationTolerance = (2**(maxCoordPowerOf2 - POWER))**2;
    const errorTolerance = 2**(maxCoordPowerOf2 - 46);
    const maxOscRadius = sqrt(squaredDiagonalLength);
    const oneProngTolerance = 2**(maxCoordPowerOf2 - 32);
    // Half the min separation: the maximal disk at a point is never larger
    // than the osculating circle there, and its 2 contact points are at most
    // a diameter apart, so any 2-prong from a point with a smaller osculating
    // radius would be rejected by the separation check anyway.
    const minOscRadius = 2**(maxCoordPowerOf2 - (POWER + 1));


    return function find2ProngInner(
            isHoleClosing: boolean,
            for1Prong: boolean,
            angle: number,
            yPos: PrePointOnShape): { circle: Circle, zs: PrePointOnShape[] } | undefined {


        const { curve: { loop, ps }, t, p: y } = yPos;
        // `ddNormal2` (unlike `ddNormal`) is not the zero vector where the
        // first derivative vanishes; scaled (exactly) to about unit length so
        // that the tolerances used in the search do not depend on the speed of
        // the curve at `t`
        const normDd = ddScaleToAboutUnit(ddNormal2(ps, t));
        const _nnorm = [-normDd[0][1], -normDd[1][1]];  // Left-handed system (sorry)
        const nnorm = isHoleClosing
            ? [0, -maxOscRadius]
            : (angle !== 0 ? rotate(sin(angle), cos(angle))(_nnorm) : _nnorm);

        const nnormDd = isHoleClosing || angle !== 0
            ? [[0, nnorm[0]], [0, nnorm[1]]]
            : [[-normDd[0][0], -normDd[0][1]], [-normDd[1][0], -normDd[1][1]]];

        // Get initial kissing circle guess
        const Oc = getInitialX(
            angle, isHoleClosing, minOscRadius, maxOscRadius, yPos, nnorm
        );
        if (Oc === undefined) {
            return undefined;  // osculating radius is too small
        }

        let [xO,rO] = Oc;

        // The boundary piece that should contain the other point of 
        // the 2-prong circle. (Defined by start and end points).
        const curvePieces = getInitialCurvePieces(
            angle, isHoleClosing, loop, loops, meta, yPos, xO
        );

        // The lines below is an optimization.
        const xy2 = reduceRadius(rO, curvePieces, y, nnorm);
        const xy = sqrt(xy2);

        const l = sqrt(nnorm[0]**2 + nnorm[1]**2);
        xO = [y[0] + nnorm[0]/l*xy, y[1] + nnorm[1]/l*xy];

        // (the extra multiplier accounts for floating point error)
        const culledCurvePieces = cullCurvePieces(curvePieces, xO, (1 + 2**-20)*xy2);

        const antipodalPoints = getAntipodalPoints(
            maxCoordPowerOf2, nnormDd, yPos,
            for1Prong, angle,
            culledCurvePieces
        );

        if (antipodalPoints.length === 0) {
            return undefined;
        }

        // All antipodal points are at the same distance (up to floating point
        // error) and thus on the same maximal disk, i.e. if there is more than
        // one this is an n-prong (n > 2)
        const { x, d } = antipodalPoints[0];

        if (for1Prong && rO < (1 - oneProngTolerance)*d) {
            add1Prong(meta, rO, xO, yPos);
            return undefined;
        }

        const circle = { center: x, radius: d };

        const zs = antipodalPoints.map(({ curve, s }): PrePointOnShape => {
            const pDd = toP(curve.ps, s);
            const p = pDd.map(c => c[0] + c[1]);

            return { curve, t: s, isSource: false, p, pDd };
        });

        if (isHoleClosing) {
            return { circle, zs: [zs[0]] };
        }

        const z = zs[0];
        const yz = squaredDistanceBetweenDd(yPos.p, z.p);
        const xz = squaredDistanceBetweenDd(x, z.p);

        if (yz === 0) {
            return undefined;
        }

        // The lines below eliminate cases where the found 2-prong is too
        // close to a one-prong
        const squaredSeparationTolerance = max(
            calcSquaredSeparationTolerance(rO, sqrt(xz), (2**2)*errorTolerance),
            minSquaredSeparationTolerance
        );
        if (yz <= squaredSeparationTolerance) {
            return undefined;
        }

        // Other antipodal points this close to `y` or to one another are
        // (numerically) the same contact point
        const zs_ = [z];
        for (const z of zs.slice(1)) {
            const ps = [yPos.p, ...zs_.map(z_ => z_.p)];
            if (ps.every(p => squaredDistanceBetweenDd(p, z.p) > squaredSeparationTolerance)) {
                zs_.push(z);
            }
        }

        return { circle, zs: zs_ };
    }
}


/**
 * @internal
 * Returns the given double-double vector scaled by a power of 2 (and thus
 * exactly) such that its largest coordinate (in absolute value) is in `[1,2)`.
 *
 * The zero vector is returned unchanged.
 */
function ddScaleToAboutUnit(
        v: number[][]): number[][] {

    const m = max(abs(v[0][1]), abs(v[1][1]));
    if (m === 0) { return v; }

    const s = 2**-floor(log2(m));

    return v.map(c => [c[0]*s, c[1]*s]);
}


export { find2Prong }
