import { CpNode } from '../../../cp-node.js';
import { drawCirclePercent } from './draw-circle-percent.js';


/** @hidden */
function leaves(g: SVGGElement, leaves: CpNode[]) {	
    let $elems: SVGElement[] = [];

    for (let cpNode of leaves) {
        let cp = cpNode.cp;
        let p = cp.circle.center;

        $elems.push(drawCirclePercent(g, p, 0.5, 'pinker thin5 nofill'));
    }
    
	return $elems;
}


export { leaves }
