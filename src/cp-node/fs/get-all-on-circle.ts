import { CpNode } from "../cp-node.js";


function getAllOnCircle(
        cpNode: CpNode,
        exclThis = false) {

    const startCpNode = cpNode;
    let cpNode_ = startCpNode;

    const cpNodes: CpNode[] = [];
    do {
        if (!(exclThis && cpNode_ === startCpNode)) {
            cpNodes.push(cpNode_);
        }
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode)

    return cpNodes;
}


export { getAllOnCircle }
