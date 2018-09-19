import { ImmutableLinkedLoop } from './immutable-linked-loop';
declare class ImmutableListNode<T> {
    loop: ImmutableLinkedLoop<T>;
    item: T;
    prev: ImmutableListNode<T>;
    next: ImmutableListNode<T>;
    idx: number;
    /**
     * Representation of a linked loop vertex (i.e. node) having various edges, two
     * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
     * @param loop - The linked loop this node belongs to.
     * @param item - The actual item stored at a node.
     * @param prev - The previous item.
     * @param next - The next item.
     */
    constructor(loop: ImmutableLinkedLoop<T>, item: T, prev: ImmutableListNode<T>, next: ImmutableListNode<T>, idx: number);
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps<T>(node: ImmutableListNode<T>, n: number): ImmutableListNode<T>;
}
export { ImmutableListNode };
