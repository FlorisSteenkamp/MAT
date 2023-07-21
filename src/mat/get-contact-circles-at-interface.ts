import { Curve, getCornerAtEnd } from '../curve.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';


/**
 * @internal
 * @param curve 
 */
function getContactCirclesAtInterface(curve: Curve): PointOnShape[] {
	const { isQuiteSharp, isQuiteDull } = getCornerAtEnd(curve);

	return isQuiteSharp
		? [createPos(curve, 1)]
		: isQuiteDull
		? [createPos(curve, 1),
		   createPos(curve.next, 0)]
		: [];
}


export { getContactCirclesAtInterface }
