/** @hidden */
declare var _debug_: Debug; 

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug }   from '../../debug/debug.js';
import { Loop } from '../../loop.js';
import { getOsculatingCircle, calcPosOrder, isPosDullCorner, IPointOnShape } from '../../point-on-shape.js';
import { CpNode } from '../../cp-node.js';
import { addToCpGraph } from '../add-to-cp-graph.js';
import { isAnotherCpCloseby } from '../is-another-cp-closeby.js';


/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos 
 */
function add1Prong(
		maxOsculatingCircleRadius: number,
        cpGraphs: Map<Loop,LlRbTree<CpNode>>, 
        pos: IPointOnShape) {

	//if (PointOnShape.isDullCorner(pos)) {
    if (isPosDullCorner(pos)) {
		// This is a 1-prong at a dull corner.
		
		// TODO IMPORTANT 
		// Remove this line, uncomment piece below it and implement the 
		// following strategy to find the 3-prongs: if deltas are conjoined due 
		// to dull corner, split the conjoinment by inserting successively 
		// closer (binary division) 2-prongs. If a 2-prong actually fails, 
		// simply remove the 1-prong at the dull corner. In this way **all** 
        // terminal points are found, e.g. zoom in on top left leg of ant.
        // Afterthought: there is a better way - split points by two prongs.

		//toRemove.push(posNode); // this!
		
		if (typeof _debug_ !== 'undefined') { 
            _debug_.generated.elems.oneProngAtDullCorner.push(pos);
        }

		return;
	}
	
	//let circle = PointOnShape.getOsculatingCircle(maxOsculatingCircleRadius, pos);
	let circle = getOsculatingCircle(maxOsculatingCircleRadius, pos);
	
	//let order = PointOnShape.calcOrder(circle, pos);
	let order = calcPosOrder(circle, pos);
	// Make sure there isn't already a ContactPoint close by - it can cause
	// floating point stability issues.
	if (isAnotherCpCloseby(cpGraphs, pos, circle, order, 0, 1000, 'magenta')) {
		return;
	}

    addToCpGraph(circle, [-0.5, +0.5], cpGraphs, [pos, pos]); 
	
	if (typeof _debug_ !== 'undefined') { 
        _debug_.generated.elems.oneProng.push(pos);
    }
}


export { add1Prong }
