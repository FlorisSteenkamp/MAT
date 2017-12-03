import Circle from '../../geometry/classes/circle';
import ListNode from '../../linked-list/list-node';
import ContactPoint from './contact-point';
/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
 * i.e. a representative data point of the MAT.
 *
 * @constructor
 * @param {Circle} circle
 * @param {ListNode[]} cpNodes - The contact points of this circle on the shape.
 * @note Do not do 'new MatCircle', rather use 'MatCircle.create'.
 */
declare class MatCircle {
    circle: Circle;
    cpNodes: ListNode<ContactPoint>[];
    visited: number;
    constructor(circle: Circle, cpNodes: ListNode<ContactPoint>[]);
    /**
     * MatCircle creator.
     * @param {Circle} circle
     * @param {ListNode[]} cpNodes An array of 'orphaned'
     *        (i.e. without belonging to a MatCircle) contact points.
     * Notes: Due to the mutual dependency between the matCircle and
     * contactPoints fields, a normal constructor can not instantiate a
     * MatCircle in one step - hence this creator.
     */
    static create(circle: Circle, cpNodes: ListNode<ContactPoint>[]): MatCircle;
}
export default MatCircle;
