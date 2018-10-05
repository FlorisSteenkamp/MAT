"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("./contact-point");
const cp_node_for_debugging_1 = require("./debug/cp-node-for-debugging");
const EDGES = ['prev', 'next', 'prevOnCircle', 'nextOnCircle'];
/**
 * Representation of a ContactPoint node having various edges, two of which
 * ('prev' and 'next') enforce a cyclic ordering on the CpNodes.
 */
class CpNode {
    /**
     * @param cp The actual item stored at a node
     * @param prev The previous contact point on the boundary
     * @param next The next contact point on the boundary
     * @param prevOnCircle The previous contact point on the inscribed circle
     * @param prev The next contact point on the inscribed circle
     * @param matCurve The actual medial axis curve from this ContactPoint's
     * circle to the next ContactPoint's circle. It is a bezier curve of order
     * 1 to 3.
     * @param isHoleClosing
     */
    constructor(cp, isHoleClosing, isIntersection, prev = undefined, next = undefined, prevOnCircle = undefined, nextOnCircle = undefined, matCurve = undefined) {
        this.cp = cp;
        this.isHoleClosing = isHoleClosing;
        this.isIntersection = isIntersection;
        this.prev = prev;
        this.next = next;
        this.prevOnCircle = prevOnCircle;
        this.nextOnCircle = nextOnCircle;
        this.matCurve = matCurve;
    }
    clone() {
        // Don't change this function to be recursive, the call stack may 
        // overflow if there are too many CpNodes.
        let nodeMap = new Map();
        let cpNode = this;
        let newCpNode = new CpNode(cpNode.cp, cpNode.isHoleClosing, cpNode.isIntersection);
        newCpNode.matCurve = cpNode.matCurve;
        nodeMap.set(cpNode, newCpNode);
        let cpStack = [{ cpNode, newCpNode }];
        while (cpStack.length) {
            let { cpNode, newCpNode } = cpStack.pop();
            for (let edge of EDGES) {
                let node = cpNode[edge];
                let newNode = nodeMap.get(node);
                if (!newNode) {
                    newNode = new CpNode(node.cp, node.isHoleClosing, node.isIntersection);
                    newNode.matCurve = node.matCurve;
                    nodeMap.set(node, newNode);
                    cpStack.push({ cpNode: node, newCpNode: newNode });
                }
                newCpNode[edge] = newNode;
            }
        }
        return newCpNode;
    }
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param cp - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     */
    static insert(isHoleClosing, isIntersection, cpTree, cp, prev_) {
        let cpNode = new CpNode(cp, isHoleClosing, isIntersection);
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.elems.cpNode.push(new cp_node_for_debugging_1.CpNodeForDebugging(_debug_.generated, cpNode));
        }
        let prev;
        let next;
        if (!prev_) {
            prev = cpNode;
            next = cpNode;
        }
        else {
            prev = prev_;
            next = prev.next;
        }
        next.prev = cpNode;
        prev.next = cpNode;
        cpNode.prev = prev;
        cpNode.next = next;
        cpTree.insert(cpNode);
        return cpNode;
    }
    remove(cpTree, cpNode) {
        let prev = cpNode.prev;
        let next = cpNode.next;
        prev.next = next;
        next.prev = prev;
        cpTree.remove(cpNode, false);
    }
    /**
     * Return this and the the other CpNodes around the vertex circle in order.
     */
    getNodes() {
        let startCp = this;
        let cp = startCp;
        let cps = [];
        do {
            cps.push(cp);
            cp = cp.nextOnCircle;
        } while (cp !== startCp);
        return cps;
    }
    isTerminating() {
        let cp = this;
        return cp === cp.next.prevOnCircle;
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
        return cp.getNodes().length === 3;
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
CpNode.comparator = (a, b) => contact_point_1.ContactPoint.compare(a.cp, b.cp);
exports.CpNode = CpNode;
