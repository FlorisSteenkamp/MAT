import { CpGraph } from './cp-graph';
import { ContactPoint } from '../mat/classes/contact-point';
/**
 * Representation of a ContactPoint node having various edges, two of which
 * enforce an ordering on the nodes, i.e. 'prev' and 'next'.
 */
declare class CpNode {
    cpGraph: CpGraph;
    cp: ContactPoint;
    prev: CpNode;
    next: CpNode;
    prevOnCircle: CpNode;
    nextOnCircle: CpNode;
    /**
     * @param graph - The linked loop this node belongs to.
     * @param cp - The actual item stored at a node.
     * @param prev - The previous item.
     * @param next - The next item.
     */
    constructor(graph: CpGraph, cp: ContactPoint, prev: CpNode, next: CpNode);
    getCps(): CpNode[];
    isTerminating(): boolean;
    isHoleClosing(): boolean;
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
export { CpNode };
