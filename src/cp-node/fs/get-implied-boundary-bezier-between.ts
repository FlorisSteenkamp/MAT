import { tangent } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
import { 
    fromTo, dot, cross, translate, lineLineIntersection, toUnitVector
} from 'flo-vector2d';
import { CpNode } from '../cp-node.js';


/** @internal */
const TOLERANCE_ADD_2PRONG = 0.01;
/** @internal */
const TOLERANCE_USE_LINE = 0.0001; // else cubic


function getImpliedBoundaryBezierBetween(
        cpNodeA: CpNode,
        cpNodeB: CpNode): number[][] | undefined {

    const posA = cpNodeA.cp.pointOnShape;
    const posB = cpNodeB.cp.pointOnShape;

    let { curve: curveA, p: pA, t: tA } = posA;
    let { curve: curveB, p: pB, t: tB } = posB;

    if (pA[0] === pB[0] && pA[1] === pB[1]) {
        return [pA];
    }

    if (tA === 1) { tA = 0; curveA = curveA.next; }
    if (tB === 0) { tB = 1; curveB = curveB.prev; }
    
    const { ps: psA } = curveA;
    const { ps: psB } = curveB;

    const lA = [pA,translate(pA)(toUnitVector(tangent(psA, tA)))];
    const lB = [pB,translate(pB)(toUnitVector(tangent(psB, tB)))];

    const mid = lineLineIntersection(lA, lB);

    const c = fromTo(pA,pB);

    let twisted: boolean;
    if (!mid) {
        twisted = true;
    } else {
        const a = fromTo(pA, mid);
        const b = fromTo(pB, mid);
        
        twisted = dot(a,c) < 0 || dot(b,c) > 0;
    }
    
    if (!twisted) {
        // drawFs.bezier(g, [pA, mid!, pB], 'thin10 pink nofill', 0)
        return [pA, mid!, pB];
    } 
        
    const w1 = fromTo(lA[0], lA[1]);  // This is a unit vector
    const w2 = fromTo(lB[0], lB[1]);  // This is a unit vector

    const d1 = Math.abs(cross(c, w1)) / (3*3); 
    const d2 = Math.abs(cross(c, w2)) / (3*3); 

    if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
        // not within tolerance
        return undefined;
    } 

    if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
        // approximate with cubic bezier?
        return undefined;  // add 2-prong
    } 

    // Within tolerance - approximate with a straight line.
    return [pA, pB];
}


export { getImpliedBoundaryBezierBetween }
