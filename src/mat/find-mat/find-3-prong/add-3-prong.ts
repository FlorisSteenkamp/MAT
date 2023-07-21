declare const _debug_: Debug;

import { Debug } from '../../../debug/debug.js';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode, getRealProngCount } from '../../../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { Circle } from '../../../circle.js';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { addToCpGraph } from '../../add-to-cp-graph.js';
import { isAnotherCpCloseby } from '../../is-another-cp-closeby.js';


/**
 * @internal
 * 
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated) 
 * points on the shape. 
 * 
 * Returns 3 CpNodes if successful, else return one CpNode that is an offending
 * too close existing CpNode.
 * 
 * @param cpTrees 
 * @param orders 
 * @param threeProng 
 */
function add3Prong(
		cpTrees: Map<Loop,LlRbTree<CpNode>>,
		orders: number[],
		threeProng: { 
    		circle: Circle, 
			ps: PointOnShape[],
			δ3s: CpNode[][]
		}): CpNode[] {
	
	const { circle, ps: poss, δ3s } = threeProng;

	// Keep for possible future debugging.	

	/*
	let ii = -1;
	if (typeof _debug_ !== 'undefined') {
		for (let i=0; i<3; i++) {
			const cpBef = threeProng.δ3s[i][0].cp;
			const cpAft = threeProng.δ3s[i][1].cp;

			//let cmpBef = PointOnShape.compareInclOrder(cpBef.pointOnShape, poss[i], cpBef.order, orders[i]);
			//let cmpAft = PointOnShape.compareInclOrder(cpAft.pointOnShape, poss[i], cpAft.order, orders[i]); 
			const cmpBef = compareCps(cpBef, { pointOnShape: poss[i], order: orders[i], order2: 0, circle: undefined });
			const cmpAft = compareCps(cpAft, { pointOnShape: poss[i], order: orders[i], order2: 0, circle: undefined });

			// const cmpBef = comparePoss(cpBef.pointOnShape, poss[i]);
			// const cmpAft = comparePoss(cpAft.pointOnShape, poss[i]); 

			// len is used by debug functions to reference a particular 
			// three-prong.
			const len = _debug_.generated.elems.threeProng.length-1; 
			if (cmpBef > 0) {
				console.log('----------------------------------------');
				console.log(`3-prong order is wrong (bef) : i: ${i} - cmp: ${cmpBef} - n: ${len}`);
				console.log(threeProng);
				console.log(cpBef);
				console.log(cpAft);
				console.log(poss[i]);
				ii = i;
			}
			if (cmpAft < 0) {
				console.log('----------------------------------------');
				console.log(`3-prong order is wrong (aft) : i: ${i} - cmp: ${cmpAft} - n: ${len}`);
				console.log(threeProng);
				console.log(cpBef);
				console.log(cpAft);
				console.log(poss[i]);
			}
		}
	}
	*/

	// TODO - replace 1000 below with correct value
	const c1 = isAnotherCpCloseby(cpTrees, poss[0], circle, orders[0], 0, 1000);
	const c2 = isAnotherCpCloseby(cpTrees, poss[1], circle, orders[1], 0, 1000);
	const c3 = isAnotherCpCloseby(cpTrees, poss[2], circle, orders[2], 0, 1000);

	// for (let pos of poss) {
	// 	if (pos.t === 0.9978869234519733) {
	// 		console.log(pos)
	// 	}
	// }
	

	// if (!!c1) {
	// 	console.log(getRealProngCount(c1));
	// }
	// if (!!c2) {
	// 	console.log(getRealProngCount(c2));
	// }
	// if (!!c3) {
	// 	console.log(getRealProngCount(c3));
	// }

	// if (!!c1) { return [c1]; }
	// if (!!c2) { return [c2]; }
	// if (!!c3) { return [c3]; }

	const cps = addToCpGraph(circle, orders, cpTrees, poss, δ3s); 
	
	return cps;
}


export { add3Prong }
