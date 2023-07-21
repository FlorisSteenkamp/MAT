import { ContactPoint } from '../contact-point.js';
import { CpNode } from './cp-node.js';


function createCpNode(
        cp: ContactPoint,
        isHoleClosing  : boolean,
        isIntersection : boolean,
        prev           : CpNode = undefined!,
        next           : CpNode = undefined!,
        prevOnCircle   : CpNode = undefined!,
        nextOnCircle   : CpNode = undefined!): CpNode {

    return {
        cp, isHoleClosing, isIntersection,
        prev, next, prevOnCircle, nextOnCircle
    }
}


export { createCpNode }
