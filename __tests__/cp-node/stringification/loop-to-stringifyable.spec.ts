import { expect, test } from '@jest/globals';
import { loopFromBeziers } from 'flo-boolean';
import { loopToStringifyable } from '../../../src/cp-node/stringification/loop-to-stringifyable.js';
import { loopFromStringifyable } from '../../../src/cp-node/stringification/loop-from-stringifyable.js';


test('`LoopToStringifyable` and `LoopFromStringifyable`', function() {
    const beziers = [
        [[24,8], [34,18], [4,28]]
    ];
    const _loop_ = loopFromBeziers(beziers, 3);
    const loopStringifyable = loopToStringifyable(_loop_);

    expect(loopStringifyable.beziers).toEqual(beziers);
    expect(loopStringifyable.idx).toEqual(3);

    const loop_ = loopFromStringifyable(loopStringifyable);
    expect(loop_).toEqual(_loop_);
});
