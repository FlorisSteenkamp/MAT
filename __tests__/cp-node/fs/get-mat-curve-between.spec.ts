import { expect, test } from '@jest/globals';
import { cross, fromTo, toUnitVector } from 'flo-vector2d';
import { getMatCurveBetween } from '../../../src/cp-node/fs/get-mat-curve-between.js';
import { getEdgeDirection } from '../../../src/cp-node/fs/get-edge-direction.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectBezierClose, expectBeziersConnected, expectPointClose } from '../../helpers/expect-point-close.js';


/** unit direction of the given line `[p, q]` */
const lineDir = (l: number[][]) => toUnitVector(fromTo(l[0], l[1]));
/** unit tangent at the start / end of a bezier */
const startTan = (ps: number[][]) => toUnitVector(fromTo(ps[0], ps[1]));
const endTan   = (ps: number[][]) => toUnitVector(fromTo(ps[ps.length-2], ps[ps.length-1]));


test('getMatCurveBetween', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    {
        // 3-prong center [81.5,18.5] to the sharp corner [46,54]: the edge
        // direction and the corner bisector are collinear - a straight line
        const pss = getMatCurveBetween(byId(147), byId(2));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[81.5,18.5],[46,54]]);
    }
    {
        // sharp corner [24,8] to the 2-prong on its bisector - a straight line
        const pss = getMatCurveBetween(byId(1), byId(10));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[24,8],[46,-5.21425847941623]]);
    }
    {
        // 2-prong {10,11} to the 3-prong {142,143,144}: the medial axis is a
        // parabola here (equidistant from the corner point [46,8] and a line)
        // - a single quadratic whose control point is the intersection of the
        // two edge directions.
        const pss = getMatCurveBetween(byId(10), byId(144));
        expect(pss.length).toBe(1);
        const ps = pss[0];
        expect(ps.length).toBe(3);
        const l0 = getEdgeDirection(byId(10));
        const l1 = getEdgeDirection(byId(143));  // = 144.prevOnCircle
        expect(cross(fromTo(l0[0], ps[1]), lineDir(l0))).toBeCloseTo(0, 9);
        expect(cross(fromTo(l1[0], ps[1]), lineDir(l1))).toBeCloseTo(0, 9);
    }

    // For every MAT edge: 1 or 2 pieces (lines or quadratics), from the
    // circle center of this node to that of the next, joined smoothly,
    // leaving along the edge direction at the start and arriving along the
    // edge direction at the end.
    for (const cp of getAllOnLoop(cpNode)) {
        const pss = getMatCurveBetween(cp, cp.next);
        expect([1,2]).toContain(pss.length);
        for (const ps of pss) { expect([2,3]).toContain(ps.length); }

        const c0 = cp.pointOnShape.circle.center;
        const c1 = cp.next.pointOnShape.circle.center;
        expectPointClose(pss[0][0], c0);
        const last = pss[pss.length-1];
        expectPointClose(last[last.length-1], c1);
        expectBeziersConnected(pss);

        if (isTerminating(cp)) {
            // both nodes share a center: a degenerate curve
            for (const ps of pss) { for (const p of ps) { expectPointClose(p, c0); } }
            continue;
        }

        const d0 = lineDir(getEdgeDirection(cp));
        const d1 = lineDir(getEdgeDirection(cp.next.prevOnCircle));
        expect(cross(startTan(pss[0]), d0)).toBeCloseTo(0, 4);
        expect(cross(endTan(last), d1)).toBeCloseTo(0, 4);
        if (pss.length === 2) {
            expect(cross(endTan(pss[0]), startTan(pss[1]))).toBeCloseTo(0, 9);
        }
    }
});
