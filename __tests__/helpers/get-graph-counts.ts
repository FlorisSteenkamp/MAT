import type { Mat } from '../../src/mat/mat.js';
import type { CpNode } from '../../src/cp-node/cp-node.js';
import { getAllOnLoop } from '../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnCircle } from '../../src/cp-node/fs/get-all-on-circle.js';
import { isTerminating } from '../../src/cp-node/fs/is-terminating.js';


/**
 * Counts maximal disks as vertices and the MAT edges between them as edges
 * (each edge is passed twice going around the boundary).
 *
 * For a valid MAT (a tree) `vertexCount === edgeCount + 1`.
 */
function getGraphCounts(mat: Mat) {
    const cpNodes = getAllOnLoop(mat.cpNode);
    const rings = new Set<CpNode>();
    for (const cpNode of cpNodes) {
        const ring = getAllOnCircle(cpNode);
        if (!ring.some(cp => rings.has(cp))) { rings.add(cpNode); }
    }
    const edgeCount = cpNodes.filter(cp => !isTerminating(cp)).length / 2;

    return { vertexCount: rings.size, edgeCount, cpNodes };
}


export { getGraphCounts }
