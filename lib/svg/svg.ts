
// TODO - move later out of mat module

import Bezier3    from 'flo-bezier3'; 
import Vector     from 'flo-vector2d';
import PathCurve  from '../geometry/classes/path-curve';
import LinkedLoop from '../linked-list/linked-loop';
import ListNode   from '../linked-list/list-node';
import Geometry   from '../geometry/geometry';

//import pathDataPolyFill from './path-data-polyfill/path-data-polyfill.js';
//		'./path-data-polyfill/path-data-polyfill.js';

const DELTA = 1e-6; // TODO - must be replaced with value relative to image size.

/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
function getBeziersFromSvgElem(elem: SVGElement) {

	/**
	 * Returns true if the given point is close to the origin (by Manhattan 
	 * distance), fale otherwise.
	 * @private
	 * @param p - a point
	 * @param delta - a tolerance - defaults to 1e-6;
	 */
	function isCloseToOrigin(p: number[], delta: number = DELTA) {
		return Vector.manhattanLength(p) < delta;
	}
	

	/**
	 * Returns true if distance between consecutive points are all less than 
	 * some delta, false otherwise.
	 * @private
	 * @param ps - an array of points
	 * @param {number} [delta] - a tolerance - defaults to 1e-6;
	 * @returns {boolean}
	 */
	function isAlmostZeroLength(ps: number[][], delta: number = DELTA) {
		
		for (let i=1; i<ps.length; i++) {
			let p1 = ps[i-1];
			let p2 = ps[i];
			
			if (Vector.manhattanDistanceBetween(p1, p2) > DELTA) {
				return false; 
			}
		}
		
		return true;
	}


	function pushBezier(arr: PathCurve[], ps_: number[][], j: number) {
		// TODO 
		// We check if any of the ps are coincident and thus
		// that the bezier is degenerate in some sense. If that is the
		// case we apply a heuristic to get a new similar bezier by 
		// respacing the points. This entire function is very 
		// convoluted.
		// We should investigate a better mathematical solution.
		
		// Currently if the bezier degenerates more or less into a point
		// we make the next bezier start at the previous bezier's end
		// point else we adjust the bezier to be less pathological.

		//console.log(Vector)
		let ds = [
			[	
				0,
				Vector.manhattanDistanceBetween(ps_[0], ps_[1]),
				Vector.manhattanDistanceBetween(ps_[0], ps_[2]),
				Vector.manhattanDistanceBetween(ps_[0], ps_[3])
			],
			[
				Vector.manhattanDistanceBetween(ps_[1], ps_[0]),
				0,
				Vector.manhattanDistanceBetween(ps_[1], ps_[2]),	
				Vector.manhattanDistanceBetween(ps_[1], ps_[3]),
			],
			[
				Vector.manhattanDistanceBetween(ps_[2], ps_[0]),
				Vector.manhattanDistanceBetween(ps_[2], ps_[1]),
				0,	
				Vector.manhattanDistanceBetween(ps_[2], ps_[3]),
			],
			[
				Vector.manhattanDistanceBetween(ps_[3], ps_[0]),
				Vector.manhattanDistanceBetween(ps_[3], ps_[1]),
				Vector.manhattanDistanceBetween(ps_[3], ps_[2]),	
				0,
			]
		];
		
		let ps = ps_;
		
		const SHIFT = 0.1;
		// Check if first or last 3 points are coincident
		if (ds[0][1] < DELTA && ds[1][2] < DELTA || 
			ds[1][2] < DELTA && ds[2][3] < DELTA) {
			ps = [
				ps_[0],
				Vector.interpolate(ps_[0], ps_[3], 1/3),
				Vector.interpolate(ps_[0], ps_[3], 2/3),
				ps_[3]
			];
		}
		
		// Check if first 2 points are coincident
		if (ds[0][1] < DELTA) {
			ps[1] = Vector.interpolate(
					ps_[0], ps_[2], SHIFT
			); 	
		}
		
		// Check if last 2 points are coincident
		if (ds[2][3] < DELTA) {
			ps[2] = Vector.interpolate(
					ps_[1], ps_[3], 1-SHIFT 
			); 	
		}
		
		// Check if middle 2 points are coincident
		if (ds[1][2] < DELTA) {
			ps[1] = Vector.interpolate(
					ps_[0], ps_[1], 1-SHIFT 
			); 	
			ps[2] = Vector.interpolate(
					ps_[2], ps_[3], SHIFT 
			);
		}
		
		
		arr.push(new PathCurve(j, ps));
	}
	
	
	const MUST_START_WITH_M = 
		'Invalid SVG - every new path must start with an M or m.';
	const INVALID_COMMAND = 
		'Invalid SVG - command not recognized.'
	
	//pathDataPolyFill(); // Ensure polyfill is applied.

	//let paths = (elem as any).getPathData();  
	// TODO - must still implement handling of multiple <path>s
	let paths = elem.getElementsByTagName('path');
	let path = paths[0];
	let pathSegs = path.pathSegList;
	
	if (pathSegs.numberOfItems < 2) {
		// A shape is not described   
		return []; 
	}
	

	let pathStarted = false;

	// Used in conjunction with "S" and "s"
	let prev2ndCubicControlPoint: number[] = undefined;
	let prev2ndQuadraticControlPoint: number[] = undefined;
	
	let bezierArrays: PathCurve[][] = [];
	let bezierArray: PathCurve[] = [];

	let j;
	let type = undefined;
	let initialPoint = undefined;
	let x0: number;
	let y0: number;
	/*
	let pathSeg: {
		type: string/*,
		values: number[]*//*
	};*/
	for (let i=0; i<pathSegs.numberOfItems; i++) {
		let pathSeg = pathSegs.getItem(i);
		//let vals = pathSeg.values;
		//pathSeg.type = pathSeg_.pathSegTypeAsLetter;

		let type = pathSeg.pathSegTypeAsLetter;
		let addX = 0;
		let addY = 0;
		if (type == type.toLowerCase()) {
			addX = x0;
			addY = y0;
		}
		let prevType = type;
		type = type.toUpperCase();
		
		// TODO - massively simplify this code by using SVGPathSegCurvetoCubicAbs ??????

		let ps;
		switch (type) {
			/* 
			 * M and m: (from www.w3.org) 
			 * --------------------------
			 * Start a new sub-path at the given (x,y) coordinate. 
			 * M (uppercase) indicates that absolute coordinates will 
			 * follow; m (lowercase) indicates that relative coordinates 
			 * will follow. If a moveto is followed by multiple pairs of 
			 * coordinates, the subsequent pairs are treated as implicit 
			 * lineto commands. Hence, implicit lineto commands will be 
			 * relative if the moveto is relative, and absolute if the 
			 * moveto is absolute. If a relative moveto (m) appears as the 
			 * first element of the path, then it is treated as a pair of 
			 * absolute coordinates. In this case, subsequent pairs of 
			 * coordinates are treated as relative even though the initial 
			 * moveto is interpreted as an absolute moveto. 
			 */
			case 'M': {
				// Note: A valid SVG path must start with "M" or "m".
				
				let path = (pathSeg as SVGPathSegMovetoAbs);
				let vals = [path.x, path.y];
				
				if (pathStarted) {
					// This is a subpath, close as if a Z or z was the
					// previous command.
					if (prevType !== 'Z') {
						let xInterval = (vals[0] + addX - x0)/3;
						let yInterval = (vals[1] + addY - y0)/3;
						ps = [
							[x0, y0],
							[x0 + xInterval*1, y0 + yInterval*1],
							[x0 + xInterval*2, y0 + yInterval*2],
							[x0 + xInterval*3, y0 + yInterval*3]
						];
						prev2ndCubicControlPoint = undefined;
						prev2ndQuadraticControlPoint = undefined;
						
						if ( !isCloseToOrigin([xInterval, yInterval]) ) {
							pushBezier(bezierArray, ps, j++);
						}
					}
				}
				
				if (bezierArray.length) {
					bezierArrays.push(bezierArray);
					bezierArray = [];
				}
				
				pathStarted = true;
				
				// Update current point
				x0 = vals[0];
				y0 = vals[1];
				
				// Update initial point of current path/sub-path.
				initialPoint = [x0, y0];
				
				j = 0;
				
				break;
			}
		
			/* 
			 * C and c: (from www.w3.org) 
			 * params: x1 y1 x2 y2 x y
			 * --------------------------
			 * Draws a cubic Bézier curve from the current point to (x,y) 
			 * using (x1,y1) as the control point at the beginning of the 
			 * curve and (x2,y2) as the control point at the end of the 
			 * curve. C (uppercase) indicates that absolute coordinates 
			 * will follow; c (lowercase) indicates that relative 
			 * coordinates will follow. Multiple sets of coordinates may 
			 * be specified to draw a polybézier. At the end of the 
			 * command, the new current point becomes the final (x,y) 
			 * coordinate pair used in the polybézier.
			 */
			case 'C': { 
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegCurvetoCubicAbs);
				let vals = [path.x, path.y, path.x1, path.y1, path.x2, path.y2];

				ps = [
					[x0, y0],
					[addX + vals[0], addY + vals[1]],
					[addX + vals[2], addY + vals[3]],
					[addX + vals[4], addY + vals[5]]
				];
				prev2ndCubicControlPoint = ps[2];
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if ( !isAlmostZeroLength(ps) ) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
			/* 
			 * S and s: (from www.w3.org) 
			 * params: x2 y2 x y
			 * --------------------------
			 * Draws a cubic Bézier curve from the current point to 
			 * (x,y). The first control point is assumed to be the 
			 * reflection of the second control point on the previous 
			 * command relative to the current point. (If there is no 
			 * previous command or if the previous command was not an 
			 * C, c, S or s, assume the first control point is 
			 * coincident with the current point.) (x2,y2) is the 
			 * second control point (i.e., the control point at the end 
			 * of the curve). S (uppercase) indicates that absolute 
			 * coordinates will follow; s (lowercase) indicates that 
			 * relative coordinates will follow. Multiple sets of 
			 * coordinates may be specified to draw a polybézier. 
			 * At the end of the command, the new current point becomes 
			 * the final (x,y) coordinate pair used in the polybézier.
			 */
			case 'S': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegCurvetoCubicSmoothAbs);
				let vals = [path.x, path.y, path.x2, path.y2];

				let x1;
				let y1;
				if (prev2ndCubicControlPoint) {
					x1 = (x0 - prev2ndCubicControlPoint[0]) + x0; 
					y1 = (y0 - prev2ndCubicControlPoint[1]) + y0;
				} else {
					x1 = x0;
					y1 = y0;
				}
				ps = [
					[x0, y0],
					[x1, y1],
					[addX + vals[0], addY + vals[1]],
					[addX + vals[2], addY + vals[3]]
				];
				prev2ndCubicControlPoint = ps[2];
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if ( !isAlmostZeroLength(ps) ) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
			/* 
			 * L and l: (from www.w3.org)
			 * params: x y 
			 * --------------------------
			 * Draw a line from the current point to the given (x,y) 
			 * coordinate which becomes the new current point. L 
			 * (uppercase) indicates that absolute coordinates will 
			 * follow; l (lowercase) indicates that relative 
			 * coordinates will follow. A number of coordinates pairs 
			 * may be specified to draw a polyline. At the end of the 
			 * command, the new current point is set to the final set 
			 * of coordinates provided.
			 */	
			case 'L': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegLinetoAbs);
				let vals = [path.x, path.y];
				
				let xInterval = (vals[0] + addX - x0)/3;
				let yInterval = (vals[1] + addY - y0)/3;
				ps = [
					[x0, y0],
					[x0 + xInterval*1, y0 + yInterval*1],
					[x0 + xInterval*2, y0 + yInterval*2],
					[x0 + xInterval*3, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if ( !isCloseToOrigin([xInterval, yInterval]) ) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
				
			/* 
			 * H and h: (from www.w3.org) 
			 * params: x
			 * --------------------------
			 * Draws a horizontal line from the current point (cpx, cpy) 
			 * to (x, cpy). H (uppercase) indicates that absolute 
			 * coordinates will follow; h (lowercase) indicates that 
			 * relative coordinates will follow. Multiple x values can 
			 * be provided (although usually this doesn't make sense). 
			 * At the end of the command, the new current point becomes 
			 * (x, cpy) for the final value of x.
			 */	
			case 'H': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegLinetoHorizontalAbs);
				let vals = [path.x];

				let xInterval = (vals[0] + addX - x0)/3;
				ps = [
					[x0, y0],
					[x0 + xInterval*1, y0],
					[x0 + xInterval*2, y0],
					[x0 + xInterval*3, y0]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if (Math.abs(xInterval) > DELTA) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
				
			/* 
			 * V and v: (from www.w3.org) 
			 * params: y
			 * --------------------------
			 * Draws a vertical line from the current point (cpx, cpy) 
			 * to (cpx, y). V (uppercase) indicates that absolute 
			 * coordinates will follow; v (lowercase) indicates that 
			 * relative coordinates will follow. Multiple y values can 
			 * be provided (although usually this doesn't make sense). 
			 * At the end of the command, the new current point becomes 
			 * (cpx, y) for the final value of y.
			 */
			case 'V': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegLinetoVerticalAbs);
				let vals = [path.y];

				//let yInterval = (vals[1] + addY - y0)/3;
				let yInterval = (vals[0] + addY - y0)/3;
				ps = [
					[x0, y0],
					[x0, y0 + yInterval*1],
					[x0, y0 + yInterval*2],
					[x0, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if (Math.abs(yInterval) > DELTA) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
				
			/* 
			 * Q and q: (from www.w3.org) 
			 * params: x1 y1 x y
			 * --------------------------
			 * Draws a quadratic Bézier curve from the current point to 
			 * (x,y) using (x1,y1) as the control point. Q (uppercase) 
			 * indicates that absolute coordinates will follow; q 
			 * (lowercase) indicates that relative coordinates will 
			 * follow. Multiple sets of coordinates may be specified 
			 * to draw a polybézier. At the end of the command, the new 
			 * current point becomes the final (x,y) coordinate pair 
			 * used in the polybézier.
			 */
			case 'Q': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegCurvetoQuadraticAbs);
				let vals = [path.x, path.y, path.x1, path.y1];

				//---------------------------------------------------
				// Convert quadratic to cubic
				// see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
				//---------------------------------------------------
				
				let QP0 = [x0, y0];
				let QP1 = [addX + vals[0], addY + vals[1]];
				let QP2 = [addX + vals[2], addY + vals[3]];
				
				
				// Endpoints stay the same
				let CP0 = QP0;
				let CP3 = QP2;
				
				// CP1 = QP0 + 2/3 *(QP1-QP0)
				let CP1 = [
					QP0[0] + (2/3)*(QP1[0]-QP0[0]), 
					QP0[1] + (2/3)*(QP1[1]-QP0[1])
				];
				// CP2 = QP2 + 2/3 *(QP1-QP2)
				let CP2 = [
					QP2[0] + (2/3)*(QP1[0]-QP2[0]), 
					QP2[1] + (2/3)*(QP1[1]-QP2[1])
				];
				
				ps = [CP0, CP1, CP2, CP3];
				
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = QP1;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if ( !isAlmostZeroLength(ps) ) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
				
			/* 
			 * T and t: (from www.w3.org) 
			 * params: x y
			 * --------------------------
			 * Draws a quadratic Bézier curve from the current point to 
			 * (x,y). The control point is assumed to be the reflection 
			 * of the control point on the previous command relative to 
			 * the current point. (If there is no previous command or if 
			 * the previous command was not a Q, q, T or t, assume the 
			 * control point is coincident with the current point.) T 
			 * (uppercase) indicates that absolute coordinates will 
			 * follow; t (lowercase) indicates that relative coordinates 
			 * will follow. At the end of the command, the new current 
			 * point becomes the final (x,y) coordinate pair used in the 
			 * polybézier.
			 */
			case 'T': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let path = (pathSeg as SVGPathSegCurvetoQuadraticSmoothAbs);
				let vals = [path.x, path.y];
				
				let x1;
				let y1;
				if (prev2ndQuadraticControlPoint) {
					x1 = (x0 - prev2ndQuadraticControlPoint[0]) + x0; 
					y1 = (y0 - prev2ndQuadraticControlPoint[1]) + y0;
				} else {
					x1 = x0;
					y1 = y0;
				}
			
				//---------------------------------------------------
				// Convert quadratic to cubic
				// see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
				//---------------------------------------------------
				
				let QP0 = [x0, y0];
				let QP1 = [x1, y1];
				let QP2 = [addX + vals[0], addY + vals[1]];
				
				
				// Endpoints stay the same
				let CP0 = QP0;
				let CP3 = QP2;
				
				// CP1 = QP0 + 2/3 *(QP1-QP0)
				let CP1 = [
					QP0[0] + (2/3)*(QP1[0]-QP0[0]), 
					QP0[1] + (2/3)*(QP1[1]-QP0[1])
				];
				// CP2 = QP2 + 2/3 *(QP1-QP2)
				let CP2 = [
					QP2[0] + (2/3)*(QP1[0]-QP2[0]), 
					QP2[1] + (2/3)*(QP1[1]-QP2[1])
				];
				
				ps = [CP0, CP1, CP2, CP3];
				
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = QP1;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];
				
				if ( !isAlmostZeroLength(ps) ) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
			}
				
			/* 
			 * A and a: (from www.w3.org) 
			 * params: rx ry x-axis-rotation large-arc-flag 
			 *         sweep-flag x y
			 * --------------------------------------------
			 * Draws an elliptical arc from the current point to (x, y). 
			 * The size and orientation of the ellipse are defined by 
			 * two radii (rx, ry) and an x-axis-rotation, which 
			 * indicates how the ellipse as a whole is rotated relative 
			 * to the current coordinate system. The center (cx, cy) of 
			 * the ellipse is calculated automatically to satisfy the 
			 * constraints imposed by the other parameters. 
			 * large-arc-flag and sweep-flag contribute to the automatic 
			 * calculations and help determine how the arc is drawn.
			 */
			case 'A': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				prev2ndCubicControlPoint = undefined; 
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				//x0 = ? ps[3][0]; 
				//y0 = ? ps[3][1];
				
				pushBezier(bezierArray, ps, j++);
				
				break;
			}				
				
			/* 
			 * Z and z: (from www.w3.org) 
			 * params: (none)
			 * --------------------------
			 * Close the current subpath by drawing a straight line 
			 * from the current point to current subpath's initial 
			 * point. Since the Z and z commands take no parameters, 
			 * they have an identical effect.
			 */
			case 'Z':
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
				
				let xInterval = (initialPoint[0] + addX - x0)/3;
				let yInterval = (initialPoint[1] + addY - y0)/3;
				
				ps = [
					[x0, y0],
					[x0 + xInterval*1, y0 + yInterval*1],
					[x0 + xInterval*2, y0 + yInterval*2],
					[x0 + xInterval*3, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = ps[3][0]; 
				y0 = ps[3][1];

				
				if ( !isCloseToOrigin([xInterval, yInterval]) ) {
					pushBezier(bezierArray, ps, j++);
				}
				
				break;
				
			default: 
				throw new Error(INVALID_COMMAND);
		}
	}


	if (bezierArray.length) {
		bezierArrays.push(bezierArray);
		bezierArray = [];
	}
	
	return bezierArrays;
}


