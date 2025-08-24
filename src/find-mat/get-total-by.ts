import { Curve } from '../curve/curve.js';
import { Loop } from 'flo-boolean';


/**
 * @internal
 * Helper function.
 * @internal
 * @param totalByF
 */
function getTotalBy(totalByF: (curve: Curve) => number) {
	
	return function(loop: Loop) {
		let node = loop.curves[0];
		let total = 0;
		do {
			total += totalByF(node);
			
			node = node.next;
		} while (node !== loop.curves[0]);
		
		return total;		
	}
}


export { getTotalBy }
