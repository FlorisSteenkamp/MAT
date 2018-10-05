
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { CpNode } from '../../../cp-node';


function maxVertex(g: SVGGElement, cpNode: CpNode) {	
    let draw = _debug_.fs.draw;

    let circle = cpNode.cp.circle;

    let $elems = draw.circle(g, circle, 'brown thin10 nofill');
        
	return $elems;
}


export { maxVertex }
