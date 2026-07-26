type Depth = 1 | 2 | 3 | 4 | 5 | 6;
type NestedArray<T, D extends Depth> = D extends 1 ? T[] : D extends 2 ? T[][] : D extends 3 ? T[][][] : D extends 4 ? T[][][][] : D extends 5 ? T[][][][][] : T[][][][][][];
type PrevDepth<D extends Depth> = D extends 6 ? 5 : D extends 5 ? 4 : D extends 4 ? 3 : D extends 3 ? 2 : D extends 2 ? 1 : never;
type LeafAtDepth<A, D extends Depth> = D extends 1 ? A extends (infer T)[] ? T : never : A extends (infer T)[] ? LeafAtDepth<T, PrevDepth<D>> : never;
type LeafValue<T, FilterUndefined extends boolean> = FilterUndefined extends true ? Exclude<T, undefined> : T;
/**
 * Returns the result of mapping the array to the given depth and, optionally,
 * filtering out `undefined` leaf values.
 *
 * @param tss
 * @param f
 * @param filterUndefined
 */
declare function mapDeep<D extends Depth, A extends NestedArray<unknown, D>, U, F extends boolean = false>(depth: D, tss: A, f: (t: LeafAtDepth<A, D>) => U, filterUndefined?: F): NestedArray<LeafValue<U, F>, D>;
export { mapDeep };
