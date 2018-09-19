
import LlRbTree from "flo-ll-rb-tree";

import { CpNode } from "./cp-node";;
import { Loop   } from './loop';


/**
 * Represents a complete Medial Axis Transform (MAT).
 */
class Mat {
    /**
     * @param cpNode 
     * @param cpTrees 
     */
    constructor(
            public cpNode: CpNode, 
            public cpTrees: Map<Loop, LlRbTree<CpNode>>) {
    }
}


export { Mat }
