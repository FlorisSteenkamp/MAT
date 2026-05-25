import { memoize } from 'flo-memoize';
import { CpNode } from '../cp-node.js';
import { getMatCurveBetween } from './get-mat-curve-between.js';


/**
 * Returns the bezier curve from the maximal disk of the given `CpNode` to the 
 * next `CpNode`'s maximal disk and thus directly represents a piece of the 
 * medial axis.
 * @param cpNode 
 */
function getMatCurveToNext(cpNode: CpNode) {
    return getMatCurveBetween(cpNode, cpNode.next);
}


const getMatCurveToNext$ = memoize(getMatCurveToNext);

export { getMatCurveToNext, getMatCurveToNext$ }
