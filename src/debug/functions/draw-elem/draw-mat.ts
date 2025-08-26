import { drawFs } from 'flo-draw';
import { Mat } from '../../../mat/mat.js';
import { $traverseEdges, traverseEdges, traverseEdges$$ } from '../../../cp-node/fs/traverse-edges.js';
import { getMatCurveToNext } from '../../../cp-node/fs/get-mat-curve-to-next.js';
import { CpNodeFs } from '../../../cp-node/cp-node-fs.js';
import { drawCpNode } from './draw-cp-node.js';
import { sleep } from '../../../utils/sleep.js';

const { isTerminating } = CpNodeFs;


const altClasses = [
    'thin10 blue nofill',
    'thin10 red nofill'
];

/** @internal */
/*async */function drawMat(
        g: SVGGElement,
        mat: Mat,
        classes_?: string,
        delay = 0,
        scaleFactor = 1): /*Promise<*/SVGElement[]/*>*/ {

    let cpNode = mat.cpNode;
    if (!cpNode) { return []; }

    while (!isTerminating(cpNode)) { cpNode = cpNode.next; }

    const $svgs: SVGElement[] = [];

    let i = 0;
    traverseEdges(cpNode, async cpNode => {
        // await sleep(50);
        if (isTerminating(cpNode)) { return; }

        const bezier = getMatCurveToNext(cpNode);
        if (!bezier) { return; }

        $svgs.push( ...drawFs.bezier(g, bezier, altClasses[i%2], delay));
        i++;
    });

    return $svgs;
}


function drawCurve() {

}


export { drawMat }
