"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawSharpCorner(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let $pos = _debug_.fs.draw.dot(pos.p, 0.6 * scaleFactor, 'green ' + visibleClass);
    return { $pos };
}
exports.drawSharpCorner = drawSharpCorner;
