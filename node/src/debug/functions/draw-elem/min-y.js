"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
function minY(g, pos) {
    let p = flo_bezier3_1.evaluate(pos.curve.ps, pos.t);
    let $elems = _debug_.fs.draw.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
exports.minY = minY;
