import { ContactPoint } from '../contact-point/contact-point.js';
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
 * Call [[getMatCurveBetween]](cpNodeFrom, cpNodeTo) or getMatCurveToNext(cpNode)
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
 * The getter, [[getVertexForwardChildren]], is similar to [[getChildren]] but returns the
 * child nodes of the tree when [[CpNode]] is seen as a MAT vertex point (as
 * opposed to edge). In this way the dual graph of the tree can easily be
 * traversed - see e.g. [[traverseVertices]]. Generally, however, traversing the
 * edges is preferred as it returns the entire Medial Axis (by utilizing
 * [[getMatCurveToNext]] on each returned edge).
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
    /**
     * For hole closers only - the next `CpNode` ignoring the hole closer
     */
    holeCloserNext?: CpNode | undefined;
    /**
     * For hole closers only - the prev `CpNode` ignoring the hole closer
     */
    holeCloserPrev?: CpNode | undefined;
    /** Only used in export */
    id?: number;
    /** Only used in export */
    children?: number[];
    /** Only used in export */
    isRoot?: boolean;
    /** Only used in export */
    parentId?: number;
    /** Only used in export */
    childId?: number;
}
export { CpNode };
