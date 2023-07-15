import { Curve, getCornerAtEnd } from '../curve.js';
import { createPos, PointOnShape } from '../point-on-shape.js';


/**
 * @hidden
 * @param curve 
 */
function getContactCirclesAtInterface(curve: Curve): PointOnShape[] {
	const { isQuiteSharp, isQuiteDull } = getCornerAtEnd(curve);

	if (isQuiteSharp) {  
		return [
			// new PointOnShape(curve, 1)
			createPos(curve, 1)
		]; 
	} else if (isQuiteDull) {
		return [
			// new PointOnShape(curve, 1),
			// new PointOnShape(curve.next, 0)
			createPos(curve, 1),
			createPos(curve.next, 0)
		];
	}

	return [];
}


export { getContactCirclesAtInterface }
