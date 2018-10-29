"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function linearToCubic(l) {
    let [p0, p1] = l;
    let xInterval = (p1[0] - p0[0]) / 3;
    let yInterval = (p1[1] - p0[1]) / 3;
    let ps = [
        p0,
        [p0[0] + xInterval, p0[1] + yInterval],
        [p0[0] + xInterval * 2, p0[1] + yInterval * 2],
        p1
    ];
    return ps;
}
exports.linearToCubic = linearToCubic;
//# sourceMappingURL=linear-to-cubic.js.map