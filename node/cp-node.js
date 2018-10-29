"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("./contact-point");
const cp_node_for_debugging_1 = require("./debug/cp-node-for-debugging");
/** @private */
const EDGES = ['prev', 'next', 'prevOnCircle', 'nextOnCircle'];
/**
 * The primary class of the library.
 *
 * Since the MAT is a full representation of the shape boundary an instance of
 * this class contains both the information of a boundary point and a medial
 * axis point (and edge to the next point(s)). It also contains edges to other
 * [[CpNode]]s which allows for traversal of the MAT and thus implictly
 * represents the entire MAT.
 *
 * To get the maximal disk circle (of which the center is on the medial axis)
 * use [[cp]].circle.
 *
 * To get the boundary point, use [[cp]].pointOnShape.
 *
 * The edge, [[next]] (resp. [[prev]]) allows one to move anti-clockwise (resp.
 * clockwise) on the shape boundary to the next [[CpNode]]. This also imposes a
 * direction of traversal of the MAT edges and vertices.
 *
 * The edge [[nextOnCircle]] (resp. [[prevOnCircle]]) allows one to go
 * anti-clockwise (resp. clockwise) around the maximal disks implied by
 * the CpNode to the next maximal disk contact point. This is equivalent to
 * following other branches on the MAT.
 *
 * Each [[CpNode]] has a property, [[matCurveToNextVertex]], which is a bezier
 * curve from the maximal disk of this [[CpNode]] to the next [[CpNode]]'s
 * maximal disk and thus directly represents a piece of the medial axis.
 *
 * The getter, [[children]], returns the children of this [[CpNode]] when
 * seen as a MAT edge. Only children in a 'forward' direction are returned. These
 * include all edges except the 'backward' edge given by [[prevOnCircle]]. For
 * [[CpNode]]s having a maximal disk with 2 contact points (a 2-prong, the usual
 * case) the children will be the single edge [[next]]. For a 3-prong this will
 * be the edgese [[next]] and [[nextOnCircle]], etc. [[children]] allows one to
 * easily traverse the MAT tree - see e.g. the implementation of
 * [[traverseEdges]].
 *
 * [[vertexChildren]] is similar to [[children]] but returns the child nodes of
 * the tree when [[CpNode]] is seen as a MAT vertex point (as opposed to edge).
 * In this way the dual graph of the tree can easily be traversed - see e.g.
 * [[traverseVertices]]. Generally, however, traversing the edges is preferred
 * as it returns the entire Medial Axis (by utilizing [[matCurveToNextVertex]]
 * on each returned edge).
 *
 * It may be worth mentioning that by traversing from the CpNode by following
 * [[next]] repeatedly until one is back at the same CpNode allows one
 * to 'go around' the shape and at the same time traverse the MAT twice in
 * different directions.
 */
