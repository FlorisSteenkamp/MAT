// Modified by Floris
/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/

// import { Heap } from "../heap/heap";
/**
 * see [Wikipedia](https://en.wikipedia.org/wiki/Heap_(data_structure))
 * 
 * @internal
 */
class Heap<T> {
    public heap: T[] = [];

    constructor(private compare: (a: T, b: T) => number) {}

    public isEmpty() {
        return this.heap.length === 0;
    }

    public insert(t: T): void {
        const heap = this.heap;

        heap.push(t);

        // Swim up
        let i = heap.length-1;
        while (true) {
            const parentIdx = (i - 1 - (i+1)%2)/2;
            if (parentIdx === -1) { return; }

            const parent = heap[parentIdx];
            if (this.compare(t, parent) < 0) { 
                break;
            }
            
            // Swap and update indexes and variables
            heap[parentIdx] = t;
            heap[i] = parent;
            i = parentIdx;
        }
    }


    public popMax(): T {
        const heap = this.heap;
        const maxT = heap[0];
        heap[0] = heap[heap.length - 1];
        heap.length--;
        this.swimDown();

        return maxT;
    }


    private swimDown() {
        const heap = this.heap;

        const len = heap.length;
    
        let i = 0;
        // Swim down
        while (true) {
            const leftIdx = 2*i + 1;
            if (leftIdx >= len) { 
                break;  // there's no left or right child
            }
            const rightIdx = 2*i + 2;

            const swapIdx = (rightIdx >= len) || (this.compare(heap[leftIdx], heap[rightIdx]) > 0)
                ? leftIdx
                : rightIdx;

            const swapChild = heap[swapIdx];

            const parent = heap[i];    
            if (this.compare(parent, swapChild) > 0) { 
                break;
            }

            // Swap and update indexes
            heap[swapIdx] = parent;
            heap[i] = swapChild;
            i = swapIdx;
        }
    }


    public swapMinOrMax(t: T): void {
        this.heap[0] = t;
        this.swimDown();
    }

    /* ignore coverage */
    public static getParentIdx(i: number) { return (i - 1 - (i+1)%2)/2; }
    public static getLeftChild(i: number) { return 2*i + 1; }
    public static getRightChild(i: number) { return 2*i + 2; }
}


interface NodeWithWeight<T> {
    v: T;
    w: number;
}


function compareNodeWithWeight<T>(
        a: NodeWithWeight<T>,
        b: NodeWithWeight<T>) {

    return a.w - b.w;
}


type OGraph = { [index:string]: { [index:string]: number } };


// function getOChildren(
//         graph: OGraph) {

//     return (

//     )
// }


function singleSourceShortestPaths(
        graph: OGraph,
        s: string,
        d?: string) {

    // Predecessor map for each node that has been encountered.
    // node ID => predecessor node ID
    const predecessors: { [index:string]: string } = {};

    // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost
    const costs: { [index:string]: number } = {};
    costs[s] = 0;

    // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?
    const open = new Heap<NodeWithWeight<string>>(compareNodeWithWeight);
    open.insert({ v: s, w: 0 });


    while (!open.isEmpty()) {
        // In the nodes remaining in graph that have a known cost from s,
        // find the node, u, that currently has the shortest path from s.
        const closest = open.popMax();
        const u = closest.v;
        const costOf_s_to_u = closest.w;

        // Get nodes adjacent to u...
        const adjacentNodes = graph[u] || {};

        // ...and explore the edges that connect u to those nodes, updating
        // the cost of the shortest paths to any or all of those nodes as
        // necessary. v is the node across the current edge from u.
        for (const v in adjacentNodes) {
            if (adjacentNodes.hasOwnProperty(v)) {
                // Get the cost of the edge running from u to v.
                const costOf_e = adjacentNodes[v];

                // Cost of s to u plus the cost of u to v across e--this is *a*
                // cost from s to v that may or may not be less than the current
                // known cost to v.
                const costOf_s_to_u_PLUS_costOf_e = costOf_s_to_u + costOf_e;

                // If we haven't visited v yet OR if the current known cost from s to
                // v is greater than the new cost we just found (cost of s to u plus
                // cost of u to v across e), update v's cost in the cost list and
                // update v's predecessor in the predecessor list (it's now u).
                const costOf_s_to_v = costs[v];
                const firstVisit = (costs[v] === undefined);
                if (firstVisit || costOf_s_to_v > costOf_s_to_u_PLUS_costOf_e) {
                    costs[v] = costOf_s_to_u_PLUS_costOf_e;
                    open.insert({ v, w: costOf_s_to_u_PLUS_costOf_e });
                    predecessors[v] = u;
                }
            }
        }
    }

    if (d !== undefined && costs[d] === undefined) {
        const msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
        throw new Error(msg);
    }

    return predecessors;
}


