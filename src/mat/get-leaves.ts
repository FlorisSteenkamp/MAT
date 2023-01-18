import { CpNode } from '../cp-node.js';


/** @hidden */
function getLeaves(cpNode: CpNode) {
    const leaves: CpNode[] = [];

    const cps = cpNode.getAllOnLoop();
    cps.forEach(function(cp) {
        if (cp.isTerminating()) { 
            leaves.push(cp);
        }
    });

    return leaves;
}


export { getLeaves }
