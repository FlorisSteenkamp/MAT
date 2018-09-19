import { MatNode } from '../classes/mat-node';
import { traverseNodes } from '../functions/traverse-nodes';
import { traverseBranches } from '../functions/traverse-branches';
import { getMatNodesAsArray } from '../functions/get-mat-nodes-as-array';
import { MatCircle } from './mat-circle';
/**
 * The Medial Axis Transform. It is defined recursively as a rooted tree with
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * @param node - A handle on the MAT tree structure.
 */
declare class MatTree {
    readonly startNode: MatNode;
    readonly startCircle: MatCircle;
    constructor(startNode: MatNode, startCircle: MatCircle);
    static readonly traverseNodes: typeof traverseNodes;
    static readonly traverseBranches: typeof traverseBranches;
    static readonly getMatNodesAsArray: typeof getMatNodesAsArray;
}
export { MatTree };
