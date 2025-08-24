import { drawFs } from 'flo-draw';
import { CpNode, isTerminating } from '../../../cp-node/cp-node.js';
import { getCurveToNext } from '../../../cp-node/get-curve-to-next.js';


/** @internal */
function drawBranch(g: SVGGElement, branch: CpNode[], delay?: number) {

    const classes = 'thin5 purple nofill';

    const $svgs: SVGElement[] = [];
    let i = 0;

    for (const cpNode of branch) {
        if (isTerminating(cpNode)) { continue; }
        const bezier = getCurveToNext(cpNode);
        if (!bezier) { continue; }
        i++;
        $svgs.push( ...drawFs.bezier(g, bezier, classes, delay));
    }
    
    return $svgs;
}


export { drawBranch }
