import type { CpNode } from "../cp-node.js";
import { LlRbTree } from "flo-ll-rb-tree";
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
declare function isOrderCorrect(cpTree: LlRbTree<CpNode>, pos: PointOnShape, next: CpNode): boolean;
export { isOrderCorrect };
