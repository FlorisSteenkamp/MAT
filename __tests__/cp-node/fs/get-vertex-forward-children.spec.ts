import { expect, test } from '@jest/globals';
import { getVertexForwardChildren } from '../../../src/cp-node/fs/get-vertex-forward-children.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getVertexForwardChildren', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const childIds = (id: number) => getVertexForwardChildren(byId(id)).map(cp => cp.id);

    // Seen as a vertex entered via the given node (its `prevOnCircle` being
    // the edge back to the parent), the forward children are the far ends of
    // the other edges, in on-circle order.
    expect(childIds(144)).toEqual([147, 148]);  // 3-prong: two children
    expect(childIds(142)).toEqual([148, 11]);   // same 3-prong, entered differently
    expect(childIds(147)).toEqual([2, 4]);      // 3-prong towards two leaves
    expect(childIds(10)).toEqual([144]);        // 2-prong: one child
    expect(childIds(1)).toEqual([10]);          // leaf, leaving
    expect(childIds(0)).toEqual([]);            // leaf, entered - no children

    for (const cp of getAllOnLoop(cpNode)) {
        const children = getVertexForwardChildren(cp);

        // one child per non-terminating node on the circle other than the one
        // leading back
        const ring = getAllOnCircle(cp);
        const expected = ring
            .filter(c => c !== cp.prevOnCircle && !isTerminating(c))
            .map(c => c.next);
        expect(children.length).toBe(expected.length);
        expect(children.every((c, i) => c === expected[i])).toBe(true);

        for (const child of children) {
            // a child is reached by an edge from this vertex...
            expect(child.prev.pointOnShape.circle).toBe(cp.pointOnShape.circle);
            // ...to a different vertex
            expect(child.pointOnShape.circle).not.toBe(cp.pointOnShape.circle);
        }
    }
});
