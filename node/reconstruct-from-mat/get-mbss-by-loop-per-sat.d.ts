import type { Mat } from "../mat/mat.js";
declare function getMbssByLoopPerSat(mats: Mat[], satScale: number): {
    mbssByLoop: (import("./matched-beziers.js").MatchedBeziers[] | undefined)[][];
    oppArr: [[number, number], [number, number]][];
}[];
export { getMbssByLoopPerSat };
