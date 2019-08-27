"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../../point-on-shape");
const circle_1 = require("../../../circle");
const flo_draw_1 = require("flo-draw");
const scaleFactor = 0.5;
function drawOneProng(g, pos) {
    let circle = circle_1.Circle.scale(point_on_shape_1.PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos), 1);
    let $center = flo_draw_1.drawFs.dot(g, pos.p, 0.1 * scaleFactor, 'gray');
    let $circle = flo_draw_1.drawFs.dot(g, circle.center, 0.25 * scaleFactor, 'gray');
    let $pos = flo_draw_1.drawFs.circle(g, circle, 'gray thin10 nofill');
    return [...$center, ...$circle, ...$pos];
}
exports.drawOneProng = drawOneProng;
//# sourceMappingURL=one-prong.js.map