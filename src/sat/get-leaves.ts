import { CpNode, getAllOnLoop, isTerminating } from '../cp-node/cp-node.js';


/** @internal */
function getLeaves(cpNode: CpNode) {
    const leaves: CpNode[] = [];

    const cps = getAllOnLoop(cpNode);
    for (const cp of cps) {
        if (isTerminating(cp)) { 
            leaves.push(cp);
        }
    }

    return leaves;
}


export { getLeaves }
