import { PointOnShape } from '../classes/point-on-shape';
import { Circle } from '../classes/circle';
/**
 * Class representing a single contact point of a Vertex.
 */
declare class ContactPoint {
    readonly pointOnShape: PointOnShape;
    circle: Circle;
    order: number;
    order2: number;
    static toStr: (cp: ContactPoint) => string;
    /**
     * @param pointOnShape
     * @param vertex
     */
    constructor(pointOnShape: PointOnShape, circle: Circle, order: number, order2: number);
    static compare(a: ContactPoint, b: ContactPoint): number;
}
export { ContactPoint };
