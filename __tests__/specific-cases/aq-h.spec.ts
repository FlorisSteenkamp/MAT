import { expect, test } from '@jest/globals';
import { findMats } from '../../src/find-mat/find-mats.js';
import { loadSvgs } from './load-svg/load-svg.js';
import { getPathsFromStr } from 'flo-boolean';
import { getAllOnLoop } from '../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnCircle } from '../../src/cp-node/fs/get-all-on-circle.js';
import { isTerminating } from '../../src/cp-node/fs/is-terminating.js';
import type { Mat } from '../../src/mat/mat.js';
import type { CpNode } from '../../src/cp-node/cp-node.js';


/**
 * Glyph `aq_H` has cubics with a degenerate end handle (a control point equal
 * to an end point). These once caused a maximal disk far outside the shape
 * and a medial axis with cycles.
 */
test('aq_H: MAT is a tree with all maximal disks inside the shape bounds', async function() {
    const svgs = await loadSvgs(`./test-svgs/achispado.svg`);
    const d = svgs.find(glyph => glyph.name === 'aq_H')!.d;

    const settings = [
        { applySat: false },
        { applySat: true, satScale: 1.1 },
        { applySat: true, satScale: 1.5 },
        { applySat: true, satScale: 2 }
    ];

    for (const setting of settings) {
        const mats = findMats(getPathsFromStr(d), {
            ...setting,
            simplify: false,
            maxCurviness: 0.25,
            maxLength: 10,
            angleIncrement: 15,
            simplifyTolerance: 2**-5
        });

        for (const mat of mats) {
            const { vertexCount, edgeCount, cpNodes } = getGraphCounts(mat);

            for (const cpNode of cpNodes) {
                const [x,y] = cpNode.pointOnShape.circle.center;
                expect(x >= 18 && x <= 742 && y >= -3 && y <= 665).toBe(true);
            }

            expect(vertexCount).toEqual(edgeCount + 1);
        }
    }
});


/**
 * Counts maximal disks as vertices and the MAT edges between them as edges
 * (each edge is passed twice going around the boundary).
 */
function getGraphCounts(mat: Mat) {
    const cpNodes = getAllOnLoop(mat.cpNode);
    const rings = new Set<CpNode>();
    for (const cpNode of cpNodes) {
        const ring = getAllOnCircle(cpNode);
        if (!ring.some(cp => rings.has(cp))) { rings.add(cpNode); }
    }
    const edgeCount = cpNodes.filter(cp => !isTerminating(cp)).length / 2;

    return { vertexCount: rings.size, edgeCount, cpNodes };
}
