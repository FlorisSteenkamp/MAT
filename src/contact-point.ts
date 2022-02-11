import { comparePoss, IPointOnShape } from './point-on-shape.js';
import { Circle } from './circle.js';


/**
 * Represents a point on the shape boundary for which MAT data has been
 * calculated.  
 */
interface ContactPoint {
	/** Identifies the point on the shape boundary. */
	pointOnShape: IPointOnShape;
	/** The maximal disk circle touching this point. */
	circle: Circle;
	/** Internally used to order two points lying at the same planar point. */
	order: number;
	/** Internally used to order two points lying at the same planar point. */
	order2: number;
}


/**
 * Primarily for internal use.
 * 
 * Compares the two contact points according to their order along the shape
 * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
 * @param a The first contact point.
 * @param b The second contact point.
 */
function compareCps(a: ContactPoint, b: ContactPoint) {
	//let res = PointOnShape.compare(a.pointOnShape, b.pointOnShape);
	let res = comparePoss(a.pointOnShape, b.pointOnShape);

	if (res === undefined) { return undefined; }
	
	if (res !== 0) { return res; }

	res = a.order - b.order;
	if (res !== 0) { return res; }

	return a.order2 - b.order2;
} 


export { ContactPoint, compareCps }
