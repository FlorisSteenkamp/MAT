"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../point-on-shape");
/**
 * Class used in debugging. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */
class ThreeProngForDebugging {
    /**
     * @param circle The best fit circle found for the 3-prong.
     * @param poss The best fit 3 points found for the 3-prong.
     * @param cp3s The 3 boundary pieces on which the three prong points were
     * found.
     * @param cps The boundary pieces that were used to search the three prong
     * on.
     * @param bestIndx
     * @param candidateThreeProngs An array of 3-prongs, each of which may be a
     * best fit 3-prong.
     */
    constructor(circle, poss, cp3s, cps, bestIndx, candidateThreeProngs, visitedCps) {
        this.circle = circle;
        this.poss = poss;
        this.cpss = cps;
        this.cp3ss = cp3s;
        this.bestIndx = bestIndx;
        this.candidateThreeProngs = candidateThreeProngs;
        this.visitedCps = visitedCps;
        this.cpsSimple = cps.map(δ => [point_on_shape_1.PointOnShape.toHumanString(δ[0].cp.pointOnShape),
            point_on_shape_1.PointOnShape.toHumanString(δ[1].cp.pointOnShape)]);
    }
}
exports.ThreeProngForDebugging = ThreeProngForDebugging;
