"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundingHull = void 0;
const flo_draw_1 = require("flo-draw");
/** @hidden */
function boundingHull(g, hull, style = 'thin5 black nofill') {
    let $polygon = flo_draw_1.drawFs.polygon(g, hull, style);
    return $polygon;
}
exports.boundingHull = boundingHull;
//# sourceMappingURL=bounding-hull.js.map