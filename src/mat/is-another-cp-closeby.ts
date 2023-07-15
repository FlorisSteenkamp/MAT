import { LlRbTree } from 'flo-ll-rb-tree';
import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';
import { Loop } from '../loop.js';
import { CpNode } from '../cp-node.js';
import { PointOnShape } from '../point-on-shape.js';
import { Circle } from '../circle.js';
import { getNeighbouringPoints } from './get-neighboring-cps.js';


/** @hidden */
const ANGLE_THRESHOLD = Math.cos(15 * (Math.PI / 180));  // 15 degrees


/**
 * @hidden
 * Returns true if another CpNode is close to the given implied (via pos, order
 * and order2) CpNode.
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
        extreme: number,
        color: string): boolean {

    const DISTANCE_THRESHOLD = extreme * 1e-4;

    const cpTree = cpTrees.get(pos.curve.loop);
    const cpNodes = getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) { return false }

    for (const cpNode of cpNodes) {
        const pos2 = cpNode.cp.pointOnShape;
        const p1 = pos.p;
        const p2 = pos2.p;
        
        if (distanceBetween(p1,p2) > DISTANCE_THRESHOLD) {
            continue;
        }

        // TODO2
        // return true;

        const v1 = toUnitVector(fromTo(p2, cpNode.cp.circle.center));
        const v2 = toUnitVector(fromTo(p1, circle.center));
        const cosTheta = dot(v1,v2);

        if (cosTheta > ANGLE_THRESHOLD) {
            // console.log(`%c${cosTheta} - ${distanceBetween(p1,p2)}`, `color: ${color}`);
            return true;
        }
    }

    return false;
}


export { isAnotherCpCloseby }
