import type { CpNode } from "../cp-node.js";
import { distanceBetween } from "flo-vector2d";
import { totalLength } from "flo-bezier3";
import { getBoundaryBeziersBetween } from "./get-boundary-beziers-between.js";
import { sum } from '../../utils/sum.js';


/**
 * Returns the salience of the given `CpNode`: the ratio of the boundary length
 * from its contact point forward to the next contact point on its circle to
 * the straight distance between those two points.
 *
 * * `Infinity` if that stretch of boundary passes a hole closer
 * * `0` if the two contact points coincide with no boundary in between (the
 *   terminating `CpNode` of a 1-prong) - the other `CpNode` of a 1-prong,
 *   whose stretch is the entire boundary, gives `Infinity`
 *
 * See https://research.gold.ac.uk/id/eprint/31944/
 *
 * @param cpNode
 */
function getSalience(cpNode: CpNode) {
    const cpNode1 = cpNode;
    const cpNode2 = cpNode.nextOnCircle;
    const bp1 = cpNode1.pointOnShape.p;
    const bp2 = cpNode2.pointOnShape.p;

    const d = distanceBetween(bp1, bp2);

    const { pss, hasHoleCloser } = getBoundaryBeziersBetween(cpNode1, cpNode2);

    const s = sum(pss.map(ps => totalLength(ps)));

    if (hasHoleCloser) { return Infinity; }
    if (s === 0) { return 0; }  // (avoids `0/0` for the 1-prong case)

    return s/d;
}


export { getSalience }
