
import { Curve } from './curve';

class BezierPiece {

    /**
     * @param curve
     * @param ts The start and end t parameter of the original bezier curve
     */
    constructor(
            public curve: Curve, 
            public ts: number[]) {
    }
}


export { BezierPiece };
