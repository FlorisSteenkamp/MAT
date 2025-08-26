import { memoize } from "flo-memoize";
import { totalCurvature$ } from "../../bezier/total-curvature.js";
import { totalLength$ } from "../../bezier/total-length.js";
import { memoizePrimitive } from "../../memoize-primitive.js";
import { CpNode } from "../cp-node.js";
import { getMatCurveToNext$ } from "./get-mat-curve-to-next.js";
import { getRealProngCount } from "./get-real-prong-count.js";
import { isFullyTerminating } from "./is-fully-terminating.js";


const RLen = 40;

const getSmoothedSpeed$ = memoizePrimitive(
    function (L: number) {
        return memoize(
            function getSmoothedSpeed(
                    cpNode: CpNode): number | undefined {

                let cpStart = cpNode;

                let cumLB = 0;
                let cumLF = 0;
                let curB = cpStart.prev;
                let curF = cpStart;
                let cumKB = 0;
                let cumKF = 0;
                let cumLRB = 0;
                let cumLRF = 0;
                while (cumLRF < L/2/RLen &&
                       curF !== cpStart.prev &&
                       !isFullyTerminating(curF) &&
                       getRealProngCount(curF) <= 2) {
                    const { radius: r } = curF.cp.circle;
                    const ps = getMatCurveToNext$(curF);
                    const turn = totalCurvature$(ps);

                    let rot = 0;
                    // if (getProngCount(curF) >= 3) {
                    //     rot = -getInterfaceRotation(
                    //         tangentAt0(ps),
                    //         tangentAt1(curF.prev.cp.pointOnShape.curve.ps)
                    //     );
                    // }

                    const l = totalLength$(getMatCurveToNext$(curF));
                    cumKF += r*(turn + rot);
                    cumLF += l;
                    cumLRF += l/r;

                    curF = curF.next;
                }
                while (cumLRB < L/2/RLen &&
                       curB !== cpStart &&
                       !isFullyTerminating(curB) &&
                       getRealProngCount(curB) <= 2) {
                    const { radius: r } = curB.cp.circle;
                    const ps = getMatCurveToNext$(curB);
                    const turn = totalCurvature$(ps);

                    let rot = 0;
                    // if (getProngCount(curB) >= 3) {
                    //     rot = -getInterfaceRotation(
                    //         tangentAt0(ps),
                    //         tangentAt1(curB.prev.cp.pointOnShape.curve.ps)
                    //     )
                    // }

                    const l = totalLength$(getMatCurveToNext$(curB));
                    cumKB += r*(turn + rot);
                    cumLB += l;
                    cumLRB += l/r;

                    curB = curB.prev;
                }
                const cumL = cumLB + cumLF;
                const cumK = cumKB + cumKF;

                if (cumL === 0) {
                    return undefined;
                }

                const x = -cumK/cumL;

                // f(x) = 1 - exp(-x)
                // f(x) = 1 - 1/(1 + x)
                // f(x) = x/(a + x)
                // f(x) = tanh(x)

                // return 1 - Math.E**(-x)
                return x;
            }
        )
    }
);


export { getSmoothedSpeed$ }
