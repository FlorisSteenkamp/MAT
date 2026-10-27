import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
import type { MatMeta } from '../mat/mat-meta.js';
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
declare function isVertexOnDisk(meta: MatMeta, cpNode: CpNode, circle: Circle): boolean;
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
declare function getVertexOnSameDisk(meta: MatMeta, circle: Circle, closeBys: (CpNode | undefined)[]): CpNode | undefined;
export { getVertexOnSameDisk, isVertexOnDisk };
