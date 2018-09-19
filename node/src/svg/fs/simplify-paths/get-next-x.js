"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param intersections A mapping of intersections to curves
 * @param curBez The current curve
 * @param curT The current t on the current curve
 * @param endBez The end of the loop
 * @param endT The end t of the loop
 */
function getNextX(xInfos, curBez, curT, endBez, endT) {
    let xIdx = undefined;
    let bestT = Number.POSITIVE_INFINITY;
    for (let i = 0; i < xInfos.length; i++) {
        let XInfo = xInfos[i];
        let t = XInfo.pos.t;
        // For the final bezier, don't go beyond end point
        let maxT = 1;
        if (curBez === endBez && curT < endT) {
            maxT = endT;
        }
        let deltaT = t - curT;
        if (deltaT > 0 && deltaT < bestT && t < maxT) {
            xIdx = i;
            bestT = deltaT;
        }
    }
    return xIdx;
}
exports.getNextX = getNextX;
