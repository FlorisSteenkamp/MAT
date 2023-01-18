import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node.js';


/** @hidden */
function maxVertex(g: SVGGElement, cpNode: CpNode) {	
    const circle = cpNode.cp.circle;

    const $elems = drawFs.circle(g, circle, 'brown thin10 nofill');
        
	return $elems;
}


export { maxVertex }
