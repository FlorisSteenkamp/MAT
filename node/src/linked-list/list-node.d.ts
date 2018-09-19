import { LinkedLoop } from './linked-loop';
import { ContactPoint } from '../mat/classes/contact-point';
declare class ListNode {
    loop: LinkedLoop;
    item: ContactPoint;
    prev: ListNode;
    next: ListNode;
    idx: number;
    prevOnCircle: ListNode;
    nextOnCircle: ListNode;
    /**
     * Representation of a linked loop vertex (i.e. node) having various edges, two
     * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
     * @param loop - The linked loop this node belongs to.
     * @param item - The actual item stored at a node.
     * @param prev - The previous item.
     * @param next - The next item.
     */
    constructor(loop: LinkedLoop, item: ContactPoint, prev: ListNode, next: ListNode, idx: number);
    getNext(): ListNode;
    isTerminating(): boolean;
    isHoleClosing(): boolean;
    isSharp(): boolean;
    /**
     * Returns true if this ListNode is a one-prong (including
     * sharp corners).
     */
    isOneProng(): boolean;
    isThreeProng(): boolean;
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps(node: ListNode, n: number): ListNode;
}
export { ListNode };
