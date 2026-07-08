import { CpNode } from "../../src/cp-node/cp-node.js";
import { comparePossByValue } from "./compare-poss-by-value.js";
import { randomWalk } from "./random-walk.js";


function compareCpNodesByValue(
        cpNode1: CpNode,
        cpNode2: CpNode): boolean {

    // Perform a random walk on the calculated MAT to ensure it behaves as expected

    const N = 10;
    let reachCpNodes1 = new Set<CpNode>();
    let reachCpNodes2 = new Set<CpNode>();
    for (let i=0; i<N; i++) {
        cpNode1 = randomWalk(cpNode1, i*N, N);
        cpNode2 = randomWalk(cpNode2, i*N, N);

        reachCpNodes1.add(cpNode1);
        reachCpNodes2.add(cpNode2);

        if (!comparePossByValue(cpNode1.cp.pointOnShape, cpNode2.cp.pointOnShape)) {
            return false;
        }
        
        cpNode2.cp.pointOnShape;
    }

    if (reachCpNodes1.size !== reachCpNodes2.size) { return false; }

    return true;
}


export { compareCpNodesByValue }
