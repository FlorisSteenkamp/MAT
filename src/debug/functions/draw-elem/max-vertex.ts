import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node.js';


/** @hidden */
function maxVertex(g: SVGGElement, cpNode: CpNode) {	
    let circle = cpNode.cp.circle;

    let $elems = drawFs.circle(g, circle, 'brown thin10 nofill');
        
	return $elems;
}


export { maxVertex }
