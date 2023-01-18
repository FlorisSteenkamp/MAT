import { compareCps } from './contact-point.js';
import { removeCpNode } from './cp-node/remove.js';
import { getCurveToNext } from './get-curve-to-next.js';
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
 * The edge [[next]] (resp. [[prev]]) allows one to move anti-clockwise (resp.
 * clockwise) on the shape boundary to the next [[CpNode]]. This also imposes a
 * direction of traversal of the MAT edges and vertices.
 *
 * The edge [[nextOnCircle]] (resp. [[prevOnCircle]]) allows one to go
 * anti-clockwise (resp. clockwise) around the maximal disks implied by
 * the CpNode to the next maximal disk contact point. This is equivalent to
 * following other branches on the MAT.
 *
 * Call [[getCurveBetween]](cpNodeFrom, cpNodeTo) or getCurveToNext(cpNode)
 * (replacing the older CpNode.[[matCurveToNextVertex]]) to get a bezier curve
 * from the maximal disk of this [[CpNode]] to the next [[CpNode]]'s
 * maximal disk and thus directly representing a piece of the medial axis.
 *
 * The function, [[getChildren]], returns the children of this [[CpNode]] when
 * seen as a MAT edge. Only children in a 'forward' direction are returned. These
 * include all edges except the 'backward' edge given by [[prevOnCircle]]. For
 * [[CpNode]]s having a maximal disk with 2 contact points (a 2-prong, the usual
 * case) the children will be the single edge [[next]]. For a 3-prong this will
 * be the edges [[next]] and [[nextOnCircle]], etc. [[getChildren]] allows one to
 * easily traverse the MAT tree - see e.g. the implementation of [[traverseEdges]].
 *
 * The getter, [[vertexChildren]], is similar to [[getChildren]] but returns the
 * child nodes of the tree when [[CpNode]] is seen as a MAT vertex point (as
 * opposed to edge). In this way the dual graph of the tree can easily be
 * traversed - see e.g. [[traverseVertices]]. Generally, however, traversing the
 * edges is preferred as it returns the entire Medial Axis (by utilizing
 * [[getCurveToNext]] on each returned edge).
 *
 * It may be worth mentioning that by traversing from the CpNode by following
 * [[next]] repeatedly until one is back at the same CpNode allows one
 * to 'go around' the shape boundary and at the same time traverse the MAT twice
 * in opposite directions.
 */
class CpNode {
    /**
     * Primarily for internal use.
     * @param cp The shape boundary contact point, i.e. a [[CpNode]] without its
     * edges.
     * @param isHoleClosing If true, this [[CpNode]] belongs to a hole-closing
     * maximal disk.
     * @param isIntersection true if this cpNode is at a shape boundary
     * intersection point, false otherwise
     * @param prev The previous (going clockwise around the boundary) contact
     * point ([[CpNode]]).
     * @param next The next (going anti-clockwise around the boundary) contact
     * point ([[CpNode]]).
     * @param prevOnCircle The previous [[CpNode]] (going clockwise around
     * the inscribed circle defined by the maximal disk).
     * @param nextOnCircle The next [[CpNode]] (going anti-clockwise around
     * the inscribed circle defined by the maximal disk).
     */
    constructor(cp, isHoleClosing, isIntersection, prev = undefined, next = undefined, prevOnCircle = undefined, nextOnCircle = undefined) {
        this.cp = cp;
        this.isHoleClosing = isHoleClosing;
        this.isIntersection = isIntersection;
        this.prev = prev;
        this.next = next;
        this.prevOnCircle = prevOnCircle;
        this.nextOnCircle = nextOnCircle;
    }
    /**
     * Returns the bezier curve from the maximal disk of this [[CpNode]] to the
     * next [[CpNode]]'s maximal disk and thus directly represents a piece of the
     * medial axis.
     * @deprecated Use [[getCurveToNext]] instead
     * @param cpNode
     */
    get matCurveToNextVertex() {
        return getCurveToNext(this);
    }
    /**
     * Returns the children of this [[CpNode]] when seen as a MAT edge. Only
     * children in a 'forward' direction are returned. These include all edges
     * except the 'backward' edge given by [[prevOnCircle]], even terminating
     * edges.
     */
    getChildren() {
        const children = [];
        const cp = this.next;
        let cp_ = cp;
        do {
            children.push(cp_);
            cp_ = cp_.nextOnCircle;
        } while (cp_.nextOnCircle !== cp);
        return children;
    }
    /**
     * Similar to [[getChildren]] but returns the child nodes of the tree when
     * [[CpNode]] is seen as a MAT vertex point (as opposed to edge). In this
     * way the dual graph of the tree can easily be traversed - see e.g.
     * [[traverseVertices]]. Generally, however, traversing the edges is
     * preferred as it returns the entire Medial Axis (by utilizing
     * [[getCurveToNext]] on each returned edge).
     */
    get vertexChildren() {
        if (this.isTerminating()) {
            return [];
        }
        const cp = this;
        const children = [];
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
        const cpStart = this;
        const cps = [cpStart];
        let cp = this.next;
        while (cp !== cpStart) {
            cps.push(cp);
            cp = cp.next;
        }
        return cps;
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
     * @param cp [[ContactPoint]] defining the [[CpNode]].
     * @param prev_ Inserts the new [[CpNode]] right after this item if the
     * loop is not empty, else insert the new [[CpNode]] as the only item in the
     * loop.
     */
    static insert(isHoleClosing, isIntersection, cpTree, cp, prev_) {
        const cpNode = new CpNode(cp, isHoleClosing, isIntersection);
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.elems.cpNode.push({
                generated: _debug_.generated,
                cpNode
            });
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
     * Return this (except if exclThis is truthy) and the the other CpNodes
     * around the maximal disk vertex circle in an anti-clockwise order.
     * @param exclThis If true the returned array does not include this
     * [[CpNode]].
     */
    getCpNodesOnCircle(exclThis = false) {
        const startCp = this;
        let cp = startCp;
        const cps = [];
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
        const cpNodes = cpNode1.getCpNodesOnCircle(true);
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
     * Like isTerminating() but only returns true if all cpNodes on the circle
     * (except this.prevOnCircle) is terminating.
     */
    isFullyTerminating() {
        const otherOnCircle = this.prevOnCircle.getCpNodesOnCircle(true);
        const isFullyTerminating = otherOnCircle.every(cpNode => cpNode.isTerminating());
        return isFullyTerminating;
    }
    /**
     * Returns the first [[CpNode]] (from this one by successively applying
     * .nextOnCircle) that exits the circle.
     */
    getFirstExit() {
        const startNode = this;
        let cpNode = startNode;
        while (cpNode.next === cpNode.prevOnCircle) {
            cpNode = cpNode.next;
            if (cpNode === startNode) {
                // The very special case the MAT is a single point.
                return undefined;
            }
        }
        return cpNode;
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
        const cp1 = this;
        if (cp1.cp.circle.radius === 0) {
            return true;
        }
        const cp2 = cp1.nextOnCircle;
        const p1 = cp1.cp.pointOnShape.p;
        const p2 = cp2.cp.pointOnShape.p;
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
        const startCp = this;
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
CpNode.comparator = (a, b) => compareCps(a.cp, b.cp);
CpNode.remove = removeCpNode;
export { CpNode };
//# sourceMappingURL=cp-node.js.map