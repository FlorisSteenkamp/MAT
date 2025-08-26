import { distanceBetween, fromTo, interpolate, rotate, translate } from 'flo-vector2d';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { getOsculatingCircle } from '../point-on-shape/get-osculating-circle.js';
import { findEquidistantPointOnLineDd } from './find-equidistant-point-on-line-dd.js';
import { getInitialBezierPieces } from './get-initial-bezier-pieces.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
import { reduceRadius } from './reduce-radius.js';
import { squaredDistanceBetweenDd } from './squared-distance-between-dd.js';
import { cullBezierPieces2 } from './cull-bezier-pieces.js';
import { add1Prong } from './add-1-prong.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { MatMeta } from '../mat/mat-meta.js';
import { calcSeperationTolerance } from './calc-seperation-tolerance.js';


const { ceil, log2, max, sqrt, abs, sin, cos } = Math;


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
 * @param maxCoordinate The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape 
 * bounding box.
 * @param y The source point of the 2-prong to be found
 * @param isHoleClosing True if this is a hole-closing two-prong, false otherwise
 * @param loopIdx The loop array index
 */
function find2Prong(
		meta: MatMeta,
		isHoleClosing: boolean,
		for1Prong: boolean,
		angle: number,
        y: PointOnShape): { circle: Circle,	zs: PointOnShape[] } | undefined {

	const { loops, maxCoordinate, squaredDiagonalLength, cpTrees } = meta;

	const loop = y.curve.loop;

	const MAX_ITERATIONS = 25;
	const minSquaredSeperationTolerance = ((2**-21)*maxCoordinate)**2;
	const errorTolerance = (2**-46)*maxCoordinate;
	// const errorTolerance = (2**-28)*maxCoordinate;
	const maxOsculatingCircleRadius = sqrt(squaredDiagonalLength);
	const minCurvature = 1/maxOsculatingCircleRadius;
	const oneProngTolerance = (2**-16)*maxCoordinate;

	const [xO,rO] = getO(
		angle, isHoleClosing, maxOsculatingCircleRadius, minCurvature, y
	);

	const p = y.p;

	// The boundary piece that should contain the other point of 
	// the 2-prong circle. (Defined by start and end points).
	let bezierPieces = getInitialBezierPieces(
		angle, isHoleClosing, loop, loops, cpTrees, y, { center: xO, radius: rO }
	);

	/** The center of the two-prong (successively refined) */
	let x = xO;

	// The lines below is an optimization.
	const r_ = sqrt(reduceRadius(maxCoordinate, bezierPieces, p, xO));
	if (rO > r_) {
		x = interpolate(p, xO, r_/rO);
	}

	/** The antipode of the two-prong (successively refined) */
	let zs: PointOnShape[] = undefined!;
	let z: PointOnShape = undefined!;

	let i = 0;
	while (i < MAX_ITERATIONS) {
		const xy = squaredDistanceBetweenDd(x, y.p);

		if (i < 2) { bezierPieces = cullBezierPieces2(bezierPieces, x, xy); }
		const pow = max(0,ceil(log2(maxCoordinate/xy))) + 1;  // determines accuracy
		// console.log(pow);
		const _zs = getCloseBoundaryPointsCertified(
			pow, bezierPieces, x, y.curve, y.t,
			for1Prong && i == 0 && rO !== 1/minCurvature,
			angle
		).map(info => createPos(info.curve, info.t, false));

		let maxD = Number.NEGATIVE_INFINITY;
		let maxPos: PointOnShape = undefined!;
		zs = [];
		for (const z of _zs) {
			if (z === undefined) { continue; }
			const _yz = squaredDistanceBetweenDd(y.p, z.p);
			if (_yz > maxD) {
				maxD = _yz;
				maxPos = z;
			}
			if (_yz !== 0) {
				zs.push(z);
			}
		}
		// z = zs[0];
		const yz = maxD;
		z = maxPos;

		if (z === undefined || yz === 0) {
			// addDebugInfo2(isHoleClosing);
			return undefined;
		}

		const xz = squaredDistanceBetweenDd(x, z.p);

		// if on first try
		if (i === 0) {
			if (rO < (1 - oneProngTolerance)*sqrt(xz)) {
				add1Prong(meta, rO, xO, y);
				return undefined;
			}
		}
		
		// if (typeof _debug_ !== 'undefined') { xs.push({ x, y, z: createPos(z.curve, z.t, false), t: y.t }); }

	
		if (!isHoleClosing) {
			const squaredSeperationTolerance = max(calcSeperationTolerance(
				rO, sqrt(xz), 2**2*errorTolerance
			), minSquaredSeperationTolerance);
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
			// if (typeof _debug_ !== 'undefined') { console.log('failed (slow): max iterations reached'); }
			return undefined;
		}
	}

	const circle = { center: x, radius: distanceBetween(x, z.p) };

	// if (typeof _debug_ !== 'undefined') { addDebugInfo(bezierPieces, false, x, y, z, circle!, δ!, xs, isHoleClosing); }

	// return { circle, zs };
	zs = zs.filter(z => z !== undefined)
	// return { circle, zs };
	return { circle, zs: [z] };
}


function getO(
		angle: number,
		isHoleClosing: boolean,
		maxOsculatingCircleRadius: number,
		minCurvature: number,
		y: PointOnShape) {

	let xO: number[];  // the original x to mitigate drift
	const p = y.p;
	let rO: number;
	if (isHoleClosing) {
		xO = [p[0], p[1] - maxOsculatingCircleRadius];
		rO = maxOsculatingCircleRadius;
	} else {
		if (angle === 0) {
			({ center: xO, radius: rO } = getOsculatingCircle(minCurvature, y));
		} else {
			({ center: xO, radius: rO } = getOsculatingCircle(minCurvature, y, true));
			const v = fromTo(y.p, xO);
			const v_ = rotate(sin(angle), cos(angle))(v);
			xO = translate(y.p)(v_);
		}
	}

	return [xO,rO] as [number[],number];
}


export { find2Prong }
