"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function boundingHull(g, hull, style = 'thin5 black nofill') {
    let $polygon = _debug_.fs.draw.polygon(g, hull, style);
    return $polygon;
}
exports.boundingHull = boundingHull;
//# sourceMappingURL=bounding-hull.js.map