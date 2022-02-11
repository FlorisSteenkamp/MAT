import { Curve, getCornerAtEnd } from '../curve.js';
import { PointOnShape } from '../point-on-shape.js';
import { IPointOnShape } from '../point-on-shape.js';


/**
 * @hidden
 * @param curve 
 */
function getContactCirclesAtInterface(curve: Curve): IPointOnShape[] {
	let { isQuiteSharp, isQuiteDull } = getCornerAtEnd(curve);

	if (isQuiteSharp) {  
		return [new PointOnShape(curve, 1)]; 
	} else if (isQuiteDull) {
		return [
			new PointOnShape(curve, 1),
			new PointOnShape(curve.next, 0)
		];
	}

	return [];
}


export { getContactCirclesAtInterface }
