import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { Circle } from '../geometry/circle.js';
import { ContactPoint } from '../contact-point/contact-point.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CpNode } from '../cp-node/cp-node.js';
import { CpNodeFs } from '../cp-node/cp-node-fs.js';
import { getCpNodeToLeftOrSame } from './get-cp-node-to-left-or-same.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { joinSpokes } from '../add-n-prong.ts/join-spokes.js';


/**
 * @param circle 
 * @param orders 
 * @param cpTrees 
 * @param poss 
 * @param neighbors 
 * 
 * @internal
 */
function addToCpTree(
        insertIfOrderIsWrong: boolean,
        isHoleClosing: boolean,
        circle: Circle, 
        orders: number[],
        cpTrees: Map<Loop,LlRbTree<CpNode>>,
        poss: PointOnShape[],
        neighbors? : CpNode[]): { anyFailed: boolean, cpNodes: (CpNode | undefined) [] } {

    let anyFailed = false;
    const cpNodes = poss.map((pos,i) => {
        const order = orders[i];
        const cpTree = cpTrees.get(pos.curve.loop)!;
        const cp: ContactPoint = { pointOnShape: pos, circle, order, order2: 0 };

        const pred = neighbors === undefined
            ? getCpNodeToLeftOrSame(cpTree, pos, order, 0)
            : neighbors[i];

        const cpNode = insertCpNode(insertIfOrderIsWrong, isHoleClosing, false, cpTree, cp, pred);

        if (cpNode === undefined) { anyFailed = true; }

        return cpNode;
    });

    if (!anyFailed) {
        joinSpokes(circle, cpNodes as CpNode[]);
    }

    return { anyFailed, cpNodes };
}


export { addToCpTree }
