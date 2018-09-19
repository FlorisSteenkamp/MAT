import { LinkedLoop } from '../../../linked-list/linked-loop';
import { Loop } from '../../../linked-list/loop';
import { Curve } from '../../../linked-list/curve';
import { ContactPoint } from '../contact-point';
import { PointOnShape } from '../point-on-shape';
import { Vertex } from '../vertex/vertex';
/**
 * A Shape represents the loops of individual cubic bezier curves composing
 * an SVG element. When constructed, some initial analysis is done.
 */
declare class Shape {
    bezierLoops: Loop[];
    for2ProngsArray: PointOnShape[][];
    extremes: {
        p: number[];
        bezierNode: Curve;
        t: number;
    }[];
    cpGraphs: LinkedLoop<ContactPoint>[];
    readonly mat: Vertex;
    /**
     * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop
     * represents a closed path of the shape.
     */
    constructor(bezierLoops: Loop[]);
}
export { Shape };
