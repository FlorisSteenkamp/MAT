
import LlRbTree from "flo-ll-rb-tree";

import { distanceBetween, toUnitVector, fromTo, dot } from 'flo-vector2d';

import { Loop         } from "../loop/loop";
import { CpNode       } from "../cp-node/cp-node";
import { PointOnShape } from "../point-on-shape";
import { Circle       } from "../circle";

import { getNeighbouringPoints } from "./get-neighboring-cps";

//const ANGLE_THRESHOLD = Math.cos(3 * (Math.PI / 180)); // 3 degrees
const ANGLE_THRESHOLD = 0.9986295347545738; // === Math.cos(3  degrees)
//const ANGLE_THRESHOLD = 0.9848077530122080; // === Math.cos(10 degrees)
//const ANGLE_THRESHOLD = 0.9998476951563913; // === Math.cos(1 degrees)
//const ANGLE_THRESHOLD = 0.9999984769132877; // === Math.cos(0.1 degrees)   
//const ANGLE_THRESHOLD = 0.9999999847691291  // === Math.cos(0.01 degrees)   


/**
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

    //console.log(extreme)
    //const DISTANCE_THRESHOLD = extreme * 1e-1; 
    //const DISTANCE_THRESHOLD = extreme * 1e-1;
    const DISTANCE_THRESHOLD = extreme * 1e-4;
    //const DISTANCE_THRESHOLD = extreme * 1e-4; - was this
    //const DISTANCE_THRESHOLD = extreme * 1e-6;
    //const DISTANCE_THRESHOLD = extreme * 1e-12;
    // It seems this can be zero else the ordering should be correct
    //const DISTANCE_THRESHOLD = 0;

    let cpTree = cpTrees.get(pos.curve.loop);
    let cpNodes = getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) { return false }

    for (let cpNode of cpNodes) {
        let pos2 = cpNode.cp.pointOnShape;
        let p1 = pos.p;
        let p2 = pos2.p;
        
        if (distanceBetween(p1,p2) > DISTANCE_THRESHOLD) {
            continue;
        }

        let v1 = toUnitVector(fromTo(
            cpNode.cp.pointOnShape.p, 
            cpNode.cp.circle.center
        ));
        let v2 = toUnitVector(fromTo(
            p1,
            circle.center
        ));
        let cosTheta = dot(v1,v2);
                            
        if (cosTheta > ANGLE_THRESHOLD) {
            //console.log(`%c${cosTheta} - ${distanceBetween(p1,p2)}`, `color: ${color}`);
            return true;
        }
    }

    return false;
}


export { isAnotherCpCloseby }
