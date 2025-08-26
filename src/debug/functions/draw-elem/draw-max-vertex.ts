import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node/cp-node.js';


/** @internal */
function maxVertex(g: SVGGElement, cpNode: CpNode) {	
    const circle = cpNode.cp.circle;

    const $elems = drawFs.circle(g, circle, 'brown thin10 nofill');
        
	return $elems;
}


export { maxVertex }
