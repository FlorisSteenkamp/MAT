
import { Loop } from '../../../loop';

import { reverseOrientation } from "../../fs/reverse-orientation";
import { isPathPositivelyOrientated } from '../../fs/is-path-positively-oriented';


/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise) and the rest negatively 
 * oriented.
 */
function orient(loops: Loop[]) {	
	let newLoops = [];

	for (let i=0; i<loops.length; i++) {
		let loop = loops[i];
		newLoops.push(
			orientLoop(loop, i !== 0)
		);
	}

	return newLoops;
}


/**
 * Returns a loop oriented according to the given orientation.
 * @param loop The loop
 * @param positive If true, returns a positively oriented loop, else a negative 
 * one.
 */
function orientLoop(loop: Loop, positive: boolean) {
	console.log('reversing?: ' + (positive !== isPathPositivelyOrientated(loop)));

	return positive === isPathPositivelyOrientated(loop)
		? loop 
		: reverseOrientation(loop);
}


export { orient }
