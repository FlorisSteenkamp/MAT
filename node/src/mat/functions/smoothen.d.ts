import { Vertex } from '../classes/vertex';
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
declare function smoothen(mat: Vertex): {
    lines: number[][][];
    quads: number[][][];
    cubes: number[][][];
};
export { smoothen };
