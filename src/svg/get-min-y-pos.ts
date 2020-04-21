
/** @hidden */
declare var _debug_: Debug; 

import { Debug }   from '../debug/debug';
import { Loop } from '../loop';
import { getLoopBounds } from './get-loop-bounds';


/**
 * @hidden
 * Get topmost PointOnShape of the given loop.
 */
function getMinYPos(loop: Loop) {
	return getLoopBounds(loop).minY;
}


export { getMinYPos }
