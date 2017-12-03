import ListNode from '../../linked-list/list-node';
import ContactPoint from './contact-point';
declare class HoleClosing2Prong {
    k1: number;
    k2: number;
    cpNodeA2: ListNode<ContactPoint>;
    cpNodeA1: ListNode<ContactPoint>;
    cpNodeB1: ListNode<ContactPoint>;
    cpNodeB2: ListNode<ContactPoint>;
    constructor(k1: number, k2: number, cpNodeA2: ListNode<ContactPoint>, cpNodeA1: ListNode<ContactPoint>, cpNodeB1: ListNode<ContactPoint>, cpNodeB2: ListNode<ContactPoint>);
}
export default HoleClosing2Prong;
