import type { CpNode } from '../cp-node/cp-node.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';


/**
 * Returns the `CpNode` (of the given ones) with the largest maximal disk
 * radius (the first one in case of a tie).
 *
 * @param cpNodes a non-empty array of `CpNode`s
 *
 * @internal
 */
function getLargestOf(cpNodes: CpNode[]): CpNode {
    return cpNodes.reduce((maxCpNode, cpNode) =>
        maxCpNode.pointOnShape.circle.radius >= cpNode.pointOnShape.circle.radius
            ? maxCpNode
            : cpNode
    );
}


/**
 * Returns the `CpNode` on the MAT with the largest maximal disk radius.
 *
 * @param cpNode any `CpNode` on the MAT
 */
function getLargestVertex(
        cpNode: CpNode): CpNode {

    return getLargestOf(getAllOnLoop(cpNode));
}


export { getLargestVertex, getLargestOf }
