
/** @hidden */
declare var _debug_: Debug; 

import { Debug } from '../../debug/debug';
import LlRbTree from 'flo-ll-rb-tree';
import { CpNode } from '../../cp-node';
import { Loop } from '../../loop';
import { Circle } from '../../circle';
import { calcPosOrder, isPosSharpCorner } from '../../point-on-shape';
import { find3Prong } from './find-3-prong/find-3-prong';
import { add3Prong  } from '../find-mat/add-3-prong';


/**
 * @hidden
 * Finds and adds all 3-prongs.
 * @param cpGraphs
 * @param cpStart The CpNode to start traversing from. 
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddAll3Prongs(
		cpGraphs : Map<Loop,LlRbTree<CpNode>>,
		cpStart  : CpNode,
		extreme  : number) {

	// Don't change this function to be recursive, the call stack may overflow 
	// if there are too many two-prongs.

	let visitedEdges = new Map<CpNode, Set<CpNode>>();

	let edgesToCheck = [{ fromCpNode: undefined as CpNode, cpStart }];

	while (edgesToCheck.length) {
		let { fromCpNode, cpStart } = edgesToCheck.shift();

		markEdgeAsTaken(visitedEdges, fromCpNode, cpStart);
		
		for (let cpNode of cpStart.getCpNodesOnCircle()) {

			//if (!PointOnShape.isSharpCorner(cpNode.cp.pointOnShape)) {
			if (!isPosSharpCorner(cpNode.cp.pointOnShape)) {
				if (findAndAdd3Prongs(cpGraphs, cpNode, extreme) === undefined) {
					return; // only for debugging purposes
				};
			}

			if (hasEdgeBeenTaken(visitedEdges, cpNode, cpNode.next)) {
				continue; // We already visited this edge
			}

			edgesToCheck.push({ fromCpNode: cpStart, cpStart: cpNode.next }); 
		}
	}
}


/**
 * @hidden
 * Marks the given edge as already taken.
 */
function markEdgeAsTaken(
		visitedEdges: Map<CpNode, Set<CpNode>>,
		cp1: CpNode, 
		cp2: CpNode) {

	if (cp1 === undefined) { return; }

	f(cp1, cp2);
	f(cp2, cp1);

	function f(cp1: CpNode, cp2: CpNode) {
		let visited = visitedEdges.get(cp1);
		if (!visited) { 
			visited = new Set<CpNode>();
			visitedEdges.set(cp1, visited);
		}  
		visited.add(cp2);
	}
}


/** @hidden */
function hasEdgeBeenTaken(
		visitedEdges: Map<CpNode, Set<CpNode>>,
		cp1: CpNode, 
		cp2: CpNode) {

	let cps: Set<CpNode>;

	cps = visitedEdges.get(cp1);
	let takenForward   = cps && cps.has(cp2); 

	cps = visitedEdges.get(cp2);
	let takenBackwards = cps && cps.has(cp1); 

	return takenForward || takenBackwards;
}


/**
 * @hidden
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

	let visitedCps = [];
	do {
		visitedCps.push(cpNode);
	
		let next = cpNode.next.prevOnCircle;
		cpNode = cpNode === next
				? cpNode = cpNode.next.next // Terminal vertex
				: cpNode = next         // Take last exit
	
	} while (cpNode !== cpStart); 
	
	return visitedCps;
}


/**
 * @hidden
 * Starting from some ContactPoint, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively 
 * adds 3-prongs until only one or two Vertices have been visited. 
 * 
 * This process further subdivides the shape.
 * @param cpGraphs
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
let ii = 0;
function findAndAdd3Prongs(
		cpGraphs : Map<Loop,LlRbTree<CpNode>>,
		cpStart  : CpNode,
		extreme  : number) {

	let visitedCps: CpNode[];
	
	do {
		visitedCps = traverseShape(cpStart);
	
		if (visitedCps.length > 2) {
			findAndAdd3Prong(cpGraphs, visitedCps, extreme);
			ii++;
		}

		if (typeof _debug_ !== 'undefined') {
            if (ii === _debug_.directives.stopAfterThreeProngsNum) {
                return undefined;
            }
        }
	} while (visitedCps.length > 2);

	return visitedCps;
}


/**
 * @hidden
 * Finds and add a 3-prong MAT circle to the given shape. 
 * @param cpGraphs
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(
		cpGraphs   : Map<Loop,LlRbTree<CpNode>>,
		visitedCps : CpNode[],
		extreme    : number) {
	
	let δs = [];
	for (let visitedCp of visitedCps) {
		δs.push([visitedCp, visitedCp.next]);
	}
	
	let threeProng = find3Prong(δs, extreme);
	
	let orders = [];
	for (let i=0; i<3; i++) {
		orders.push(
			//PointOnShape.calcOrder(threeProng.circle, threeProng.ps[i])
			calcPosOrder(threeProng.circle, threeProng.ps[i])
		);
	}
	
	let circle = add3Prong(cpGraphs, orders, threeProng);

	if (typeof _debug_ !== 'undefined') { 
		add3ProngDebugInfo(circle, visitedCps);
	}
}


/** @hidden */
function add3ProngDebugInfo(
		circle: Circle, 
		visitedCps: CpNode[]) {

	let threeProngs = _debug_.generated.elems.threeProng;
	let len = threeProngs.length;
	let data = threeProngs[len-1];
	data.visitedCps = visitedCps;
	data.circle     = circle;
}


export { findAndAddAll3Prongs }
