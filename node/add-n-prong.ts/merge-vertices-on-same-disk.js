import { distanceBetween } from 'flo-vector2d';
import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';
import { isVertexOnDisk } from './get-vertex-on-same-disk.js';
import { joinSpokes } from './join-spokes.js';
/**
 * @internal
 * Merges adjacent MAT vertices that have the same maximal disk (see
 * `isVertexOnDisk`) into a single n-prong, i.e. contracts the (numerically)
 * zero length MAT edges between them; returns a `CpNode` of the MAT.
 *
 * Such vertices are found when the contact points of an n-prong (n > 3) are
 * found separately, e.g. as two 3-prongs, each with its own floating point
 * error.
 *
 * Contracting an edge keeps the MAT a tree. Where the two vertices touch the
 * boundary at the same point (the edge's boundary piece on that side has zero
 * length) only one `CpNode` is kept.
 *
 * @param meta
 * @param cpStart
 */
function mergeVerticesOnSameDisk(meta, cpStart) {
    const removed = new Set();
    let anyMerged = true;
    while (anyMerged) {
        anyMerged = false;
        for (const cpNode of getAllOnLoop(cpStart)) {
            if (removed.has(cpNode) || isTerminating(cpNode)) {
                continue;
            }
            const next = cpNode.next;
            const circle = cpNode.pointOnShape.circle;
            if (next.pointOnShape.circle === circle) {
                continue;
            }
            if (!isVertexOnDisk(meta, cpNode, circle) ||
                !isVertexOnDisk(meta, next, circle)) {
                continue;
            }
            if (merge(meta, cpNode, next, removed)) {
                anyMerged = true;
                if (removed.has(cpStart)) {
                    cpStart = cpNode;
                }
            }
        }
    }
    return cpStart;
}
/**
 * @internal
 * Merges the vertex of `cpNodeB` into that of `cpNodeA`; returns `false` (and
 * changes nothing) if the merged contact points cannot be ordered.
 */
function merge(meta, cpNodeA, cpNodeB, removed) {
    // (contact points of the 2 vertices are found with errors similar to
    // those of their maximal disks - see `isVertexOnDisk`)
    const tol = 2 ** (meta.maxCoordPowerOf2 - 32);
    const isSamePoint = (a, b) => distanceBetween(a.pointOnShape.p, b.pointOnShape.p) <= tol;
    const ringA = getAllOnCircle(cpNodeA);
    const ringB = getAllOnCircle(cpNodeB);
    // Of each pair of `CpNode`s (one of each vertex) adjacent on the boundary
    // at the same point keep only the one of vertex A
    const toRemove = new Set();
    for (const cpNode of ringA) {
        if (ringB.includes(cpNode.next) && isSamePoint(cpNode, cpNode.next)) {
            toRemove.add(cpNode.next);
        }
        if (ringB.includes(cpNode.prev) && isSamePoint(cpNode, cpNode.prev)) {
            toRemove.add(cpNode.prev);
        }
    }
    const ring = [...ringA, ...ringB.filter(cpNode => !toRemove.has(cpNode))];
    // The contact points must be distinct to be ordered around the circle
    for (let i = 0; i < ring.length; i++) {
        for (let j = i + 1; j < ring.length; j++) {
            if (isSamePoint(ring[i], ring[j])) {
                return false;
            }
        }
    }
    const { circle } = cpNodeA.pointOnShape;
    for (const cpNode of toRemove) {
        removeCpNode(cpNode, meta);
        removed.add(cpNode);
    }
    for (const cpNode of ringB) {
        if (toRemove.has(cpNode)) {
            continue;
        }
        // (`CpNode`s on the same ring share the same `Circle` object)
        cpNode.pointOnShape = { ...cpNode.pointOnShape, circle };
    }
    joinSpokes(circle, ring);
    return true;
}
export { mergeVerticesOnSameDisk };
//# sourceMappingURL=merge-vertices-on-same-disk.js.map