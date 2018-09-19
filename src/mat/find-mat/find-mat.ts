
declare var _debug_: MatDebug; 

import { MatDebug, Generated } from '../../debug/debug';

import Memoize from 'flo-memoize';
import LlRbTree from 'flo-ll-rb-tree';

import { CpNode       } from '../../cp-node';
import { Loop         } from '../../loop';
import { PointOnShape } from '../../point-on-shape';
import { Mat          } from '../../mat';
import { Circle       } from '../../circle';

import { getLoopBounds, simplifyPaths } from '../../svg/svg';
import { findAndAddAll3Prongs } from '../find-mat/find-and-add-3-prongs';
import { createInitialCpGraph } from '../find-mat/create-initial-cp-graph';;
import { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 } from '../find-mat/add-debug-info';
import { getPotential2Prongs } from '../find-mat/get-potential-2-prongs';
import { getInterestingPointsOnLoop } from '../find-mat/get-interesting-points-on-loop';
import { getSharpCorners } from '../find-mat/get-sharp-corners';
import { orient } from '../../svg/fs/simplify-paths/orient';
import { getExtreme } from '../../svg/fs/get-extreme';
import { smoothen } from '../smoothen/smoothen';
import { findAndAdd2ProngsOnAllPaths } from './find-and-add-2-prongs-on-all-paths';
import { findAndAddHoleClosing2Prongs } from './find-and-add-hole-closing-2-prongs';

let { m1: memoize } = Memoize;


/**
 * Find the MAT from the given Shape.
 * @param shape
 */
let findMat = memoize(function(loops: Loop[]) {
	if (typeof _debug_ !== 'undefined') {
		let timing = _debug_.generated.timing;
		timing.simplify[0] = performance.now();
	}

	//let loops_ = loops.map(loop => Loop.perturb(loop, 10))
	//let loopss = simplifyPaths(loops_);

	let loopss = simplifyPaths(loops);

	if (typeof _debug_ !== 'undefined') {
		let timing = _debug_.generated.timing;
		timing.simplify[1] += performance.now() - timing.simplify[0];
	}

	let mat: Mat[] = [];
	for (let loops of loopss) {
		loops.sort(ascendingByTopmostPoint);
		loops = orient(loops);
		/*
		for (let loop of loops) {
			console.log(loop.toBeziers());
		}
		*/
		let partialMat = findPartialMat(loops);
		if (partialMat) {
			mat.push(partialMat);
		}
	}
	return mat;
});


function findPartialMat(loops: Loop[]) {
	let extreme = getExtreme(loops);

	addDebugInfo1(loops);
		
	// Gets interesting points on the shape, i.e. those that makes sense to use 
	// for the 2-prong procedure.
	let pointsPerLoop = loops.map(getInterestingPointsOnLoop);

	let for2ProngsPerLoop = getPotential2Prongs(pointsPerLoop);
	let sharpCornersPerLoop = getSharpCorners(pointsPerLoop);

	let cpTrees: Map<Loop, LlRbTree<CpNode>> = new Map();
	let cpNode = createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop);
	
	findAndAddHoleClosing2Prongs(loops, cpTrees, extreme);

	if (typeof _debug_ !== 'undefined') {
		if (_debug_.directives.stopAfterHoleClosers) {
			return undefined;
		}
	}

	addDebugInfo2(pointsPerLoop);
	
	cpNode = findAndAdd2ProngsOnAllPaths(
		loops, cpTrees, for2ProngsPerLoop, extreme
	);

	if (typeof _debug_ !== 'undefined') {
		if (_debug_.directives.stopAfterTwoProngs) {
			return undefined;
		}
	}

	addDebugInfo3();
	
	if (cpNode === undefined) { return undefined; }
	
	findAndAddAll3Prongs(cpTrees, cpNode, extreme);

	if (typeof _debug_ !== 'undefined') {
		if (_debug_.directives.stopAfterThreeProngs) {
			return undefined;
		}
	}

	let mat = new Mat(cpNode, cpTrees);

	smoothen(mat.cpNode);

	addDebugInfo4(cpNode);
	
	return mat;
}


/**
 * 
 * @param loopA 
 * @param loopB 
 */
function ascendingByTopmostPoint(loopA: Loop, loopB: Loop) {
    let boundsA = getLoopBounds(loopA);
    let boundsB = getLoopBounds(loopB);

    let a = boundsA.minY.p[1];
    let b = boundsB.minY.p[1];

    return a-b;
}


export { findMat };
