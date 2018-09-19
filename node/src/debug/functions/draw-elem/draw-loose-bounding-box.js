"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawLooseBoundingBox(box, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let $box = _debug_.fs.draw.looseBoundingBox(box, 'thin5 brown nofill ' + visibleClass);
    return { $box };
}
exports.drawLooseBoundingBox = drawLooseBoundingBox;
