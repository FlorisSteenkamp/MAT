import type { Corner } from "./corner.js";
/**
 * @internal
 * Returns a new corner with properties.
 *
 * @param psI The incoming bezier that ends in the corner
 * @param psO The outgoing bezier that starts at the corner
 */
declare function getCorner(psI: number[][], psO: number[][]): Corner;
/**
 * Memoized version of `getCorner` (keyed on the two control point arrays).
 *
 * @internal
 */
declare const getCorner$: typeof getCorner & {
    readonly weakMapS: WeakMap<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly mapS: Map<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly clearCache: () => void;
    readonly addToCache: (r: unknown, ...args: any) => void;
};
export { getCorner, getCorner$ };
