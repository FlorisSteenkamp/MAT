import ContactPoint from '../../classes/contact-point';
import ListNode from '../../../linked-list/list-node';
declare class ThreeProngForDebugging {
    threeProng: {};
    deltas: ListNode<ContactPoint>[][];
    bestIndx: number;
    candidateThreeProngs: {};
    deltasSimple: string[][];
    constructor(threeProng: {}, deltas: ListNode<ContactPoint>[][], bestIndx: number, candidateThreeProngs: {});
}
export default ThreeProngForDebugging;
