import { CpNode } from "../cp-node/cp-node.js";


function getHoleCloserPairs(
        holeClosers: CpNode[]): Map<CpNode,CpNode> {

    const pairs: Map<CpNode,CpNode> = new Map();
    for (let hcA of holeClosers) {
        for (let hcB of holeClosers) {
            const cA = hcA.cp.circle.center;
            const cB = hcB.cp.circle.center;
            const cpA = hcA.cp.pointOnShape.p;
            const cpB = hcB.cp.pointOnShape.p;
            if (hcB !== hcA &&
                cA[0] === cB[0] && cA[1] === cB[1] &&
                cpA[0] === cpB[0] && cpA[1] === cpB[1]) {

                pairs.set(hcA,hcB);
            }
        }
    }

    return pairs;
}


export { getHoleCloserPairs }
