import { getTAtLength, length } from "flo-bezier3";
import { createPos } from "../../point-on-shape/create-pos.js";
import { CpNode } from "../cp-node.js";


function addDistanceFrom(
        d: number,
        cpNode: CpNode) {

    const posS = cpNode.cp.pointOnShape;
    const curveS = posS.curve;

    let tS = posS.t;
    let cumL = 0;
    let dist = 0;
    let curve = curveS;
    let ps;
    let dLeft = d;
    while (true) {
        ps = curve.ps;
        dist = length([tS,1], ps);
        cumL += dist;

        if (cumL < d) {
            tS = 0;
            dLeft -= dist;
            curve = curve.next;
        } else {
            break;
        }
    }

    // const overshoot = cumL - d;
    const lL = length([0,tS], curve.ps);
    const l = lL + dLeft;

    const t = getTAtLength(curve.ps, l);

    const posE = createPos(curve, t);

    return posE;
}



export { addDistanceFrom }


// TESTING

