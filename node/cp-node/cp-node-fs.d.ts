import { CpNode } from "./cp-node.js";
import { getHoleClosers } from "./fs/get-hole-closers.js";
import { getSpeed } from "./fs/get-speed.js";
import { enhanceCpNode } from "./fs/enhance-cp-node.js";
import { traverseCp } from './fs/traverse-cp.js';
import { traverseEdges } from './fs/traverse-edges.js';
import { traverseVertices } from './fs/traverse-vertices.js';
import { clone } from './fs/clone.js';
import { getBoundaryBezierPartsToNext } from './fs/get-boundary-bezier-parts-to-next.js';
import { getBoundaryBeziersToNext } from './fs/get-boundary-beziers-to-next.js';
import { removeVertex } from '../vertex/remove-vertex.js';
import { getProngCount } from './fs/get-prong-count.js';
import { getChildren } from './fs/get-children.js';
import { getAllOnLoop } from './fs/get-all-on-loop.js';
import { getAllOnCircle } from './fs/get-all-on-circle.js';
import { getMatCurveToNext } from './fs/get-mat-curve-to-next.js';
import { getFirstExit } from './fs/get-first-exit.js';
import { getRealProngCount } from './fs/get-real-prong-count.js';
import { isFullyTerminating } from './fs/is-fully-terminating.js';
import { isOnSameCircle } from './fs/is-on-same-circle.js';
import { isOneProng } from './fs/is-one-prong.js';
import { isSharp } from './fs/is-sharp.js';
import { isTerminating } from './fs/is-terminating.js';
import { getVertexForwardChildren } from './fs/get-vertex-forward-children.js';
import { isTwoProng } from './fs/is-two-prong.js';
import { getBranch } from './fs/get-branch.js';
import { getBranchBeziers } from './fs/get-branch-beziers.js';
import { getSalience } from './fs/get-salience.js';
import { getMatCurveBetween } from './fs/get-mat-curve-between.js';
import { getEdgeDirection } from './fs/get-edge-direction.js';
import { getBoundaryBeziersBetween } from './fs/get-boundary-beziers-between.js';
import { getMatCurvesBetween } from './fs/get-mat-curves-between.js';
import { getInitialDegAngleBetweenMatCurves } from "./fs/get-angle-between-mat-curves.js";
import { getAllVertices } from "./fs/get-all-vertices.js";
declare const CpNodeFs: {
    /**
     * Returns the children of this [[CpNode]] when seen as a MAT edge. Only
     * children in a 'forward' direction are returned. These include all edges
     * except the 'backward' edge given by [[prevOnCircle]], even terminating
     * edges.
     */
    getChildren: typeof getChildren;
    /**
     * Similar to [[getChildren]] but returns the child nodes of the tree when
     * [[CpNode]] is seen as a MAT vertex point (as opposed to edge). In this
     * way the dual graph of the tree can easily be traversed - see e.g.
     * [[traverseVertices]]. Generally, however, traversing the edges is
     * preferred as it returns the entire Medial Axis (by utilizing
     * [[getMatCurveToNext]] on each returned edge).
     */
    getVertexForwardChildren: typeof getVertexForwardChildren;
    /**
     * Returns all [[CpNode]]s on the MAT that this [[CpNode]] is part of
     * starting from the current one and going anti-clockwise around the shape.
     */
    getAllOnLoop: typeof getAllOnLoop;
    /**
     * Return this (except if exclThis is truthy) and the the other CpNodes
     * around the maximal disk vertex circle in an anti-clockwise order.
     * @param exclThis If true the returned array does not include this
     * [[CpNode]].
     */
    getAllOnCircle: typeof getAllOnCircle;
    /**
     * Returns true if the 2 given [[CpNode]]s are on the same maximal disk
     * circle.
     * @param cpNode1 A [[CpNode]].
     * @param cpNode2 Another [[CpNode]]
     */
    isOnSameCircle: typeof isOnSameCircle;
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
    isTerminating: typeof isTerminating;
    /**
     * Like isTerminating() but only returns true if all cpNodes on the circle
     * (except this.prevOnCircle) is terminating.
     */
    isFullyTerminating: typeof isFullyTerminating;
    /**
     * Returns the first [[CpNode]] (from this one by successively applying
     * .nextOnCircle) that exits the circle.
     */
    getFirstExit: typeof getFirstExit;
    /**
     * Returns true if this [[CpNode]] represents a sharp corner, i.e. the
     * limiting case of a two-prong having zero radius.
     *
     * Note that two [[CpNode]]s are stored for each sharp corner, one being
     * terminating and one not. See [[isTerminating]] for more details.
     */
    isSharp: typeof isSharp;
    /**
     * Returns true if this [[CpNode]]'s maximal disk has only one contact point
     * on the shape boundary (up to planar coordinates). These includes sharp
     * corners.
     *
     * Note, however, that two [[CpNode]]s are stored for each such point to
     * preserve symmetry - see [[isTerminating]] for more details.
     */
    isOneProng: typeof isOneProng;
    /**
     * Returns the number of contact points on the maximal disk circle implied
     * by this [[CpNode]].
     *
     * Note, however, that even one-prongs and sharp corners will return 2 (see
     * [[isTerminating]] for more details); if this is not desired use
     * [[getRealProngCount]] instead which will return 1 in these cases.
     */
    getProngCount: typeof getProngCount;
    /**
     * Returns the number of contact points (up to planar coordinates) on the
     * maximal disk circle implied by this [[CpNode]].
     *
     * See also [[getProngCount]].
     */
    getRealProngCount: typeof getRealProngCount;
    /**
     * Primarily for internal use.
     *
     * Compares the order of two [[CpNode]]s. The order is cyclic and depends
     * on a [[CpNode]]'s relative position along the shape boundary.
     */
    cpNodeComparator: (a: CpNode, b: CpNode) => number;
    /**
     * For debugging
     * @param cpNode
     */
    enhanceCpNode: typeof enhanceCpNode;
    /**
     * @internal
     *
     * Traverses the shape from the given `CpNode` going around the shortest path
     * so that only a piece of the shape is traversed and returns the visited
     * `CpNode`s (starting from the given `CpNode`).
     *
     * @param cpStart The `CpNode` from where to start the traversal.
     */
    traverseCp: typeof traverseCp;
    /**
     * Traverses all edges (depth first) of the given MAT tree starting at the given
     * vertex (represented by a [[CpNode]]).
     * @param cpNode Any [[CpNode]] representing the start vertex.
     * @param traverseEdgesCallback A callback function for each CpNode representing the vertex at the
     * start of an edge.
     */
    traverseEdges: typeof traverseEdges;
    /**
     * Traverses the MAT tree and calls the given callback function for each vertex
     * (represented by a [[CpNode]]) on the MAT.
     *
     * It is usually preferable to use [[traverseEdges]] as it allows for the
     * traversal of all the smooth curves representing the MAT.
     * @param cpNode Any [[CpNode]] representing the start vertex.
     * @param traverseVerticesCallback A callback function taking a single [[CpNode]] as parameter.
     */
    traverseVertices: typeof traverseVertices;
    /**
     * Returns a deep clone of this [[CpNode]]. Can be used to copy the MAT
     * since cloning a single [[CpNode]] necessarily implies cloning all
     * [[CpNode]]s on the same MAT tree.
     */
    clone: typeof clone;
    /**
     * Returns the ordered bezier curves from this CpNode to the next CpNode
     * on the boundary.
     * @param cpNode
     */
    getBoundaryBezierPartsToNext: typeof getBoundaryBezierPartsToNext;
    /**
     * Returns the ordered bezier curves from this CpNode to the next CpNode
     * on the boundary.
     * @param cpNode
     */
    getBoundaryBeziersToNext: typeof getBoundaryBeziersToNext;
    /**
     * Removes a cpNode from the MAT.
     * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
     * @param cpNode The [[CpNode]] to remove.
     */
    removeVertex: typeof removeVertex;
    /**
     * Returns the bezier curve from the maximal disk of the given [[CpNode]] to the
     * next [[CpNode]]'s maximal disk and thus directly represents a piece of the
     * medial axis.
     * @param cpNode
     */
    getMatCurveToNext: typeof getMatCurveToNext;
    isTwoProng: typeof isTwoProng;
    getBranch: typeof getBranch;
    getBranchBeziers: typeof getBranchBeziers;
    getSalience: typeof getSalience;
    /**
     * Returns the bezier curve from the maximal disk of one [[CpNode]] to another
     * [[CpNode]]'s maximal disk.
     * @param cpNodeFrom
     * @param cpNodeTo
     */
    getMatCurveBetween: typeof getMatCurveBetween;
    /**
     * @internal
     * Returns a line segment of unit length starting in the given Vertex center and
     * pointing in the direction of the medial axis (viewed as a rooted tree).
     * @param cpNode
     */
    getEdgeDirection: typeof getEdgeDirection;
    getBoundaryBeziersBetween: typeof getBoundaryBeziersBetween;
    getMatCurvesBetween: typeof getMatCurvesBetween;
    getHoleClosers: typeof getHoleClosers;
    getSpeed: typeof getSpeed;
    getSmoothedSpeed$: (a: number) => (a: CpNode) => number | undefined;
    getInitialDegAngleBetweenMatCurves: typeof getInitialDegAngleBetweenMatCurves;
    getAllVertices: typeof getAllVertices;
};
export { CpNodeFs };
