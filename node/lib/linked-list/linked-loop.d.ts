import LlRbTree from 'flo-ll-rb-tree';
import ListNode from './list-node';
/**
 * Represents a destructive (i.e. not functional) two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 * @param indx - Loop identifier.
 */
declare class LinkedLoop<T> {
    items: T[];
    cptree: LlRbTree<ListNode<T>>;
    indx: number;
    head: ListNode<T>;
    constructor(items: T[], comparator?: (a: ListNode<T>, b: ListNode<T>) => number, indx?: number);
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    private addAllFromScratch(arr);
    /**
     * Insert an item into the linked loop after the specified point.
     * @param item - Item to insert
     * @param prev - Inserts the new item right after this item
     * @param coupledNode - A node coupled to this one
     */
    insert(item: T, prev_: ListNode<T>, coupledNode?: ListNode<T>): ListNode<T>;
    /**
     * Removes a node from the linked loop.
     */
    remove(node: ListNode<T>): void;
    /**
     *
     */
    getAsArray(): T[];
    /**
     *
     */
    forEach(f: (node: ListNode<T>) => void): void;
    /**
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n: number): ListNode<T>;
}
export default LinkedLoop;
