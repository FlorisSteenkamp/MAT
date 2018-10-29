"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../../point-on-shape");
function oneProngAtDullCorner(g, pos) {
    let oCircle = point_on_shape_1.PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    let $center = _debug_.fs.draw.dot(g, pos.p, 0.1, 'orange');
    let $circle = _debug_.fs.draw.dot(g, oCircle.center, 0.25, 'orange');
    let $pos = _debug_.fs.draw.circle(g, oCircle, 'orange thin10 nofill');
    return [...$center, ...$circle, ...$pos];
}
exports.oneProngAtDullCorner = oneProngAtDullCorner;
//# sourceMappingURL=one-prong-at-dull-corner.js.map