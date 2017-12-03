import Circle from './circle';
declare class Arc {
    circle: Circle;
    sinAngle1: number;
    cosAngle1: number;
    sinAngle2: number;
    cosAngle2: number;
    startpoint: number[];
    endpoint: number[];
    /**
     * Arc class.
     * If circle === null then the arc degenerates into a line segment
     * given by sinAngle1 and cosAngle2 which now represent points.
     * The arc curve is always defined as the piece from angle1 -> angle2.
     * Note: startpoint and endpoint is redundant
     */
    constructor(circle: Circle, sinAngle1: number, cosAngle1: number, sinAngle2: number, cosAngle2: number, startpoint: number[], endpoint: number[]);
    /**
     * Returns the closest point on the arc.
     * NOTE: Not currently used.
     * @private
     */
    static closestPointOnArc(p: number[], arc: Arc): {
        p: number[];
        position: number;
    };
}
export default Arc;
