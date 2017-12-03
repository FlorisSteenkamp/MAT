import PathCurve from '../../geometry/classes/path-curve';
import LinkedLoop from '../../linked-list/linked-loop';
import ListNode from '../../linked-list/list-node';
import BezierPiece from '../../geometry/classes/bezier-piece';
import ContactPoint from '../../mat/classes/contact-point';
import PointOnShape from '../../geometry/classes/point-on-shape';
import Corner from './corner';
import HoleClosing2Prong from '../../mat/classes/hole-closing-2-prong';
declare class Shape {
    private shapeBoundingBox;
    private pointsOnShapePerLoop;
    private bezierLoops;
    for2ProngsArray: ListNode<PointOnShape>[][];
    /** Hash of 2-prongs that need to be skipped in 2-prong procedure
    since we already have a hole-closing 2-prong there. */
    skip2ProngHash: {
        [index: string]: PointOnShape;
    };
    /** Hash of PointOnShapes that has a normal pointing straight up. */
    straightUpHash: {
        [index: string]: PointOnShape;
    };
    extremes: {
        p: number[];
        bezierNode: ListNode<PathCurve>;
        t: number;
    }[];
    /** A hash of all the dull corners (i.e. those with angle > 180 deg) */
    dullCornerHash: {
        [index: string]: Corner;
    };
    contactPointsPerLoop: LinkedLoop<ContactPoint>[];
    /** Hole closing 2-prongs that will be populated during find-mat */
    holeClosers: HoleClosing2Prong[];
    /**
     * A Shape represents the loop of individual cubic bezier curves composing
     * an SVG element. When constructed, some initial analysis is done.
     * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop
     * represents a closed path of the shape.
     */
    constructor(bezierArrays: PathCurve[][]);
    /**
     * Applies f to each PointOnShape within the shape
     * @param shape - The shape
     * @param f - The function to call.
     */
    private static forEachPointOnShape(shape, f);
    /**
     * Get potential 2-prong points on shape.
     * @param shape
     */
    private static getPotential2Prongs(shape);
    /**
     * Get useful points on the shape - these incude osculating points and points at
     * the bezier-bezier interfaces.
     * @param shape
     */
    private static getInterestingPointsOnShape(shape);
    /**
     * TODO - uncomment and finish implementation
     * Respace points so that the total absolute curvature between
     * consecutive points are very roughly equal.
     *
     * @param contactPointsPerLoop
     * @param maxAbsCurvatureInDegrees
     *
     * NOTES: Mutates contactPoints.
     */
    /**
     *
     */
    static getBoundaryBeziers: (shape: Shape, k: number) => BezierPiece[];
    /**
     * TODO - uncomment and finish
     * Get all points where shape intersect itself.
     */
    /**
     * @param shape
     * @param bezierLoop
     */
    private static getInterestingPointsOnLoop(shape, bezierLoop);
    /**
     * Returns the boundary piece that starts at the immediate previous point on
     * the shape and ends at the immediate next point.
     * Note: Uses a red-black tree to quickly find the required bounds
     */
    static getNeighbouringPoints(shape: Shape, pos: PointOnShape): ListNode<ContactPoint>[];
    /**
     *
     */
    static getTotalCurvature: (bezierLoop: LinkedLoop<PathCurve>) => number;
    /**
     *
     */
    static getTotalAbsoluteCurvature: (bezierLoop: LinkedLoop<PathCurve>) => number;
    /**
     *
     */
    static forAllBeziers: (f: (ps: number[][]) => void, shape: Shape) => void;
    /**
     * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
     * from the given boundary piece.
     * @param δ - An ordered pair that represents the start and ending points of
     * the boundary piece
     * @param keepStraight - If true then don't go around any mat circles
     */
    static getBoundaryPieceBeziers: (δ: ListNode<ContactPoint>[], keepStraight?: boolean) => BezierPiece[];
}
export default Shape;
