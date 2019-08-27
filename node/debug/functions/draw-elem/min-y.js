"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_draw_1 = require("flo-draw");
function minY(g, pos) {
    let p = flo_bezier3_1.evaluate(pos.curve.ps, pos.t);
    let $elems = flo_draw_1.drawFs.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
exports.minY = minY;
//# sourceMappingURL=min-y.js.map