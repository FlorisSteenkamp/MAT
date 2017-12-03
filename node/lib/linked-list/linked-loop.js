"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_ll_rb_tree_1 = require("flo-ll-rb-tree");
const list_node_1 = require("./list-node");
/**
 * Represents a destructive (i.e. not functional) two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 * @param indx - Loop identifier.
 */
class LinkedLoop {
    constructor(items, comparator, indx) {
        if (comparator) {
            this.cptree = new flo_ll_rb_tree_1.default(comparator, [], true);
        }
        this.indx = indx;
        this.addAllFromScratch(items || []);
    }
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    addAllFromScratch(arr) {
        if (arr.length === 0) {
            return;
        }
        let head;
        let prevNode = null;
        let node;
        for (let i = 0; i < arr.length; i++) {
            node = new list_node_1.default(this, arr[i], prevNode, null);
            if (prevNode) {
                prevNode.next = node;
            }
            prevNode = node;
            if (i === 0) {
                head = node;
            }
            if (this.cptree) {
                this.cptree.insert(node);
            }
            ;
        }
        // Close loop
        head.prev = node;
        node.next = head;
        this.head = head;
    }
    /**
     * Insert an item into the linked loop after the specified point.
     * @param item - Item to insert
     * @param prev - Inserts the new item right after this item
     * @param coupledNode - A node coupled to this one
     */
    insert(item, prev_, coupledNode = undefined) {
        let loop = this;
        let node = new list_node_1.default(loop, item, undefined, undefined);
        let prev;
        let next;
        if (!loop.head) {
            prev = node;
            next = node;
            loop.head = node;
        }
        else {
            prev = prev_;
            next = prev.next;
        }
        next.prev = node;
        prev.next = node;
        node.prev = prev;
        node.next = next;
        node.coupledNode = coupledNode;
        if (loop.cptree) {
            loop.cptree.insert(node);
        }
        ;
        return node;
    }
    /**
     * Removes a node from the linked loop.
     */
    remove(node) {
        let loop = this;
        let prev = node.prev;
        let next = node.next;
        if (node === loop.head) {
            loop.head = next;
        }
        prev.next = next;
        next.prev = prev;
        if (loop.cptree) {
            loop.cptree.remove(node, false); // TODO, make the second parameter default
        }
        ;
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
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n) {
        let loop = this;
        return list_node_1.default.advanceNSteps(loop.head, n);
    }
}
exports.default = LinkedLoop;
