import { memoize } from 'flo-memoize';
import { CpNode } from '../cp-node.js';
import { getMatCurveBetween } from './get-mat-curve-between.js';


function getMatCurveToNext(cpNode: CpNode) {
	return getMatCurveBetween(cpNode, cpNode.next);
}


const getMatCurveToNext$ = memoize(getMatCurveToNext);

export { getMatCurveToNext, getMatCurveToNext$ }
