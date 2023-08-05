/** @internal */
declare const _debug_: Debug;

import { Debug } from '../debug/debug.js';
import { LlRbTree } from 'flo-ll-rb-tree';
import { distanceBetween, fromTo, interpolate, rotate, translate } from 'flo-vector2d';
import { getClosestBoundaryPointCertified } from 
    '../closest-boundary-point/get-closest-boundary-point-certified.js';
import { CpNode } from '../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { getOsculatingCircle } from '../point-on-shape/get-osculating-circle.js';
import { addDebugInfo } from './add-debug-info.js';
import { TXForDebugging } from './x-for-debugging.js';
import { findEquidistantPointOnLineDd } from './find-equidistant-point-on-line-dd.js';
import { getInitialBezierPieces } from './get-initial-bezier-pieces.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullBezierPieces2 } from './cull-bezier-pieces.js';


const { sqrt, abs, sin, cos } = Math;
const { EPSILON: eps } = Number;


/**
 * @internal
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and 
 * the second one is found by the algorithm.
 * 
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2 
 * points.
 * 
 * Before any 2-prongs are added the entire shape is our δΩ.
 * 
 * As per the paper by Choi, Choi, Moon and Wee: 
 *   "The starting point of this algorithm is a choice of a circle Br(x)
 *    centered at an interior point x which contains two boundary portions c and
 *    d of dΩ as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand. 
 * @param loops A shape represented by path loops
 * @param extreme The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape 
 * bounding box.
 * @param y The source point of the 2-prong to be found
 * @param isHoleClosing True if this is a hole-closing two-prong, false otherwise
 * @param k The loop array index
 */

function find2Prong(
		angle: number,
		loops: Loop[],
		extreme: number,
		squaredDiagonalLength: number,
		cpTrees: Map<Loop,LlRbTree<CpNode>>,
        y: PointOnShape,
		isHoleClosing: boolean,
		k: number): { circle: Circle,	zs: PointOnShape[] } | undefined {

	const MAX_ITERATIONS = 25;
	const squaredSeperationTolerance = ((2**-24)*extreme)**2;
	const errorTolerance = (2**-46)*extreme;
	const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);

	let xO: number[];  // the original x to mitigate drift
	let p = y.p;
	let r: number;
	if (isHoleClosing) {
		xO = [p[0], p[1] - maxOsculatingCircleRadius];
		r = maxOsculatingCircleRadius;
	} else {
		if (angle === 0) {
			xO = getOsculatingCircle(maxOsculatingCircleRadius, y).center;
		} else {
			xO = getOsculatingCircle(maxOsculatingCircleRadius, y, true).center;
			const v = fromTo(y.p, xO);
			const v_ = rotate(sin(angle), cos(angle))(v);
			xO = translate(y.p)(v_);
		}

		r = squaredDistanceBetweenDd(p,xO);
	}

	// The boundary piece that should contain the other point of 
	// the 2-prong circle. (Defined by start and end points).
	const { bezierPieces, δ } = getInitialBezierPieces(
		angle, isHoleClosing, k, loops, cpTrees, y, { center: xO, radius: r }
	);

	/** The center of the two-prong (successively refined) */
	let x = xO;

	// The lines below is an optimization.
	const r_ = reduceRadius(extreme, bezierPieces, p, xO);
	if (r > r_) {
		x = interpolate(p, xO, sqrt(r_/r));
	}

	/** Trace the convergence (for debugging). */
	const xs: TXForDebugging[] = []; 
	/** The antipode of the two-prong (successively refined) */
	// let z: { pos: PointOnShape; d: number } = undefined!; 
	let z: PointOnShape = undefined!;
	let bezierPieces_ = bezierPieces;

	//if (y.p[0] === 62.83499999999913 && y.t === 0) {
	//	console.log('aaa')
	//}

	let i = 0;
	while (i < MAX_ITERATIONS) {
		/** squared distance between source boundary point and circle center */
		const xy = squaredDistanceBetweenDd(x, y.p);

		if (i < 5) {  // optimization
			bezierPieces_ = cullBezierPieces2(bezierPieces_, x, xy);
		}

		z = getClosestBoundaryPointCertified(angle, bezierPieces_, x, y.curve, y.t);
		

		if (z === undefined) {
			addDebugInfo2(isHoleClosing);
			return undefined;
		}
		
		if (typeof _debug_ !== 'undefined') { xs.push({ x, y, z: z, t: y.t }); }

	
		/** squared distance between anti-pode boundary point and circle center */
		const xz = squaredDistanceBetweenDd(x, z.p);
		const yz = squaredDistanceBetweenDd(y.p, z.p);

		if (!isHoleClosing) {
			// if (i === 1) { if (xy < xz) { return undefined; } }
			if (yz <= squaredSeperationTolerance) {
				// if (typeof _debug_ !== 'undefined') { console.log(`failed: seperation too small - ${sqrt(yz)}`); }
				return undefined;
			} 
		}

		// Find the point on the line connecting y with x that is  
		// equidistant from y and z. This will be our next x.
		const nextX = findEquidistantPointOnLineDd(x, y.p, z.p);
		const error = abs(sqrt(xy) - sqrt(xz));
		// if (xy < xz) { return undefined; }
		
		x = nextX;

		if (error < errorTolerance) {
			break;
		} 

		i++;
		
		if (i === MAX_ITERATIONS) {
			// Convergence was too slow.
			if (typeof _debug_ !== 'undefined') { console.log('failed (slow): max iterations reached'); }
			return undefined;
		}
	}


	// TODO2 - there should be a better way - reuse
	const zs = getCloseBoundaryPointsCertified(
		angle, bezierPieces_, x, y,
		distanceBetween(x, z.p),
		extreme
	);
	if (zs.length === 0) { 
		zs.push(z);
	}

	const circle = { center: x, radius: distanceBetween(x, z.p) };

	if (typeof _debug_ !== 'undefined') { addDebugInfo(bezierPieces, false, x, y, z, circle!, δ!, xs, isHoleClosing); }
	
	return { circle, zs };
}


function addDebugInfo2(isHoleClosing: boolean) {
	if (typeof _debug_ !== 'undefined') {
		const elems = _debug_.generated.elems;
		const elem = isHoleClosing  ? elems.twoProng_holeClosing : elems.twoProng_regular
		const elemStr = isHoleClosing ? 'hole-closing: ' + elem.length : 'regular: ' + elem.length;
		console.log('failed: no closest point - ' + elemStr);
	}
}

export { find2Prong }
