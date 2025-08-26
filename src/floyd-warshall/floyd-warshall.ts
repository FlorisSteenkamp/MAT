// A JavaScript program for Floyd Warshall All Pairs Shortest Path algorithm.
// From https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/
// This code is contributed by rdtaank.


/**
 * Returns a matrix of all distances between all nodes (O(n**3))
 *
 * @param graph 
 */
function floydWarshall(graph: number[][]) {
    const V = graph.length;
    const dist: number[][] = Array.from(
        Array(V),
        () => new Array(V).fill(0)
    );


    // Initialize the solution matrix same as input graph matrix Or we can
    // say the initial values of shortest distances are based on shortest
    // paths considering no intermediate vertex
    for (let i=0; i<V; i++) {
        for (let j=0; j<V; j++) {
            dist[i][j] = graph[i][j];
        }
    }


    // Add all vertices one by one to the set of intermediate vertices.
    // ---> Before start of a iteration, we have shortest distances
    // between all pairs of vertices such that the shortest distances
    // consider only the vertices in set {0, 1, 2, .. k-1} as
    // intermediate vertices.
    // ---> After the end of a iteration, vertex no. k is added to the set
    // of intermediate vertices and the set becomes {0, 1, 2, .. k}


    for (let k=0; k<V; k++) {
        // Pick all vertices as source one by one
        for (let i=0; i<V; i++) {
            // Pick all vertices as destination for the above picked source
            for (let j=0; j<V; j++) {
                // If vertex k is on the shortest path from i to j, then update
                // the value of dist[i][j]
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    return dist;
}


export { floydWarshall }


// floydWarshall(graph)

// TESTING

// Let us create the following weighted graph
//
//           10
//    (0)--------->(3)
//     |           /|\
//   5 |            |
//     |            | 1
//    \|/           |
//    (1)--------->(2)
//           3


// const INF = Number.POSITIVE_INFINITY;
// const graph = [
//     [0, 5, INF, 10],
//     [INF, 0, 3, INF],
//     [INF, INF, 0, 1],
//     [INF, INF, INF, 0],
// ];

// 0   5   8   9
// INF 0   3   4
// INF INF 0   1
// INF INF INF 0

// floydWarshall(graph);//?

