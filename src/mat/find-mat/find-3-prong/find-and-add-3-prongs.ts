/** @internal */
declare const _debug_: Debug; 

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug } from '../../../debug/debug.js';
import { CpNode, getRealProngCount } from '../../../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { Circle } from '../../../circle.js';
import { calcPosOrder } from '../../../point-on-shape/calc-pos-order.js';
import { find3Prong } from './find-3-prong.js';
import { add3Prong  } from './add-3-prong.js';
import { enhanceCpNode } from '../../../cp-node/enhance-cp-node.js';


/**
 * @internal
 * Traverses the shape from the given ContactPoint going around contact circles 
 * so that only a piece of the shape is traversed and returns the visited 
 * CpNodes (starting from the given CpNode).
 * @param cpStart The ContactPoint from where to start the traversal.
 */
function traverseShape(cpStart: CpNode) {
	let cpNode = cpStart;

	if (cpNode === cpNode.next.prevOnCircle) {
		return [cpNode];
	}

	const visitedCps: CpNode[] = [];
	do {
		visitedCps.push(cpNode);
	
		const next = cpNode.next.prevOnCircle;
		cpNode = cpNode === next
				? cpNode = cpNode.next.next // Terminal vertex
				: cpNode = next         // Take last exit
	
	} while (cpNode !== cpStart); 
	
	return visitedCps;
}


/**
 * @internal
 * Starting from some ContactPoint, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively 
 * adds 3-prongs until only one or two Vertices have been visited. 
 * 
 * This process further subdivides the shape.
 * 
 * @param cpGraphs
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
let ii = 0;
function findAndAdd3Prongs(
		cpGraphs: Map<Loop,LlRbTree<CpNode>>,
		cpStart: CpNode,
		extreme: number): CpNode[] {

	let visitedCps: CpNode[];
	
	do {
		visitedCps = traverseShape(cpStart);
	
		if (visitedCps.length > 2) {
			const newCpNodes = findAndAdd3Prong(cpGraphs, visitedCps, extreme);
			if (newCpNodes.length === 1) {
				// There was another closeby cpNode
				const closeCpNode = newCpNodes[0];
				// console.log(getRealProngCount(closeCpNode));
				// console.log(enhanceCpNode(closeCpNode));
				// throw 'a';
			}
			ii++;
		}

		if (typeof _debug_ !== 'undefined') {
            if (ii === _debug_.directives.stopAfterThreeProngsNum) {
                return undefined!;
            }
        }
	} while (visitedCps.length > 2);

	return visitedCps;
}


/**
 * @internal
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpGraphs
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(
		cpGraphs: Map<Loop,LlRbTree<CpNode>>,
		visitedCps: CpNode[],
		extreme: number): CpNode[] {
	
	const δs: [CpNode, CpNode][] = [];
	for (const visitedCp of visitedCps) {
		δs.push([visitedCp, visitedCp.next]);
	}
	
	const threeProng = find3Prong(δs, extreme);
	
	const orders: number[] = [];
	for (let i=0; i<3; i++) {
		orders.push(
			calcPosOrder(threeProng.circle, threeProng.ps[i])
		);
	}
	
	const newCpNodes = add3Prong(cpGraphs, orders, threeProng);

	if (typeof _debug_ !== 'undefined') {
		if (newCpNodes.length === 3) {
			add3ProngDebugInfo(newCpNodes[0].cp.circle, visitedCps);
		}
	}

	return newCpNodes;
}


/** @internal */
function add3ProngDebugInfo(
		circle: Circle, 
		visitedCps: CpNode[]) {

	const threeProngs = _debug_.generated.elems.threeProng;
	const len = threeProngs.length;
	const data = threeProngs[len-1];
	data.visitedCps = visitedCps;
	data.circle = circle;
}


export { findAndAdd3Prongs }
