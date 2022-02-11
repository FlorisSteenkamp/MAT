import { drawCirclePercent } from './draw-circle-percent.js';
/** @hidden */
function leaves(g, leaves) {
    let $elems = [];
    for (let cpNode of leaves) {
        let cp = cpNode.cp;
        let p = cp.circle.center;
        $elems.push(drawCirclePercent(g, p, 0.5, 'pinker thin5 nofill'));
    }
    return $elems;
}
export { leaves };
//# sourceMappingURL=leaves.js.map