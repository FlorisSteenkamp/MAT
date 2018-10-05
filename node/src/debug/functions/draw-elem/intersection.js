"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draw_circle_percent_1 = require("./draw-circle-percent");
function intersection(g, x) {
    return [draw_circle_percent_1.drawCirclePercent(g, x.pos.p, 0.7, 'purple thin2 nofill')];
}
exports.intersection = intersection;
