"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../../circle");
const scaleFactor = 1;
function draw3Prong(threeProng, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let draw = _debug_.fs.draw;
    let circle = circle_1.Circle.scale(threeProng.circle, 1);
    let poss = threeProng.poss;
    let $cp1 = draw.dot(poss[0].p, 0.1 * 1 * scaleFactor, 'blue ' + visibleClass);
    let $cp2 = draw.dot(poss[1].p, 0.1 * 2 * scaleFactor, 'blue ' + visibleClass);
    let $cp3 = draw.dot(poss[2].p, 0.1 * 3 * scaleFactor, 'blue ' + visibleClass);
    let $center = draw.dot(circle.center, 0.3 * scaleFactor, 'blue ' + visibleClass);
    let $circle = draw.circle(circle, 'blue thin2 nofill ' + visibleClass);
    return { $center, $cp1, $cp2, $cp3, $circle };
}
exports.draw3Prong = draw3Prong;
