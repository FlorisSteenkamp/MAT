
import { Curve        } from '../curve';
import { PointOnShape } from '../point-on-shape';


function getContactCirclesAtInterface(curve: Curve) {

	let { isQuiteSharp, isDull, isQuiteDull } = Curve.getCornerAtEnd(curve);

	if (isQuiteSharp) {  
		return [new PointOnShape(curve, 1)]; 
	} else if (isQuiteDull) {
		return [
			new PointOnShape(curve, 1),
			new PointOnShape(curve.next, 0)
		];
	} else if (isDull) {
		
	}

	return [];
}


export { getContactCirclesAtInterface };
