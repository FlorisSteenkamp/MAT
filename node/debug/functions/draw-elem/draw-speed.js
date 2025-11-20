import { normal } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
import { toLength, translate } from 'flo-vector2d';
import { getSmoothedSpeed$ } from '../../../cp-node/fs/get-smoothed-speed.js';
/** @internal */
function drawSpeed(g, cpNode, classes_, delay = 0, scaleFactor = 1) {
    const $elems = [];
    const s = getSmoothedSpeed$(0)(cpNode);
    if (s === undefined) {
        return [];
    }
    const pos = cpNode.cp.pointOnShape;
    const { p, t } = pos;
    const ps = pos.curve.ps;
    const ss = s * scaleFactor / 8;
    const n = toLength(normal(ps, t), ss);
    $elems.push(...drawFs.line(g, [p, translate(p, n)], 'red thin5', delay));
    return $elems;
}
export { drawSpeed };
//# sourceMappingURL=draw-speed.js.map