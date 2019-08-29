"use strict";
// TODO - move to another library
Object.defineProperty(exports, "__esModule", { value: true });
/** @hidden */
const C = 0.55191502449;
/** @hidden */
function circleToCubicBeziers(center = [0, 0], radius, clockwise = false) {
    let x = center[0];
    let y = center[1];
    let r = radius;
    let c = r * C;
    let pss = [
        [[x, y + r], [x + c, y + r], [x + r, y + c], [x + r, y]],
        [[x + r, y], [x + r, y - c], [x + c, y - r], [x, y - r]],
        [[x, y - r], [x - c, y - r], [x - r, y - c], [x - r, y]],
        [[x - r, y], [x - r, y + c], [x - c, y + r], [x, y + r]]
    ];
    if (!clockwise) {
        return pss;
    }
    return (pss.map(ps => ps.slice().reverse()).slice().reverse());
}
exports.circleToCubicBeziers = circleToCubicBeziers;
//# sourceMappingURL=circle-to-cubic-beziers.js.map