import type { BezierPiece } from 'flo-bezier3';
import type { CpNode } from '../cp-node.js';
/**
 * Returns the boundary beziers pieces between this `CpNode` and the next
 * one.
 *
 * * returns `undefined` if the next `CpNode` is on a different loop,
 * as this is a hole-closer and there are no boundary beziers between them.
 *
 * @param cpNode
 */
declare function getBoundaryBezierPartsToNext(cpNode: CpNode): BezierPiece[];
export { getBoundaryBezierPartsToNext };
