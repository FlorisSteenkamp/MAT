
import { Mat    } from '../../../mat';
import { traverseEdges } from "../../../traverse-edges";
import { drawFs } from 'flo-draw';
import { getCurveToNext } from '../../../mat/smoothen/smoothen';


function drawMat(type: 'mat' | 'sat') {

    let classes: string = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';

    return (g: SVGGElement, mat: Mat) => {
        let cpNode = mat.cpNode;
        
        if (!cpNode) { return undefined; }

        // TODO - remove - testing
        /*while (!cpNode.isTerminating()) {
            cpNode = cpNode.next;
        }*/
        /*
        drawFs.dot(g, cpNode.cp.pointOnShape.p, 1)
        drawFs.dot(g, cpNode.cp.circle.center, 2)
        */

        let $svgs: SVGElement[] = [];
        let i = 0;

        traverseEdges(cpNode, cpNode => {
            if (cpNode.isTerminating()) { return; }
    
            //let bezier = cpNode.matCurveToNextVertex;
            let bezier = getCurveToNext(cpNode);
            
            if (!bezier) { return; }

            i++;
            
            $svgs.push( ...drawFs.bezier(g, bezier, classes/*, i*100*/));
        });
        
        return $svgs;
    }
}


export { drawMat }
