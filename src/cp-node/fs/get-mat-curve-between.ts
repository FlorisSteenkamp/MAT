import type { CpNode } from '../cp-node.js';
import { getEdgeDirection } from './get-edge-direction.js';
import { getBeziersFromTangents } from '../../utils/get-beziers-from-tangents.js';


/**
 * Returns the bezier curves (an array of 1 or 2 lines or quadratics joined
 * smoothly) from the maximal disk of one `CpNode` to another `CpNode`'s 
 * maximal disk.
 * 
 * @param cpNodeFrom 
 * @param cpNodeTo 
 */
function getMatCurveBetween(
        cpNodeFrom: CpNode, 
        cpNodeTo: CpNode): number[][][] {

    return getBeziersFromTangents(
        getEdgeDirection(cpNodeFrom),
        getEdgeDirection(cpNodeTo.prevOnCircle)
    );
}


export { getMatCurveBetween }
