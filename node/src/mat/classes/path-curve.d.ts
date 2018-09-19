declare class PathCurve {
    idx: number;
    bezier3: number[][];
    /**
     * An indexed cubic bezier curve.
     * @param idx
     * @param bezier3
     */
    constructor(idx: number, bezier3: number[][]);
    /**
     * Returns the reverse of the given bezier and assign the new given idx.
     * @param curve - a path curve
     * @param newIdx
     */
    static reverse: (curve: PathCurve, newIdx: number) => PathCurve;
}
export { PathCurve };
