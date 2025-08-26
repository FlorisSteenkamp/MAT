/** @internal */
declare const _debug_: Debug; 

import { Debug } from '../debug/debug.js';
import { CpNode } from '../cp-node/cp-node.js';
import { traverseCp } from '../cp-node/fs/traverse-cp.js';
import { MatMeta } from '../mat/mat-meta.js';
import { isPosSharpCorner } from '../point-on-shape/is-pos-sharp-corner.js';
import { findAndAdd3Prong } from './find-and-add-3-prong.js';


let ii = 0;
/**
  * Starting from some `CpNode`, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively 
 * adds 3-prongs until only one or two Vertices have been visited. 
 * 
 * This process further subdivides the shape.
 * 
 * @param cpTrees
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * 
 * @internal
 */
function findAndAdd3Prongs(
		meta: MatMeta,
		cpStart: CpNode) {

	if (isPosSharpCorner(cpStart.cp.pointOnShape)) {
		return { closeBysFor3Prong: undefined, addedCpNodes: [] };
	}

	const addedCpNodes: CpNode[][] = [];
	let closeBysFor3Prong: CpNode[] | undefined = undefined;
	do {
		if (cpStart === undefined) { continue; }
		const visitedCps = traverseCp(cpStart);
	
		if (visitedCps.length <= 2) { break; }

		const { closeBysFor3Prong, cpNodes } = findAndAdd3Prong(meta, visitedCps);

		addedCpNodes.push(cpNodes);
		if (closeBysFor3Prong.length > 0) {
			return { closeBysFor3Prong, addedCpNodes };
		}

		if (typeof _debug_ !== 'undefined') {
			if (++ii === _debug_.directives.stopAfterThreeProngsNum) {
				return undefined!;
			}
		}
	} while (true);

	return { closeBysFor3Prong, addedCpNodes };
}


export { findAndAdd3Prongs }
