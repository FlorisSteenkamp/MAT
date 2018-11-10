
import { memoize } from 'flo-memoize';
import { tangent } from 'flo-bezier3';
import { cross } from 'flo-vector2d';

import { Loop } from './loop';
import { Corner } from './corner';


/**
 * Represents a bezier curve on the shape boundary / loop.
 */
class Curve {

	/** 
	 * Primarily for internal use.
	 * @param loop The closed loop of bezier curves representing the shape 
	 * boundary this curve belongs to.
	 * @param ps The bezier control points.
	 * @param prev The previous curve (when going in a negative direction around
	 * the shape boundary, i.e. clockwise for the outer shape and anti-clockwise
	 * for the holes (if any)).
	 * @param next The next curve (when going in a positive direction around
	 * the shape boundary, i.e. anti-clockwise for the outer shape and clockwise
	 * for the holes (if any)).
	 * @param idx The curve's ordered index in the loop. This imposes a cycling
	 * ordering of the curves in the loop.
	 */
    constructor(
			public readonly loop : Loop, 
			public readonly ps   : number[][], 
			public          prev : Curve, 
			public          next : Curve,
			public readonly idx  : number) {
	}
	

	/**
 	 * Returns information about the corner created at the end of this curve 
 	 * (at t === 1) and the start of the next curve (at t === 0).
	 * @param curve The relevant [[Curve]].
	 */
	public static getCornerAtEnd(curve: Curve) {
		return getCornerAtEnd(curve);
	}
}


/** 
 * Angle in degrees to radians.
 * @hidden
 */
const DEGREES = {
	//'0'    : 0.0000,
	0.25 : 0.0050,
	1    : 0.0167,
	4    : 0.0698,
	16   : 0.2756,
};


/** @hidden */
const DEGREE_LIMIT = DEGREES[1]; 


/**
 * Returns information about the corner created at the end of this curve 
 * (at t === 1) and the start of the next curve (at t === 0).
 * @hidden
 */
let getCornerAtEnd = memoize(function(curve: Curve) {

	let tangents = [
		tangent(curve.ps,      1), 
		tangent(curve.next.ps, 0)
	];

	let crossTangents = cross(tangents[0], tangents[1]);

	return new Corner( 
		tangents, 
		crossTangents, 
		crossTangents < 0,
		crossTangents > 0, 
		crossTangents < -DEGREE_LIMIT,
		crossTangents > +DEGREE_LIMIT 
	);
});


export { Curve };
