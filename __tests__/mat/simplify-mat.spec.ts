import { expect, test } from '@jest/globals';
import { getPathsFromStr } from 'flo-boolean';
import { closestPointOnBezier, evalDeCasteljau } from 'flo-bezier3';
import { distanceBetween } from 'flo-vector2d';
import { findMats } from '../../src/find-mat/find-mats.js';
import { simplifyMat } from '../../src/mat/simplify-mat.js';
import { getAllOnLoop } from '../../src/cp-node/fs/get-all-on-loop.js';
import { getMatCurveToNext } from '../../src/cp-node/fs/get-mat-curve-to-next.js';
import { isTerminating } from '../../src/cp-node/fs/is-terminating.js';
import type { CpNode } from '../../src/cp-node/cp-node.js';


/** All the bezier pieces making up the MAT. */
function getMatBeziers(cpNode: CpNode): number[][][] {
    return getAllOnLoop(cpNode)
        .filter(cp => !isTerminating(cp))
        .flatMap(getMatCurveToNext);
}


/**
 * The one-sided Hausdorff distance from the curves `A` to the curves `B`,
 * approximated by sampling points on `A`.
 */
function sampledHausdorffDistanceOneSided(
        A: number[][][],
        B: number[][][],
        samplesPerCurve = 16): number {

    let worst = 0;
    for (const ps of A) {
        for (let i=0; i<=samplesPerCurve; i++) {
            const p = evalDeCasteljau(ps, i/samplesPerCurve);
            let best = Infinity;
            for (const qs of B) {
                const { p: q } = closestPointOnBezier(qs, p);
                best = Math.min(best, distanceBetween(p, q));
            }
            worst = Math.max(worst, best);
        }
    }

    return worst;
}


test('simplifyMat', function() {
    // A smooth blob: its MAT is a single long branch made up of very many
    // 2-prongs, so there is a lot to simplify.
    const loops = getPathsFromStr(
        'M0 0 C 50 -40 150 -40 200 0 C 250 40 250 80 200 120 ' +
        'C 150 160 50 160 0 120 C -50 80 -50 40 0 0 Z'
    );
    const [mat] = findMats(loops, { simplify: false, applySat: false });
    const original = getMatBeziers(mat.cpNode);
    const originalCount = getAllOnLoop(mat.cpNode).length;
    const originalTreeSizes = [...mat.meta.cpTrees.values()].map(t => t.size);

    const hausdorffTolerance = 2**-3;
    const simplified = simplifyMat(mat, hausdorffTolerance);
    const simplifiedBeziers = getMatBeziers(simplified.cpNode);

    // it did simplify...
    expect(getAllOnLoop(simplified.cpNode).length).toBeLessThan(originalCount);
    expect(simplifiedBeziers.length).toBeLessThan(original.length);

    // ...but stayed within the tolerance: no point of the original MAT is
    // further than `hausdorffTolerance` from the simplified MAT (the tolerance
    // is a certified bound, up to floating point roundoff)
    const hd = sampledHausdorffDistanceOneSided(original, simplifiedBeziers);
    expect(hd).toBeLessThanOrEqual(hausdorffTolerance * (1 + 2**-20));

    // the input MAT is left intact - its linked list *and* its `cpTrees`
    expect(getAllOnLoop(mat.cpNode).length).toBe(originalCount);
    expect([...mat.meta.cpTrees.values()].map(t => t.size)).toEqual(originalTreeSizes);

    // the simplified MAT has its own `cpTrees`, consistent with its nodes
    expect(simplified.meta.cpTrees).not.toBe(mat.meta.cpTrees);
    const simplifiedNodes = getAllOnLoop(simplified.cpNode);
    for (const [loop, tree] of simplified.meta.cpTrees) {
        const onLoop = simplifiedNodes.filter(cp => cp.pointOnShape.curve.loop === loop);
        expect(tree.size).toBe(onLoop.length);
        for (const cp of onLoop) { expect(tree.find(cp)?.datum).toBe(cp); }
    }
});
