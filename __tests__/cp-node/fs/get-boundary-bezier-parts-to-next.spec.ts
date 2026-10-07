import { expect, test } from '@jest/globals';
import { fromTo, totalLength } from 'flo-bezier3';
import { getBoundaryBezierPartsToNext } from '../../../src/cp-node/fs/get-boundary-bezier-parts-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnLoop_ByLoop } from '../../../src/cp-node/fs/get-all-on-loop-by-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { getMatsWithHole } from '../../get-mats-with-hole.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getBoundaryBezierPartsToNext', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    {
        // id 1 is at the end (t=1) of curve 0 and its next (id 10) at the end
        // of curve 1 - so a degenerate piece of curve 0 and all of curve 1.
        const cp = byId(1);
        const parts = getBoundaryBezierPartsToNext(cp);
        expect(parts.length).toBe(2);
        expect(parts[0].ps).toBe(cp.pointOnShape.curve.ps);
        expect(parts[0].ts).toEqual([1, 1]);
        expect(parts[1].ps).toBe(cp.next.pointOnShape.curve.ps);
        expect(parts[1].ts).toEqual([0, 1]);
    }
    {
        // id 147 and its next (id 2) are both on curve 2 - a single piece.
        const cp = byId(147);
        const parts = getBoundaryBezierPartsToNext(cp);
        expect(parts.length).toBe(1);
        expect(parts[0].ps).toBe(cp.pointOnShape.curve.ps);
        expect(parts[0].ts).toEqual([cp.pointOnShape.t, 1]);
        expect(parts[0].ts[0]).toBeCloseTo(0.2282608695652173, 15);
    }
    {
        // ids 150 -> 143 are both strictly inside curve 0
        const cp = byId(150);
        const parts = getBoundaryBezierPartsToNext(cp);
        expect(parts.length).toBe(1);
        expect(parts[0].ts).toEqual([cp.pointOnShape.t, cp.next.pointOnShape.t]);
        expect(parts[0].ts[0]).toBeLessThan(parts[0].ts[1]);
    }

    // Structural invariants for every node: starts at the (curve,t) of this
    // node, ends at the (curve,t) of the next node, skipped curves are taken
    // whole, and the parameter intervals are ordered.
    let total = 0;
    for (const cp of getAllOnLoop(cpNode)) {
        const parts = getBoundaryBezierPartsToNext(cp);
        expect(parts.length).toBeGreaterThan(0);

        const first = parts[0];
        const last = parts[parts.length-1];
        expect(first.ps).toBe(cp.pointOnShape.curve.ps);
        expect(first.ts[0]).toBe(cp.pointOnShape.t);
        expect(last.ps).toBe(cp.next.pointOnShape.curve.ps);
        expect(last.ts[1]).toBe(cp.next.pointOnShape.t);
        for (let i=1; i<parts.length; i++) {
            expect(parts[i].ts[0]).toBe(0);
            if (i < parts.length-1) { expect(parts[i].ts[1]).toBe(1); }
        }
        if (parts.length > 1) { expect(first.ts[1]).toBe(1); }
        for (const { ts } of parts) { expect(ts[0]).toBeLessThanOrEqual(ts[1]); }

        total += parts.reduce((s, bp) => s + totalLength(fromTo(bp.ps, bp.ts[0], bp.ts[1])), 0);
    }

    // ...and all the pieces together cover the boundary exactly once.
    const perimeter = cpNode.pointOnShape.curve.loop.curves
        .reduce((s, curve) => s + totalLength(curve.ps), 0);
    expect(total).toBeCloseTo(perimeter, 8);
});


test('getBoundaryBezierPartsToNext - hole closers', function() {
    const { cpNode } = getMatsWithHole()[0];
    const cpNodes = getAllOnLoop_ByLoop(cpNode).flat();

    // `[]` if and only if the next `CpNode` is on another loop
    let crossings = 0;
    for (const cp of cpNodes) {
        const crossesLoops = cp.pointOnShape.curve.loop !== cp.next.pointOnShape.curve.loop;
        const parts = getBoundaryBezierPartsToNext(cp);
        expect(parts.length === 0).toBe(crossesLoops);
        if (crossesLoops) {
            crossings++;
            expect(cp.isHoleClosing).toBe(true);
        }
    }
    expect(crossings).toBeGreaterThan(0);
});
