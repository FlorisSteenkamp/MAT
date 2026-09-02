import { expect } from '@jest/globals';
import { nearly } from './jest-extend-nearly.js';


// Polyfill for the TC39 `Map.prototype.getOrInsert` / `getOrInsertComputed`
// proposal, not yet available in the Node runtime Jest runs on (used by flo-boolean).
// See: https://github.com/tc39/proposal-upsert
if (typeof (Map.prototype as any).getOrInsert !== 'function') {
    Object.defineProperty(Map.prototype, 'getOrInsert', {
        value: function getOrInsert(this: Map<unknown, unknown>, key: unknown, defaultValue: unknown) {
            if (this.has(key)) {
                return this.get(key);
            }
            this.set(key, defaultValue);
            return defaultValue;
        },
        writable: true,
        configurable: true,
        enumerable: false,
    });
}

if (typeof (Map.prototype as any).getOrInsertComputed !== 'function') {
    Object.defineProperty(Map.prototype, 'getOrInsertComputed', {
        value: function getOrInsertComputed(this: Map<unknown, unknown>, key: unknown, callbackFn: (key: unknown) => unknown) {
            if (this.has(key)) {
                return this.get(key);
            }
            const value = callbackFn(key);
            this.set(key, value);
            return value;
        },
        writable: true,
        configurable: true,
        enumerable: false,
    });
}


// Register custom matchers globally for all test files.
expect.extend(nearly);
