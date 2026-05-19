import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Creates the initial ContactPoint loops from the given sharp corners.
 *
 * * modifies `cpTrees` and `lastInsertId` of `meta`
 *
 * @param loops
 * @param cpTrees
 * @param sharpCornerss
 * @param lastInsertId
 */
declare function createInitialCpTree(loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, sharpCornerss: PointOnShape[][], lastInsertId: {
    id: number;
}): CpNode | undefined;
export { createInitialCpTree };
