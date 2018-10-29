"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param xs An array of intersections on the curve
 * @param curT The current t value
 * @param forwards If true go forwards else go backwards
 */
function getNextX(xs, curT, forwards, wasOnX) {
    let bestX = undefined;
    let bestT = Number.POSITIVE_INFINITY;
    for (let i = 0; i < xs.length; i++) {
        let x = xs[i];
        let t = x.pos.t;
        let deltaT = forwards
            ? t - curT
            : curT - t;
        if ((deltaT > 0 || (deltaT === 0 && !wasOnX)) && deltaT < bestT) {
            bestX = x;
            bestT = deltaT;
        }
    }
    return bestX;
}
exports.getNextX = getNextX;
/**
 *
 * @param xs An array of intersections on the curve
 * @param t The current t value
 */
function getThisX(xs, t) {
    for (let i = 0; i < xs.length; i++) {
        let x = xs[i];
        if (x.pos.t - t === 0) {
            return x;
        }
    }
}
exports.getThisX = getThisX;
//# sourceMappingURL=get-next-x.js.map