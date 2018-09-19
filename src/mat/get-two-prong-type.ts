
import { TwoProngForDebugging } from "../debug/two-prong-for-debugging";
import { ElemType_TwoProng } from "./elem-type-two-prong";


function getTwoProngType(e: TwoProngForDebugging): ElemType_TwoProng {
	if (e.failed     ) { return 'twoProng_failed'; }
	if (e.notAdded   ) { return 'twoProng_notAdded'; } 
	if (e.deleted    ) { return 'twoProng_deleted' }         
	if (e.holeClosing) { return 'twoProng_holeClosing' }
	
	return 'twoProng_regular';
}


export { getTwoProngType }