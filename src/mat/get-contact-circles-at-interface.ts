
import { Curve        } from '../curve';
import { PointOnShape } from '../point-on-shape';


function getContactCirclesAtInterface(curve: Curve) {

	let { isQuiteSharp, isQuiteDull } = Curve.getCornerAtEnd(curve);
	//return [];

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


export { getContactCirclesAtInterface };
