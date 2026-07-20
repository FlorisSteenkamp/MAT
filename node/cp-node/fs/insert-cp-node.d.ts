import type { CpNode } from "../cp-node.js";
import type { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { RbTree } from "flo-ll-rb-tree";
declare function insertCpNode(insertIfOrderWrong: boolean, isHoleClosing: boolean, isIntersection: boolean, cpTree: RbTree<CpNode>, pos: PointOnShape, _prev: CpNode | undefined, lastInsertId: {
    id: number;
}): CpNode | undefined;
export { insertCpNode };
