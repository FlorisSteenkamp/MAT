import { posToHumanString } from '../point-on-shape/pos-to-human-string.js';
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
function cpsSimple(threeProngForDebugging) {
    return threeProngForDebugging.cpss.map(δ => [posToHumanString(δ[0].cp.pointOnShape),
        posToHumanString(δ[1].cp.pointOnShape)]);
}
export { createEmptyThreeProngForDebugging };
//# sourceMappingURL=three-prong-for-debugging.js.map