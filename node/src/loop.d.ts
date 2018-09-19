import { Curve } from './curve';
/**
 * Represents a two-way linked loop of Curves.
 */
declare class Loop {
    items: number[][][];
    readonly curves: Curve[];
    readonly head: Curve;
    /**
     * @param items - A pre-ordered array of items to add initially
     */
    constructor(items?: number[][][]);
    toBeziers(): number[][][];
    static perturb(loop: Loop, x: number): Loop;
}
export { Loop };
