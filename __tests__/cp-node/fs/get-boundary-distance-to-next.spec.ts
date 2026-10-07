import { expect, test } from '@jest/globals';
import { totalLength } from 'flo-bezier3';
import { getBoundaryDistanceToNext } from '../../../src/cp-node/fs/get-boundary-distance-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getBoundaryDistanceToNext', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    expect(getBoundaryDistanceToNext(byId(1))).toBeCloseTo(22, 10);     // [24,8] -> [46,8]
    expect(getBoundaryDistanceToNext(byId(147))).toBeCloseTo(35.5, 10); // [46,18.5] -> [46,54]
    expect(getBoundaryDistanceToNext(byId(144))).toBeCloseTo(10.5, 10); // [46,8] -> [46,18.5] (crosses a corner)
    expect(getBoundaryDistanceToNext(byId(0))).toBe(0);                 // two nodes at the same corner point

    // the distances around the loop add up to the perimeter
    const perimeter = cpNode.pointOnShape.curve.loop.curves
        .reduce((s, curve) => s + totalLength(curve.ps), 0);
    const total = getAllOnLoop(cpNode)
        .reduce((s, cp) => s + getBoundaryDistanceToNext(cp), 0);
    expect(total).toBeCloseTo(perimeter, 8);
});
