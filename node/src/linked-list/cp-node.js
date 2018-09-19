"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of a ContactPoint node having various edges, two of which
 * enforce an ordering on the nodes, i.e. 'prev' and 'next'.
 */
class CpNode {
    /**
     * @param graph - The linked loop this node belongs to.
     * @param cp - The actual item stored at a node.
     * @param prev - The previous item.
     * @param next - The next item.
     */
    constructor(graph, cp, prev, next) {
        this.cpGraph = graph;
        this.cp = cp;
        this.prev = prev;
        this.next = next;
    }
    getCps() {
        let startCp = this;
        let cp = startCp.nextOnCircle;
        let cps = [startCp];
        while (cp !== startCp) {
            cps.push(cp);
            cp = cp.nextOnCircle;
        }
        return cps;
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
        let cpNode = this;
        return cpNode.cp.circle.radius === 0;
    }
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
        let p1 = cp.cp.pointOnShape.p;
        let p2 = cp2.cp.pointOnShape.p;
        return (p1[0] === p2[0] && p1[1] === p2[1]);
    }
    isThreeProng() {
        let cp = this;
        return cp.getCps().length === 3;
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
exports.CpNode = CpNode;
