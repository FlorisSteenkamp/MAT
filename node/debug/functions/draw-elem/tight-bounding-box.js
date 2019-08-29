"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function tightBoundingBox(g, box) {
    let $box = flo_draw_1.drawFs.polygon(g, box, 'thin5 black nofill');
    return $box;
}
exports.tightBoundingBox = tightBoundingBox;
//# sourceMappingURL=tight-bounding-box.js.map