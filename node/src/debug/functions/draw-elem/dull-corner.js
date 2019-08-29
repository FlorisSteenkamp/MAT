"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function dullCorner(g, curve) {
    const scaleFactor = 1;
    let p = curve.ps[3];
    let $pos = flo_draw_1.drawFs.dot(g, p, 0.5 * scaleFactor, 'orange');
    return $pos;
}
exports.dullCorner = dullCorner;
//# sourceMappingURL=dull-corner.js.map