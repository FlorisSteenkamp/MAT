
import { Circle } from '../../circle';
import { getLeaves } from '../get-leaves';
import { CpNode } from '../../cp-node';


/**
 * Returns the set of Vertices passing the following test: walk the MAT tree and 
 * keep all Vertices not in the current cull set and any Vertices that have a 
 * non-culled node further down the line toward the tree leaves.
 * @param culls The CpNodes (referred to by circles) that should be culled.
 * @param cpStart The start CpNode which must reprsesent the maximal vertex.
 */
function cull(
        culls: Set<Circle>, 
        cpStart: CpNode) {

    let leaves = getLeaves(cpStart);
    

    while (leaves.length) {
        let leaf = leaves.pop();

        // Preserve topology.
        if (leaf.isHoleClosing || leaf.isIntersection) { continue; }

        if (!culls.has(leaf.cp.circle)) {
            continue;
        }

        let cpNode = leaf.next; // Turn around

        while (true) {
            cpNode = cpNode.next;
            let cut = false;
            let cp1 = cpNode.prevOnCircle;

            if (!culls.has(cpNode.cp.circle)) {
                cut = true;
            } else if (cpNode.isThreeProng()) {
                let cp2 = cp1.prevOnCircle;

                if (cpStart === cpNode || cpStart === cp1 || cpStart === cp2) {
                    cut = true; // We are at the max disk - cut whole edge
                } else if (cpNode.next === cp2) {
                    cpNode = cp2;
                } else if (cp2.next !== cp1) {
                    cut = true; // Cut whole edge
                }
            } 

            if (cut) {
                cp1.next = cpNode;
                cpNode.prev = cp1;
                break;
            }
        }
    }
}


export { cull }
