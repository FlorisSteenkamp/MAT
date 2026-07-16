import type { CpNode } from "../cp-node.js";
import type { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { LlRbTree } from "flo-ll-rb-tree";
declare function insertCpNode(insertIfOrderWrong: boolean, isHoleClosing: boolean, isIntersection: boolean, cpTree: LlRbTree<CpNode>, pos: PointOnShape, _prev: CpNode | undefined, lastInsertId: {
    id: number;
}): CpNode | undefined;
export { insertCpNode };
