import LlRbTree from "flo-ll-rb-tree";
import { CpNode } from "./cp-node";
import { Loop } from './loop';
/**
 * Represents a complete Medial Axis Transform (MAT).
 */
declare class Mat {
    cpNode: CpNode;
    cpTrees: Map<Loop, LlRbTree<CpNode>>;
    /**
     * @param cpNode
     * @param cpTrees
     */
    constructor(cpNode: CpNode, cpTrees: Map<Loop, LlRbTree<CpNode>>);
}
export { Mat };
