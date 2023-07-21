import { BezierPiece } from 'flo-bezier3';
import { CpNode } from './cp-node/cp-node.js';
/**
 * Returns the ordered bezier curves from this CpNode to the next CpNode
 * on the boundary.
 * @param cpNode
 */
declare function getBoundaryBezierPartsToNext(cpNode: CpNode): BezierPiece[];
export { getBoundaryBezierPartsToNext };
