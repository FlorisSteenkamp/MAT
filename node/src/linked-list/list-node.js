"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO - refactor to graph - this is used for both cps and bezierloops
class ListNode {
    /**
     * Representation of a linked loop vertex (i.e. node) having various edges, two
     * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
     * @param loop - The linked loop this node belongs to.
     * @param item - The actual item stored at a node.
     * @param prev - The previous item.
     * @param next - The next item.
     */
    constructor(loop, item, prev, next, idx) {
        // TODO - we should really subclass linked-loop and/or list-node as the 
        // below only applies to the segregated shape pieces
        this.prevOnCircle = undefined;
        this.nextOnCircle = undefined;
        this.loop = loop;
        this.item = item;
        this.prev = prev;
        this.next = next;
        this.idx = idx;
    }
    getNext() {
        let cp = this;
        return cp.isTerminating()
            ? undefined
            : cp.next;
    }
    isTerminating() {
        let cp = this;
        return cp === cp.next.prevOnCircle;
    }
    // TODO - currently will also include terminating two-prongs
    isHoleClosing() {
        let cp = this;
        if (cp.isOneProng() || cp.isThreeProng()) {
            return false;
        }
        return cp.isTerminating();
    }
    isSharp() {
        let cp = this;
        return cp.item.vertex.circle.radius === 0;
    }
    // TODO - refactor
    /**
     * Returns true if this ListNode is a one-prong (including
     * sharp corners).
     */
    isOneProng() {
        let cp = this;
        if (cp.isSharp()) {
            return true;
        }
        if (cp.isThreeProng()) {
            return false;
        }
        let cp2 = cp.nextOnCircle;
        let p1 = cp.item.pointOnShape.p;
        let p2 = cp2.item.pointOnShape.p;
        return (p1[0] === p2[0] && p1[1] === p2[1]);
    }
    isThreeProng() {
        let cp = this;
        return cp.item.vertex.cps.length === 3;
    }
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps(node, n) {
        for (let i = 0; i < n; i++) {
            node = node.next;
        }
        return node;
    }
}
exports.ListNode = ListNode;
