import { CpNode } from './cp-node/cp-node';
/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given
 * vertex (represented by a [[CpNode]]). Returns the result as an array of
 * smooth branches, where smoothness is total or within a given tolerance.
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param tolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required.
 */
declare function getBranches(cpNode: CpNode, tolerance?: number): CpNode[][];
export { getBranches };
