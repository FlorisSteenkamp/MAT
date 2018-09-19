import { ListNode } from '../../linked-list/list-node';
import { ContactPoint } from '../classes/contact-point';
import { Vertex } from '../classes/vertex/vertex';
import { LinkedLoop } from '../../linked-list/linked-loop';
/**
 * Recursively builds the MAT tree.
 * The returned Vertex === the Vertex of the cpStart parameter.
 * @param cpStart The ContactPoint to start traversing from.
 */
declare function buildMat(cpGraphs: LinkedLoop<ContactPoint>[], cpStart: ListNode<ContactPoint>): Vertex;
export { buildMat };
