import { drawFs } from 'flo-draw';
/** @internal */
function maxVertex(g, cpNode) {
    const circle = cpNode.cp.circle;
    const $elems = drawFs.circle(g, circle, 'brown thin10 nofill');
    return $elems;
}
export { maxVertex };
//# sourceMappingURL=max-vertex.js.map