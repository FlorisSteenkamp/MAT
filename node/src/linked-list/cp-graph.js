"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_ll_rb_tree_1 = require("flo-ll-rb-tree");
const cp_node_1 = require("./cp-node");
const contact_point_1 = require("../mat/classes/contact-point");
function comparator(a, b) {
    return contact_point_1.ContactPoint.compare(a.cp, b.cp);
}
/**
 * Represents a specialised linked graph made for ContactPoints.
 */
class CpGraph {
    /**
     * @param cps - A pre-ordered array of items to add initially; it is
     * faster to add items initially than to add them in a loop with insert.
     */
    constructor(cps = []) {
        this.cptree = new flo_ll_rb_tree_1.default(comparator, [], true);
        this.addAllFromScratch(cps);
    }
    /**
     * Returns the boundary piece that starts at the immediate previous point on
     * the shape and ends at the immediate next point.
     */
    static getNeighbouringPoints(cpGraph, pos, order, order2) {
        let cptree = cpGraph.cptree;
        // TODO - ugly - improve code
        let cps = cptree.findBounds(new cp_node_1.CpNode(undefined, new contact_point_1.ContactPoint(pos, undefined, order, order2), undefined, undefined));
        if (!cps[0] && !cps[1]) {
            // The tree is still empty
            return [undefined, undefined];
        }
        if (!cps[0] || !cps[1]) {
            // Smaller than all -> cptree.min() === cps[1].data OR
            // Larger than all -> cptree.max() === cps[0].data
            return [
                cptree.max(cptree.root),
                cptree.min(cptree.root)
            ];
        }
        return [
            cps[0].data,
            cps[1].data
        ];
    }
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    addAllFromScratch(cps) {
        if (cps.length === 0) {
            return;
        }
        let head;
        let prev = null;
        let cpNode;
        for (let i = 0; i < cps.length; i++) {
            cpNode = new cp_node_1.CpNode(this, cps[i], prev, null);
            if (prev) {
                prev.next = cpNode;
            }
            prev = cpNode;
            if (i === 0) {
                head = cpNode;
            }
            if (this.cptree) {
                this.cptree.insert(cpNode);
            }
            ;
        }
        // Close loop
        head.prev = cpNode;
        cpNode.next = head;
        this.head = head;
    }
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param cp - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     */
    insert(cp, prev_) {
        let cpGraph = this;
        let cpNode = new cp_node_1.CpNode(cpGraph, cp, undefined, undefined);
        let prev;
        let next;
        if (!cpGraph.head) {
            prev = cpNode;
            next = cpNode;
            cpGraph.head = cpNode;
        }
        else {
            prev = prev_;
            next = prev.next;
        }
        next.prev = cpNode;
        prev.next = cpNode;
        cpNode.prev = prev;
        cpNode.next = next;
        if (cpGraph.cptree) {
            cpGraph.cptree.insert(cpNode);
        }
        ;
        return cpNode;
    }
    /**
     * Removes a node from the linked loop.
     */
    remove(cpNode) {
        let cpGraph = this;
        let prev = cpNode.prev;
        let next = cpNode.next;
        if (cpNode === cpGraph.head) {
            cpGraph.head = next;
        }
        prev.next = next;
        next.prev = prev;
        if (cpGraph.cptree) {
            cpGraph.cptree.remove(cpNode, false);
        }
        ;
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
        return cp_node_1.CpNode.advanceNSteps(loop.head, n);
    }
}
exports.CpGraph = CpGraph;
