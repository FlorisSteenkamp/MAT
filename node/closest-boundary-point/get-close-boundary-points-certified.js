import { getPotentialClosestPointsOnCurveCertified } from './get-potential-closest-points-on-curve-certified.js';
import { cullCurvePieces } from './cull-curve-pieces.js';
import { getBestDistanceSquared } from './get-best-distance-squared.js';
import { toP } from '../point-on-shape/to-p.js';
/**
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param maxCoordPowerOf2
 * @param curvePieces
 * @param x
 *
 * @internal
 */
function getCloseBoundaryPointsCertified(curvePieces, x) {
    // cull the pieces that cannot contain the closest point (the best
    // squared distance already includes a floating point tolerance)
    curvePieces = cullCurvePieces(curvePieces, x, getBestDistanceSquared(curvePieces, x));
    const pInfos = [];
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const _pInfos = getPotentialClosestPointsOnCurveCertified(curvePiece.curve, x, curvePiece.ts);
        pInfos.push(..._pInfos);
    }
    /** the minimum max interval value */
    let minMax = Infinity;
    for (let i = 0; i < pInfos.length; i++) {
        const diMax = pInfos[i].dSquaredI[1];
        if (diMax < minMax) {
            minMax = diMax;
        }
    }
    const closestPointInfos = [];
    for (let i = 0; i < pInfos.length; i++) {
        const info = pInfos[i];
        if (info.dSquaredI[0] <= minMax) {
            closestPointInfos.push(info);
        }
    }
    return closestPointInfos.map(info => {
        const { curve, t } = info;
        const { ps } = curve;
        const pDd = toP(ps, t);
        const p = pDd.map(c => c[0] + c[1]);
        return {
            curve, t, isSource: false, p, pDd
        };
    });
}
export { getCloseBoundaryPointsCertified };
//# sourceMappingURL=get-close-boundary-points-certified.js.map