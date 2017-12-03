import PointOnShape from '../../geometry/classes/point-on-shape';
import MatCircle from './mat-circle';
/**
 * Class representing a single contact point of a MatCircle.
 *
 * @param pointOnShape
 * @param {MatCircle} matCircle
 */
declare class ContactPoint {
    pointOnShape: PointOnShape;
    matCircle: MatCircle;
    key: string;
    0: number;
    1: number;
    constructor(pointOnShape: PointOnShape, matCircle: MatCircle);
    static compare(a: ContactPoint, b: ContactPoint): number;
    static equal(a: ContactPoint, b: ContactPoint): boolean;
}
export default ContactPoint;
