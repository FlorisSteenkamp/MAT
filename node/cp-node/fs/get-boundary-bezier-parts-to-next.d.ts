import type { BezierPiece } from 'flo-bezier3';
import type { CpNode } from '../cp-node.js';
/**
 * Returns the ordered `BezierPiece`s from this `CpNode` to the next `CpNode`
 * on the boundary.
 *
 * * returns `[]` if (and only if) the next `CpNode` is on a different loop;
 * this differs from "returns `[]` if (and only if) the next `CpNode` is a
 * hole-closer" as half of hole-closers are on the same loop.
 *
 * @param cpNode
 */
declare function getBoundaryBezierPartsToNext(cpNode: CpNode): BezierPiece[];
export { getBoundaryBezierPartsToNext };
