"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function looseBoundingBox(g, box) {
    let $box = flo_draw_1.drawFs.rect(g, box, 'thin5 brown nofill');
    return $box;
}
exports.looseBoundingBox = looseBoundingBox;
//# sourceMappingURL=loose-bounding-box.js.map