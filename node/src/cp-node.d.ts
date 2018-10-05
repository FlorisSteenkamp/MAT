import LlRbTree from 'flo-ll-rb-tree';
import { ContactPoint } from './contact-point';
export declare type Edge = 'prev' | 'next' | 'prevOnCircle' | 'nextOnCircle';
export declare type Edges = {
    [E in Edge]: CpNode;
};
/**
 * Representation of a ContactPoint node having various edges, two of which
 * ('prev' and 'next') enforce a cyclic ordering on the CpNodes.
 */
export declare class CpNode implements Edges {
    readonly cp: ContactPoint;
    isHoleClosing: boolean;
    isIntersection: boolean;
    prev: CpNode;
    next: CpNode;
    prevOnCircle: CpNode;
    nextOnCircle: CpNode;
    matCurve: number[][];
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
    constructor(cp: ContactPoint, isHoleClosing: boolean, isIntersection: boolean, prev?: CpNode, next?: CpNode, prevOnCircle?: CpNode, nextOnCircle?: CpNode, matCurve?: number[][]);
    static comparator: (a: CpNode, b: CpNode) => number;
    clone(): CpNode;
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param cp - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     */
    static insert(isHoleClosing: boolean, isIntersection: boolean, cpTree: LlRbTree<CpNode>, cp: ContactPoint, prev_: CpNode): CpNode;
    remove(cpTree: LlRbTree<CpNode>, cpNode: CpNode): void;
    /**
     * Return this and the the other CpNodes around the vertex circle in order.
     */
    getNodes(): CpNode[];
    isTerminating(): boolean;
    isSharp(): boolean;
    /**
     * Returns true if this ListNode is a one-prong (including
     * sharp corners).
     */
    isOneProng(): boolean;
    isThreeProng(): boolean;
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps(node: CpNode, n: number): CpNode;
}
