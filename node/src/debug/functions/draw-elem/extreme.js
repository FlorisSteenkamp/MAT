"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
function extreme(extreme, visible = true) {
    let p = flo_bezier3_1.evaluate(extreme.curve.ps, extreme.t);
    let visibleClass = visible ? '' : ' invisible';
    let { $circle, $l1, $l2 } = _debug_.fs.draw.crossHair(p, 'red thin10 nofill ' + visibleClass);
    return { $circle, $l1, $l2 };
}
exports.extreme = extreme;
