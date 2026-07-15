import { Mutable } from "../../utils/mutable.js";
import type { CpNode } from "../cp-node.js";


/** @internal */
type Edge =
    | 'prev'
    | 'next'
    | 'prevOnCircle'
    | 'nextOnCircle'
    | 'holeCloserTwin';

/** @internal */
const EDGES: Edge[] = ['prev', 'next', 'prevOnCircle', 'nextOnCircle', 'holeCloserTwin'];


type CpNodeWithoutEdges = 
    Omit<CpNode, 'prev' | 'next' | 'prevOnCircle' | 'nextOnCircle' | 'holeCloserTwin'>;


/**
 * Returns a deep clone of this `CpNode`. Can be used to copy the MAT 
 * since cloning a single `CpNode` necessarily implies cloning all 
 * `CpNode`s on the same MAT tree.
 */
function clone(
        cpNode: CpNode): CpNode {

    // Don't change this function to be recursive, the call stack may 
    // overflow if there are too many `CpNode`s.

    const nodeMap: Map<CpNode, CpNodeWithoutEdges> = new Map();

    const newCpNode: CpNodeWithoutEdges = cloneWithoutEdges(cpNode);

    nodeMap.set(cpNode, newCpNode);
    const cpStack = [{ cpNode, newCpNode }];

    while (cpStack.length) {
        const { cpNode, newCpNode } = cpStack.pop()!;

        for (const edge of EDGES) {
            const node = cpNode[edge];
            if (node === undefined) { continue; }

            let node_ = nodeMap.get(node);
            if (!node_) {
                node_ = cloneWithoutEdges(node);
                
                nodeMap.set(node, node_);
                cpStack.push({ cpNode: node, newCpNode: node_ });
            }
            (newCpNode as Mutable<CpNode>)[edge] = node_ as CpNode;
        }
    }

    return newCpNode as CpNode;
}


function cloneWithoutEdges(cpNode: CpNode) {
    const cpNode_ = {
        ...cpNode,
        ...{
            prev: undefined,
            next: undefined,
            prevOnCircle: undefined,
            nextOnCircle: undefined,
            holeCloserTwin: undefined
        }
    };

    return cpNode_;
}


export { clone }

