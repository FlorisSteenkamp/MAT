import { expect, test } from '@jest/globals';
import { findFirst } from '../../../src/cp-node/fs/find-first.js';
import { getMats1 } from '../../get-mats1.js';


test('findFirst', function() {
    const { cpNode } = getMats1()[0];

    // Always-true predicate: returns the start node
    expect(findFirst(() => true, cpNode) === cpNode).toBe(true);

    // Always-false predicate: returns undefined
    expect(findFirst(() => false, cpNode)).toBeUndefined();

    // Predicate matching cpNode.next: returns cpNode.next
    expect(findFirst(n => n === cpNode.next, cpNode) === cpNode.next).toBe(true);
});
