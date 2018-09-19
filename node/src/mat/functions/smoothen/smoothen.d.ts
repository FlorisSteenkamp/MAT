import { CpNode } from '../../../linked-list/cp-node';
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
declare function smoothen(cpNode: CpNode): {
    lines: number[][][];
    quads: number[][][];
    cubes: number[][][];
};
export { smoothen };
