
type Depth = 1 | 2 | 3 | 4 | 5 | 6;

type NestedArray<T, D extends Depth> =
    D extends 1 ? T[] :
    D extends 2 ? T[][] :
    D extends 3 ? T[][][] :
    D extends 4 ? T[][][][] :
    D extends 5 ? T[][][][][] :
    T[][][][][][];

type PrevDepth<D extends Depth> =
    D extends 6 ? 5 :
    D extends 5 ? 4 :
    D extends 4 ? 3 :
    D extends 3 ? 2 :
    D extends 2 ? 1 :
    never;

type LeafAtDepth<A, D extends Depth> =
    D extends 1
        ? A extends (infer T)[] ? T : never
        : A extends (infer T)[] ? LeafAtDepth<T, PrevDepth<D>> : never;

type LeafValue<T, FilterUndefined extends boolean> =
    FilterUndefined extends true ? Exclude<T, undefined> : T;


/**
 * Returns the result of mapping the array to the given depth and, optionally,
 * filtering out `undefined` leaf values.
 * 
 * @param tss 
 * @param f 
 * @param filterUndefined 
 */
function mapDeep<D extends Depth, A extends NestedArray<unknown, D>, U, F extends boolean = false>(
        depth: D,
        tss: A,
        f: (t: LeafAtDepth<A, D>) => U,
        filterUndefined?: F): NestedArray<LeafValue<U, F>, D> {

    if (!Number.isInteger(depth) || depth < 1) {
        throw new Error('depth must be an integer >= 1');
    }

    function mapRec(d: number, arr: unknown): unknown {
        const a = arr as unknown[];

        if (d === 1) {
            const ts_: U[] = [];
            for (let i=0; i<a.length; i++) {
                const v = f(a[i] as LeafAtDepth<A, D>);
                if (!filterUndefined || v !== undefined) {
                    ts_.push(v);
                }
            }

            return ts_;
        }

        const tss_: unknown[] = [];
        for (let i=0; i<a.length; i++) {
            tss_.push(mapRec(d - 1, a[i]));
        }

        return tss_;
    }

    return mapRec(depth, tss as unknown) as NestedArray<LeafValue<U, F>, D>;
}


export { mapDeep }

