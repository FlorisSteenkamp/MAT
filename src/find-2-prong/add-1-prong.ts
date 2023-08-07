/** @internal */
declare const _debug_: Debug; 

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug }   from '../debug/debug.js';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { addToCpGraph } from '../mat/add-to-cp-graph.js';
import { isAnotherCpCloseby } from '../mat/is-another-cp-closeby.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { isPosDullCorner } from '../point-on-shape/is-pos-dull-corner.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { Circle } from '../geometry/circle.js';


/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos 
 */
function add1Prong(
		radius: number,
        center: number[],
        cpGraphs: Map<Loop,LlRbTree<CpNode>>, 
        pos: PointOnShape) {

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
            // _debug_.generated.elems.oneProngAtDullCorner.push(pos);
        }

		return;
	}
	
	// const circle = getOsculatingCircle(maxOsculatingCircleRadius, pos);
    const circle: Circle = { radius, center };
	
	const order = calcPosOrder(circle, pos);
	// Make sure there isn't already a ContactPoint close by - it can cause
	// floating point stability issues.
	if (isAnotherCpCloseby(cpGraphs, pos, circle, order, 0, 1000)) {
		return;
	}

    const cpNodes = addToCpGraph(circle, [-0.5, +0.5], cpGraphs, [pos, pos]); 
	
	if (typeof _debug_ !== 'undefined') { 
        _debug_.generated.elems.oneProng.push(cpNodes);
    }
}


export { add1Prong }