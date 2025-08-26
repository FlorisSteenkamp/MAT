import { length } from "flo-bezier3";
import { CpNode } from "../cp-node/cp-node.js";
import { getAllOnCircle } from "../cp-node/fs/get-all-on-circle.js";
import { getMatCurveToNext } from "../cp-node/fs/get-mat-curve-to-next.js";
import { traverseEdges } from "../cp-node/fs/traverse-edges.js";
import { DualSet, DualSetFs } from "../utils/dual-set.js";


function getSatCulls(
        cpNode: CpNode, 
        s: number) {

    /** 
     * All vertices that are set to be culled initially. This may change later 
     * in order to preserve topology. 
     */
    const culls: DualSet<number,number> = new Map();

    const rMap: Map<CpNode,number> = new Map();

    traverseEdges(cpNode, function(cpNode) {
        /** The occulating radius stored with this vertex. */
        const R = rMap.get(cpNode) || (s*cpNode.cp.circle.radius);

        const cpNode_ = cpNode.next;

        const l = length([0,1], getMatCurveToNext(cpNode));

        const r = cpNode_.cp.circle.radius;
        const r_ = s*r;
        if (R - l > r_) {
            for (const cpNode of getAllOnCircle(cpNode_)) {
                rMap.set(cpNode, R - l); // Update osculating radii
                if (!cpNode_.isHoleClosing) {
                    const { center: c } = cpNode_.cp.circle;
                    DualSetFs.add(culls, c[0], c[1]);
                }
            }
        }
    });

    return culls;
}


export { getSatCulls }
