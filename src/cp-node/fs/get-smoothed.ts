import { totalAbsoluteCurvature, totalCurvature, totalLength } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { totalCurvature$ } from "../../bezier/total-curvature";
import { totalLength$ } from "../../bezier/total-length";
import { memoizePrimitive } from "../../memoize-primitive";
import { CpNode } from "../cp-node";
import { getAvgSpeed, getAvgSpeed$ } from "./get-avg-speed";
import { getMatCurveToNext, getMatCurveToNext$ } from "./get-mat-curve-to-next";
import { getSpeed } from "./get-speed";


const getSmoothed$ = memoizePrimitive(
    function (L: number) {
        return memoize(
            function getSmoothed(
                    cpNode: CpNode) {

                // return getAvg$(cpNode)
                // return getAvgCurvature(cpNode)
                let cpStart = cpNode;

                let cumLB = 0;
                let cumLF = 0;
                let curB = cpStart.prev;
                let curF = cpStart;
                let cumRTurnB = 0;
                let cumRTurnF = 0;
                while (cumLB < L/2 && curB !== cpStart) {
                    const { radius: r } = curB.cp.circle;
                    const ps = getMatCurveToNext$(curB);
                    const absK = totalCurvature$(ps);
                    const l = totalLength$(getMatCurveToNext$(curB));
                    cumRTurnB += r*absK;
                    cumLB += l;

                    curB = curB.prev;
                }
                while (cumLF < L/2 && curF !== cpStart.prev) {
                    const { radius: r } = curF.cp.circle;
                    const ps = getMatCurveToNext$(curF);
                    const absK = totalCurvature$(ps);
                    const l = totalLength$(getMatCurveToNext$(curF));
                    cumRTurnF += r*absK;
                    cumLF += l;

                    curF = curF.next;
                }
                const cumL = cumLB + cumLF;
                const cumRTurn = cumRTurnB + cumRTurnF;

                if (cumL === 0) {
                    return undefined;
                }

                return { cumRTurn, cumL };
            }
        )
    }
);


export { getSmoothed$ }
