import { ListNode } from '../../linked-list/list-node';
import { ContactPoint } from '../classes/contact-point';
import { Vertex } from './vertex';
interface IEdge {
    fromCp: ListNode<ContactPoint>;
    toCp: ListNode<ContactPoint>;
    fromVertex: Vertex;
    toVertex: Vertex;
}
export { IEdge };
