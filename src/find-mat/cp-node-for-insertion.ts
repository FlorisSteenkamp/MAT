import { LlRbTree } from "flo-ll-rb-tree";
import { CpNode } from "../cp-node/cp-node";


interface CpNodeForInsertion {
    cpTree: LlRbTree<CpNode>;
    cpNode: CpNode;
    prev: CpNode;
    next: CpNode;
}


export { CpNodeForInsertion }
