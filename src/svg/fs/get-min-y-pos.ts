
declare var _debug_: MatDebug; 

import { MatDebug }   from '../../debug/debug';

import { Loop } from '../../loop/loop';

import { getLoopBounds } from './get-loop-bounds';


/**
 * Get topmost PointOnShape the given loop.
 */
function getMinYPos(loop: Loop) {
	let pos = getLoopBounds(loop).minY;

	if (typeof _debug_ !== 'undefined') { 
		_debug_.generated.elems.minY.push(pos);
	}

	return pos;
}


export { getMinYPos }
