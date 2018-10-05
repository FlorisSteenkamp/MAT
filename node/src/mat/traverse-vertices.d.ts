import { CpNode } from '../cp-node';
/**
 * Traverses the MAT tree and finds and returns the first CpNode (representing
 * a vertex) as an array with one element (or all) with a specified property
 * defined by the given predicate function. Returns [] if no CpNode with the
 * specified property has been found.
 * @param cpNode any CpNode of the MAT tree
 * @param f A function that should return true if the CpNode passes the criteria
 * necessary to be returned or falsy otherwise.
 * @param returnFirst If true, returns as soon as the first CpNode passing
 * f(cpNode) was found as [CpNode]. False by default.
 */
declare function traverseVertices(cpNode: CpNode, f?: (cpNode: CpNode) => boolean, returnFirst?: boolean): CpNode[];
export { traverseVertices };
