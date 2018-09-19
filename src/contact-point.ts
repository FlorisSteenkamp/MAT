
import { PointOnShape } from './point-on-shape';
import { Circle       } from './circle';


class ContactPoint {

	/**
	 * Representation of a point on a loop (or shape). 
	 * @param pointOnShape 
	 * @param vertex 
	 */
	constructor(
			readonly pointOnShape: PointOnShape, 
			readonly circle: Circle,
			readonly order: number,
			readonly order2: number) {
	}


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
