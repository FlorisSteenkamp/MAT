import { ImmutableListNode } from './immutable-list-node';
/**
 * Represents a destructive (i.e. not functional) two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 * @param indx - Loop identifier.
 */
declare class ImmutableLinkedLoop<T> {
    items: T[];
    indx: number;
    head: ImmutableListNode<T>;
    constructor(items?: T[], indx?: number);
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    private addAllFromScratch(items);
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param item - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     * @param coupledNode - A node coupled to this one
     */
    insert(item: T, prev_: ImmutableListNode<T>, coupledNode?: ImmutableListNode<T>): ImmutableListNode<T>;
    /**
     *
     */
    forEach(f: (node: ImmutableListNode<T>) => void): void;
    /**
     *
     */
    getAsArray(): T[];
    /**
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n: number): ImmutableListNode<T>;
}
export { ImmutableLinkedLoop };
