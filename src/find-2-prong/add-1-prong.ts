import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { Circle } from '../geometry/circle.js';
import { MatMeta } from '../mat/mat-meta.js';
import { isPosCorner } from '../point-on-shape/is-pos-corner.js';
import { getPosCorner } from '../point-on-shape/get-pos-corner.js';


/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpTrees
 * @param pos 
 */
function add1Prong(
		meta: MatMeta,
		radius: number,
        center: number[],
        pos: PointOnShape) {

    if (isPosCorner(pos) && getPosCorner(pos).isDull) {
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
		
		// if (typeof _debug_ !== 'undefined') { 
            // _debug_.generated.elems.oneProngAtDullCorner.push(pos);
        // }

		return;
	}
	
    const circle: Circle = { radius, center };
	
	const order = calcPosOrder(circle, pos);
	// Make sure there isn't already a ContactPoint close by - it can cause
	// floating point stability issues.
	if (getCloseByCpIfExist(meta, pos, circle, order, 0, 1)) {
		return;
	}

    const { anyFailed, cpNodes } = addToCpTree(false, false, circle, [-0.5, +0.5], meta.cpTrees, [pos, pos]); 
	
	// if (typeof _debug_ !== 'undefined') { 
    //     _debug_.generated.elems.oneProng.push(cpNodes);
    // }
}


export { add1Prong }