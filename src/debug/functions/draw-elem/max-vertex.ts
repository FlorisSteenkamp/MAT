
import { CpNode } from '../../../cp-node/cp-node';
import { drawFs } from 'flo-draw';


function maxVertex(g: SVGGElement, cpNode: CpNode) {	
    let circle = cpNode.cp.circle;

    let $elems = drawFs.circle(g, circle, 'brown thin10 nofill');
        
	return $elems;
}


export { maxVertex }
