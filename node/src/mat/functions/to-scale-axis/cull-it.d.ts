import { Vertex } from '../../classes/vertex';
/**
 * Returns the set Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 */
declare function cullIt(culls: Set<Vertex>, vertex: Vertex): void;
export { cullIt };
