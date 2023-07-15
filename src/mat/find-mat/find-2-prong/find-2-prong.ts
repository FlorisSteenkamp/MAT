/** @internal */
declare const _debug_: Debug;

import { Debug } from '../../../debug/debug.js';
import { LlRbTree } from 'flo-ll-rb-tree';
import { lineLineIntersection, distanceBetween, squaredDistanceBetween, interpolate, dot } from 'flo-vector2d';
import { evalDeCasteljau as evalDeCasteljau_ } from 'flo-bezier3';
import { getClosestBoundaryPoint } from 
    '../../closest-boundary-point/get-closest-boundary-point.js';
import { CpNode } from '../../../cp-node.js';
import { Loop } from '../../../loop.js';
import { Circle } from '../../../circle.js';
import { getOsculatingCircle, IPointOnShape } from '../../../point-on-shape.js';
import { BezierPiece } from '../../bezier-piece.js';
import { add1Prong } from '../add-1-prong.js';
import { addDebugInfo } from './add-debug-info.js';
import { TXForDebugging } from './x-for-debugging.js';
import { cullBezierPieces } from './cull-bezier-pieces.js';
import { findEquidistantPointOnLine } from './find-equidistant-point-on-line.js';
import { findEquidistantPointOnLineDd } from './find-equidistant-point-on-line-dd.js';
import { getInitialBezierPieces } from './get-initial-bezier-pieces.js';
import { getCloseBoundaryPoints } from '../../closest-boundary-point/get-close-boundary-points.js';


const evalDeCasteljau = evalDeCasteljau_;


/**
 * @hidden
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and 
 * the second one is found by the algorithm.
 * 
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2 
 * points.
 * 
 * Before any 2-prongs are added the entire shape is our δΩ (1-prongs do not 
 * reduce the boundary).
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
		loops: Loop[],
		extreme: number,
		squaredDiagonalLength: number,
		cpTrees: Map<Loop,LlRbTree<CpNode>>,
        y: IPointOnShape,
		isHoleClosing: boolean,
		k: number) {

	const MAX_ITERATIONS = 25;
	const squaredSeperationTolerance = (1e-5 * extreme)**2;
	// TODO - base deltas on theory or remove
	const oneProngTolerance = (1e-4)**2;
	// const oneProngTolerance = (1e-5)**2;
	// const oneProngTolerance = 0;
	const squaredErrorTolerance = 1e-2 * squaredSeperationTolerance;
	const maxOsculatingCircleRadiusSquared = squaredDiagonalLength;

	// The boundary piece that should contain the other point of 
	// the 2-prong circle. (Defined by start and end points).
	const { bezierPieces, δ } = getInitialBezierPieces(
		isHoleClosing, k, loops, cpTrees, y
	);
	//console.log(bezierPieces.length)

	/** The center of the two-prong (successively refined) */
	let x: number[];
	let p: number[];
	let r: number;
	if (isHoleClosing) {
		p = [y.p[0], y.p[1]];
		x = [p[0], p[1] - Math.sqrt(maxOsculatingCircleRadiusSquared)];
		r = maxOsculatingCircleRadiusSquared;
	} else {
		p = y.p;
		x = getOsculatingCircle(maxOsculatingCircleRadiusSquared, y).center;
		r = squaredDistanceBetween(p,x);
	}

	// The lines below is an optimization.
	const r_ = reduceRadius(extreme, bezierPieces, p, x);
	if (r > r_) {
		x = interpolate(p, x, Math.sqrt(r_/r));
	}

	
	/** Trace the convergence (for debugging). */
	const xs: TXForDebugging[] = []; 
	/** The antipode of the two-prong (successively refined) */
	let z: { pos: IPointOnShape; d: number }; 
	let i = 0;
	let done = 0;
	let failed = false; // The failed flag is set if a 2-prong cannot be found.
	let bezierPieces_ = bezierPieces;
	// ---> for (let b of bezierPieces) { d.fs.draw.bezierPiece(document.getElementsByTagName('g')[0], b.curve.ps, b.ts, 'nofill thin10 red', 100); }
	do {
		i++

		/** squared distance between source boundary point and circle center */
		const xy = squaredDistanceBetween(x, y.p);

		bezierPieces_ = cullBezierPieces(bezierPieces_, x, xy);

		z = getClosestBoundaryPoint(
			bezierPieces_,
			x,
			y.curve,
			y.t
		);

		if (z === undefined) {
			if (typeof _debug_ !== 'undefined') {
				const elems = _debug_.generated.elems;
				const elem = isHoleClosing 
					? elems.twoProng_holeClosing
					: elems.twoProng_regular
				const elemStr = isHoleClosing
					? 'hole-closing: ' + elem.length
					: 'regular: ' + elem.length;
				console.log(
					'failed: no closest point - ' + elemStr
				);
			}
			failed = true;
			break;
		}
		
		if (typeof _debug_ !== 'undefined') { 
			xs.push({ x, y, z: z.pos, t: y.t });	
		}
		
		/** squared distance between anti-pode boundary point and circle center */
		const xz = squaredDistanceBetween(x, z.pos.p);
		//if (i === 1 && d*oneProngTolerance >= r) {
		if (i === 1 && xy < xz+oneProngTolerance) {
			// It is a 1-prong.
			// TODO2 - below line was removed (maybe)
			add1Prong(Math.sqrt(maxOsculatingCircleRadiusSquared), cpTrees, y); 
			return undefined; 
		}
		
		// TODO - squaredSeperationTolerance should in future be replaced with
		// a relative error, i.e. distance between y (or z) / length(y (or z)).
		const yz = squaredDistanceBetween(y.p, z.pos.p);
		if (!isHoleClosing && yz <= squaredSeperationTolerance) {
			if (typeof _debug_ !== 'undefined') {
				/*
				let elems = _debug_.generated.elems;
				let elem = isHoleClosing 
					? elems.twoProng_holeClosing
					: elems.twoProng_regular
				let elemStr = isHoleClosing
					? 'hole-closing: ' + elem.length
					: 'regular: ' + elem.length;
				console.log(
					'failed: two-prong radius too small - ' + elemStr
				);
				*/
			}
			failed = true;
			break;
		} 

		// TODO - Accuracy optimization: tolerance should not be between x and 
		// nextX, but rather (distance from x to y) - (distance from x to z)

		// Find the point on the line connecting y with x that is  
		// equidistant from y and z. This will be our next x.
		// const nextX = findEquidistantPointOnLineDd(x, y.p, z.pos.p);
		const nextX = findEquidistantPointOnLine(x, y.p, z.pos.p);
		const squaredError = squaredDistanceBetween(x, nextX);
		// const squaredError = Math.abs(xy - xz);
		
		x = nextX;

		if (squaredError < squaredErrorTolerance) {
			done++; // Do one more iteration
		} else if (i === MAX_ITERATIONS) {
			// Convergence was too slow.
			failed = true;
			break; // We're done
		}
	} while (done < 1);


	/************************************************************************ */
	/* Do one more double-double precision iteration
	/************************************************************************ */
	/*
	z = getClosestBoundaryPoint(
		bezierPieces_, x, y.curve, y.t
	);

	if (z === undefined) {
		failed = true;
	}
	
	if (typeof _debug_ !== 'undefined') { 
		xs.push({ x, y, z: z.pos, t: y.t });	
	}
	
	if (!isHoleClosing && squaredDistanceBetween(y.p, z.pos.p) <= squaredSeperationTolerance) {
		failed = true;
	} else {
		x = findEquidistantPointOnLineDd(x, y.p, z.pos.p);
	}
	/************************************************************************ */
	/************************************************************************ */


	// TODO - Optimization: only do this if second closest point is within the
	// tolerance which can be checked in getClosestBoundaryPoint algorithm
	let zs: { pos: IPointOnShape; d: number; }[] = [];
	if (!failed) {
		zs = getCloseBoundaryPoints(
			bezierPieces_, 
			x,
			y,
			distanceBetween(x, z.pos.p)
		);

		if (!zs.length) { 
			// TODO - Numerical issue - fix
			zs.push(z);
		}
	}

	let circle: Circle;
	if (z !== undefined) {
		circle = { center: x, radius: distanceBetween(x, z.pos.p) };
	}


	// TODO2
	// if (Math.random() > 0.8 && !isHoleClosing) { return undefined; }

	if (typeof _debug_ !== 'undefined' && !failed) { 
		xs.push({ x, y, z: z.pos, t: y.t });
		addDebugInfo(bezierPieces, failed, y, circle, z.pos, δ, xs, isHoleClosing);
	}
	
	return failed ? undefined : { circle, zs };
}


