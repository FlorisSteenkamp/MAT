"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxVertex = void 0;
const flo_draw_1 = require("flo-draw");
/** @hidden */
function maxVertex(g, cpNode) {
    let circle = cpNode.cp.circle;
    let $elems = flo_draw_1.drawFs.circle(g, circle, 'brown thin10 nofill');
    return $elems;
}
exports.maxVertex = maxVertex;
//# sourceMappingURL=max-vertex.js.map