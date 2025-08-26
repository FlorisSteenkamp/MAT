import { CpNode } from "../cp-node/cp-node.js";
import { clone } from "../cp-node/fs/clone.js";
import { getAllOnCircle } from "../cp-node/fs/get-all-on-circle.js";
import { getAllOnLoop } from "../cp-node/fs/get-all-on-loop.js";
import { getNonTerminatingOnCircle } from "../cp-node/fs/get-non-terminating-on-circle.js";
import { getProngCount } from "../cp-node/fs/get-prong-count.js";
import { getSalience } from "../cp-node/fs/get-salience.js";
import { traverseAllForward } from "../cp-node/fs/traverse-all-forward.js";
import { createNewCpTree } from "../mat/create-new-cp-tree.js";
import { getLargest3Prong } from "../mat/get-largest-3-prong.js";
import { Mat } from "../mat/mat.js";


function cullBySalience(
        minSalience: number,
        mat: Mat) {

    // get largest 3-prong
    const cpNode = getLargest3Prong(clone(mat.cpNode));
    if (cpNode === undefined) {
        return mat;
    }

    // get all 3-prongs (even if having terminal prongs)
    const cpNodesOnThreeProngs = new Set(
        getAllOnLoop(cpNode)
        .filter(cpNode => getProngCount(cpNode) > 2)
    );


    // add culls according to salience
    const culls: Set<CpNode> = new Set();
    for (const cpNode of cpNodesOnThreeProngs) {
        const cpNodesOC = getNonTerminatingOnCircle(cpNode);
        for (const cpNodeOC of cpNodesOC) {
            const salience = getSalience(cpNodeOC)
            if (salience < minSalience) {
                culls.add(cpNodeOC);
            }
        }
    }


    // Get all 3-prongs that have been culled, including those on culled
    // branches.
    const culled3ProngCpNodes: Set<CpNode> = new Set();
    for (const cull of culls) {
        // cull branch and return all 3-prong cp-nodes on the culled branch
        const culled3ProngsToAdd = cullBranch(cull);
        for (const cpNode of culled3ProngsToAdd) {
            culled3ProngCpNodes.add(cpNode);
        }
    }

    // Find 3-prong not culled and assign to `cpNodeT`
    let cpNodeT: CpNode | undefined = undefined;
    for (const cpNode of cpNodesOnThreeProngs) {
        if (!culled3ProngCpNodes.has(cpNode)) {
            cpNodeT = cpNode;
            break;
        }
    }

    // Special case: only one completely terminating 3-prong survives
    if (cpNodeT === undefined) {
        // Return the largest 3-prong with all branches snipped
        cpNodeT = cpNode;
        for (const b of getAllOnCircle(cpNode)) {
            b.next = b.nextOnCircle;
            b.prev = b.prevOnCircle;
        }
    }

    const sat: Mat = {
        cpNode: cpNodeT,
        meta: {
            ...mat.meta,
			cpTrees: createNewCpTree(cpNodeT)
        }
    };

    return sat;
}


/**
 * Cull branch and return all 3-prong cp-nodes on the culled branch
 */ 
function cullBranch(
        cpNode: CpNode): Set<CpNode> {

    const cull = cpNode;
    const culledCpNodes = new Set<CpNode>();

    culledCpNodes.add(cull);
    traverseAllForward(cull, cpNode_ => {
        if (getProngCount(cpNode_) >= 3 &&
            cpNode_ !== cull) {

            for (const cpN of getAllOnCircle(cpNode_)) {
                culledCpNodes.add(cpN);
            }
        }
    });

    const cpNodeNOC = cull.nextOnCircle;

    cull.next = cpNodeNOC;
    cpNodeNOC.prev = cull;

    return culledCpNodes;
}


export { cullBySalience }
