import { CpNode } from "../cp-node.js";


/** @hidden */
type Edge =
    | 'prev'
	| 'next'
	| 'prevOnCircle'
	| 'nextOnCircle';

/** @hidden */
const EDGES: Edge[] = ['prev', 'next', 'prevOnCircle', 'nextOnCircle'];


/**
 * Returns a deep clone of this [[CpNode]]. Can be used to copy the MAT 
 * since cloning a single [[CpNode]] necessarily implies cloning all 
 * [[CpNode]]s on the same MAT tree.
 */
function clone(cpNode: CpNode): CpNode {
    // Don't change this function to be recursive, the call stack may 
    // overflow if there are too many CpNodes.

    const nodeMap: Map<CpNode, CpNode> = new Map();

    const newCpNode = new CpNode(cpNode.cp, cpNode.isHoleClosing, cpNode.isIntersection);

    nodeMap.set(cpNode, newCpNode);
    const cpStack = [{ cpNode, newCpNode }];

    while (cpStack.length) {
        const { cpNode, newCpNode } = cpStack.pop();

        for (const edge of EDGES) {
            const node = cpNode[edge];
            let newNode = nodeMap.get(node);
            if (!newNode) {	
                newNode = new CpNode(node.cp, node.isHoleClosing, node.isIntersection);
                nodeMap.set(node, newNode);
                cpStack.push({cpNode: node, newCpNode: newNode });
            }
            newCpNode[edge] = newNode;
        }
    }

    return newCpNode;
}


export { clone }
