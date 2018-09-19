"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_list_node_1 = require("./immutable-list-node");
/**
 * Represents a destructive (i.e. not functional) two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 * @param indx - Loop identifier.
 */
class ImmutableLinkedLoop {
    constructor(items = [], indx) {
        this.indx = indx;
        this.items = items;
        this.addAllFromScratch(items);
    }
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    addAllFromScratch(items) {
        if (items.length === 0) {
            return;
        }
        let head;
        let prevNode = null;
        let node;
        for (let i = 0; i < items.length; i++) {
            node = new immutable_list_node_1.ImmutableListNode(this, items[i], prevNode, null, i);
            if (prevNode) {
                prevNode.next = node;
            }
            prevNode = node;
            if (i === 0) {
                head = node;
            }
        }
        // Close loop
        head.prev = node;
        node.next = head;
        this.head = head;
    }
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param item - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     * @param coupledNode - A node coupled to this one
     */
    insert(item, prev_, coupledNode = undefined) {
        let loop = this;
        let node = new immutable_list_node_1.ImmutableListNode(loop, item, undefined, undefined, undefined);
        let prev;
        let next;
        let idx;
        if (!loop.head) {
            prev = node;
            next = node;
            idx = 0;
            loop.head = node;
        }
        else {
            prev = prev_;
            next = prev.next;
            idx = prev.idx + 1;
        }
        next.prev = node;
        prev.next = node;
        node.prev = prev;
        node.next = next;
        node.idx = idx;
        return node;
    }
    /**
     *
     */
    forEach(f) {
        let loop = this;
        let node = loop.head;
        do {
            f(node);
            node = node.next;
        } while (node !== loop.head);
    }
    /**
     *
     */
    getAsArray() {
        let loop = this;
        let nodes = [];
        let node = loop.head;
        do {
            nodes.push(node.item);
            node = node.next;
        } while (node !== loop.head);
        return nodes;
    }
    /**
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n) {
        let loop = this;
        return immutable_list_node_1.ImmutableListNode.advanceNSteps(loop.head, n);
    }
}
exports.ImmutableLinkedLoop = ImmutableLinkedLoop;
