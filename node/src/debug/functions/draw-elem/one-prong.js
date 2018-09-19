"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../../point-on-shape");
const circle_1 = require("../../../circle");
const scaleFactor = 0.5;
function oneProng(g, pos) {
    let draw = _debug_.fs.draw;
    let circle = circle_1.Circle.scale(point_on_shape_1.PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos), 1);
    let $center = draw.dot(g, pos.p, 0.1 * scaleFactor, 'gray');
    let $circle = draw.dot(g, circle.center, 0.25 * scaleFactor, 'gray');
    let $pos = draw.circle(g, circle, 'gray thin10 nofill');
    return [...$center, ...$circle, ...$pos];
}
exports.oneProng = oneProng;
