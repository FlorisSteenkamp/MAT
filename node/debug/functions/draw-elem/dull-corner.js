"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dullCorner(g, pos) {
    const scaleFactor = 0.1;
    let $pos = _debug_.fs.draw.dot(g, pos.p, 0.5 * scaleFactor, 'orange');
    return $pos;
}
exports.dullCorner = dullCorner;
//# sourceMappingURL=dull-corner.js.map