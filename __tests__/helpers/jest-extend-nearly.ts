import type { MatcherContext, SyncExpectationResult } from 'expect';
import { closeTo } from "./close-to.js";
import { ObjOrArray } from "./obj-or-array.js";


/**
 * Jest custom matcher equivalent of the old Chai `nearly` plugin.
 *
 * Register once (e.g. in a setup file or at the top of a spec) via:
 *     expect.extend(nearly);
 *
 * Then use as:
 *     expect(received).toBeNearly(2**4, expectedValue);
 *     expect(received).not.toBeNearly([2], expectedValue);
 */
const nearly = {
    toBeNearly(
        this: MatcherContext,
        received: ObjOrArray<number>,
        ulpsOrEps: number | number[],
        value: ObjOrArray<number>,
    ): SyncExpectationResult {
        const isUlps = !Array.isArray(ulpsOrEps);

        // Preserve the original argument order: `received` plays the role of
        // `expected` in `closeTo` (it scales the ulp error), `value` the `actual`.
        const pass = closeTo(ulpsOrEps)(received, value);

        return {
            pass,
            message: () =>
                `expected \n${JSON.stringify(received)}\n to ${this.isNot ? 'not ' : ''}be nearly ` +
                `(${ulpsOrEps} ${isUlps ? 'ulps' : 'eps'}) \n${JSON.stringify(value)}`,
        };
    },
};


export { nearly }
