import type { CpNode } from "../cp-node.js";


/**
 * Returns all the `CpNode`s on the same circle.
 * 
 * @param cpNode 
 * @param exclThis 
 */
function getAllOnCircle(
        cpNode: CpNode,
        exclThis = false) {

    const startCpNode = cpNode;

    const cpNodes: CpNode[] = exclThis ? [] : [cpNode];

    let cpNode_ = cpNode.nextOnCircle;
    while (cpNode_ !== startCpNode) {
        cpNodes.push(cpNode_);
        cpNode_ = cpNode_.nextOnCircle;
    }

    return cpNodes;
}


export { getAllOnCircle }
