import { getMatDistanceToNext } from "../cp-node/fs/get-distance-to-next.js";
import { traverseEdges } from "../cp-node/fs/traverse-edges.js";
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
function getSatCulls(cpNode, s) {
    /**
     * All vertices that are set to be culled initially. This may change later
     * in order to preserve topology.
     */
    const culls = new Set();
    /** The osculating radius stored with each vertex. */
    const rMap = new Map();
    traverseEdges(cpNode, function (cpNode) {
        const circle = cpNode.pointOnShape.circle;
        const R = rMap.get(circle) ?? s * circle.radius;
        const cpNode_ = cpNode.next;
        const circle_ = cpNode_.pointOnShape.circle;
        const l = getMatDistanceToNext(cpNode);
        const r_ = s * circle_.radius;
        if (R - l > r_) {
            rMap.set(circle_, R - l); // Update osculating radius
            if (!cpNode_.isHoleClosing) {
                culls.add(circle_);
            }
        }
    });
    return culls;
}
export { getSatCulls };
//# sourceMappingURL=get-sat-culls.js.map