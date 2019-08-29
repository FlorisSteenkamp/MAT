
import LlRbTree from "flo-ll-rb-tree";

import { CpNode } from "./cp-node";
import { Loop   } from './loop';


/**
 * Represents a complete Medial Axis Transform (MAT).
 * 
 * The MAT is fully described through its [[CpNode]] property. The [[cpTrees]]
 * property is only added to facilitate extension of the MAT, e.g. by adding
 * extra maximal disks and is typically not used. See [[CpNode]] for more
 * details.
 */
class Mat {

    /**
     * @param cpNode A complete representation of the MAT. See [[CpNode]].
     * @param cpTrees Primarily for internal use. A tree structure storing the
     * [[CpNode]]s of the MAT by their compare order, i.e. their cyclic order
     * around the shape boundary.
     */
    constructor(
            public cpNode: CpNode, 
            public cpTrees: Map<Loop, LlRbTree<CpNode>>) {
    }
}


export { Mat }
