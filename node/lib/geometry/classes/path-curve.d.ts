declare class PathCurve {
    indx: number;
    bezier3: number[][];
    /**
     * An indexed cubic bezier curve.
     * @param indx
     * @param bezier3
     */
    constructor(indx: number, bezier3: number[][]);
    /**
     * Returns the reverse of the given bezier and assign the new given idx.
     * @param {PathCurve} curve - a path curve
     * @param {number} idx
     * @returns {Bezier3}
     */
    static reverse: (curve: PathCurve, newIndx: number) => PathCurve;
}
export default PathCurve;
