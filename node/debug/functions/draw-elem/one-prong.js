"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawOneProng = void 0;
const point_on_shape_1 = require("../../../point-on-shape");
const circle_1 = require("../../../circle");
const flo_draw_1 = require("flo-draw");
/** @hidden */
const scaleFactor = 0.5;
/** @hidden */
function drawOneProng(g, pos, classes, delay = 0) {
    let circle = circle_1.scaleCircle(
    //PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos),
    point_on_shape_1.getOsculatingCircle(Number.POSITIVE_INFINITY, pos), 1);
    let $center = flo_draw_1.drawFs.dot(g, pos.p, 0.1 * scaleFactor, 'gray', delay);
    let $circle = flo_draw_1.drawFs.dot(g, circle.center, 0.25 * scaleFactor, 'gray', delay);
    let $pos = flo_draw_1.drawFs.circle(g, circle, 'gray thin10 nofill', delay);
    return [...$center, ...$circle, ...$pos];
}
exports.drawOneProng = drawOneProng;
//# sourceMappingURL=one-prong.js.map