import type { CpNode } from '../cp-node.js';
/**
 * Returns the bezier curves (an array of 1 or 2 lines or quadratics joined
 * smoothly) approximating the shape boundary between the contact points of
 * two `CpNode`s.
 *
 * @param cpNodeA
 * @param cpNodeB
 */
declare function getImpliedBoundaryBezierBetween(cpNodeA: CpNode, cpNodeB: CpNode): number[][][];
export { getImpliedBoundaryBezierBetween };
