import type  { Circle } from '../geometry/circle.js';
import type  { ContactPoint } from '../contact-point/contact-point.js';
import type  { PointOnShape } from '../point-on-shape/point-on-shape.js';
import type  { CpNode } from '../cp-node/cp-node.js';
import type { MatMeta } from '../index.js';
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
        meta: MatMeta,
        poss: PointOnShape[],
        neighbors?: CpNode[]): { anyFailed: boolean, cpNodes: (CpNode | undefined) [] } {

    const { cpTrees } = meta;

    let anyFailed = false;
    const cpNodes = poss.map((pos,i) => {
        const order = orders[i];
        const cpTree = cpTrees.get(pos.curve.loop)!;
        const cp: ContactPoint = { pointOnShape: pos, circle, order, order2: 0 };

        const pred = neighbors === undefined
            ? getCpNodeToLeftOrSame(cpTree, pos, order, 0)
            : neighbors[i];

        const cpNode = insertCpNode(
            insertIfOrderIsWrong,
            isHoleClosing,
            false,
            cpTree,
            cp,
            pred,
            meta.lastInsertId
        );

        if (cpNode === undefined) { anyFailed = true; }

        return cpNode;
    });

    if (!anyFailed) {
        joinSpokes(circle, cpNodes as CpNode[]);
    }

    return { anyFailed, cpNodes };
}


export { addToCpTree }
