
import { Circle } from '../../circle';
import { getLeaves } from '../get-leaves';
import { CpNode } from '../../cp-node/cp-node';


/**
 * @hidden
 * Returns the set of Vertices passing the following test: walk the MAT tree and 
 * keep all Vertices not in the current cull set and any Vertices that have a 
 * non-culled node further down the line toward the tree leaves.
 * @param culls The CpNodes (referred to by circles) that should be culled.
 * @param maxCpNode The start CpNode which must reprsesent the maximal vertex.
 */
function cull(
        culls: Set<Circle>, 
        maxCpNode: CpNode) {

    let leaves = getLeaves(maxCpNode);

    function getNonTrivialEdges(cpStart: CpNode) {
		let cp = cpStart;
		
        let cps: CpNode[] = [];
		do {
            if (cp.next !== cp.nextOnCircle) {
                cps.push(cp);
            }
			cp = cp.nextOnCircle;
		} while (cp !== cpStart.prevOnCircle)

		return cps;
    }

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
                // Cut off the edge once a non-cull has been reached.
                cut = true;
            } else if (CpNode.isOnSameCircle(cpNode, maxCpNode)) {
                cut = true; // We are at the max disk - cut whole edge
            } else {
                let cps = getNonTrivialEdges(cpNode);

                if (cps.length === 1) { 
                    cpNode = cps[0];
                } else {
                    cut = true;
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

/*
function cull(
    culls: Set<Circle>, 
    maxCpNode: CpNode) {

let leaves = getLeaves(maxCpNode);

function getNonTrivialBranches(cpStart: CpNode) {
    let cp = cpStart.next;
    
    let cps: CpNode[] = [];
    do {
        if (cp.next !== cp.nextOnCircle) {
            cps.push(cp);
        }
        cp = cp.nextOnCircle;
    } while (cp !== cpStart)

    return cps;
}

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
            // Cut the branch once a non-cull has been reached.
            cut = true;
        } else {
            //let cp2 = cp1.prevOnCircle;
            let cp2 = cpNode.nextOnCircle;

            //if (maxCpNode === cpNode || maxCpNode === cp1 || maxCpNode === cp2) {
            if (CpNode.isOnSameCircle(cpNode, maxCpNode)) {
                cut = true; // We are at the max disk - cut whole edge
            } else if (cpNode.next === cp2) {
                // Continue but starting from cp2
                cpNode = cp2;
            } else if (cp2.next === cp1) {
                // Do nothing - ignore the branch starting from cp2 since it
                // is terminating.
            } else if (cp2.next !== cp1) {
                // At this stage (cpNode.next !== cp2 && cp2.next !== cp1) 
                // so it is a bifurcation point - cut the edge.
                cut = true; 
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
*/


export { cull }
