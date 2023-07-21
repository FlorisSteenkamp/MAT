import { LlRbTree } from 'flo-ll-rb-tree';
import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../circle.js';
import { getNeighbouringPoints } from './get-neighboring-cps.js';


/** @internal */
const DEGREES = 5;  // TODO2 - make about 3 degrees
const ANGLE_THRESHOLD = Math.cos(DEGREES * (Math.PI / 180));


/**
 * @internal
 * If another `CpNode` is close by (to the given implied (via `pos`, `order` and
 * `order2`) then return it, else return `undefined`.
 * 
 * @param cpTrees 
 * @param pos 
 * @param circle 
 * @param order 
 * @param order2 
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * @param color Used for debugging only
 */
function isAnotherCpCloseby(
        cpTrees: Map<Loop,LlRbTree<CpNode>>,
        pos: PointOnShape,
        circle: Circle,
        order: number,
        order2: number,
        extreme: number): CpNode | undefined {

    const DISTANCE_THRESHOLD = extreme * 1e-4;
    const DISTANCE_THRESHOLD2 = DISTANCE_THRESHOLD * 1e-6;

    const cpTree = cpTrees.get(pos.curve.loop)!;
    const cpNodes = getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) { return undefined; }

    for (const cpNode of cpNodes) {
        const pos2 = cpNode.cp.pointOnShape;
        const p1 = pos.p;
        const p2 = pos2.p;
        const d = distanceBetween(p1,p2);
        if (d > DISTANCE_THRESHOLD) {
            continue;
        }

        // TODO2
        // return true;

        const v1 = toUnitVector(fromTo(p2, cpNode.cp.circle.center));
        const v2 = toUnitVector(fromTo(p1, circle.center));
        const cosTheta = dot(v1,v2);

        if (cosTheta > ANGLE_THRESHOLD ||
            d < DISTANCE_THRESHOLD2) {

            // console.log(d, DISTANCE_THRESHOLD2)
            return cpNode;
        }
    }

    return undefined;
}


export { isAnotherCpCloseby }
