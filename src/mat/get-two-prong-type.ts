import { TwoProngForDebugging } from '../debug/two-prong-for-debugging.js';
import { ElemType_TwoProng } from './elem-type-two-prong.js';


/** @hidden */
function getTwoProngType(e: TwoProngForDebugging): ElemType_TwoProng {
	if (e.holeClosing) { return 'twoProng_holeClosing' }
	
	return 'twoProng_regular';
}


export { getTwoProngType }
