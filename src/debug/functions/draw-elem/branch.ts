
import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node';
import { getCurveToNext } from '../../../get-curve-to-next';


/** @hidden */
function drawBranch(g: SVGGElement, branch: CpNode[], delay?: number) {

    let classes = 'thin5 purple nofill';

    let $svgs: SVGElement[] = [];
    let i = 0;

    for (let cpNode of branch) {
        if (cpNode.isTerminating()) { continue; }
        //let bezier = cpNode.matCurveToNextVertex;
        let bezier = getCurveToNext(cpNode);
        if (!bezier) { continue; }
        i++;
        $svgs.push( ...drawFs.bezier(g, bezier, classes, delay));
    }
    
    return $svgs;
}


export { drawBranch }
