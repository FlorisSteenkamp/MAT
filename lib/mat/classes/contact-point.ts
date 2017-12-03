
import Vector from 'flo-vector2d';

import PointOnShape from '../../geometry/classes/point-on-shape';
import MatCircle    from './mat-circle';


/** 
 * Class representing a single contact point of a MatCircle. 
 *
 * @param pointOnShape
 * @param {MatCircle} matCircle 
 */
class ContactPoint {
	pointOnShape: PointOnShape;
	matCircle: MatCircle;
	key: string; 
	0: number;
	1: number;

	constructor(pointOnShape: PointOnShape, matCircle: MatCircle) {
		this.pointOnShape = pointOnShape;
		this.matCircle    = matCircle;
		this.key = PointOnShape.toHumanString(pointOnShape); // TODO - remove
	
		// TODO - remove from cache?
		this[0] = pointOnShape[0]; // Shortcut
		this[1] = pointOnShape[1]; // ...
	}


	static compare(a: ContactPoint, b: ContactPoint): number {
		return PointOnShape.compare(a.pointOnShape, b.pointOnShape); 
	} 
	
	
	static equal(a: ContactPoint, b: ContactPoint): boolean {
		return Vector.equal(a.pointOnShape.p, b.pointOnShape.p);
	}
}


export default ContactPoint;
