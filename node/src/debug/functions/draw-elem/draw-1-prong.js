"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../../point-on-shape");
const circle_1 = require("../../../circle");
const scaleFactor = 1;
function draw1Prong(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let draw = _debug_.fs.draw;
    let circle = circle_1.Circle.scale(point_on_shape_1.PointOnShape.getOsculatingCircle(pos), 1);
    let $center = draw.dot(pos.p, 0.1 * scaleFactor, 'gray ' + visibleClass);
    let $circle = draw.dot(circle.center, 0.25 * scaleFactor, 'gray ' + visibleClass);
    let $pos = draw.circle(circle, 'gray thin10 nofill ' + visibleClass);
    return { $center, $circle, $pos };
}
exports.draw1Prong = draw1Prong;
