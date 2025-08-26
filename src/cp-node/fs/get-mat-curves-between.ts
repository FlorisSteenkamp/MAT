import { CpNode } from '../cp-node.js';
import { getMatCurveBetween } from './get-mat-curve-between.js';


function getMatCurvesBetween(
        cpNodeS: CpNode,
        cpNodeE: CpNode) {

    let cpNode = cpNodeS;
    const pss: number[][][] = [];
    while (cpNode !== cpNodeE) {
	    const ps = getMatCurveBetween(cpNode, cpNode.next);
        pss.push(ps);

        cpNode = cpNode.next;
    }

    return pss;
}


export { getMatCurvesBetween }
