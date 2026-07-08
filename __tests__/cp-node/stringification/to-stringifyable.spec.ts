import { expect, test } from '@jest/globals';
import { toStringifyable } from '../../../src/cp-node/stringification/to-stringifyable.js';
import { fromStringifyable } from '../../../src/cp-node/stringification/from-stringifyable.js';
import { getMats1 } from '../../get-mats1.js';
import { compareCpNodesByValue } from '../compare-cp-nodes-by-value.js';


test('`toStringifyable` and `fromStringifyable`', function() {
    {
        // Basic test
        const { cpNode } = getMats1()[0];

        const stringifyable = toStringifyable(cpNode);
        const cpNode_ = fromStringifyable(stringifyable);

        const r = compareCpNodesByValue(cpNode, cpNode_);

        expect(r).toBe(true);
    }
    {
        // Test that also JSON.stringify and JSON.parse work with the stringifyable format
        const cpNode = getMats1()[0].cpNode;

        const stringifyable = toStringifyable(cpNode);
        const jsonStr = JSON.stringify(stringifyable);  // Should not throw
        const stringifyable_ = JSON.parse(jsonStr) as ReturnType<typeof toStringifyable>;

        const cpNode_ = fromStringifyable(stringifyable_);

        const r = compareCpNodesByValue(cpNode, cpNode_);

        expect(r).toBe(true);
    }
});
