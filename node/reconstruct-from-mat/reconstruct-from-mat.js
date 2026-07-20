import { getMbssByLoopPerSat } from './get-mbss-by-loop-per-sat.js';
function reconstructFromMats(mats) {
    const loopss = [];
    const bzs = [];
    const mbssByLoopPerSat = getMbssByLoopPerSat(mats, 1.5);
    for (const mbssByLoopPS of mbssByLoopPerSat) {
        const { mbssByLoop, oppArr } = mbssByLoopPS;
        for (let l = 0; l < mbssByLoop.length; l++) {
            const rs = mbssByLoop[l];
            for (let i = 0; i < rs.length; i++) {
                const r = mbssByLoop[l][i];
                if (r === undefined) {
                    continue;
                }
                const matchedBezierss = r;
                for (let j = 0; j < matchedBezierss.length; j++) {
                    const mb = matchedBezierss[j];
                    const { boundaryBezier, medialBezier } = mb;
                    bzs.push(boundaryBezier);
                }
            }
        }
    }
    return bzs;
    // return loopss;
}
export { reconstructFromMats };
//# sourceMappingURL=reconstruct-from-mat.js.map