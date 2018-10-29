"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tightBoundingBox(g, box) {
    let $box = _debug_.fs.draw.polygon(g, box, 'thin5 black nofill');
    return $box;
}
exports.tightBoundingBox = tightBoundingBox;
//# sourceMappingURL=tight-bounding-box.js.map