"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyThreeProngForDebugging = void 0;
const point_on_shape_1 = require("../point-on-shape");
function createEmptyThreeProngForDebugging() {
    return {
        generated: undefined,
        circle: undefined,
        poss: undefined,
        cp3ss: undefined,
        cpss: undefined,
        bestIndx: undefined,
        candidateThreeProngs: undefined,
        visitedCps: undefined,
        boundaries: undefined,
        traces: undefined,
    };
}
exports.createEmptyThreeProngForDebugging = createEmptyThreeProngForDebugging;
function cpsSimple(threeProngForDebugging) {
    return threeProngForDebugging.cpss.map(δ => [point_on_shape_1.posToHumanString(δ[0].cp.pointOnShape),
        point_on_shape_1.posToHumanString(δ[1].cp.pointOnShape)]);
}
//# sourceMappingURL=three-prong-for-debugging.js.map