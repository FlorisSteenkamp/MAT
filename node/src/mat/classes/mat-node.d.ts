import { Edge } from '../classes/edge';
import { MatCircle } from '../classes/mat-circle';
/**
 * Representation of a node in the MAT structure.
 * @param matCircle
 * @param branches
 */
declare class MatNode {
    matCircle: MatCircle;
    branches: Edge[];
    deleted: boolean;
    constructor(matCircle: MatCircle, branches: Edge[]);
    static copy(node: MatNode): MatNode;
}
export { MatNode };
