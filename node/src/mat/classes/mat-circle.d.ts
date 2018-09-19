import { ListNode } from '../../linked-list/list-node';
import { Circle } from '../classes/circle';
import { ContactPoint } from '../classes/contact-point';
import { PointOnShape } from '../classes/point-on-shape';
import { Shape } from '../classes/shape';
import { Edge } from './edge';
/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
 * i.e. a representative data point of the MAT.
 *
 * @constructor
 * @param circle
 * @param cps - The contact points of this circle on the shape.
 */
declare class Vertex {
    circle: Circle;
    cps: ListNode<ContactPoint>[];
    edges: Edge[];
    deleted: boolean;
    constructor(circle: Circle, cps: ListNode<ContactPoint>[], edges?: Edge[]);
    /**
     * Returns a deep copy (clone) of the given Vertex. Since a Vertex
     * represents an entire MAT we have to clone an entire MAT.
     * @param vertex The Vertex to clone.
     */
    static clone(vertex: Vertex): Vertex;
    static create2(circle: Circle, shape?: Shape, poss?: PointOnShape[], neighboringCps?: ListNode<ContactPoint>[][]): Vertex;
    /**
     * Vertex creator.
     * @param circle
     * @param cps An array of 'orphaned'
     *        (i.e. without belonging to a Vertex) contact points.
     * Notes: Due to the mutual dependency between the vertex and
     * contactPoints fields, a normal constructor can not instantiate a
     * Vertex in one step - hence this creator.
     */
    static create(circle: Circle, cps: ListNode<ContactPoint>[]): Vertex;
}
export { Vertex };
