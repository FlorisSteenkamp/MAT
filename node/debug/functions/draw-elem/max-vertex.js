import { drawFs } from 'flo-draw';
/** @hidden */
function maxVertex(g, cpNode) {
    let circle = cpNode.cp.circle;
    let $elems = drawFs.circle(g, circle, 'brown thin10 nofill');
    return $elems;
}
export { maxVertex };
//# sourceMappingURL=max-vertex.js.map