import { drawFs } from 'flo-draw';
import { Mat } from '../../../mat.js';
import { traverseEdges } from '../../../traverse-edges.js';
import { getCurveToNext } from '../../../get-curve-to-next.js';
import { isTerminating } from '../../../cp-node/cp-node.js';


/** @internal */
function drawMat(type: 'mat' | 'sat') {

    const classes: string = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';

    return (
            g: SVGGElement,
            mat: Mat,
            classes_?: string,
            delay = 0,
            scaleFactor = 1): SVGElement[] => {

        const cpNode = mat.cpNode;
        
        // if (!cpNode) { return undefined; }
        if (!cpNode) { return []; }

        const $svgs: SVGElement[] = [];
        let i = 0;

        traverseEdges(cpNode, cpNode => {
            if (isTerminating(cpNode)) { return; }
    
            const bezier = getCurveToNext(cpNode);

            if (!bezier) { return; }

            i++;
            
            $svgs.push( ...drawFs.bezier(g, bezier, classes, delay));
        });
        
        return $svgs;
    }
}


export { drawMat }
