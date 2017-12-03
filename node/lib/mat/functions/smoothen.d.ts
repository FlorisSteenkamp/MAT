import MatTree from '../classes/mat-tree';
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
declare function smoothen(mat: MatTree): {
    lines: number[][][];
    quads: number[][][];
    cubes: number[][][];
};
export default smoothen;
