import type { Circle } from '../geometry/circle.js';
import type { PointOnShape, PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { CpNode } from '../cp-node/cp-node.js';
import type { MatMeta } from '../mat/mat-meta.js';
import { getCpNodeNeighbors } from './get-cp-node-neighbors.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { joinSpokes } from '../add-n-prong.ts/join-spokes.js';


/**
 * Insert the given `poss` into the `cpTree` (within `meta`) and returns the
 * newly inserted `CpNode`s.
 * 
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
        poss: PrePointOnShape[],
        neighbors?: [CpNode,CpNode][]): { anyFailed: boolean, cpNodes: (CpNode | undefined) [] } {

    const { cpTrees } = meta;

    let anyFailed = false;
    const cpNodes = poss.map((ppos,i) => {
        const order = orders[i];
        const cpTree = cpTrees.get(ppos.curve.loop)!;
        const pos: PointOnShape = { ...ppos, circle, order, order2: 0 };

        const pred = neighbors === undefined
            ? getCpNodeNeighbors(cpTree, ppos, order, 0)?.[0]
            : neighbors[i][0];

        const cpNode = insertCpNode(
            insertIfOrderIsWrong,
            isHoleClosing,
            false,
            cpTree,
            pos,
            pred,
            pred?.next,
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
