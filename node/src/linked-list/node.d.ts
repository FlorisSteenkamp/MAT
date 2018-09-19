import { Loop } from './loop';
declare class Node<T> {
    loop: Loop<T>;
    item: T;
    prev: Node<T>;
    next: Node<T>;
    idx: number;
    /**
     * Representation of a linked loop vertex (i.e. node) having various edges, two
     * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
     * @param loop - The linked loop this node belongs to.
     * @param item - The actual item stored at a node.
     * @param prev - The previous item.
     * @param next - The next item.
     */
    constructor(loop: Loop<T>, item: T, prev: Node<T>, next: Node<T>, idx: number);
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps<T>(node: Node<T>, n: number): Node<T>;
}
export { Node };
