"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const get_closest_points_1 = require("./get-closest-points");
/**
 * @hidden
 * Find new x and ps that are a better estimate of the 3-prong circle.
 * The potential function, V, is defined as the distance to the actual 3 prong
 * circle center.
 * @param bezierPiece3s The three boundary pieces, each of which should contain
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 * @param vectorToZeroV
 * @param extreme
 */
function calcBetterX(bezierPiece3s, x, vectorToZeroV) {
    let V = flo_vector2d_1.len(vectorToZeroV);
    let nu = 1;
    let better;
    let newX;
    let newPs;
    let newV;
    let i = 0; // Safeguard
    do {
        let shift = flo_vector2d_1.scale(vectorToZeroV, nu);
        newX = flo_vector2d_1.translate(shift, x);
        newPs = get_closest_points_1.getClosestPoints(newX, bezierPiece3s);
        // Point of zero V
        let newCircleCenter = flo_vector2d_1.circumCenter(newPs.map(pos => pos.p));
        let newVectorToZeroV = flo_vector2d_1.fromTo(newX, newCircleCenter);
        newV = flo_vector2d_1.len(newVectorToZeroV);
        better = newV < V;
        nu = nu / 2;
        i++;
    } while (!better && i < 3);
    return { newX, newV, newPs };
}
exports.calcBetterX = calcBetterX;
//# sourceMappingURL=calc-better-x.js.map