"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threeProng = void 0;
const circle_1 = require("../../../circle");
const flo_draw_1 = require("flo-draw");
/** @hidden */
const scaleFactor = 0.3;
/** @hidden */
function threeProng(g, threeProng) {
    let circle = circle_1.scaleCircle(threeProng.circle, 1);
    let poss = threeProng.poss;
    let $cp1 = flo_draw_1.drawFs.dot(g, poss[0].p, 0.1 * 1 * scaleFactor, 'blue');
    let $cp2 = flo_draw_1.drawFs.dot(g, poss[1].p, 0.1 * 2 * scaleFactor, 'blue');
    let $cp3 = flo_draw_1.drawFs.dot(g, poss[2].p, 0.1 * 3 * scaleFactor, 'blue');
    let $center = flo_draw_1.drawFs.dot(g, circle.center, 0.3 * scaleFactor, 'blue');
    let $circle = flo_draw_1.drawFs.circle(g, circle, 'blue thin2 nofill');
    return [...$center, ...$cp1, ...$cp2, ...$cp3, ...$circle];
}
exports.threeProng = threeProng;
//# sourceMappingURL=three-prong.js.map