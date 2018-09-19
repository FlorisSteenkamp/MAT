"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawDullCorner(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let $pos = _debug_.fs.draw.dot(pos.p, 0.5 * scaleFactor, 'orange ' + visibleClass);
    return { $pos };
}
exports.drawDullCorner = drawDullCorner;
