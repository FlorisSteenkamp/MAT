"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function sharpCorner(g, curve) {
    const scaleFactor = 1;
    let p = curve.ps[curve.ps.length - 1];
    let $pos = flo_draw_1.drawFs.dot(g, p, 0.6 * scaleFactor, 'green');
    return $pos;
}
exports.sharpCorner = sharpCorner;
//# sourceMappingURL=sharp-corner.js.map