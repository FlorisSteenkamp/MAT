import { expect, test } from '@jest/globals';
import { RbTree } from 'flo-ll-rb-tree';
import type { CpNode } from '../../../src/cp-node/cp-node.js';
import type { MatMeta } from '../../../src/mat/mat-meta.js';
import { removeCpNode } from '../../../src/cp-node/fs/remove-cp-node.js';
import { cpNodeComparator } from '../../../src/cp-node/fs/cp-node-comparator.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('removeCpNode', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const all = getAllOnLoop(cpNode);

    const loop = cpNode.pointOnShape.curve.loop;
    const cpTree = new RbTree<CpNode>(cpNodeComparator);
    for (const cp of all) { cpTree.insert(cp); }
    const meta = { cpTrees: new Map([[loop, cpTree]]) } as unknown as MatMeta;

    const cp = byId(10);
    const prev = cp.prev;  // id 1
    const next = cp.next;  // id 144
    expect(cpTree.find(cp)?.datum).toBe(cp);

    removeCpNode(cp, meta);

    // (compare `CpNode`s by identity / id only - they are circular structures
    // that must not be deep-compared)

    // unlinked from the loop...
    expect(prev.next).toBe(next);
    expect(next.prev).toBe(prev);
    const remaining = getAllOnLoop(cpNode);
    expect(remaining.length).toBe(all.length - 1);
    expect(remaining.includes(cp)).toBe(false);
    // ...and from the tree, with everything else still there
    expect(cpTree.find(cp)).toBeUndefined();
    expect(cpTree.size).toBe(all.length - 1);
    const expectedIds = all.filter(c => c !== cp).sort(cpNodeComparator).map(c => c.id);
    expect(cpTree.toArr().map(c => c.id)).toEqual(expectedIds);
    // the removed node itself is left untouched
    expect(cp.prev).toBe(prev);
    expect(cp.next).toBe(next);
});
