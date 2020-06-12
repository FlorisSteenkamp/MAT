"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneProngAtDullCorner = void 0;
const point_on_shape_1 = require("../../../point-on-shape");
const flo_draw_1 = require("flo-draw");
/** @hidden */
function oneProngAtDullCorner(g, pos) {
    //let oCircle = PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    let oCircle = point_on_shape_1.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    let $center = flo_draw_1.drawFs.dot(g, pos.p, 0.1, 'orange');
    let $circle = flo_draw_1.drawFs.dot(g, oCircle.center, 0.25, 'orange');
    let $pos = flo_draw_1.drawFs.circle(g, oCircle, 'orange thin10 nofill');
    return [...$center, ...$circle, ...$pos];
}
exports.oneProngAtDullCorner = oneProngAtDullCorner;
//# sourceMappingURL=one-prong-at-dull-corner.js.map