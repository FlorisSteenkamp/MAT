
import { squaredDistanceBetween } from 'flo-vector2d';


/**
 *
 */
function getClosestSquareDistanceToRect(box: number[][], p: number[]) {

	let [[x0,y0],[x1,y1]] = box;
	let [xp,yp] = p;
	
	if (xp < x0) {
		if (yp < y0) {
			return squaredDistanceBetween(box[0], p);
		} else if (yp > y1) {
			return squaredDistanceBetween([x0,y1], p);
		} else {
			let d = x0 - xp;
			return d*d;
		}
	} else if (xp > x1) {
		if (yp < y0) {
			return squaredDistanceBetween([x1,y0], p);
		} else if (yp > y1) {
			return squaredDistanceBetween(box[1], p);
		} else {
			let d = xp - x1;
			return d*d;
		}
	} else {
		if (yp < y0) {
			let d = y0 - yp;
			return d*d;
		} else if (yp > y1) {
			let d = yp - y1;
			return d*d;
		} else {
			return 0;
		}
	}
}


export { getClosestSquareDistanceToRect }
