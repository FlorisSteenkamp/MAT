import { getClosestPoint } from './get-closest-points.js';
/**
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 *
 * @param maxCoordPowerOf2
 * @param nnorm
 * @param yPos
 * @param for1Prong defaults to `false`;
 * @param angle angle from normal
 * @param curvePieces
 *
 * @internal
 */
function getAntipodalPoints(maxCoordPowerOf2, nnorm, yPos, for1Prong, angle, curvePieces) {
    const pInfoss = [];
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const pInfos = getClosestPoint(maxCoordPowerOf2, nnorm, yPos, for1Prong, angle, curvePiece);
        pInfoss.push(...pInfos);
    }
    /** the minimum max value */
    let minMax = Infinity;
    for (let i = 0; i < pInfoss.length; i++) {
        const diMax = pInfoss[i].d * (1 + 2 ** -46);
        if (diMax < minMax) {
            minMax = diMax;
        }
    }
    const antipodalPoints = [];
    for (let i = 0; i < pInfoss.length; i++) {
        const info = pInfoss[i];
        const d = info.d * (1 - 2 ** -46);
        if (d <= minMax) {
            antipodalPoints.push(info);
        }
    }
    return antipodalPoints;
}
export { getAntipodalPoints };
//# sourceMappingURL=get-antipodal-points.js.map