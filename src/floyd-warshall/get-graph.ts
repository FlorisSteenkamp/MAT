import { CpNode } from "../cp-node/cp-node.js";
import { getAllOnCircle } from "../cp-node/fs/get-all-on-circle.js";
import { getMatDistanceToNext$ } from "../cp-node/fs/get-distance-to-next.js";
import { isOnSameCircle } from "../cp-node/fs/is-on-same-circle.js";
import { isVertexSpecial } from "../cp-node/fs/is-vertex-special.js";
import { getHoleCloserPairs } from "./get-hole-closer-pairs.js";


function getGraph(
        specialVertices: CpNode[],
        holeClosers: CpNode[]) {

    const pairs = getHoleCloserPairs(holeClosers);

    const V = specialVertices.length;

    const graph: number[][] = [];
    for (let i=0; i<V; i++) {
        const cpNodeA = specialVertices[i];

        const row: number[] = [];
        for (let j=0; j<V; j++) {
            const cpNodeB = specialVertices[j];
            if (i === j) {
                row.push(0);
                continue;
            }

            let minD = Number.POSITIVE_INFINITY;
            for (const toChild of getAllOnCircle(cpNodeA)) {
                let d = getMatDistanceToNext$(toChild);
                let child = toChild.next;
                while (true) {
                    if (isOnSameCircle(child, cpNodeB)) {
                        break;  // Found path from A to B
                    }
                    if (child.isHoleClosing) {
                        // Hole closer found - don't go around loop 
                        child = holeCloserNext(pairs, child);
                        continue;
                    }
                    if (isVertexSpecial(child)) {
                        // we only find the immediate next special ones
                        d = Number.POSITIVE_INFINITY;
                        break;  // Next special vertex found but it's not B
                    }

                    d += getMatDistanceToNext$(child);
                    child = child.next;
                }

                if (d < minD) { minD = d; }
            }

            row.push(minD);
        }

        graph.push(row);
    }

    return graph;
}


function holeCloserNext(
        pairs: Map<CpNode,CpNode>,
        holeCloser: CpNode) {

    return pairs.get(holeCloser)!.next;
}


export { getGraph }
