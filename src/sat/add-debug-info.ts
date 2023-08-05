declare const _debug_: Debug; 

import { Debug } from '../debug/debug.js';
import { Mat } from '../mat/mat.js';


/**
 * @internal
 * @param sat 
 */
function addDebugInfo(
		sat: Mat,
		timingStart: number) {

	if (typeof _debug_ === 'undefined') { return; }

	_debug_.generated.elems.sat.push(sat);

	const timing = _debug_.generated.timing;
	timing.sats = performance.now() - timingStart;
}


export { addDebugInfo }
