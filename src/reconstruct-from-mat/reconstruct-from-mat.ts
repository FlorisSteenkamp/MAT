import type { BezierPiece } from 'flo-bezier3';
import type { Mat } from '../mat/mat.js';
import { getMbssByLoopPerSat } from './get-mbss-by-loop-per-sat.js';
import { getMbssByLoopWithOppArr } from './get-mbss-by-loop-with-opp-arr.js';


function reconstructFromMats(
        mats: Mat[]) {

    const loopss: number[][][][] = [];

    const bzs: BezierPiece[] = [];

    const mbssByLoopPerSat = getMbssByLoopPerSat(mats, 1.5)!;

    for (const mbssByLoopPS of mbssByLoopPerSat) {
        const { mbssByLoop, oppArr } = mbssByLoopPS;

        for (let l=0; l<mbssByLoop.length; l++) {
            const rs = mbssByLoop[l];

            for (let i=0; i<rs.length; i++) {
                const r = mbssByLoop[l][i];

                if (r === undefined) { continue; }

                const matchedBezierss = r;

                for (let j=0; j<matchedBezierss.length; j++) {
                    const mb = matchedBezierss[j];
                    const { boundaryBezier, medialBezier } = mb;

                    bzs.push(boundaryBezier)
                }
            }
        }
    }


    return bzs;
    // return loopss;
}


export { reconstructFromMats }
