
class PathCurve {
    indx: number;
    bezier3: number[][];

    /**
     * An indexed cubic bezier curve.
     * @param indx
     * @param bezier3
     */
    constructor(indx: number, bezier3: number[][]) {
	    this.indx = indx; 
        this.bezier3 = bezier3;
    }


    /**
     * Returns the reverse of the given bezier and assign the new given idx.
     * @param {PathCurve} curve - a path curve
     * @param {number} idx
     * @returns {Bezier3} 
     */
    static reverse = function(curve: PathCurve, newIndx: number): PathCurve {
        let ps = curve.bezier3.slice().reverse();

        return new PathCurve(newIndx, ps);
    }
}


export default PathCurve;
