import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
import type { PointOnShape, PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
import type { Mutable } from '../utils/mutable.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';


/**
 * Adds a 2-prong contact circle to the shape.
 *
 * @param meta
 * @param circle Circle containing the 2 contact points
 * @param pposSource The source point on shape
 * @param pposAntipode The found antipodal point on shape
 * @param isHoleClosing True if this is a hole-closing 2-prong, false otherwise
 * 
 * @internal
 */
function add2Prong(
        meta: MatMeta,
        circle: Circle,
        pposSource: PrePointOnShape,
        pposAntipode: PrePointOnShape,
        isHoleClosing: boolean): CpNode | undefined {

    pposSource = pposSource.t === 0
        ? { ...pposSource, curve: pposSource.curve.prev, t: 1 }
        : pposSource;

    const orderSource = calcPosOrder(circle.center, pposSource);
    const orderAntipode = calcPosOrder(circle.center, pposAntipode);

    const posAntipode: PointOnShape = {
        ...pposAntipode, circle, order: orderAntipode, order2: 0
    };
    const posSource: PointOnShape = {
        ...pposSource, circle, order: orderSource, order2: 0
    }

    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    if (!!getCloseByCpIfExist(meta, pposSource, circle, orderSource, 0, 2)) {
        return undefined;
    }
    if (!!getCloseByCpIfExist(meta, pposAntipode, circle, orderAntipode, 0, 2)) {
        return undefined;
    }

    const { anyFailed, cpNodes } = addToCpTree(
        isHoleClosing, isHoleClosing, circle,
        [orderSource, orderAntipode],
        meta,
        [posSource, posAntipode]
    );

    if (anyFailed) {
        cpNodes.forEach(cpNode => {
            if (cpNode !== undefined) {
                removeCpNode(cpNode, meta);
            }
        });
        return undefined;
    }

    if (isHoleClosing) { 
        closeHole(meta, cpNodes as CpNode[]);
    }

    return cpNodes[0];  // return the source `CpNode`
}


function closeHole(
        meta: MatMeta,
        cpNodes: CpNode[]) {

    const { cpTrees } = meta;

    const [cpNodeSource, cpNodeAntipode] = cpNodes as Mutable<CpNode>[];

    // Antipode - create and insert twin
    const posAntipode = cpNodeAntipode.pointOnShape;
    const cpNodeAntipodeTwin = insertCpNode(
        true, true, false,
        cpTrees.get(posAntipode.curve.loop)!,
        { ...posAntipode, order2: +1 },
        cpNodeAntipode,
        meta.lastInsertId
    )! as Mutable<CpNode>;
    cpNodeAntipodeTwin.holeCloserTwin = cpNodeAntipode;
    cpNodeAntipode.holeCloserTwin = cpNodeAntipodeTwin;

    // Source - create and insert twin
    const posSource = cpNodeSource.pointOnShape;
    const cpNodeSourceTwin = insertCpNode(
        true, true, false,
        cpTrees.get(posSource.curve.loop)!,
        { ...cpNodeSource.pointOnShape!, order2: -1 },
        cpNodeSource.prev,
        meta.lastInsertId
    )! as Mutable<CpNode>;
    cpNodeSourceTwin.holeCloserTwin = cpNodeSource;
    cpNodeSource.holeCloserTwin = cpNodeSourceTwin;

    // Connect graph
    cpNodeSourceTwin.prevOnCircle = cpNodeAntipodeTwin;
    cpNodeSourceTwin.nextOnCircle = cpNodeAntipodeTwin;
    cpNodeAntipodeTwin.prevOnCircle = cpNodeSourceTwin;
    cpNodeAntipodeTwin.nextOnCircle = cpNodeSourceTwin;

    cpNodeAntipode.next = cpNodeSource;
    cpNodeSource.prev = cpNodeAntipode;

    cpNodeSourceTwin.next = cpNodeAntipodeTwin;
    cpNodeAntipodeTwin.prev = cpNodeSourceTwin;
}


export { add2Prong }
