import type { Loop } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { LlRbTree } from 'flo-ll-rb-tree';
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 *
 * * ❗Modifies❗`cpTrees` and `lastInsertId`
 *
 * @param loops
 * @param cpTrees
 * @param sharpCornerss
 * @param lastInsertId
 *
 * @internal
 */
declare function createInitialCpTree(loops: Loop[], sharpCornerss: PrePointOnShape[][], lastInsertId: {
    id: number;
}): Map<Loop, LlRbTree<CpNode>>;
export { createInitialCpTree };
