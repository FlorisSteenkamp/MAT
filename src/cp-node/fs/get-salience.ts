import { distanceBetween } from "flo-vector2d";
import { totalLength } from "flo-bezier3";
import { CpNode } from "../cp-node.js";
import { getBoundaryBeziersBetween } from "./get-boundary-beziers-between.js";
import { sum } from '../../utils/sum.js';


/**
 * See https://research.gold.ac.uk/id/eprint/31944/
 * @param cpNode 
 */
function getSalience(cpNode: CpNode) {
    const cpNode1 = cpNode;
    const cpNode2 = cpNode.nextOnCircle;
    const bp1 = cpNode1.cp.pointOnShape.p;
    const bp2 = cpNode2.cp.pointOnShape.p;

    const d = distanceBetween(bp1, bp2);

    const { pss: bps, hasHoleCloser } = getBoundaryBeziersBetween(cpNode1, cpNode2);

    const s = sum(bps.map(ps => totalLength(ps)));

    return hasHoleCloser ? Number.POSITIVE_INFINITY : s/d;
}


export { getSalience }
