import { CpNode } from "./cp-node";
/**
 * @internal
 *
 * Traverses the shape from the given `CpNode` going around the shortest path
 * so that only a piece of the shape is traversed and returns the visited
 * `CpNode`s (starting from the given `CpNode`).
 *
 * @param cpStart The `CpNode` from where to start the traversal.
 */
declare function traverseCp(cpStart: CpNode): CpNode[];
export { traverseCp };
