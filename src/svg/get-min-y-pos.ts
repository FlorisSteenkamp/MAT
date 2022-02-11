/** @hidden */
import { Loop } from '../loop.js';
import { getLoopBounds } from './get-loop-bounds.js';


/**
 * @hidden
 * Get topmost PointOnShape of the given loop.
 */
function getMinYPos(loop: Loop) {
	return getLoopBounds(loop).minY;
}


export { getMinYPos }
