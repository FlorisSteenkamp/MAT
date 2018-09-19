import { PointOnShape } from './point-on-shape';
import { Circle } from './circle';
declare class ContactPoint {
    readonly pointOnShape: PointOnShape;
    readonly circle: Circle;
    readonly order: number;
    readonly order2: number;
    /**
     * Representation of a point on a loop (or shape).
     * @param pointOnShape
     * @param vertex
     */
    constructor(pointOnShape: PointOnShape, circle: Circle, order: number, order2: number);
    static compare(a: ContactPoint, b: ContactPoint): number;
}
export { ContactPoint };
