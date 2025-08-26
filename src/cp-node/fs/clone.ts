import { CpNode } from "../cp-node.js";


/** @internal */
type Edge =
    | 'prev'
	| 'next'
	| 'prevOnCircle'
	| 'nextOnCircle';

/** @internal */
const EDGES: Edge[] = ['prev', 'next', 'prevOnCircle', 'nextOnCircle'];


type CpNodeWithoutEdges = 
    Omit<CpNode, 'prev' | 'next' | 'prevOnCircle' | 'nextOnCircle'>;


/**
 * Returns a deep clone of this [[CpNode]]. Can be used to copy the MAT 
 * since cloning a single [[CpNode]] necessarily implies cloning all 
 * [[CpNode]]s on the same MAT tree.
 */
function clone(cpNode: CpNode): CpNode {
    // Don't change this function to be recursive, the call stack may 
    // overflow if there are too many CpNodes.

    const nodeMap: Map<CpNode, CpNodeWithoutEdges> = new Map();

    const newCpNode: CpNodeWithoutEdges = cloneWithoutLinks(cpNode);

    nodeMap.set(cpNode, newCpNode);
    const cpStack = [{ cpNode, newCpNode }];

    while (cpStack.length) {
        const { cpNode, newCpNode } = cpStack.pop()!;

        for (const edge of EDGES) {
            const node = cpNode[edge];
            let newNode = nodeMap.get(node);
            if (!newNode) {	
                newNode = cloneWithoutLinks(node);
                
                nodeMap.set(node, newNode);
                cpStack.push({cpNode: node, newCpNode: newNode });
            }
            (newCpNode as CpNode)[edge] = newNode as CpNode;
        }
    }

    return newCpNode as CpNode;
}


function cloneWithoutLinks(cpNode: CpNode) {
    const newNode = {
        ...cpNode,
        ...{
            prev: undefined,
            next: undefined,
            prevOnCircle: undefined,
            nextOnCircle: undefined
        }
    };

    return newNode;
}


export { clone }

