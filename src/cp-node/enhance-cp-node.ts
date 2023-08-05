import {
    CpNode, getProngCount, getRealProngCount, isFullyTerminating,
    isSharp, isTerminating
} from "./cp-node.js";
import { getCpNodeOrdering } from './get-cp-node-ordering.js';


function enhanceCpNode(cpNode: CpNode) {
    const cp = cpNode.cp;
    const pos = cp.pointOnShape;
    const curve = pos.curve;

    return {
        ...cpNode,
        isTerminating: isTerminating(cpNode),
        isFullyTerminating: isFullyTerminating(cpNode),
        isSharp: isSharp(cpNode),
        prongCount: getProngCount(cpNode),
        getRealProngCount: getRealProngCount(cpNode),
        ordering: getCpNodeOrdering(cpNode),
        curve,
        loop: curve.loop
    }
}


export { enhanceCpNode }
