
import { manhattanLength } from 'flo-vector2d';


const DELTA = 1e-6; 


/**
 * Returns true if the given point is close to the origin (by Manhattan 
 * distance), fale otherwise.
 * @hidden
 * @param p - a point
 * @param delta - a tolerance - defaults to 1e-6;
 */
function isCloseToOrigin(p: number[], delta: number = DELTA) {
	return manhattanLength(p) < delta;
}


export { isCloseToOrigin }