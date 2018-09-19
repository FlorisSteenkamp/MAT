import { CpNode } from '../../../linked-list/cp-node';
import { Circle } from '../../classes/circle';
import { Vertex } from './vertex';
/**
 * Vertex creator.
 * @param circle
 * @param cpNodes An array of 'orphaned' (i.e. without belonging to a Vertex)
 * contact points. Note: Due to the mutual dependency between the vertex and
 * contactPoints fields, a normal constructor can not instantiate a Vertex
 * in one step - hence this creator.
 */
declare function create(circle: Circle, cpNodes: CpNode[]): Vertex;
export { create };
