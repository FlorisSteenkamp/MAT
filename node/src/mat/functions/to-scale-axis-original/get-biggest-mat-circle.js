"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBiggestMatCircle(matCircleHash) {
    let biggest = -Number.POSITIVE_INFINITY;
    let biggestCircle = undefined;
    for (let key in matCircleHash) {
        let matCircle = matCircleHash[key];
        let r = matCircle.circle.radius;
        if (r > biggest) {
            biggestCircle = matCircle;
            biggest = r;
        }
    }
    return biggestCircle;
}
exports.getBiggestMatCircle = getBiggestMatCircle;
