
import { manhattanDistanceBetween } from 'flo-vector2d';


const DELTA = 1e-6; 


/**
 * Returns true if distance between consecutive points are all less than 
 * some delta, false otherwise.
 * @hidden
 * @param ps - an array of points
 * @param delta - a tolerance - defaults to 1e-6;
 */
function isAlmostZeroLength(ps: number[][], delta: number = DELTA) {
		
	for (let i=1; i<ps.length; i++) {
		let p1 = ps[i-1];
		let p2 = ps[i];
		
		if (manhattanDistanceBetween(p1, p2) > delta) {
			return false; 
		}
	}
	
	return true;
}


export { isAlmostZeroLength }
