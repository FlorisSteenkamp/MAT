
import { Curve } from './curve';


/**
 * Represents a part of a bezier within the shape boundary.
 */
class BezierPiece {
    /**
     * @param curve A bezier curve within the shape boundary.
     * @param ts The start and end t parameter values of the bezier curve.
     */
    constructor(
            public curve: Curve, 
            public ts: number[]) {
    }
}


export { BezierPiece }
