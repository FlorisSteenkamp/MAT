import { expect, test } from '@jest/globals';
import { distanceBetween, dot, fromTo, toUnitVector } from 'flo-vector2d';
import { getEdgeDirection } from '../../../src/cp-node/fs/get-edge-direction.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectPointClose } from '../../helpers/expect-point-close.js';


test('getEdgeDirection', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const dir = (id: number) => {
        const [c, v] = getEdgeDirection(byId(id));
        return fromTo(c, v);
    };

    // 3-prong with center [81.5,18.5] and contact points [46,18.5] (id 147),
    // [81.5,54] (id 145) and [117,18.5] (id 146): each edge leaves along the
    // bisector of the contact point of the node and the next one on the circle.
    const s = Math.SQRT1_2;
    expectPointClose(dir(147), [-s, s]);
    expectPointClose(dir(145), [ s, s]);
    expectPointClose(dir(146), [ 0,-1]);

    // 1-prong at the sharp corner [24,8] (ids 0 and 1): the edge leaves along
    // the bisector of the corner (both nodes sit at the same point).
    const bisector = toUnitVector([
        1 + 58/Math.hypot(58, 109),    // unit([46,8]-[24,8]) + unit([82,-101]-[24,8])
        0 - 109/Math.hypot(58, 109)
    ]);
    expectPointClose(dir(0), bisector);
    expectPointClose(dir(1), bisector);

    // 2-prong {10,11} on the line [24,8]->[46,8] and the other edge of the
    // corner: its direction continues the corner bisector (the MAT is smooth
    // there) - and the opposite way for the node pointing back to the corner.
    expectPointClose(dir(10), bisector);
    expectPointClose(dir(11), [-bisector[0], -bisector[1]]);

    for (const cp of getAllOnLoop(cpNode)) {
        const [c, v] = getEdgeDirection(cp);
        // starts at the circle center, unit length
        expect(c).toBe(cp.pointOnShape.circle.center);
        expect(distanceBetween(c, v)).toBeCloseTo(1, 12);

        // points towards the next vertex (never backwards)
        if (!isTerminating(cp)) {
            const toNext = fromTo(c, cp.next.pointOnShape.circle.center);
            expect(dot(fromTo(c, v), toNext)).toBeGreaterThan(0);
        }
    }
});
