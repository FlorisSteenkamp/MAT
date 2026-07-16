import { fromTo, circumCenter, len, scale, translate } from 'flo-vector2d';
import { getClosestPoints } from './get-closest-points.js';
/**
 * Find new `x` and `ps` that are better estimates of the 3-prong circle.
 *
 * The potential function, V, is defined as the distance to the actual 3 prong
 * circle center.
 *
 * @param maxCoordPowerOf2
 * @param curvePiece3s The three boundary pieces, each of which should contain
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 * @param vectorToZeroV
 *
 * @internal
 */
function calcBetterX(maxCoordPowerOf2, curvePiece3s, x, vectorToZeroV) {
    const V = len(vectorToZeroV);
    let nu = 1;
    let better;
    let newX;
    let newPoss;
    let newV;
    let i = 0; // Safeguard
    do {
        const shift = scale(vectorToZeroV, nu);
        newX = translate(shift, x);
        newPoss = getClosestPoints(maxCoordPowerOf2, newX, curvePiece3s);
        // Point of zero V
        const newCircleCenter = circumCenter(newPoss.map(pos => pos.p));
        const newVectorToZeroV = fromTo(newX, newCircleCenter);
        newV = len(newVectorToZeroV);
        better = newV < V;
        nu = nu / 2;
        i++;
    } while (!better && i < 3);
    return { newX, newV, newPoss };
}
export { calcBetterX };
//# sourceMappingURL=calc-better-x.js.map