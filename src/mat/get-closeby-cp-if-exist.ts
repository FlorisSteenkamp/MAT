import { LlRbTree } from 'flo-ll-rb-tree';
import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
import { getCpNodeToLeftOrSame } from './get-cp-node-to-left-or-same.js';
import { MatMeta } from './mat-meta.js';


/** @internal */
const DEGREES = 1;
const ANGLE_THRESHOLD = Math.cos(DEGREES * (Math.PI / 180));


/**
 * @internal
 * If another `CpNode` is close by (to the given implied (via `pos`, `order` and
 * `order2`) then return it, else return `undefined`.
 * 
 * @param meta
 * @param pos 
 * @param circle 
 * @param order 
 * @param order2 
 */
function getCloseByCpIfExist(
        meta: MatMeta,
        pos: PointOnShape,
        circle: Circle,
        order: number,
        order2: number,
        forProngCount?: number): CpNode | undefined {

    const { cpTrees, maxCoordinate } = meta;

    const DISTANCE_THRESHOLD = maxCoordinate * 2e-14;
    const DISTANCE_THRESHOLD_2 = DISTANCE_THRESHOLD * 2e-2;

    const cpTree = cpTrees.get(pos.curve.loop)!;
    const cur = getCpNodeToLeftOrSame(cpTree, pos, order, order2);
    if (!cur) { return undefined; }
    const cpNodes = [cur, cur.next];

    const { p, t } = pos;
    for (const cpNode of cpNodes) {
        const pos2 = cpNode.cp.pointOnShape;
        const p2 = pos2.p;
        const d = distanceBetween(p,p2);
        if (d > DISTANCE_THRESHOLD) {
            continue;
        }

        const v1 = toUnitVector(fromTo(p2, cpNode.cp.circle.center));
        const v2 = toUnitVector(fromTo(p, circle.center));
        const cosTheta = dot(v1,v2);

        if (cosTheta > ANGLE_THRESHOLD ||
            (d < DISTANCE_THRESHOLD_2 && t !== 0 && t !== 1)) {

            if (forProngCount === 3) {
                // console.log(cosTheta, d);
                // console.log(t);
                // console.log(d, DISTANCE_THRESHOLD_2)
                // console.log(p,p2);
            }
            return cpNode;
        }
    }

    return undefined;
}


export { getCloseByCpIfExist }
