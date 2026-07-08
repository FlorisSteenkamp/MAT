import type { CpNode } from "../cp-node.js";


/**
 * Returns all `CpNode`s on the MAT that this `CpNode` is part of 
 * starting from the current one and going anti-clockwise around the shape.
 */
function getAllOnLoop(
        cpNode: CpNode) {

    const cpStart = cpNode;
    const cpNodes: CpNode[] = [];

    do {
        cpNodes.push(cpNode);
        cpNode = cpNode.next;
    } while (cpNode !== cpStart);

    return cpNodes;
}


export { getAllOnLoop }
