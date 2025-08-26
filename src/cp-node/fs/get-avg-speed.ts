import { totalAbsoluteCurvature, totalLength } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { totalCurvature$ } from "../../bezier/total-curvature";
import { CpNode } from "../cp-node";
import { getMatCurveToNext } from "./get-mat-curve-to-next";
import { getRealProngCount } from "./get-real-prong-count";

const { min, abs } = Math;


const getAvgSpeed$ = memoize(getAvgSpeed);


function getAvgSpeed(cpNode: CpNode): number | undefined {
    if (getRealProngCount(cpNode) !== 2) {
        return 0;
    }

    const { radius: r } = cpNode.cp.circle;
    const matPs = getMatCurveToNext(cpNode);
    const T = totalCurvature$(matPs);
    const l = totalLength(matPs);
    if (l === 0) {
        return undefined;
    }
    
    return -r*T/l;
}


export { getAvgSpeed, getAvgSpeed$ }
