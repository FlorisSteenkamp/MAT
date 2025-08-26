import { CpNode } from "../cp-node.js";
import { isTerminating } from "./is-terminating.js";


function getNonTerminatingOnCircle(
        cpNode: CpNode,
        exclThis = false) {

    const startCpNode = cpNode;
    let cpNode_ = startCpNode;

    const cpNodes: CpNode[] = [];
    do {
        if (!(exclThis && cpNode_ === startCpNode) && !isTerminating(cpNode_)) {
            cpNodes.push(cpNode_);
        }
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode)

    return cpNodes;
}


export { getNonTerminatingOnCircle }
