import { createPos } from '../../point-on-shape/create-pos.js';
import { getClosestPoint } from './get-closest-points.js';
import { findEquidistantPointOnLineDd } from '../find-equidistant-point-on-line-dd.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param pow
 * @param curvePieces
 * @param _x
 * @param yPos
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`
 */
function getMedial(pow, curvePieces, _x, yPos, for1Prong = false, angle = 0) {
    const pInfoss = [];
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const pInfos = getClosestPoint(pow, curvePiece, _x, yPos, for1Prong, angle);
        pInfoss.push(...pInfos);
    }
    /** the minimum max interval value */
    let minMax = Infinity;
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
    const _zs = closestPointInfos.map(info => createPos(info.curve, info.t, false));
    const xs = closestPointInfos.map(info => {
        const { p: z, } = info;
        const x = findEquidistantPointOnLineDd(_x, yPos.p, z);
        return x;
    });
    return { xs, _zs };
}
export { getMedial };
//# sourceMappingURL=get-medial.js.map