
import { Curve } from '../../curve';
import { Loop } from '../../loop/loop';


/**
 * Helper function.
 * @hidden
 * @param f
 */
function getTotalBy(f: (curve: Curve) => number) {
	
	return function(loop: Loop) {
		let node = loop.head;
		let total = 0;
		do {
			total += f(node);
			
			node = node.next;
		} while (node !== loop.head);
		
		return total;		
	}
}


export { getTotalBy }
