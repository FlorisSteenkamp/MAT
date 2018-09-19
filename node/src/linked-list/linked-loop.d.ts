import LlRbTree from 'flo-ll-rb-tree';
import { ListNode } from './list-node';
import { ContactPoint } from '../mat/classes/contact-point';
/**
 * Represents a destructive (i.e. not functional) two-way linked loop.
 */
declare class LinkedLoop {
    items: ContactPoint[];
    cptree: LlRbTree<ListNode>;
    indx: number;
    comparator: (a: ListNode, b: ListNode) => number;
    head: ListNode;
    /**
     * @param items - A pre-ordered array of items to add initially; it is
     * faster to add items initially than to add them in a loop with insert.
     * @param comparator - Tree item comparator
     * @param indx - Loop identifier
     */
    constructor(items?: ContactPoint[], comparator?: (a: ListNode, b: ListNode) => number, indx?: number);
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    private addAllFromScratch(arr);
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param item - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     */
    insert(item: ContactPoint, prev_: ListNode): ListNode;
    /**
     * Removes a node from the linked loop.
     */
    remove(node: ListNode): void;
    /**
     *
     */
    getAsArray(): ContactPoint[];
    /**
     *
     */
    forEach(f: (node: ListNode) => void): void;
    /**
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n: number): ListNode;
}
export { LinkedLoop };
