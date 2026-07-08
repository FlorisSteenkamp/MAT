import { expect, test } from '@jest/globals';
import { getNonTerminatingOnCircle } from '../../../src/cp-node/fs/get-non-terminating-on-circle.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';


test('getNonTerminatingOnCircle', function() {
    const { cpNode } = getMats1()[0];

    const nonTerm = getNonTerminatingOnCircle(cpNode);
    for (const n of nonTerm) {
        expect(isTerminating(n)).toBe(false);
    }

    // exclThis=true should not include cpNode itself
    const nonTermExcl = getNonTerminatingOnCircle(cpNode, true);
    expect(nonTermExcl.includes(cpNode)).toBe(false);
});
