
import { CpNode } from "../cp-node";


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

    let nodeMap: Map<CpNode, CpNode> = new Map();

    let newCpNode = new CpNode(cpNode.cp, cpNode.isHoleClosing, cpNode.isIntersection);

    nodeMap.set(cpNode, newCpNode);
    let cpStack = [{ cpNode, newCpNode }];

    while (cpStack.length) {
        let { cpNode, newCpNode } = cpStack.pop();

        for (let edge of EDGES) {
            let node = cpNode[edge];
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
