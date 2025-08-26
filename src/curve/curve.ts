import { Loop } from 'flo-boolean';


/**
 * Represents a bezier curve on the shape boundary / loop.
 */
interface Curve {

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
	loop : Loop;
	ps   : number[][];
	prev : Curve; 
	next : Curve;
	idx  : number;
}


export { Curve }
