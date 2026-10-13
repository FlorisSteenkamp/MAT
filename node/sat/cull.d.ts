import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
/**
 * Culls (in place) the vertices of the given MAT tree: walking the tree from
 * the maximal vertex, all vertices in the cull set are removed except those
 * that have a non-culled vertex further down the line toward the tree leaves
 * (which are kept to preserve the topology).
 *
 * @param culls the vertices (identified by their `Circle`) that should be culled
 * @param maxCpNode the start `CpNode` which must represent the maximal vertex
 *
 * @internal
 */
declare function cull(culls: Set<Circle>, maxCpNode: CpNode): void;
export { cull };
