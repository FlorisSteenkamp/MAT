
import { Curve        } from '../curve';
import { PointOnShape } from '../point-on-shape';


/**
 * @hidden
 * @param curve 
 */
function getContactCirclesAtInterface(curve: Curve) {
	let { isQuiteSharp, isQuiteDull } = Curve.getCornerAtEnd(curve);

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
