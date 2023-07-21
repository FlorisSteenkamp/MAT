/** @internal */
import { Loop } from 'flo-boolean';
import { getLoopBounds } from './get-loop-bounds.js';


/**
 * @internal
 * Get topmost PointOnShape of the given loop.
 */
function getMinYPos(loop: Loop) {
	return getLoopBounds(loop).minY;
}


export { getMinYPos }
