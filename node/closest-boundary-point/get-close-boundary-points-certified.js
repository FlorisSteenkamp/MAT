import { getPotentialClosestPointsOnCurveCertified } from './get-potential-closest-points-on-curve-certified.js';
import { cullCurvePieces1 } from './cull-bezier-pieces-1.js';
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
    curvePieces = cullCurvePieces1(curvePieces, x);
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
        const p = toP(ps, t);
        return {
            p, t, curve, isSource: false
        };
    });
}
export { getCloseBoundaryPointsCertified };
//# sourceMappingURL=get-close-boundary-points-certified.js.map