import { LlRbTree } from 'flo-ll-rb-tree';
import { ContactPoint } from './contact-point.js';
import { removeCpNode } from './cp-node/remove.js';
/**
 * The primary interface of the library.
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
interface CpNode {
    /** The shape boundary contact point, i.e. a [[CpNode]] without its edges. */
    cp: ContactPoint;
    /** If true, this [[CpNode]] belongs to a hole-closing maximal disk. */
    isHoleClosing: boolean;
    /** true if this cpNode is at a shape boundary intersection point, false otherwise */
    isIntersection: boolean;
    /** The previous (going clockwise around the boundary) contact point ([[CpNode]]).*/
    prev: CpNode;
    /** The next (going anti-clockwise around the boundary) contact point ([[CpNode]]). */
    next: CpNode;
    /**
     * The previous [[CpNode]] (going clockwise around the inscribed circle
     * defined by the maximal disk).
     */
    prevOnCircle: CpNode;
    /**
     * The next [[CpNode]] (going anti-clockwise around
     * the inscribed circle defined by the maximal disk).
     */
    nextOnCircle: CpNode;
}
declare function createCpNode(cp: ContactPoint, isHoleClosing: boolean, isIntersection: boolean, prev?: CpNode, next?: CpNode, prevOnCircle?: CpNode, nextOnCircle?: CpNode): CpNode;
/**
 * Returns the bezier curve from the maximal disk of this [[CpNode]] to the
 * next [[CpNode]]'s maximal disk and thus directly represents a piece of the
 * medial axis.
 * @deprecated Use [[getCurveToNext]] instead
 * @param cpNode
 */
declare function matCurveToNextVertex(cpNode: CpNode): number[][];
/**
 * Primarily for internal use.
 *
 * Compares the order of two [[CpNode]]s. The order is cyclic and depends
 * on a [[CpNode]]'s relative position along the shape boundary.
 */
declare const cpNodeComparator: (a: CpNode, b: CpNode) => number;
/**
 * Returns the children of this [[CpNode]] when seen as a MAT edge. Only
 * children in a 'forward' direction are returned. These include all edges
 * except the 'backward' edge given by [[prevOnCircle]], even terminating
 * edges.
 */
declare function getChildren(cpNode: CpNode): CpNode[];
/**
 * Similar to [[getChildren]] but returns the child nodes of the tree when
 * [[CpNode]] is seen as a MAT vertex point (as opposed to edge). In this
 * way the dual graph of the tree can easily be traversed - see e.g.
 * [[traverseVertices]]. Generally, however, traversing the edges is
 * preferred as it returns the entire Medial Axis (by utilizing
 * [[getCurveToNext]] on each returned edge).
 */
declare function vertexChildren(cpNode: CpNode): CpNode[];
/**
 * Returns all [[CpNode]]s on the MAT that this [[CpNode]] is part of
 * starting from the current one and going anti-clockwise around the shape.
 */
declare function getAllOnLoop(cpNode: CpNode): CpNode[];
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
declare function insertCpNode(isHoleClosing: boolean, isIntersection: boolean, cpTree: LlRbTree<CpNode>, cp: ContactPoint, prev_: CpNode): CpNode;
/**
 * Return this (except if exclThis is truthy) and the the other CpNodes
 * around the maximal disk vertex circle in an anti-clockwise order.
 * @param exclThis If true the returned array does not include this
 * [[CpNode]].
 */
declare function getCpNodesOnCircle(cpNode: CpNode, exclThis?: boolean): CpNode[];
/**
 * Returns true if the 2 given [[CpNode]]s are on the same maximal disk
 * circle.
 * @param cpNode1 A [[CpNode]].
 * @param cpNode2 Another [[CpNode]]
 */
declare function isOnSameCircle(cpNode1: CpNode, cpNode2: CpNode): boolean;
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
declare function isTerminating(cpNode: CpNode): boolean;
/**
 * Like isTerminating() but only returns true if all cpNodes on the circle
 * (except this.prevOnCircle) is terminating.
 */
declare function isFullyTerminating(cpNode: CpNode): boolean;
/**
 * Returns the first [[CpNode]] (from this one by successively applying
 * .nextOnCircle) that exits the circle.
 */
declare function getFirstExit(cpNode: CpNode): CpNode | undefined;
/**
 * Returns true if this [[CpNode]] represents a sharp corner, i.e. the
 * limiting case of a two-prong having zero radius.
 *
 * Note that two [[CpNode]]s are stored for each sharp corner, one being
 * terminating and one not. See [[isTerminating]] for more details.
 */
declare function isSharp(cpNode: CpNode): boolean;
/**
 * Returns true if this [[CpNode]]'s maximal disk has only one contact point
 * on the shape boundary (up to planar coordinates). These includes sharp
 * corners.
 *
 * Note, however, that two [[CpNode]]s are stored for each such point to
 * preserve symmetry - see [[isTerminating]] for more details.
 */
declare function isOneProng(cpNode: CpNode): boolean;
/**
 * Returns the number of contact points on the maximal disk circle implied
 * by this [[CpNode]].
 *
 * Note, however, that even one-prongs and sharp corners will return 2 (see
 * [[isTerminating]] for more details); if this is not desired use
 * [[getRealProngCount]] instead which will return 1 in these cases.
 */
declare function getProngCount(cpNode: CpNode): number;
/**
 * Returns the number of contact points (up to planar coordinates) on the
 * maximal disk circle implied by this [[CpNode]].
 *
 * See also [[getProngCount]].
 */
declare function getRealProngCount(cpNode: CpNode): number;
export { CpNode, createCpNode, matCurveToNextVertex, getChildren, vertexChildren, getAllOnLoop, insertCpNode, getCpNodesOnCircle, isOnSameCircle, isTerminating, isFullyTerminating, getFirstExit, isSharp, isOneProng, getProngCount, getRealProngCount, cpNodeComparator, removeCpNode };
