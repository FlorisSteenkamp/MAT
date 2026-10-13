import type { CpNode } from "../cp-node/cp-node.js";
import type { Circle } from "../geometry/circle.js";
/**
 * Returns the set of MAT vertices (identified by their `Circle` - all `CpNode`s
 * on a vertex share the same `Circle` object) that are to be culled by the
 * Scale Axis Transform with the given scale factor.
 *
 * @param cpNode the `CpNode` representing the maximal vertex
 * @param s the scale factor
 *
 * @internal
 */
declare function getSatCulls(cpNode: CpNode, s: number): Set<Circle>;
export { getSatCulls };
