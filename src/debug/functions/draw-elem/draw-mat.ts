import { drawFs } from 'flo-draw';
import { Mat } from '../../../mat/mat.js';
import { traverseEdges } from '../../../cp-node/fs/traverse-edges.js';
import { getMatCurveToNext } from '../../../cp-node/fs/get-mat-curve-to-next.js';
import { CpNodeFs } from '../../../cp-node/cp-node-fs.js';


const { isTerminating } = CpNodeFs;


const altClasses = [
    'thin10 blue nofill',
    'thin10 red nofill'
];

/** @internal */
function drawMat(
        g: SVGGElement,
        mat: Mat,
        classes_?: string,
        delay = 0,
        scaleFactor = 1): SVGElement[] {

    let cpNode = mat.cpNode;
    if (!cpNode) { return []; }

    while (!isTerminating(cpNode)) { cpNode = cpNode.next; }

    const $svgs: SVGElement[] = [];

    let i = 0;
    traverseEdges(cpNode, cpNode => {
        if (isTerminating(cpNode)) { return; }

        const bezier = getMatCurveToNext(cpNode);
        if (!bezier) { return; }

        $svgs.push( ...drawFs.bezier(g, bezier, altClasses[i%2], delay));
        i++;
    });

    return $svgs;
}


export { drawMat }
