
import { Circle } from '../../circle';
import { getLeaves } from '../get-leaves';
import { CpNode } from '../../cp-node';


/**
 * Returns the set Vertices passing the following test: walk the MAT tree and 
 * keep all Vertices not in the current cull set and any Vertices that have a 
 * non-culled node further down the line toward the tree leaves.
 * @param cullls
 * @param cpNode
 */
function cull(
        culls: Set<Circle>, 
        cpNode: CpNode) {

    let leaves = getLeaves(cpNode);

    while (leaves.length) {
        let leaf = leaves.pop();

        if (!culls.has(leaf.cp.circle)) {
            continue;
        }

        let cpNode = leaf.next; // Turn around

        let done = false;
        while (!done) {
            cpNode = cpNode.next;

            if (cpNode.isThreeProng()) {
                let cp1 = cpNode.prevOnCircle;

                cp1.next = cpNode;
                cpNode.prev  = cp1;
                
                let cp2 = cp1.prevOnCircle;
                if (cp2.next === cp1) {
                    cp2.next = cpNode;
                    cpNode.prev = cp2;

                    // Change 3-prong into a 2-prong since 1 point is redundant.
                    cp2.nextOnCircle = cpNode;
                    cpNode.prevOnCircle = cp2;

                    leaves.push(cp2);
                } else if (cpNode.next === cp2) {
                    cp1.next = cp2;
                    cp2.prev = cp1;

                    // Change 3-prong into a 2-prong since 1 point is redundant.
                    cp1.nextOnCircle = cp2;
                    cp2.prevOnCircle = cp1;

                    leaves.push(cp1);
                }

                done = true;
            } else if (!culls.has(cpNode.cp.circle)) {
                let cp1 = cpNode.prevOnCircle;

                cp1.next = cpNode;
                cpNode.prev  = cp1;
                
                done = true;
            }
        }
    }
}


export { cull }
