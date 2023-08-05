import { Curve } from '../curve/curve.js';
import { Loop } from 'flo-boolean';


/**
 * @internal
 * Helper function.
 * @internal
 * @param f
 */
function getTotalBy(f: (curve: Curve) => number) {
	
	return function(loop: Loop) {
		let node = loop.curves[0];
		let total = 0;
		do {
			total += f(node);
			
			node = node.next;
		} while (node !== loop.curves[0]);
		
		return total;		
	}
}


export { getTotalBy }
