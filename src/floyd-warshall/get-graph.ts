import type { CpNode } from "../cp-node/cp-node.js";
import type { Circle } from "../geometry/circle.js";
import { getMatDistanceToNext$ } from "../cp-node/fs/get-distance-to-next.js";
import { isVertexSpecial } from "../cp-node/fs/is-vertex-special.js";


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
function getGraph(
        specialVertices: CpNode[]) {

    const V = specialVertices.length;

    // the column of each given vertex, identified by its circle (all `CpNode`s
    // on a vertex share the same `Circle` object)
    const columnOf = new Map<Circle, number>(
        specialVertices.map((cpNode, j) => [cpNode.pointOnShape.circle, j])
    );

    const graph: number[][] = [];
    for (let i=0; i<V; i++) {
        const cpNodeA = specialVertices[i];

        const row: number[] = new Array(V).fill(Infinity);
        row[i] = 0;

        // walk each edge leaving the vertex up to the next special vertex
        let toChild = cpNodeA;
        do {
            let d = getMatDistanceToNext$(toChild);
            let child = toChild.next;
            while (true) {
                const j = columnOf.get(child.pointOnShape.circle);
                if (j !== undefined) {
                    // Found a path from A to one of the given vertices
                    if (j !== i && d < row[j]) { row[j] = d; }
                    break;
                }
                if (child.isHoleClosing) {
                    // Hole closer found - skip it (don't go around loop)
                    child = child.holeCloserTwin!.next;
                    continue;
                }
                if (isVertexSpecial(child)) {
                    // we only find the immediate next special ones
                    break;  // Next special vertex found but it's not a given one
                }

                d += getMatDistanceToNext$(child);
                child = child.next;
            }

            toChild = toChild.nextOnCircle;
        } while (toChild !== cpNodeA);

        graph.push(row);
    }

    return graph;
}


export { getGraph }
