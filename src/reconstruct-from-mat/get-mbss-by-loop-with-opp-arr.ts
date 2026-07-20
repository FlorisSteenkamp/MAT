import type { CpNode } from "../cp-node/cp-node.js";
import type { MatchedBeziers } from "./matched-beziers.js";
import { getMatchingBeziers } from "./get-matching-beziers.js";
import { isFullyTerminating } from "./is-fully-terminating.js";


function getMbssByLoopWithOppArr(
        cpNodess: CpNode[][]) {

    const mbssByLoop: (MatchedBeziers[] | undefined)[][] = [];

    /**
     * An array with each entry being a pair of indices mapping from
     * `MatchedBeziers[]` on one side to `MatchedBeziers[]` on the other side
     */
    const mbMap: Map<CpNode, [number,number]> = new Map();

    for (let l=0; l<cpNodess.length; l++) {
        const cpNodes = cpNodess[l];

        const mbss: (MatchedBeziers[] | undefined)[] = [];
        for (let i=0; i<cpNodes.length; i++) {
            const cpNode = cpNodes[i];

            mbMap.set(cpNode, [l,i]);

            const mbs = getMatchingBeziers(cpNode);

            mbss.push(mbs);
        }

        mbssByLoop.push(mbss);
    }


    const oppArr: [[number,number],[number,number]][] = [];

    for (let l=0; l<cpNodess.length; l++) {
        const cpNodes = cpNodess[l];

        for (let i=0; i<cpNodes.length; i++) {
            const cpNode = cpNodes[i];

            const cpNodeOpp = isFullyTerminating(cpNode)
                ? undefined // no opposite boundary
                : cpNode.next.prevOnCircle;
            
            // if (cpNodeOpp === undefined) {
            //     continue;
            // }

            const oppIdxs = cpNodeOpp === undefined
                ? [255,65535] as [number,number]
                : mbMap.get(cpNodeOpp);

            const mbs = mbssByLoop[l][i];
            if (oppIdxs !== undefined && mbs !== undefined) {
                oppArr.push([[l,i], oppIdxs]);
            } else {
                oppArr.push([[l,i], [255,65535]]);
            }
        }
    }

    return { mbssByLoop, oppArr };
}


export { getMbssByLoopWithOppArr }
