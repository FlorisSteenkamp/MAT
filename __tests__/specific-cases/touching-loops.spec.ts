import { expect, test } from '@jest/globals';
import { closestPointOnBezier } from 'flo-bezier3';
import { findMats } from '../../src/find-mat/find-mats.js';
import { getAllOnCircle } from '../../src/cp-node/fs/get-all-on-circle.js';
import { loadSvgs } from './load-svg/load-svg.js';
import { getPathsFromStr } from 'flo-boolean';
import { getGraphCounts } from '../helpers/get-graph-counts.js';
import type { CpNode } from '../../src/cp-node/cp-node.js';


/**
 * Glyphs with a hole touching the outer loop at a point: at the hole's
 * topmost point (`intersecting1`, which once threw "Unable to find
 * hole-closing 2-prong") or elsewhere (`TTT`, `koldat26`; `TTT` once got a
 * tiny 3-prong at the touching point whose disk crossed the hole).
 */
test('touching loops: MAT is a tree of empty maximal disks', async function() {
    const svgs = await loadSvgs(`./test-svgs/achispado.svg`);

    for (const name of ['intersecting1', 'TTT', 'koldat26']) {
        const d = svgs.find(glyph => glyph.name === name)!.d;

        const mats = findMats(getPathsFromStr(d), {
            applySat: false,
            simplify: false,
            maxCurviness: 0.25,
            maxLength: 40,
            angleIncrement: 15
        });

        for (const mat of mats) {
            const { vertexCount, edgeCount, cpNodes } = getGraphCounts(mat);
            const cpNodeCount = [...mat.meta.cpTrees.values()]
                .reduce((sum, cpTree) => sum + cpTree.size, 0);

            expect(vertexCount).toEqual(edgeCount + 1);
            // a single walk around the boundary visits every contact point
            expect(cpNodes.length).toEqual(cpNodeCount);

            const pss = mat.meta.loops.flatMap(loop => loop.beziers);
            // (about the min separation of a 2-prong's contact points)
            const tol = 2**(mat.meta.maxCoordPowerOf2 - 22);
            const done = new Set<CpNode>();
            for (const cpNode of cpNodes) {
                if (done.has(cpNode)) { continue; }
                getAllOnCircle(cpNode).forEach(cp => done.add(cp));

                // no boundary point lies inside the disk
                const { center, radius } = cpNode.pointOnShape.circle;
                const dMin = Math.min(...pss.map(ps => closestPointOnBezier(ps, center).d));
                expect(dMin).toBeGreaterThanOrEqual(radius*(1 - 2**-10) - tol);
            }
        }
    }
});
