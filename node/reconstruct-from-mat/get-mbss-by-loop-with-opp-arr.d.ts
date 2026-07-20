import type { CpNode } from "../cp-node/cp-node.js";
import type { MatchedBeziers } from "./matched-beziers.js";
declare function getMbssByLoopWithOppArr(cpNodess: CpNode[][]): {
    mbssByLoop: (MatchedBeziers[] | undefined)[][];
    oppArr: [[number, number], [number, number]][];
};
export { getMbssByLoopWithOppArr };