class CpNode {
    /**
     * Primarily for internal use.
     * @param cp The shape boundary contact point, i.e. a [[CpNode]] without its
     * edges.
     * @param prev The previous (going clockwise around the boundary) contact
     * point ([[CpNode]]).
     * @param next The next (going ant-clockwise around the boundary)
     * contact ([[CpNode]]).
     * @param prevOnCircle The previous [[CpNode]] (going clockwise around
     * the inscribed circle defined by the maximal disk).
     * @param nextOnCircle The next [[CpNode]] (going anti-clockwise around
     * the inscribed circle defined by the maximal disk).
     * @param matCurveToNextVertex The actual medial axis curve from this
     * [[CpNode]]'s maximal disk circle to the next [[CpNode]]'s circle. It is a
     * bezier curve of order 1, 2 or 3.
     * @param isHoleClosing If true, this [[CpNode]] belongs to a hole-closing
     * maximal disk.
     */
    constructor(cp, isHoleClosing, isIntersection, prev = undefined, next = undefined, prevOnCircle = undefined, nextOnCircle = undefined, matCurveToNextVertex = undefined) {
        this.cp = cp;
        this.isHoleClosing = isHoleClosing;
        this.isIntersection = isIntersection;
        this.prev = prev;
        this.next = next;
        this.prevOnCircle = prevOnCircle;
        this.nextOnCircle = nextOnCircle;
        this.matCurveToNextVertex = matCurveToNextVertex;
    }
    /**
     * Returns the children of this [[CpNode]] when seen as a MAT edge. Only
     * children in a 'forward' direction are returned. These include all edges
     * except the 'backward' edge given by [[prevOnCircle]].
     */
    get children() {
        let cp = this.next;
        if (this.isTerminating()) {
            return [];
        }
        let children = [cp];
        let cp_ = cp;
        while (cp_.nextOnCircle !== cp.prevOnCircle) {
            cp_ = cp_.nextOnCircle;
            children.push(cp_);
        }
        return children;
    }
    /**
     * Similar to [[children]] but returns the child nodes of the tree when
     * [[CpNode]] is seen as a MAT vertex point (as opposed to edge). In this
     * way the dual graph of the tree can easily be traversed - see e.g.
     * [[traverseVertices]]. Generally, however, traversing the edges is
     * preferred as it returns the entire Medial Axis (by utilizing
     * [[matCurveToNextVertex]] on each returned edge).
     */
    get vertexChildren() {
        if (this.isTerminating()) {
            return [];
        }
        let cp = this;
        let children = [];
        let cp_ = cp;
        while (cp_ !== cp.prevOnCircle) {
            if (!cp_.isTerminating()) {
                children.push(cp_.next);
            }
            cp_ = cp_.nextOnCircle;
        }
        return children;
    }
    /**
     * Returns all [[CpNode]]s on the MAT that this [[CpNode]] is part of
     * starting from the current one and going anti-clockwise around the shape.
     */
    getAllOnLoop() {
        let cpStart = this;
        let cps = [cpStart];
        let cp = this.next;
        while (cp !== cpStart) {
            cps.push(cp);
            cp = cp.next;
        }
        return cps;
    }
    /**
     * Returns a deep clone of this [[CpNode]]. Can be used to copy the MAT
     * since cloning a single [[CpNode]] necessarily implies cloning all
     * [[CpNode]]s on the same MAT tree.
     */
    clone() {
        // Don't change this function to be recursive, the call stack may 
        // overflow if there are too many CpNodes.
        let nodeMap = new Map();
        let cpNode = this;
        let newCpNode = new CpNode(cpNode.cp, cpNode.isHoleClosing, cpNode.isIntersection);
        newCpNode.matCurveToNextVertex = cpNode.matCurveToNextVertex;
        nodeMap.set(cpNode, newCpNode);
        let cpStack = [{ cpNode, newCpNode }];
        while (cpStack.length) {
            let { cpNode, newCpNode } = cpStack.pop();
            for (let edge of EDGES) {
                let node = cpNode[edge];
                let newNode = nodeMap.get(node);
                if (!newNode) {
                    newNode = new CpNode(node.cp, node.isHoleClosing, node.isIntersection);
                    newNode.matCurveToNextVertex = node.matCurveToNextVertex;
                    nodeMap.set(node, newNode);
                    cpStack.push({ cpNode: node, newCpNode: newNode });
                }
                newCpNode[edge] = newNode;
            }
        }
        return newCpNode;
    }
    /**
     * Primarily for internal use.
     *
     * Insert a [[CpNode]] into the MAT tree graph after the specified point
     * and returns the freshly inserted [[CpNode]].
     * @param isHoleClosing True if this is a hole closing contact point.
     * @param isIntersection True if this is a contact point at a shape boundary
     * intersection point.
     * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
     * @param cp - [[ContactPoint]] defining the [[CpNode]].
     * @param prev_ - Inserts the new [[CpNode]] right after this item if the
     * loop is not empty, else insert the new [[CpNode]] as the only item in the
     * loop.
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
    /**
     * Primarily for internal use.
     *
     * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
     * @param cpNode The [[CpNode]] to remove.
     */
    remove(cpTree, cpNode) {
        let prev = cpNode.prev;
        let next = cpNode.next;
        prev.next = next;
        next.prev = prev;
        cpTree.remove(cpNode, false);
    }
    /**
     * Return this (except if exclThis is truthy) and the the other CpNodes
     * around the maximal disk vertex circle in an anti-clockwise order.
     * @param exclThis If true the returned array does not include this
     * [[CpNode]].
     */
    getCpNodesOnCircle(exclThis = false) {
        let startCp = this;
        let cp = startCp;
        let cps = [];
        do {
            if (exclThis) {
                exclThis = false;
            }
            else {
                cps.push(cp);
            }
            cp = cp.nextOnCircle;
        } while (cp !== startCp);
        return cps;
    }
    /**
     * Returns true if the 2 given [[CpNode]]s are on the same maximal disk
     * circle.
     * @param cpNode1 A [[CpNode]].
     * @param cpNode2 Another [[CpNode]]
     */
    static isOnSameCircle(cpNode1, cpNode2) {
        let cpNodes = cpNode1.getCpNodesOnCircle(true);
        return cpNodes.indexOf(cpNode2) >= 0;
    }
    /**
     * Returns true if this [[CpNode]] is terminating, i.e. implies a leaf MAT
     * vertex.
     *
     * This is always the case for sharp corners and maximal disks with
     * a single contact point. Note, however, that even in these cases there are
     * two contact points stored (sitting 'on top' of each other) for the
     * maximal disk. It can be seen as a limiting case of a two-prong where the
     * distance between two of the contact points tend to zero. One point
     * (represented by a [[CpNode]] of course) will be terminating with the
     * other point being its [[next]], whereas the other point will *not* be
     * terminating and 'points' back into the shape.
     */
    isTerminating() {
        return this === this.next.prevOnCircle;
    }
    /**
     * Returns true if this [[CpNode]] represents a sharp corner, i.e. the
     * limiting case of a two-prong having zero radius.
     *
     * Note that two [[CpNode]]s are stored for each sharp corner, one being
     * terminating and one not. See [[isTerminating]] for more details.
     */
    isSharp() {
        return this.cp.circle.radius === 0;
    }
    /**
     * Returns true if this [[CpNode]]'s maximal disk has only one contact point
     * on the shape boundary (up to planar coordinates). These includes sharp
     * corners.
     *
     * Note, however, that two [[CpNode]]s are stored for each such point to
     * preserve symmetry - see [[isTerminating]] for more details.
     */
    isOneProng() {
        let cp1 = this;
        if (cp1.cp.circle.radius === 0) {
            return true;
        }
        let cp2 = cp1.nextOnCircle;
        let p1 = cp1.cp.pointOnShape.p;
        let p2 = cp2.cp.pointOnShape.p;
        return (p1[0] === p2[0] && p1[1] === p2[1]);
    }
    /**
     * Returns the number of contact points on the maximal disk circle implied
     * by this [[CpNode]].
     *
     * Note, however, that even one-prongs and sharp corners will return 2 (see
     * [[isTerminating]] for more details); if this is not desired use
     * [[getRealProngCount]] instead which will return 1 in these cases.
     */
    getProngCount() {
        let startCp = this;
        let cp = startCp;
        let i = 0;
        do {
            i++;
            cp = cp.nextOnCircle;
        } while (cp !== startCp);
        return i;
    }
    /**
     * Returns the number of contact points (up to planar coordinates) on the
     * maximal disk circle implied by this [[CpNode]].
     *
     * See also [[getProngCount]].
     */
    getRealProngCount() {
        if (this.isOneProng()) {
            return 1;
        }
        return this.getProngCount();
    }
}
/**
 * Primarily for internal use.
 *
 * Compares the order of two [[CpNode]]s. The order is cyclic and depends
 * on a [[CpNode]]'s relative position along the shape boundary.
 */
CpNode.comparator = (a, b) => contact_point_1.ContactPoint.compare(a.cp, b.cp);
exports.CpNode = CpNode;
//# sourceMappingURL=cp-node.js.map