import { curvature, totalAbsoluteCurvature, totalLength } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { sum } from "../../utils/sum.js";
import { CpNode } from "../cp-node.js";
import { getBoundaryBeziersToNext } from "./get-boundary-beziers-to-next.js";
import { getMatCurveToNext } from "./get-mat-curve-to-next.js";
import { getRealProngCount } from "./get-real-prong-count.js";

const { min, abs } = Math;


const getSpeed$ = memoize(getSpeed);


function getSpeed(cpNode: CpNode): number | undefined {
    if (getRealProngCount(cpNode) !== 2) {
        return 0;
    }

    const { radius: r } = cpNode.cp.circle;
    const matPs = getMatCurveToNext(cpNode);
    const absK = totalAbsoluteCurvature(matPs, [0,1]);
    const l = totalLength(matPs);
    if (l === 0) {
        return undefined;  // TODO2
    }
    // const avgK = absK/l;
    const avgK = absK;

    return avgK*r;
}




// function getSpeed() {
    // const cpNodeF = cpNode;
    // const cpNodeB = cpNode.next.prevOnCircle;
    // const matPs = getMatCurveToNext(cpNodeF);
    // const boundaryPsF = getBoundaryBeziersToNext(cpNodeF);
    // const boundaryPsB = getBoundaryBeziersToNext(cpNodeB);

    // const lF = sum(boundaryPsF.map(ps => totalLength(ps)));
    // const lB = sum(boundaryPsB.map(ps => totalLength(ps)));

    // const l = totalLength(matPs);
    // const ll = l === 0 ? 0.001 : l;

    // const _speedF = lF/ll;
    // const _speedB = lB/ll;

    // const speedF = _speedF < 1 ? _speedF : 1;
    // const speedB = _speedB < 1 ? _speedB : 1;


    // const speed = min(speedF, speedB);

    // return speed;
// }

export { getSpeed, getSpeed$ }
