import MatCircle from './mat-circle';
/**
 * Representation of a node in the MAT structure.
 * @param matCircle
 * @param branches
 */
declare class MatNode {
    matCircle: MatCircle;
    branches: MatNode[];
    constructor(matCircle: MatCircle, branches: MatNode[]);
    static copy(node: MatNode): MatNode;
}
export default MatNode;
