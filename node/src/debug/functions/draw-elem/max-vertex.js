"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function maxVertex(g, cpNode) {
    let draw = _debug_.fs.draw;
    let circle = cpNode.cp.circle;
    let $elems = draw.circle(g, circle, 'brown thin10 nofill');
    return $elems;
}
exports.maxVertex = maxVertex;
