'use strict'

let Bezier     = require('../geometry/classes/bezier.js'); 
let LinkedLoop = require('../linked-loop/linked-loop.js');
let Geometry   = require('../geometry/geometry.js');
let Vector     = require('../vector/vector.js');
let svgGetAndSetPathDataPolyFill = require('./path-data-polyfill/path-data-polyfill.js');

let Svg = {};

const DELTA = 1e-6; // TODO - must be replaced with value relative to image size.

/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 */
Svg.getBeziersFromSvgElem = function(elem) {
	
	function pushBezier(arr, bezierPoints_, j) {
		// TODO 
		// We check if any of the bezierPoints are coincident and thus
		// that the bezier is degenerate in some sense. If that is the
		// case we apply a heuristic to get a new similar bezier by 
		// respacing the points. This entire function is very 
		// convoluted.
		// We should investigate a better mathematical solution.
		
		// Currently if the bezier degenerates more or less into a point
		// we make the next bezier start at the previous bezier's end
		// point else we adjust the bezier to be less pathological.

		let ds = [
			[	
				0,
				Vector.manhattanDistanceBetween(bezierPoints_[0], bezierPoints_[1]),
				Vector.manhattanDistanceBetween(bezierPoints_[0], bezierPoints_[2]),
				Vector.manhattanDistanceBetween(bezierPoints_[0], bezierPoints_[3])
			],
			[
				Vector.manhattanDistanceBetween(bezierPoints_[1], bezierPoints_[0]),
				0,
				Vector.manhattanDistanceBetween(bezierPoints_[1], bezierPoints_[2]),	
				Vector.manhattanDistanceBetween(bezierPoints_[1], bezierPoints_[3]),
			],
			[
				Vector.manhattanDistanceBetween(bezierPoints_[2], bezierPoints_[0]),
				Vector.manhattanDistanceBetween(bezierPoints_[2], bezierPoints_[1]),
				0,	
				Vector.manhattanDistanceBetween(bezierPoints_[2], bezierPoints_[3]),
			],
			[
				Vector.manhattanDistanceBetween(bezierPoints_[3], bezierPoints_[0]),
				Vector.manhattanDistanceBetween(bezierPoints_[3], bezierPoints_[1]),
				Vector.manhattanDistanceBetween(bezierPoints_[3], bezierPoints_[2]),	
				0,
			]
		];
		
		let bezierPoints = bezierPoints_;
		
		const SHIFT = 0.1;
		// Check if first or last 3 points are coincident
		if (ds[0][1] < DELTA && ds[1][2] < DELTA || 
			ds[1][2] < DELTA && ds[2][3] < DELTA) {
			bezierPoints = [
				bezierPoints_[0],
				Vector.interpolate(bezierPoints_[0], bezierPoints_[3], 1/3),
				Vector.interpolate(bezierPoints_[0], bezierPoints_[3], 2/3),
				bezierPoints_[3]
			];
		}
		
		// Check if first 2 points are coincident
		if (ds[0][1] < DELTA) {
			bezierPoints[1] = Vector.interpolate(
					bezierPoints_[0], bezierPoints_[2], SHIFT
			); 	
		}
		
		// Check if last 2 points are coincident
		if (ds[2][3] < DELTA) {
			bezierPoints[2] = Vector.interpolate(
					bezierPoints_[1], bezierPoints_[3], 1-SHIFT 
			); 	
		}
		
		// Check if middle 2 points are coincident
		if (ds[1][2] < DELTA) {
			bezierPoints[1] = Vector.interpolate(
					bezierPoints_[0], bezierPoints_[1], 1-SHIFT 
			); 	
			bezierPoints[2] = Vector.interpolate(
					bezierPoints_[2], bezierPoints_[3], SHIFT 
			);
		}
		
		
		arr.push(new Bezier(bezierPoints, j));
	}
	
	
	const MUST_START_WITH_M = 
		'Invalid SVG - every new path must start with an M or m.';
	const INVALID_COMMAND = 
		'Invalid SVG - command not recognized.'
	
	svgGetAndSetPathDataPolyFill(); // Ensure polyfill is applied.

	var paths = elem.getPathData();  
	
	//console.log(paths);
	
	if (paths.length < 2) {
		// A shape is not described   
		return []; 
	}
	

	let pathStarted = false;

	// Used in conjunction with "S" and "s"
	let prev2ndCubicControlPoint = undefined;
	let prev2ndQuadraticControlPoint = undefined;
	
	let bezierArrays = [];
	let bezierArray = [];
	//let j = 0;
	let j;
	let type = undefined;
	let initialPoint = undefined;
	let x0 = undefined;
	let y0 = undefined;
	for (var i=0; i<paths.length; i++) {
		let path = paths[i];
		let vals = path.values;
		

		let addX = 0;
		let addY = 0;
		if (path.type == path.type.toLowerCase()) {
			addX = x0;
			addY = y0;
		}
		let prevType = type;
		type = path.type.toUpperCase();
		
		let bezierPoints;
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
				
				if (pathStarted) {
					// This is a subpath, close as if a Z or z was the
					// previous command.
					if (prevType !== 'Z') {
						let xInterval = (vals[0] + addX - x0)/3;
						let yInterval = (vals[1] + addY - y0)/3;
						bezierPoints = [
							[x0, y0],
							[x0 + xInterval*1, y0 + yInterval*1],
							[x0 + xInterval*2, y0 + yInterval*2],
							[x0 + xInterval*3, y0 + yInterval*3]
						];
						prev2ndCubicControlPoint = undefined;
						prev2ndQuadraticControlPoint = undefined;
						
						if ( !isCloseToOrigin([xInterval, yInterval]) ) {
							//bezierArray.push( new Bezier(bezierPoints, j++) );
							pushBezier(bezierArray, bezierPoints, j++);
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
			
				bezierPoints = [
					[x0, y0],
					[addX + vals[0], addY + vals[1]],
					[addX + vals[2], addY + vals[3]],
					[addX + vals[4], addY + vals[5]]
				];
				prev2ndCubicControlPoint = bezierPoints[2];
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
			
				let x1;
				let y1;
				if (prev2ndCubicControlPoint) {
					x1 = (x0 - prev2ndCubicControlPoint[0]) + x0; 
					y1 = (y0 - prev2ndCubicControlPoint[1]) + y0;
				} else {
					x1 = x0;
					y1 = y0;
				}
				bezierPoints = [
					[x0, y0],
					[x1, y1],
					[addX + vals[0], addY + vals[1]],
					[addX + vals[2], addY + vals[3]]
				];
				prev2ndCubicControlPoint = bezierPoints[2];
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
			
				let xInterval = (vals[0] + addX - x0)/3;
				let yInterval = (vals[1] + addY - y0)/3;
				bezierPoints = [
					[x0, y0],
					[x0 + xInterval*1, y0 + yInterval*1],
					[x0 + xInterval*2, y0 + yInterval*2],
					[x0 + xInterval*3, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isCloseToOrigin([xInterval, yInterval]) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
			
				let xInterval = (vals[0] + addX - x0)/3;
				bezierPoints = [
					[x0, y0],
					[x0 + xInterval*1, y0],
					[x0 + xInterval*2, y0],
					[x0 + xInterval*3, y0]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if (Math.abs(xInterval) > DELTA) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
			
				let yInterval = (vals[1] + addY - y0)/3;
				bezierPoints = [
					[x0, y0],
					[x0, y0 + yInterval*1],
					[x0, y0 + yInterval*2],
					[x0, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if (Math.abs(yInterval) > DELTA) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
				
				bezierPoints = [CP0, CP1, CP2, CP3];
				
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = QP1;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
				
				bezierPoints = [CP0, CP1, CP2, CP3];
				
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = QP1;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
				//x0 = ? bezierPoints[3][0]; 
				//y0 = ? bezierPoints[3][1];
				
				//bezierArray.push( new Bezier(bezierPoints, j++) );
				pushBezier(bezierArray, bezierPoints, j++);
				
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
				
				bezierPoints = [
					[x0, y0],
					[x0 + xInterval*1, y0 + yInterval*1],
					[x0 + xInterval*2, y0 + yInterval*2],
					[x0 + xInterval*3, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];

				
				if ( !isCloseToOrigin([xInterval, yInterval]) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
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
 * Check if distance between consecutive points are somewhere not 
 * relatively 'very small'.
 * @param points
 * @returns
 */
function isAlmostZeroLength(ps) {
	return false;
	
	for (let i=1; i<ps.length; i++) {
		let p1 = ps[i-1];
		let p2 = ps[i];
		
		if (Vector.manhattanDistanceBetween(p1, p2) > DELTA) {
			return false; 
		}
	}
	
	return true;
}


/**
 * @param point
 * @returns
 */
// TODO - we can use Manhattan distance in many places instead of 
// Euclidian distance (much faster and simpler to calculate)
function isCloseToOrigin(p) {
	return Vector.manhattanLength(p) < DELTA;
}


/**
 * Takes the given beziers and creates a path string which will consist
 * only out of 'C' elements. 
 */
Svg.getPathStrFromBezierLoop = function(bezierLoop) {
	const DEC = 10;
	
	let node = bezierLoop.head;
	let isFirst = true;
	let prevPoint = undefined;
	let str = ''; 
	do {
		let points = node.item.bezierPoints;
		
		if (isFirst) {
			isFirst = false;
			str = 'M ' + 
				points[0][0].toFixed(DEC) + ' ' + 
				points[0][1].toFixed(DEC) + '\n';
			prevPoint = points[0];
		}
		
		str += 'C ' + 
			points[1][0].toFixed(DEC) + ' ' + 
			points[1][1].toFixed(DEC) + ' ' +
			points[2][0].toFixed(DEC) + ' ' + 
			points[2][1].toFixed(DEC) + ' ' +
			points[3][0].toFixed(DEC) + ' ' + 
			points[3][1].toFixed(DEC) + ' ' + '\n';
		
		node = node.next;
	} while (node !== bezierLoop.head);
	
	return str;
}


module.exports = Svg;

















