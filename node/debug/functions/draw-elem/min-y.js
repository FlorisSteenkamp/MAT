"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_draw_1 = require("flo-draw");
/** @hidden */
function minY(g, pos) {
    let p = flo_bezier3_1.evalDeCasteljau(pos.curve.ps, pos.t);
    let ps = flo_bezier3_1.toCubic(pos.curve.ps);
    console.log('x: ', flo_bezier3_1.getX(ps));
    console.log('y: ', flo_bezier3_1.getY(ps));
    console.log('t: ', pos.t);
    let $elems = flo_draw_1.drawFs.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
exports.minY = minY;
//# sourceMappingURL=min-y.js.map