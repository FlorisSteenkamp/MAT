
import { CpNode } from '../cp-node';

import { traverseEdges } from "./traverse-edges";


function getLeaves(cpNode: CpNode) {
    let leaves: CpNode[] = [];

    traverseEdges(cpNode, f, true);

    function f(cp: CpNode, isLeaf: boolean) {
        if (isLeaf) { 
            leaves.push(cp);
        }
    }

    return leaves;
}


export { getLeaves }
