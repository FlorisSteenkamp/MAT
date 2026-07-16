declare const _debug_: Debug; 
import type { Debug } from '../debug/debug.js';


/**
 * @param sat 
 * 
 * @internal
 */
function addDebugInfo(
        timingStart: number) {

    if (typeof _debug_ === 'undefined') { return; }

    const timing = _debug_.generated.timing;
    timing.sats = performance.now() - timingStart;
}


export { addDebugInfo }
