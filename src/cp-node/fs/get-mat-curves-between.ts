import { CpNode } from '../cp-node.js';
import { getMatCurveBetween } from './get-mat-curve-between.js';


/**
 * Returns the (flattened) array of bezier curves (lines or quadratics) 
 * representing the medial axis from one `CpNode` to another by following
 * `next` repeatedly.
 * 
 * @param cpNodeS 
 * @param cpNodeE 
 */
function getMatCurvesBetween(
        cpNodeS: CpNode,
        cpNodeE: CpNode) {

    let cpNode = cpNodeS;
    const pss: number[][][] = [];
    while (cpNode !== cpNodeE) {
        pss.push(...getMatCurveBetween(cpNode, cpNode.next));

        cpNode = cpNode.next;
    }

    return pss;
}


export { getMatCurvesBetween }
