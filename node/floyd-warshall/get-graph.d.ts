import type { CpNode } from "../cp-node/cp-node.js";
/**
 * Returns the adjacency matrix (MAT edge lengths, `Infinity` if not adjacent)
 * of the given special vertices (leaves, 3-prongs, ...) seen as the vertices of
 * a graph with the MAT branches between them as edges.
 *
 * * for each vertex every MAT edge leaving it is walked once, up to the next
 *   special vertex; if that vertex is one of the given ones the walked length
 *   is its distance (the minimum over all such walks if there are several)
 *
 * @param specialVertices the special `CpNode`s (one per vertex)
 */
declare function getGraph(specialVertices: CpNode[]): number[][];
export { getGraph };
