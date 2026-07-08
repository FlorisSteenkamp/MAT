import type { CpNode } from "../cp-node.js";


/**
 * Finds the first `CpNode` in the same MAT tree for which `f` returns a
 * truthy value. Returns `undefined` if no such `CpNode` exists.
 * 
 * @param f a function that takes a `CpNode` and returns a `CpNode` or `undefined`
 * @param cpNode a `CpNode` on the MAT tree to search from
 */
function findFirst(
        f: (cpNode: CpNode) => boolean,
        cpNode: CpNode): CpNode | undefined { 

    const cpStart = cpNode;

    do {
        if (f(cpNode)) {
            return cpNode;
        }
        cpNode = cpNode.next;
    } while (cpNode !== cpStart);

    return undefined;
}


export { findFirst }
