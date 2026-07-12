import type { CpNode } from '../../../cp-node/cp-node.js';
import { drawFs } from 'flo-draw';


/** @hidden */
function drawOneProng(
        g: SVGGElement,
        cpNode: CpNode,
        classes?: string,
        delay = 0,
        scaleFactor = 1) {

    const cp = cpNode.cp;
    const { circle, pointOnShape: pos } = cp;

    const $posP = drawFs.dot(g, pos.p, 0.02*scaleFactor, 'deeppink', delay);
    const $circleCenter = drawFs.dot(g, circle.center, 0.01*scaleFactor, 'deeppink', delay);
    const $circle = drawFs.circle(g, circle, 'deeppink thin5 nofill', delay);

    return [...$posP, ...$circleCenter, ...$circle];
}


export { drawOneProng }
