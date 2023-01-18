import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node.js';
import { getCurveToNext } from '../../../get-curve-to-next.js';


/** @hidden */
function drawBranch(g: SVGGElement, branch: CpNode[], delay?: number) {

    const classes = 'thin5 purple nofill';

    const $svgs: SVGElement[] = [];
    let i = 0;

    for (const cpNode of branch) {
        if (cpNode.isTerminating()) { continue; }
        //let bezier = cpNode.matCurveToNextVertex;
        const bezier = getCurveToNext(cpNode);
        if (!bezier) { continue; }
        i++;
        $svgs.push( ...drawFs.bezier(g, bezier, classes, delay));
    }
    
    return $svgs;
}


export { drawBranch }
