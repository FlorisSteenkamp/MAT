import { drawCirclePercent } from './draw-circle-percent.js';
/** @hidden */
function leaves(g, leaves) {
    const $elems = [];
    for (const cpNode of leaves) {
        const cp = cpNode.cp;
        const p = cp.circle.center;
        $elems.push(drawCirclePercent(g, p, 0.5, 'pinker thin5 nofill'));
    }
    return $elems;
}
export { leaves };
//# sourceMappingURL=leaves.js.map