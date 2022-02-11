import { CpNode } from '../cp-node.js';


/** @hidden */
function getLeaves(cpNode: CpNode) {
    let leaves: CpNode[] = [];

    let cps = cpNode.getAllOnLoop();
    cps.forEach(function(cp) {
        if (cp.isTerminating()) { 
            leaves.push(cp);
        }
    });

    return leaves;
}


export { getLeaves }
