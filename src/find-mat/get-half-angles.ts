import { tangent, toPowerBasis_1stDerivative } from "flo-bezier3";
import { allRoots } from "flo-poly";
import { CpNode } from "../cp-node/cp-node.js";
import { createPos } from "../point-on-shape/create-pos.js";
import { PointOnShape } from "../point-on-shape/point-on-shape.js";

const { atan2, abs, sin, cos } = Math;


const MIN_ANGLE = 1/180*Math.PI;


function getHalfAngle(
        cpNodeS: CpNode) {

    const cpNodeE = cpNodeS.next;

    // Get half angle
    const { curve: curveS, t: tS } = cpNodeS.cp.pointOnShape;
    const { curve: curveE, t: tE } = cpNodeE.cp.pointOnShape;
    const { ps: psS } = curveS;
    const { ps: psE } = curveE;

    if (psS === psE && psS.length < 3) {
        return createPos(curveS, (tS + tE)/2);
        // return undefined;
    }

    const tanS = tangent(psS, tS);
    const tanE = tangent(psE, tE);
    const angleS = atan2(tanS[1], tanS[0]);
    const angleE = atan2(tanE[1], tanE[0]);
    const angle = angleS + angleE;

    if (abs(angle) <= MIN_ANGLE) {
        return curveS === curveE
            ? createPos(curveS, (tS + tE)/2)
            : tS < 1 - tE  // start closer to endpoint than end?
            ? createPos(curveS, (1 - tS)/2)
            : createPos(curveE, tE/2)
    }

    const halfAngle = angle/2;
    const x = cos(halfAngle);
    const y = sin(halfAngle);
    const q = x/y;
    /////////
    
    {
        const tE_ = curveS === curveE ? tE : 1;
        const roots = getHalfAngleRoots(psS, tS, tE_, q);
        if (roots.length > 0) {
            return createPos(curveS, roots[0]);
        }
    }
    {
        const tS_ = curveS === curveE ? tS : 0;
        const roots = getHalfAngleRoots(psE, tS_, tE, q);
        if (roots.length > 0) {
            return createPos(curveE, roots[0]);
        }
    }

    return undefined;
}


function getHalfAngleRoots(
        ps: number[][],
        tS: number,
        tE: number,
        q: number): number[] {

    let roots: number[] = [];
    if (ps.length === 3) {
        const pbS = toPowerBasis_1stDerivative(ps);
        const [[a,b],[c,d]] = pbS;
        // Solve: (a - cq)t + b - dq = 0
        roots = [(-b + d*q)/(a - c*q)];
    } else if (ps.length === 4) {
        const pbS = toPowerBasis_1stDerivative(ps);
        const [[a,b,c],[d,e,f]] = pbS;
        // Solve: (a - dq)t^2 + (b - eq)t + c - fq = 0
        const ts = [a - d*q, b - e*q, c - f*q];;
        roots = allRoots(ts)
    }
    
    return roots.filter(r =>
        r > tS &&
        r < tE
    );
}


export { getHalfAngle }
