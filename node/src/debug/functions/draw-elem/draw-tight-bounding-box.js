"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawTightBoundingBox(box, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let $box = _debug_.fs.draw.tightBoundingBox(box, 'thin5 black nofill ' + visibleClass);
    return { $box };
}
exports.drawTightBoundingBox = drawTightBoundingBox;
