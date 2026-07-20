import { getMatchingBeziers } from "./get-matching-beziers.js";
import { isFullyTerminating } from "./is-fully-terminating.js";
function getMbssByLoopWithOppArr(cpNodess) {
    const mbssByLoop = [];
    /**
     * An array with each entry being a pair of indices mapping from
     * `MatchedBeziers[]` on one side to `MatchedBeziers[]` on the other side
     */
    const mbMap = new Map();
    for (let l = 0; l < cpNodess.length; l++) {
        const cpNodes = cpNodess[l];
        const mbss = [];
        for (let i = 0; i < cpNodes.length; i++) {
            const cpNode = cpNodes[i];
            mbMap.set(cpNode, [l, i]);
            const mbs = getMatchingBeziers(cpNode);
            mbss.push(mbs);
        }
        mbssByLoop.push(mbss);
    }
    const oppArr = [];
    for (let l = 0; l < cpNodess.length; l++) {
        const cpNodes = cpNodess[l];
        for (let i = 0; i < cpNodes.length; i++) {
            const cpNode = cpNodes[i];
            const cpNodeOpp = isFullyTerminating(cpNode)
                ? undefined // no opposite boundary
                : cpNode.next.prevOnCircle;
            // if (cpNodeOpp === undefined) {
            //     continue;
            // }
            const oppIdxs = cpNodeOpp === undefined
                ? [255, 65535]
                : mbMap.get(cpNodeOpp);
            const mbs = mbssByLoop[l][i];
            if (oppIdxs !== undefined && mbs !== undefined) {
                oppArr.push([[l, i], oppIdxs]);
            }
            else {
                oppArr.push([[l, i], [255, 65535]]);
            }
        }
    }
    return { mbssByLoop, oppArr };
}
export { getMbssByLoopWithOppArr };
//# sourceMappingURL=get-mbss-by-loop-with-opp-arr.js.map