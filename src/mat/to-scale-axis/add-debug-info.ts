
declare var _debug_: MatDebug; 

import { MatDebug } from '../../debug/debug';

import { CpNode } from '../../cp-node/cp-node';
import { Mat    } from '../../mat';


function addDebugInfo(sat: Mat) {
	if (typeof _debug_ === 'undefined') { return; }

	let generated = _debug_.generated;
	generated.elems.sat.push(sat);

	let timing = generated.timing;
	timing.sats[1] += performance.now() - timing.sats[0];   
}


export { addDebugInfo }
