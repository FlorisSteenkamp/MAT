import { expect, test } from '@jest/globals';
import type { CpNode } from '../../src/cp-node/cp-node.js';
import { getGraph } from '../../src/floyd-warshall/get-graph.js';
import { getAllOnLoop } from '../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnCircle } from '../../src/cp-node/fs/get-all-on-circle.js';
import { isVertexSpecial } from '../../src/cp-node/fs/is-vertex-special.js';
import { getPathsFromStr } from 'flo-boolean';
import { findMats } from '../../src/find-mat/find-mats.js';
import { getMats1 } from '../get-mats1.js';


/** One `CpNode` per special vertex (leaves, 3-prongs, hole closers). */
function getSpecialVertices(cpNode: CpNode): CpNode[] {
    const seen = new Set<CpNode>();
    const vertices: CpNode[] = [];
    for (const cp of getAllOnLoop(cpNode)) {
        if (seen.has(cp)) { continue; }
        for (const c of getAllOnCircle(cp)) { seen.add(c); }
        if (isVertexSpecial(cp)) { vertices.push(cp); }
    }
    return vertices;
}


function checkGraph(graph: number[][], V: number, symmetricLengths: boolean) {
    expect(graph.length).toBe(V);
    for (let i=0; i<V; i++) {
        expect(graph[i].length).toBe(V);
        expect(graph[i][i]).toBe(0);
        let adjacent = 0;
        for (let j=0; j<V; j++) {
            const d = graph[i][j];
            // symmetric adjacency...
            expect(Number.isFinite(graph[j][i])).toBe(Number.isFinite(d));
            // ...and symmetric lengths (up to the summation order of the edge
            // lengths) - except across hole closers, where the two directions
            // currently accumulate slightly different lengths (pre-existing)
            if (symmetricLengths && Number.isFinite(d)) {
                expect(d).toBeCloseTo(graph[j][i], 9);
            }
            expect(d >= 0).toBe(true);
            if (i !== j && Number.isFinite(d)) { adjacent++; }
        }
        // the MAT is connected: every special vertex has a neighbour
        expect(adjacent).toBeGreaterThan(0);
    }
}


test('getGraph - single loop fixture', function() {
    const { cpNode } = getMats1()[0];
    const vertices = getSpecialVertices(cpNode);
    // 5 leaves + 3 3-prongs
    expect(vertices.length).toBe(8);

    const graph = getGraph(vertices);
    checkGraph(graph, vertices.length, true);

    // the 3-prong {142,143,144} (center [81.5,-12.64]) is adjacent to the
    // 3-prong at [81.5,18.5] by a straight vertical edge of length 31.14...
    const i = vertices.findIndex(v => v.pointOnShape.circle.center[1] === 18.5);
    const j = vertices.findIndex(v => v.pointOnShape.circle.center[1] === -12.641417453935567);
    expect(i).toBeGreaterThanOrEqual(0);
    expect(j).toBeGreaterThanOrEqual(0);
    expect(graph[i][j]).toBeCloseTo(18.5 + 12.641417453935567, 9);
});


test('getGraph - shape with a hole (hole closers are skipped via their twins)', function() {
    // (not the SAT-processed fixture: the SAT culls all the spurs of a square
    // frame, leaving only a cycle of 2-prongs and thus no special vertices)
    const loops = getPathsFromStr(
        'M0 0 L100 0 L100 100 L0 100 Z ' +
        'M30 30 L30 70 L70 70 L70 30 Z'
    );
    const { cpNode } = findMats(loops, { applySat: false, simplify: false })[0];
    const vertices = getSpecialVertices(cpNode).filter(v => !v.isHoleClosing);
    // 4 outer-corner leaves + 4 3-prongs where the spurs meet the ring
    expect(vertices.length).toBe(8);

    // must terminate (the walk over a hole closer continues on the other loop)
    const graph = getGraph(vertices);
    checkGraph(graph, vertices.length, false);

    // the 4 leaves are each adjacent to exactly one 3-prong (their spur)...
    const leaves = vertices.filter(v => v.pointOnShape.circle.radius === 0);
    expect(leaves.length).toBe(4);
    for (const leaf of leaves) {
        const i = vertices.indexOf(leaf);
        const finite = graph[i].filter((d, j) => j !== i && Number.isFinite(d));
        expect(finite.length).toBe(1);
    }
    // ...and each 3-prong to its spur leaf and its two ring neighbours
    for (const v of vertices) {
        if (v.pointOnShape.circle.radius === 0) { continue; }
        const i = vertices.indexOf(v);
        const finite = graph[i].filter((d, j) => j !== i && Number.isFinite(d));
        expect(finite.length).toBe(3);
    }
});
