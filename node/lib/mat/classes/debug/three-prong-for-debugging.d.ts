import ListNode from '../../../linked-list/list-node';
import ContactPoint from '../../classes/contact-point';
declare class ThreeProngForDebugging {
    threeProng: {};
    deltas: ListNode<ContactPoint>[][];
    bestIndx: number;
    candidateThreeProngs: {};
    deltasSimple: string[][];
    constructor(threeProng: {}, deltas: ListNode<ContactPoint>[][], bestIndx: number, candidateThreeProngs: {});
}
export default ThreeProngForDebugging;
