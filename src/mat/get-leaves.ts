
import { CpNode } from '../cp-node/cp-node';

import { traverseEdges } from "../traverse-edges";


function getLeaves(cpNode: CpNode) {
    let leaves: CpNode[] = [];

    let cps = cpNode.getAllOnLoop();
    cps.forEach(function(cp) {
        if (cp.isTerminating()) { 
            leaves.push(cp);
        }
    });

    /*
    traverseEdges(cpNode, f, true);

    function f(cp: CpNode, isLeaf: boolean) {
        if (isLeaf) { 
            leaves.push(cp);
        }
    }
    */

    return leaves;
}


export { getLeaves }
