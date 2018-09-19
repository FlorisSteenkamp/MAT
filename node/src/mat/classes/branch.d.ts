import { ListNode } from '../../linked-list/list-node';
import { ContactPoint } from '../classes/contact-point';
import { MatCircle } from './mat-circle';
export declare class Branch {
    matCircle: MatCircle;
    fromCp: ListNode<ContactPoint>;
    toCp: ListNode<ContactPoint>;
    constructor(matCircle: MatCircle, fromCp: ListNode<ContactPoint>, toCp: ListNode<ContactPoint>);
}
