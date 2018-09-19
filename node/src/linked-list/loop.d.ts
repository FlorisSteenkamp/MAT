import { Curve } from './curve';
/**
 * Represents a two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 */
declare class Loop {
    readonly items: number[][][];
    readonly head: Curve;
    constructor(items?: number[][][]);
    /**
     * Adds all given items from scratch onto the empty LinkedLoop and returns
     * the head item.
     */
    private addAllFromScratch(items);
    /**
     *
     */
    forEach(f: (node: Curve) => void): void;
    /**
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n: number): Curve;
}
export { Loop };
