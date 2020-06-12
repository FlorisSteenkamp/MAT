import { BezierPart } from 'flo-bezier3';
import { CpNode } from './cp-node';
/**
 * Returns the ordered bezier curves from this CpNode to the next CpNode
 * on the boundary.
 * @param cpNode
 */
declare function getBoundaryBezierPartsToNext(cpNode: CpNode): BezierPart[];
export { getBoundaryBezierPartsToNext };
