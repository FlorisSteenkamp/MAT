import { distanceBetween } from 'flo-vector2d';
import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { isOneProng } from '../cp-node/fs/is-one-prong.js';
const { abs } = Math;
/**
 * @internal
 * Returns `true` if the vertex of the given `CpNode` has the given maximal
 * disk (up to the accuracy of the 3-prong search) and can have contact points
 * added to it, i.e. it is not a hole-closer, sharp corner or 1-prong.
 *
 * @param meta
 * @param cpNode
 * @param circle
 */
function isVertexOnDisk(meta, cpNode, circle) {
    // (the 3-prong search converges to about this accuracy)
    const tol = 2 ** (meta.maxCoordPowerOf2 - 32);
    const { center, radius } = cpNode.pointOnShape.circle;
    return (radius !== 0 &&
        !cpNode.isHoleClosing &&
        !isOneProng(cpNode) &&
        distanceBetween(center, circle.center) <= tol &&
        abs(radius - circle.radius) <= tol);
}
/**
 * @internal
 * Given the `CpNode`s (if any) lying close by each contact point of a new
 * maximal disk (see `getCloseByCpIfExist`), returns a `CpNode` of an existing
 * vertex with the same maximal disk (see `isVertexOnDisk`), or `undefined` if
 * there is none.
 *
 * The new disk's contact points should then be added to that vertex (making it
 * an n-prong) instead of adding another vertex on top of it.
 *
 * Also returns `undefined` if a close by `CpNode` belongs to some *other*
 * vertex.
 *
 * @param meta
 * @param circle the new maximal disk
 * @param closeBys the close by `CpNode` (if any) of each new contact point
 */
function getVertexOnSameDisk(meta, circle, closeBys) {
    const vertex = closeBys.find(cpNode => cpNode !== undefined && isVertexOnDisk(meta, cpNode, circle));
    if (vertex === undefined) {
        return undefined;
    }
    const ring = getAllOnCircle(vertex);
    if (closeBys.some(cpNode => cpNode !== undefined && !ring.includes(cpNode))) {
        return undefined;
    }
    return vertex;
}
export { getVertexOnSameDisk, isVertexOnDisk };
//# sourceMappingURL=get-vertex-on-same-disk.js.map