/**
 * Returns a string representation of the given beziers linked loop.
 * @param beziers - A linked loop of cubic beziers.
 */
function getPathStrFromBezierLoop(bezierLoop: LinkedLoop<ListNode<number[][]>>) {
	let beziers = bezierLoop.getAsArray()
	.map(x => x.item);
	
	return Svg.getPathStrFromBeziers(beziers);
}


/**
 * Returns a string representation of the given array of beziers.
 * @param {number[][][]} beziers - An array of cubic beziers.
 * @returns {string}
 */
function getPathStrFromBeziers(
        beziers: number[][][], 
        decimalPlaces: number = 10): string {

	const D = decimalPlaces;
	
	let str = '';
	for (let ps of beziers) {
		if (ps === beziers[0]) {
			str = 'M ' + 
				ps[0][0].toFixed(D) + ' ' + 
				ps[0][1].toFixed(D) + '\n';
		}
		
		str += 'C ' + 
			ps[1][0].toFixed(D) + ' ' + 
			ps[1][1].toFixed(D) + ' ' +
			ps[2][0].toFixed(D) + ' ' + 
			ps[2][1].toFixed(D) + ' ' +
			ps[3][0].toFixed(D) + ' ' + 
			ps[3][1].toFixed(D) + ' ' + '\n';
	}
	
	
	return str;
}


const Svg = {
	getBeziersFromSvgElem,
	getPathStrFromBezierLoop,
	getPathStrFromBeziers
};


export default Svg;
