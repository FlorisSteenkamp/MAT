import { expect, test } from '@jest/globals';
import { findMats } from '../../src/find-mat/find-mats.js';
import { getAllOnCircle } from '../../src/cp-node/fs/get-all-on-circle.js';
import { loadSvgs } from './load-svg/load-svg.js';
import { getPathsFromStr } from 'flo-boolean';
import { getGraphCounts } from '../helpers/get-graph-counts.js';
import type { Mat } from '../../src/mat/mat.js';
import type { CpNode } from '../../src/cp-node/cp-node.js';


/** Returns a `CpNode` of each vertex (maximal disk) of the given MAT */
function getVertices(mat: Mat) {
    const { cpNodes } = getGraphCounts(mat);
    const done = new Set<CpNode>();
    const vertices: CpNode[] = [];
    for (const cpNode of cpNodes) {
        if (done.has(cpNode)) { continue; }
        getAllOnCircle(cpNode).forEach(cp => done.add(cp));
        vertices.push(cpNode);
    }

    return vertices;
}


/**
 * The inscribed circle of a regular polygon touches every edge, i.e. the MAT
 * has a single n-prong at the center. Its contact points are found (with
 * floating point error) from different source points and by the 3-prong
 * search but must end up on a single vertex.
 *
 * With edges shorter than `maxLength` the only source points are the edge
 * midpoints, i.e. the contact points of the n-prong itself; this once left
 * the MAT as just the (unconnected) corners.
 */
test('regular polygons: MAT has a single central n-prong', async function() {
    const svgs = await loadSvgs(`./test-svgs/achispado.svg`);

    const cases = [
        { name: 'poly-11', n: 11, center: [50,50], radius: 45*Math.cos(Math.PI/11) },
        { name: 'poly-12', n: 12, center: [50,50], radius: 45*Math.cos(Math.PI/12) }
    ];

    for (const { name, n, center, radius } of cases) {
        const d = svgs.find(glyph => glyph.name === name)!.d;

        for (const maxLength of [40, 140]) {
            const mats = findMats(getPathsFromStr(d), {
                applySat: false,
                simplify: false,
                maxCurviness: 0.25,
                maxLength,
                angleIncrement: 15
            });

            expect(mats.length).toEqual(1);
            const { vertexCount, edgeCount } = getGraphCounts(mats[0]);
            expect(vertexCount).toEqual(edgeCount + 1);

            const nProngs = getVertices(mats[0])
                .filter(cpNode => getAllOnCircle(cpNode).length > 2);

            expect(nProngs.length).toEqual(1);
            expect(getAllOnCircle(nProngs[0]).length).toEqual(n);

            const circle = nProngs[0].pointOnShape.circle;
            expect(circle.center[0]).toBeCloseTo(center[0], 10);
            expect(circle.center[1]).toBeCloseTo(center[1], 10);
            expect(circle.radius).toBeCloseTo(radius, 10);
        }
    }
});


/**
 * The contact points of an n-prong found as several vertices (e.g. 3-prongs)
 * with the same maximal disk (up to floating point error) must be merged into
 * a single vertex. `poly-121` once had 10 such vertices at the center of its
 * inner 21-gon.
 */
test('no two n-prongs (n > 2) have the same maximal disk', async function() {
    const svgs = await loadSvgs(`./test-svgs/achispado.svg`);

    for (const name of ['poly-121', 'bracketleft', 'A', 'H', 'three', 'plus']) {
        const d = svgs.find(glyph => glyph.name === name)!.d;

        const mats = findMats(getPathsFromStr(d), {
            applySat: false,
            simplify: false,
            maxCurviness: 0.25,
            maxLength: 40,
            angleIncrement: 15
        });

        for (const mat of mats) {
            const { vertexCount, edgeCount } = getGraphCounts(mat);
            expect(vertexCount).toEqual(edgeCount + 1);

            const tol = 2**(mat.meta.maxCoordPowerOf2 - 32);
            const centers = getVertices(mat)
                .filter(cpNode => getAllOnCircle(cpNode).length > 2)
                .map(cpNode => cpNode.pointOnShape.circle.center);

            for (let i=0; i<centers.length; i++) {
                for (let j=i+1; j<centers.length; j++) {
                    const [[x1,y1],[x2,y2]] = [centers[i], centers[j]];
                    expect(Math.hypot(x1 - x2, y1 - y2)).toBeGreaterThan(tol);
                }
            }
        }
    }
});
