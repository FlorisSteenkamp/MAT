import { LinkedLoop } from '../../linked-list/linked-loop';
import { Loop } from '../../linked-list/loop';
import { ListNode } from '../../linked-list/list-node';
import { Node } from '../../linked-list/node';
import { BezierPiece } from '../classes/bezier-piece';
import { ContactPoint } from '../classes/contact-point';
import { PointOnShape } from '../classes/point-on-shape';
import { Vertex } from '../classes/vertex';
import { Corner } from '../classes/corner';
declare class Shape {
    pointsOnShapePerLoop: LinkedLoop<PointOnShape>[];
    /** A map (per loop) mapping bezier indexes to the set of contact points
     * attached to that bezier */
    bezierCpSetPerLoop: Map<number[][], Set<ContactPoint>>[];
    shapeBounds: {
        minX: {
            bezier: Node<number[][]>;
            t: number;
            val: number;
        };
        minY: {
            bezier: Node<number[][]>;
            t: number;
            val: number;
        };
        maxX: {
            bezier: Node<number[][]>;
            t: number;
            val: number;
        };
        maxY: {
            bezier: Node<number[][]>;
            t: number;
            val: number;
        };
    };
    bezierLoops: Loop<number[][]>[];
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
        bezierNode: Node<number[][]>;
        t: number;
    }[];
    /** A hash of all the dull corners (i.e. those with angle > 180 deg) */
    dullCornerHash: {
        [index: string]: Corner;
    };
    contactPointsPerLoop: LinkedLoop<ContactPoint>[];
    readonly mat: Vertex;
    /**
     * A Shape represents the loop of individual cubic bezier curves composing
     * an SVG element. When constructed, some initial analysis is done.
     * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop
     * represents a closed path of the shape.
     */
    constructor(bezierLoops: Loop<number[][]>[]);
    private addDebugInfo();
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
     */
    static getNeighbouringPoints(shape: Shape, pos: PointOnShape): ListNode<ContactPoint>[];
    /**
     *
     */
    static getTotalCurvature: (bezierLoop: Loop<number[][]>) => number;
    /**
     *
     */
    static getTotalAbsoluteCurvature: (bezierLoop: Loop<number[][]>) => number;
    /**
     *
     */
    static forAllBeziers: (f: (ps: number[][]) => void, shape: Shape) => void;
    /**
     *
     * @param k Loop indx
     * @param cp
     */
    addCpToBezierCpSet(k: number, cp: ContactPoint): void;
    /**
     *
     * @param k Loop indx
     * @param cp
     */
    removeCpFromBezierCpSet(k: number, cp: ContactPoint): void;
    /**
     * asas
     */
    static getBoundaryBeziers: (shape: Shape, k: number) => BezierPiece[];
    /**
    * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
    * from the given boundary piece.
    * @param δ - An ordered pair that represents the start and ending points of
    * the boundary piece
    * @param keepStraight - If true then don't go around any mat circles
    * @param ifSamePointReturnEmpty = If the two δ points representing a
    * boundary piece compare as equal, then if this parameter is set to true
    * a single point will be returned else the entire boundary will be
    * returned.
    */
    static getBoundaryPieceBeziers: (δ: ListNode<ContactPoint>[], keepStraight?: boolean, ifSamePointReturnPointOnly?: boolean) => BezierPiece[];
}
export { Shape };
