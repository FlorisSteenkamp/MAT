import type { CpNode } from '../cp-node/cp-node.js';
import type { MatMeta } from '../mat/mat-meta.js';
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
declare function mergeVerticesOnSameDisk(meta: MatMeta, cpStart: CpNode): CpNode;
export { mergeVerticesOnSameDisk };
