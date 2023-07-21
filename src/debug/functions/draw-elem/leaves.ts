import { CpNode } from '../../../cp-node/cp-node.js';
import { drawCirclePercent } from './draw-circle-percent.js';


/** @internal */
function leaves(g: SVGGElement, leaves: CpNode[]) {	
    const $elems: SVGElement[] = [];

    for (const cpNode of leaves) {
        const cp = cpNode.cp;
        const p = cp.circle.center;

        $elems.push(drawCirclePercent(g, p, 0.5, 'pinker thin5 nofill'));
    }
    
	return $elems;
}


export { leaves }
