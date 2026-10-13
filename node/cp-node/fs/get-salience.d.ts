import type { CpNode } from "../cp-node.js";
/**
 * Returns the salience of the given `CpNode`: the ratio of the boundary length
 * from its contact point forward to the next contact point on its circle to
 * the straight distance between those two points.
 *
 * * `Infinity` if that stretch of boundary passes a hole closer
 * * `0` if the two contact points coincide with no boundary in between (the
 *   terminating `CpNode` of a 1-prong) - the other `CpNode` of a 1-prong,
 *   whose stretch is the entire boundary, gives `Infinity`
 *
 * See https://research.gold.ac.uk/id/eprint/31944/
 *
 * @param cpNode
 */
declare function getSalience(cpNode: CpNode): number;
export { getSalience };