/**
 * @hidden
 * Reduces the circle radius initially as an optimization step.
 */
function reduceRadius(
		extreme: number,
		bezierPieces: BezierPiece[], 
		p: number[],
		x: number[]) {

	const TOLERANCE = extreme * 1e-3;

	let prevP = undefined;
	let minRadius = Number.POSITIVE_INFINITY;
	for (let i=0; i<bezierPieces.length; i++) {
		const bezierPiece = bezierPieces[i];

		const ps = bezierPiece.curve.ps;

		const p1 = evalDeCasteljau(ps, bezierPiece.ts[0]);
		let r1 = Number.POSITIVE_INFINITY;

		// Prevent evaluating the same points twice
		if (!prevP || prevP[0] !== p1[0] || prevP[1] !== p1[1]) {
			const cc1 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1);
			if (cc1) { r1 = squaredDistanceBetween(p, cc1);	}
		}
		
		let r2 = Number.POSITIVE_INFINITY;
		const p2 = evalDeCasteljau(ps, bezierPiece.ts[1]);

		const cc2 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p2);
		if (cc2) { r2 = squaredDistanceBetween(p, cc2);	}
		
		prevP = p2;
		
		const d = Math.min(r1, r2); 
		
		if (d < minRadius) {
			minRadius = d;  
		}
	}
	
	// The extra bit is to account for floating point precision.
	// TODO - base delta on theory
	return minRadius + TOLERANCE;
}


/**
 * @hidden
 * @param p A point on the circle with normal pointing to x towards the center
 * of the circle.
 * @param x
 * @param p1 Another point on the circle.
 */
function getCircleCenterFrom2PointsAndNormal(
		extreme: number, 
		p: number[], 
		x: number[],
		p1: number[]) {

	// TODO - remove delta
	const TOLERANCE = (1e-4 * extreme)**2;

	// Ignore if p and p1 are too close together
	if (squaredDistanceBetween(p,p1) < TOLERANCE) {
		return undefined;
	}

	/** The perpindicular bisector between the two given points on the circle */
	const pb = [
		(p[0] + p1[0]) / 2,
		(p[1] + p1[1]) / 2,
	];
	const tan = [p1[0] - p[0], p1[1] - p[1]];
	const norm  = [-tan[1], tan[0]]; // Rotate by 90 degrees
	const pb2 = [pb[0] + norm[0], pb[1] + norm[1]];

	const res = lineLineIntersection([p,x], [pb, pb2]);

	if (!res) { return undefined; }

	const resO = [res[0] - p[0], res[1] - p[1]];
	const xO = [x[0] - p[0], x[1] - p[1]];
	if (dot(resO, xO) < 0) {
		return undefined;
	}

	return res;
}


export { find2Prong }
