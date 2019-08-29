
import { CpNode } from "./cp-node";
import { getCurveBetween } from "./get-curve/get-curve-between";


/**
 * 
 * @param cpNode 
 */
function getCurveToNext(cpNode: CpNode) {
	return getCurveBetween(cpNode, cpNode.next);
}


export { getCurveToNext }
