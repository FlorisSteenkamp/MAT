
declare var _debug_: MatDebug; 

import { MatDebug } from '../../debug/debug';

import { CpNode } from '../../cp-node';


function addDebugInfo(cpNode: CpNode) {
	if (typeof _debug_ === 'undefined') { return; }

	let generated = _debug_.generated;
	generated.elems.sat.push(cpNode);

	let timing = generated.timing;
	timing.sats[1] += performance.now() - timing.sats[0];   
}


export { addDebugInfo }
