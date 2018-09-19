"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const curve_1 = require("./curve");
/**
 * Represents a two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 */
class Loop {
    constructor(items = []) {
        this.items = items;
        this.head = this.addAllFromScratch(items);
    }
    /**
     * Adds all given items from scratch onto the empty LinkedLoop and returns
     * the head item.
     */
    addAllFromScratch(items) {
        let loop = this;
        if (items.length === 0) {
            return undefined;
        }
        let head;
        let prev = null;
        let node;
        for (let i = 0; i < items.length; i++) {
            node = new curve_1.Curve(loop, items[i], prev, null, i);
            if (prev) {
                prev.next = node;
            }
            prev = node;
            if (i === 0) {
                head = node;
            }
        }
        // Close loop
        head.prev = node;
        node.next = head;
        return head;
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
        return curve_1.Curve.advanceNSteps(loop.head, n);
    }
}
exports.Loop = Loop;
