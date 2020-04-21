
import { Mat    } from '../../../mat';
import { traverseEdges } from "../../../traverse-edges";
import { drawFs } from 'flo-draw';
import { getCurveToNext } from '../../../get-curve-to-next';
import { CpNode } from '../../../cp-node';


/** @hidden */
function drawMat(type: 'mat' | 'sat') {

    let classes: string = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';

    return (g: SVGGElement, mat: Mat) => {
        let cpNode = mat.cpNode;
        
        if (!cpNode) { return undefined; }

        let $svgs: SVGElement[] = [];
        let i = 0;

        traverseEdges(cpNode, cpNode => {
            if (cpNode.isTerminating()) { return; }
    
            let bezier = getCurveToNext(cpNode);

            if (!bezier) { return; }

            i++;
            
            $svgs.push( ...drawFs.bezier(g, bezier, classes/*, i*500*/));
        });
        
        return $svgs;
    }
}


export { drawMat }
