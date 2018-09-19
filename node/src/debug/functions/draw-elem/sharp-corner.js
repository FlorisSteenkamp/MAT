"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sharpCorner(g, pos) {
    const scaleFactor = 0.1;
    let $pos = _debug_.fs.draw.dot(g, pos.p, 0.6 * scaleFactor, 'green');
    return $pos;
}
exports.sharpCorner = sharpCorner;
