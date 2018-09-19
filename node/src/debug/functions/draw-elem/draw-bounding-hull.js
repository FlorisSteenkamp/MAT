"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawBoundingHull(hull, visible = true, style = 'thin5 black nofill') {
    let visibleClass = visible ? '' : ' invisible';
    let $polygon = _debug_.fs.draw.polygon(hull, style + visibleClass);
    return { $polygon };
}
exports.drawBoundingHull = drawBoundingHull;
