import { compareCps } from '../contact-point/contact-point.js';
import { removeCpNode } from './remove.js';
import { getCurveToNext } from './get-curve-to-next.js';
import { createCpNode } from './create-cp-node.js';
/**
 * Returns the bezier curve from the maximal disk of this [[CpNode]] to the
 * next [[CpNode]]'s maximal disk and thus directly represents a piece of the
 * medial axis.
 * @deprecated Use [[getCurveToNext]] instead
 * @param cpNode
 */
function matCurveToNextVertex(cpNode) {
    return getCurveToNext(cpNode);
}
/**
 * Primarily for internal use.
 *
 * Compares the order of two [[CpNode]]s. The order is cyclic and depends
 * on a [[CpNode]]'s relative position along the shape boundary.
 */
const cpNodeComparator = (a, b) => compareCps(a.cp, b.cp);
/**
 * Returns the children of this [[CpNode]] when seen as a MAT edge. Only
 * children in a 'forward' direction are returned. These include all edges
 * except the 'backward' edge given by [[prevOnCircle]], even terminating
 * edges.
 */
function getChildren(cpNode) {
    const children = [];
    const cp = cpNode.next;
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
function vertexChildren(cpNode) {
    if (isTerminating(cpNode)) {
        return [];
    }
    const children = [];
    let cp_ = cpNode;
    while (cp_ !== cpNode.prevOnCircle) {
        if (!isTerminating(cp_)) {
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
function getAllOnLoop(cpNode) {
    const cpStart = cpNode;
    const cpNodes = [cpStart];
    let cpNode_ = cpNode.next;
    while (cpNode_ !== cpStart) {
        cpNodes.push(cpNode_);
        cpNode_ = cpNode_.next;
    }
    return cpNodes;
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
function insertCpNode(isHoleClosing, isIntersection, cpTree, cp, prev_) {
    // const cpNode = new CpNode(cp, isHoleClosing, isIntersection);
    const cpNode = createCpNode(cp, isHoleClosing, isIntersection);
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
function getCpNodesOnCircle(cpNode, exclThis = false) {
    // const startCp = this as CpNode;
    const startCpNode = cpNode;
    let cpNode_ = startCpNode;
    const cpNodes = [];
    do {
        if (exclThis) {
            exclThis = false;
        }
        else {
            cpNodes.push(cpNode_);
        }
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode);
    return cpNodes;
}
/**
 * Returns true if the 2 given [[CpNode]]s are on the same maximal disk
 * circle.
 * @param cpNode1 A [[CpNode]].
 * @param cpNode2 Another [[CpNode]]
 */
function isOnSameCircle(cpNode1, cpNode2) {
    const cpNodes = getCpNodesOnCircle(cpNode1, true);
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
function isTerminating(cpNode) {
    // return this === this.next.prevOnCircle;
    return cpNode === cpNode.next.prevOnCircle;
}
/**
 * Like isTerminating() but only returns true if all cpNodes on the circle
 * (except this.prevOnCircle) is terminating.
 */
function isFullyTerminating(cpNode) {
    const otherOnCircle = getCpNodesOnCircle(cpNode.prevOnCircle, true);
    const isFullyTerminating = otherOnCircle.every(cpn => isTerminating(cpn));
    return isFullyTerminating;
}
/**
 * Returns the first [[CpNode]] (from this one by successively applying
 * .nextOnCircle) that exits the circle.
 */
function getFirstExit(cpNode) {
    // const startNode = this as CpNode;
    const startNode = cpNode;
    let cpNode_ = startNode;
    while (cpNode_.next === cpNode_.prevOnCircle) {
        cpNode_ = cpNode_.next;
        if (cpNode_ === startNode) {
            // The very special case the MAT is a single point.
            return undefined;
        }
    }
    return cpNode_;
}
/**
 * Returns true if this [[CpNode]] represents a sharp corner, i.e. the
 * limiting case of a two-prong having zero radius.
 *
 * Note that two [[CpNode]]s are stored for each sharp corner, one being
 * terminating and one not. See [[isTerminating]] for more details.
 */
function isSharp(cpNode) {
    return cpNode.cp.circle.radius === 0;
}
/**
 * Returns the number of contact points on the maximal disk circle implied
 * by this [[CpNode]].
 *
 * Note, however, that even one-prongs and sharp corners will return 2 (see
 * [[isTerminating]] for more details); if this is not desired use
 * [[getRealProngCount]] instead which will return 1 in these cases.
 */
function getProngCount(cpNode) {
    // const startCp = this as CpNode;
    const startCpNode = cpNode;
    let cpNode_ = startCpNode;
    let i = 0;
    do {
        i++;
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode);
    return i;
}
/**
 * Returns the number of contact points (up to planar coordinates) on the
 * maximal disk circle implied by this [[CpNode]].
 *
 * See also [[getProngCount]].
 */
function getRealProngCount(cpNode) {
    if (isOneProng(cpNode)) {
        return 1;
    }
    return getProngCount(cpNode);
}
/**
 * Returns true if this [[CpNode]]'s maximal disk has only one contact point
 * on the shape boundary (up to planar coordinates). These includes sharp
 * corners.
 *
 * Note, however, that two [[CpNode]]s are stored for each such point to
 * preserve symmetry - see [[isTerminating]] for more details.
 */
function isOneProng(cpNode) {
    const cp1 = cpNode;
    if (cp1.cp.circle.radius === 0) {
        return true;
    }
    const cp2 = cp1.nextOnCircle;
    const p1 = cp1.cp.pointOnShape.p;
    const p2 = cp2.cp.pointOnShape.p;
    return (p1[0] === p2[0] && p1[1] === p2[1]);
}
export { matCurveToNextVertex, getChildren, vertexChildren, getAllOnLoop, insertCpNode, getCpNodesOnCircle, isOnSameCircle, isTerminating, isFullyTerminating, getFirstExit, isSharp, isOneProng, getProngCount, getRealProngCount, cpNodeComparator, removeCpNode };
//# sourceMappingURL=cp-node.js.map