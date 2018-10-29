import Node from './src/tree-node';
declare class LlRbTree<T> {
    private replaceDups;
    private compare;
    root: Node<T>;
    /**
     * @param compare
     * @param datas
     * @param replaceDups - If true then if a duplicate is inserted (as per the
     * equivalence relation induced by the compare) then replace it. If false
     * then instead keep an array of values at the relevant node.
     */
    constructor(compare: (a: T, b: T) => number, datas: T[], replaceDups: boolean);
    /**
     * Destructively sets the tree compare. This function can be used for for
     * e.g.the Bentley Ottmann algorithm.
     */
    setComparator(compare: (a: T, b: T) => number, replaceDups: boolean): void;
    isEmpty(): boolean;
    /**
     * Find the node in the tree with the given data using the tree compare
     * function.
     * @returns {Node} node or null if not found.
     */
    find(data: T): Node<T>;
    /**
     * .
     */
    toArrayInOrder(): Array<Node<T>>;
    /**
     * Inserts a node with the given data into the tree.
     */
    insert(data: T): void;
    /**
     * Removes an item from the tree based on the given data.
     * @param {LlRbTree} tree
     * @param {*} data
     * @param {boolean} all - If the data is an array, remove all.
     */
    remove(data: T, all: boolean): void;
    /**
     * Returns the two ordered nodes bounding the data. If the
     * data falls on a node, that node and the next (to the right) is
     * returned.
     * @returns {Node[]}
     */
    findBounds(data: T): Array<Node<T>>;
    /**
     * @param {LlRbTree} tree
     * @param {*} data
     * @returns {Node[]} The two ordered nodes bounding the data. If the
     * data falls on a node, returns the nodes before and after this one.
     */
    findBoundsExcl(data: T): Array<Node<T>>;
    /**
     *
     */
    findAllInOrder(data: T): Array<Node<T>>;
    private getMinOrMaxNode;
    getMinNode: (node: Node<T>) => Node<T>;
    getMaxNode: (node: Node<T>) => Node<T>;
    min(node: Node<T>): T | T[];
    max(node: Node<T>): T | T[];
}
export default LlRbTree;
