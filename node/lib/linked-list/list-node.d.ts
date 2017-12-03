import LinkedLoop from './linked-loop';
/**
 * Representation of a linked loop vertex (i.e. node) having various edges, two
 * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
 * @param loop - The linked loop this node belongs to.
 * @param item - The actual item stored at a node.
 * @param prev - The previous item.
 * @param next - The next item.
 */
declare class ListNode<T> {
    loop: LinkedLoop<T>;
    item: T;
    prev: ListNode<T>;
    next: ListNode<T>;
    coupledNode: ListNode<T>;
    prevOnCircle: ListNode<T>;
    nextOnCircle: ListNode<T>;
    constructor(loop: LinkedLoop<T>, item: T, prev: ListNode<T>, next: ListNode<T>);
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps<T>(node: ListNode<T>, n: number): ListNode<T>;
}
export default ListNode;
