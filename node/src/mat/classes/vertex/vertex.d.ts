import { Circle } from '../../classes/circle';
/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
 * i.e. a representative data point of the MAT.
 *
 * @constructor
 * @param circle
 * @param cps - The contact points of this circle on the shape.
 */
declare class Vertex_ {
    readonly circle: Circle;
    constructor(circle: Circle);
}
export { Vertex_ };
