
import ListNode     from '../../linked-list/list-node';
import ContactPoint from './contact-point';

class HoleClosing2Prong {
    k1: number;
    k2: number;
    cpNodeA2: ListNode<ContactPoint>;
    cpNodeA1: ListNode<ContactPoint>;
    cpNodeB1: ListNode<ContactPoint>;
    cpNodeB2: ListNode<ContactPoint>;


    constructor(
            k1: number, 
            k2: number, 
            cpNodeA2: ListNode<ContactPoint>,
            cpNodeA1: ListNode<ContactPoint>,
            cpNodeB1: ListNode<ContactPoint>,
            cpNodeB2: ListNode<ContactPoint>) {
                
        this.k1 = k1;
        this.k2 = k2;
        this.cpNodeA2 = cpNodeA2;
        this.cpNodeA1 = cpNodeA1;
        this.cpNodeB1 = cpNodeB1;
        this.cpNodeB2 = cpNodeB2;
    }
}


export default HoleClosing2Prong;