function extractShortestPathFromPredecessorList(
        predecessors: { [index:string]: string },
        d: string) {

    const nodes = [];
    let u = d;
    while (u) {
        nodes.push(u);
        u = predecessors[u];
    }
    nodes.reverse();//?

    return nodes;
}


/**
 * Finds any shortest path.
 * 
 * @param graph 
 * @param s 
 * @param d 
 */
function findShortestPath(
        graph: { [index:string]: { [index:string]: number } },
        s: string,
        d: string) {

    const predecessors = singleSourceShortestPaths(graph, s, d);//?

    return extractShortestPathFromPredecessorList(
        predecessors, d
    );
}


function findPathLength<T>(
        graph: { [index:string]: { [index:string]: number } },
        path: string[]) {

    if (path.length === 0) { return 0; }

    let d = 0;
    let prevNode = path[0];
    for (let i=1; i<path.length; i++) {
        const S = prevNode;
        const E = path[i];

        d += S === E ? 0 : graph[S][E];

        prevNode = E;
    }

    return d;
}


///////////////////////////
// TESTING
///////////////////////////

function areStrArrsEql(
        a: string[],
        b: string[]) {

    if (a.length !== b.length) { return false; }

    for (let i=0; i<a.length; i++) {
        if (a[i] !== b[i]) { return false; }
    }

    return true;
}


function areStrObjsEql(
        a: { [index:string]: string },
        b: { [index:string]: string }) {

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (!areStrArrsEql(aKeys, bKeys)) { return false; }

    for (let i=0; i<aKeys.length; i++) {
        const key = aKeys[i];
        if (a[key] !== b[key]) { return false; }
    }

    return true;
}


{
    // should find the path between two points, all edges have weight 1
    const graph = {
        a: {b: 10, d: 1},
        b: {a: 1, c: 1, e: 1},
        c: {b: 1, f: 1},
        d: {a: 1, e: 1, g: 1},
        e: {b: 1, d: 1, f: 1, h: 1},
        f: {c: 1, e: 1, i: 1},
        g: {d: 1, h: 1},
        h: {e: 1, g: 1, i: 1},
        i: {f: 1, h: 1}
    };

    findPathLength(graph, ['a', 'b', 'a', 'd', 'e', 'e', 'f', 'i']);//?
    findPathLength(graph, ['a', 'd', 'e', 'f', 'i']);//?
    findPathLength(graph, ['a', 'd', 'g', 'h', 'i']);//?
    const path = findShortestPath(graph, 'a', 'i');//?
    if (!(
        areStrArrsEql(path, ['a', 'd', 'e', 'f', 'i']) ||
        areStrArrsEql(path, ['a', 'd', 'g', 'h', 'i']))) {

        throw new Error('Error')
    }
}

/*
{
    // should find the path between two points, weighted edges
    const graph = {
        a: {b: 10, c: 100, d: 1},
        b: {c: 10},
        d: {b: 1, e: 1},
        e: {f: 1},
        f: {c: 1},
        g: {b: 1}
    };

    let path = findShortestPath(graph, 'a', 'c');
    if (!areStrArrsEql(path, ['a', 'd', 'e', 'f', 'c'])) {
        throw new Error('Error')
    }
    path = findShortestPath(graph, 'd', 'b');
    if (!areStrArrsEql(path, ['d', 'b'])) {
        throw new Error('Error')
    }
}


{
    // should throw on unreachable destination
    const graph = {
        a: {b: 10, c: 100, d: 1},
        b: {c: 10},
        d: {b: 1, e: 1},
        e: {f: 1},
        f: {c: 1},
        g: {b: 1}
    };

    // Exception 
    let errored = false;
    try { findShortestPath(graph, 'c', 'a'); } catch (e) { errored = true; }
    if (!errored) {
        throw new Error('Error');
    }
    // Exception 
    errored = false;
    try { findShortestPath(graph, 'a', 'g'); } catch (e) { errored = true; }
    if (!errored) {
        throw new Error('Error');
    }
}


{
    // should throw on non-existent destination
    const graph = {
        a: {b: 10, c: 100, d: 1},
        b: {c: 10},
        d: {b: 1, e: 1},
        e: {f: 1},
        f: {c: 1},
        g: {b: 1}
    };

    // Exception 
    let errored = false;
    try { findShortestPath(graph, 'a', 'z'); } catch (e) { errored = true; }
    if (!errored) {
        throw new Error('Error');
    }
}


{
    // should find all paths from a node
    const graph = {
        a: {b: 10, c: 100, d: 1},
        b: {c: 10},
        d: {b: 1, e: 1},
        e: {f: 1},
        f: {c: 1},
        g: {b: 1}
    };

    // All paths from 'a'
    const paths = singleSourceShortestPaths(graph, 'a');//?
    if (!areStrObjsEql(paths, ({ b: 'd', c: 'f', d: 'a', e: 'd', f: 'e' }))) {
        throw new Error('Error')
    }
}
*/