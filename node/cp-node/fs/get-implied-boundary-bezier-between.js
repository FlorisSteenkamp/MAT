import { getBoundaryTangentLine } from '../../point-on-shape/get-boundary-tangent-line.js';
import { getBeziersFromTangents } from '../../utils/get-beziers-from-tangents.js';
/**
 * Returns the bezier curves (an array of 1 or 2 lines or quadratics joined
 * smoothly) approximating the shape boundary between the contact points of
 * two `CpNode`s.
 *
 * @param cpNodeA
 * @param cpNodeB
 */
function getImpliedBoundaryBezierBetween(cpNodeA, cpNodeB) {
    return getBeziersFromTangents(getBoundaryTangentLine(cpNodeA.pointOnShape, true), getBoundaryTangentLine(cpNodeB.pointOnShape, false));
}
export { getImpliedBoundaryBezierBetween };
//# sourceMappingURL=get-implied-boundary-bezier-between.js.map