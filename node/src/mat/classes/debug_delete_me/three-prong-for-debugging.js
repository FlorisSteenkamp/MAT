"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../classes/point-on-shape");
class ThreeProngForDebugging {
    constructor(threeProng, deltas, bestIndx, candidateThreeProngs) {
        this.threeProng = threeProng;
        this.deltas = deltas;
        this.bestIndx = bestIndx;
        this.candidateThreeProngs = candidateThreeProngs;
        this.deltasSimple = deltas.map(function (delta) {
            return [
                point_on_shape_1.default.toHumanString(delta[0].item.pointOnShape),
                point_on_shape_1.default.toHumanString(delta[1].item.pointOnShape)
            ];
        });
    }
}
exports.default = ThreeProngForDebugging;
