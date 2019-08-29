
/** @hidden */
declare var _debug_: MatDebug; 

import { MatDebug } from './debug/debug';
import LlRbTree from 'flo-ll-rb-tree';
import { CpNode } from './cp-node/cp-node';
import { Loop } from './loop/loop';
import { Mat } from './mat';
import { simplifyPaths, ascendingByTopmostPoint } from './svg/fs/simplify-paths/simplify-paths';
import { getExtreme } from './svg/fs/get-extreme';
import { findAndAddAll3Prongs } from './mat/find-mat/find-and-add-3-prongs';
import { createInitialCpGraph } from './mat/find-mat/create-initial-cp-graph';;
import { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 } from './mat/find-mat/add-debug-info';
import { getPotential2Prongs } from './mat/find-mat/get-potential-2-prongs';
import { getSharpCorners } from './mat/find-mat/get-sharp-corners';
import { findAndAdd2ProngsOnAllPaths } from './mat/find-mat/find-and-add-2-prongs-on-all-paths';
import { createGetInterestingPointsOnLoop } from './mat/find-mat/create-get-interesting-points-on-loop';
import { findAndAddHoleClosing2Prongs } from './mat/find-mat/find-and-add-hole-closing-2-prongs';
import { getLoopArea } from './loop/get-loop-area';
import { normalizeLoops } from './loop/normalize/normalize-loop';


/**
 * Find the Medial Axis Transforms (MATs) from the given array of bezier loops
 * representing shape boundaries.
 * @param bezierLoops An array of (possibly intersecting) loops with each loop 
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each 
 * loop consists of an array of beziers represented by an array of control 
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic 
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 * @param additionalPointCount Additional points per bezier where a MAT circle
 * will be added. Defaults to 3.
 */
function findMats(
		bezierLoops: number[][][][], 
		additionalPointCount = 1) {

	if (typeof _debug_ !== 'undefined') {
		let timing = _debug_.generated.timing;
		timing.simplify[0] = performance.now();
	}

	// We use 14 here since (14+3)*3 = 51 < 53 (signifcand length). In other
	// words if we change a bezier point coordinate to power basis we add
	// three more significant figures at most (due to multiplication by 6) to
	// get a bit length of 17 so we can multiply 3 coordinates together without
	// any round-off error.
	//let loops = loops_.map(loop => normalizeLoop(loop, max, 13));
	let loops = normalizeLoops(bezierLoops, 14);

	let { loopss, xMap } = simplifyPaths(loops);

	for (let i=0; i<loopss.length; i++) {
		let loops = loopss[i].filter(loopHasNonNegligibleArea(0.1))
		loopss[i] = loops;
	}
	loopss = loopss.filter(loops => loops.length);

	if (typeof _debug_ !== 'undefined') {
		let timing = _debug_.generated.timing;
		timing.simplify[1] += performance.now() - timing.simplify[0];
	}

	let mats: Mat[] = [];
	for (let loops of loopss) {
		loops.sort(ascendingByTopmostPoint);
		let mat = findPartialMat(loops, xMap, additionalPointCount);
		if (mat) { mats.push(mat); }
	}

	return mats;
}


/**
 * @hidden
 * @param minArea 
 */
function loopHasNonNegligibleArea(minArea: number) {
	return (loop: Loop) => {
		let area = getLoopArea(loop);
		//console.log(area);
		return Math.abs(area) > minArea;
	}
}


/**
 * @hidden
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest 
 * (i.e. smallest y-value) topmost point loops to lowest)
 * @param xMap Intersection point map.
 * @param additionalPointCount 
 */
function findPartialMat(
		loops: Loop[], 
		xMap: Map<number[][],{ ps: number[][] }>,
		additionalPointCount = 3) {

	let extreme = getExtreme(loops);

	addDebugInfo1(loops);
		
	// Gets interesting points on the shape, i.e. those that makes sense to use 
	// for the 2-prong procedure.
	let pointsPerLoop = loops.map(
		createGetInterestingPointsOnLoop(additionalPointCount)
	);

	let for2ProngsPerLoop = getPotential2Prongs(pointsPerLoop);
	let sharpCornersPerLoop = getSharpCorners(pointsPerLoop);

	let cpTrees: Map<Loop, LlRbTree<CpNode>> = new Map();
	let cpNode = createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop, xMap);
	
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

	addDebugInfo3();

	if (typeof _debug_ !== 'undefined') {
		if (_debug_.directives.stopAfterTwoProngs) {
			return undefined;
		}
	}
	
	if (cpNode === undefined) { return undefined; }
	
	findAndAddAll3Prongs(cpTrees, cpNode, extreme);

	if (typeof _debug_ !== 'undefined') {
		if (_debug_.directives.stopAfterThreeProngs) {
			return undefined;
		}
	}

	let mat = new Mat(cpNode, cpTrees);

	addDebugInfo4(mat);
	
	return mat;
}


export { findMats }
