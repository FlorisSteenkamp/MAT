import { CpNode } from "../cp-node.js";
import { getCpNodeOrdering } from './get-cp-node-ordering.js';
import { CpNodeFs } from '../cp-node-fs.js';
import { getProngCount } from './get-prong-count.js';
import { getRealProngCount } from "./get-real-prong-count.js";
import { isFullyTerminating } from "./is-fully-terminating.js";
import { isSharp } from "./is-sharp.js";
import { isTerminating } from "./is-terminating.js";


function enhanceCpNode(cpNode: CpNode) {
    const cp = cpNode.cp;
    const pos = cp.pointOnShape;
    const curve = pos.curve;

    return {
        ...cpNode,
        pos: cpNode.cp.pointOnShape,
        p: cpNode.cp.pointOnShape.p,
        t: cpNode.cp.pointOnShape.t,
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
