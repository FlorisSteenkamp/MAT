import traverse from '../../mat/functions/traverse';
import MatNode from './mat-node';
/**
 * The Medial Axis Transform. It is defined recursively as a rooted tree with
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * @param node - A handle on the MAT tree structure.
 */
declare class MatTree {
    startNode: MatNode;
    constructor(node: MatNode);
    static traverse: typeof traverse;
}
export default MatTree;
