import { getPotentialClosestPointsOnCurveCertified } from './get-potential-closest-points-on-curve-certified.js';
import { cullBezierPieces1 } from './cull-bezier-pieces.js';
import { createPos } from '../point-on-shape/create-pos.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param x
 * @param touchedCurve
 * @param t
 * @param extreme
 */
function getCloseBoundaryPointsCertified(bezierPieces, x, touchedCurve = undefined, t = undefined, for1Prong = false, angle = 0) {
    bezierPieces = cullBezierPieces1(bezierPieces, x);
    const pInfoss = [];
    for (let i = 0; i < bezierPieces.length; i++) {
        const bezierPiece = bezierPieces[i];
        const pInfos = getPotentialClosestPointsOnCurveCertified(bezierPiece.curve, x, bezierPiece.ts, touchedCurve, t, for1Prong, angle);
        pInfoss.push(...pInfos);
    }
    /** the minimum max interval value */
    let minMax = Number.POSITIVE_INFINITY;
    for (let i = 0; i < pInfoss.length; i++) {
        const diMax = pInfoss[i].dSquaredI[1];
        if (diMax < minMax) {
            minMax = diMax;
        }
    }
    const closestPointInfos = [];
    for (let i = 0; i < pInfoss.length; i++) {
        const info = pInfoss[i];
        if (info.dSquaredI[0] <= minMax) {
            closestPointInfos.push(info);
        }
    }
    return closestPointInfos.map(info => createPos(info.curve, info.t, false));
}
export { getCloseBoundaryPointsCertified };
//# sourceMappingURL=get-close-boundary-points-certified.js.map