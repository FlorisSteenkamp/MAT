import type { CpNode } from "../cp-node.js";
import type { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { RbTree } from "flo-ll-rb-tree";
/**
 *
 * @param insertIfOrderWrong order cannot be checked for hole-closers since they're on different loops
 * @param isHoleClosing
 * @param isIntersection
 * @param cpTree
 * @param pos
 * @param pred predecessor (to `pos`) on sampe loop (found via `cpTree`)
 * @param succ successor (to `pos`) on sampe loop (found via `cpTree`)
 * @param lastInsertId
 */
declare function insertCpNode(insertIfOrderWrong: boolean, isHoleClosing: boolean, isIntersection: boolean, cpTree: RbTree<CpNode>, pos: PointOnShape, pred: CpNode | undefined, succ: CpNode | undefined, lastInsertId: {
    id: number;
}): CpNode | undefined;
export { insertCpNode };
