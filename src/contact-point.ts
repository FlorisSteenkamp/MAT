
import { PointOnShape } from './point-on-shape';
import { Circle       } from './circle';

/**
 * Represents a point on the shape boundary for which MAT data has been
 * calculated.  
 */
class ContactPoint {

	/**
	 * @param pointOnShape Identifies the point on the shape boundary.
	 * @param circle The maximal disk circle touching this point.
	 * @param order Internally used to order two points lying at the same planar 
	 * point.
	 * @param order2
	 * Internally used to order two points lying at the same planar 
	 * point.
	 */
	constructor(
			readonly pointOnShape: PointOnShape, 
			readonly circle: Circle,
			readonly order: number,
			readonly order2: number) {
	}


	/**
	 * Primarily for internal use.
	 * 
	 * Compares the two contact points according to their order along the shape
	 * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
	 * @param a The first contact point.
	 * @param b The second contact point.
	 */
	static compare(a: ContactPoint, b: ContactPoint) {
		let res = PointOnShape.compare(a.pointOnShape, b.pointOnShape);

		if (res === undefined) { return undefined; }
		
		if (res !== 0) { return res; }

		res = a.order - b.order;
		if (res !== 0) { return res; }

		return a.order2 - b.order2;
	} 
}


export { ContactPoint };
