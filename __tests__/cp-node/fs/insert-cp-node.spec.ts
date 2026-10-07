import { expect, test } from '@jest/globals';
import { RbTree } from 'flo-ll-rb-tree';
import type { CpNode } from '../../../src/cp-node/cp-node.js';
import type { PointOnShape } from '../../../src/point-on-shape/point-on-shape.js';
import { insertCpNode } from '../../../src/cp-node/fs/insert-cp-node.js';
import { cpNodeComparator } from '../../../src/cp-node/fs/cp-node-comparator.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


/** A point on the shape (on the curve of the given node at `t`) with a zero disk. */
function posOnCurveOf(cpNode: CpNode, t: number, p: number[]): PointOnShape {
    return {
        curve: cpNode.pointOnShape.curve, t, p,
        pDd: [[0,p[0]],[0,p[1]]], isSource: true,
        circle: { center: p, radius: 0 }, order: 0, order2: 0
    };
}


test('insertCpNode', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const all = getAllOnLoop(cpNode);
    const cpTree = new RbTree<CpNode>(cpNodeComparator);
    for (const cp of all) { cpTree.insert(cp); }
    const lastInsertId = { id: 1000 };

    // insert between [24,8] (id 1, end of curve 0) and [46,8] (id 10, end of
    // curve 1) a point halfway along curve 1
    const pred = byId(1);
    const succ = byId(10);
    const pos = posOnCurveOf(succ, 0.5, [35, 8]);
    const inserted = insertCpNode(false, false, false, cpTree, pos, pred, succ, lastInsertId)!;

    expect(inserted).toBeDefined();
    expect(inserted.id).toBe(1000);
    expect(lastInsertId.id).toBe(1001);
    expect(inserted.pointOnShape).toBe(pos);
    expect(inserted.isHoleClosing).toBe(false);
    expect(inserted.isIntersection).toBe(false);
    // linked into the loop...
    expect(inserted.prev).toBe(pred);
    expect(inserted.next).toBe(succ);
    expect(pred.next).toBe(inserted);
    expect(succ.prev).toBe(inserted);
    expect(getAllOnLoop(cpNode).length).toBe(all.length + 1);
    // ...and into the tree, in order
    expect(cpTree.find(inserted)?.datum).toBe(inserted);
    expect(cpTree.size).toBe(all.length + 1);
    const inOrder = cpTree.toArr();
    expect(inOrder.length).toBe(all.length + 1);
    expect(inOrder[inOrder.indexOf(pred) + 1]).toBe(inserted);
    expect(inOrder[inOrder.indexOf(inserted) + 1]).toBe(succ);
    // the on-circle edges are left for the caller to set
    expect(inserted.nextOnCircle).toBeUndefined();
    expect(inserted.prevOnCircle).toBeUndefined();

    {
        // A point on curve 3 does not belong between ids 1 and 10 - refused
        // unless told to insert regardless. (At t=0.25 - not t=0.5 where id
        // 145 already sits, which the tree would treat as a duplicate.)
        const wrongPos = posOnCurveOf(byId(145), 0.25, [63.75, 54]);
        const r = insertCpNode(false, false, false, cpTree, wrongPos, pred, inserted, lastInsertId);
        expect(r).toBeUndefined();
        expect(pred.next).toBe(inserted);
        expect(cpTree.size).toBe(all.length + 1);
        expect(lastInsertId.id).toBe(1001);

        const forced = insertCpNode(true, true, true, cpTree, wrongPos, pred, inserted, lastInsertId)!;
        expect(forced).toBeDefined();
        expect(forced.id).toBe(1001);
        expect(forced.isHoleClosing).toBe(true);
        expect(forced.isIntersection).toBe(true);
        expect(pred.next).toBe(forced);
        expect(forced.next).toBe(inserted);
        expect(inserted.prev).toBe(forced);
        expect(cpTree.size).toBe(all.length + 2);
    }

    {
        // without a predecessor the node starts a loop of its own
        const emptyTree = new RbTree<CpNode>(cpNodeComparator);
        const lone = insertCpNode(false, false, false, emptyTree, pos, undefined, undefined, lastInsertId)!;
        expect(lone.next).toBe(lone);
        expect(lone.prev).toBe(lone);
        expect(emptyTree.size).toBe(1);
        expect(emptyTree.toArr()[0]).toBe(lone);
    }
});
