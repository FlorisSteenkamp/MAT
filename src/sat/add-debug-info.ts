declare const _debug_: Debug; 

import { Debug } from '../debug/debug.js';


/**
 * @internal
 * @param sat 
 */
function addDebugInfo(
		timingStart: number) {

	if (typeof _debug_ === 'undefined') { return; }

	const timing = _debug_.generated.timing;
	timing.sats = performance.now() - timingStart;
}


export { addDebugInfo }
