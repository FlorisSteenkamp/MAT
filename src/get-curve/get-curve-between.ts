import { 
    fromTo, dot, cross, rotate90Degrees, interpolate, translate,
    lineLineIntersection
} from 'flo-vector2d';
import { CpNode } from '../cp-node.js';
import { getEdgeDirection } from './get-edge-direction.js';


/** @hidden */
const TOLERANCE_ADD_2PRONG = 0.01;
/** @hidden */
const TOLERANCE_USE_LINE = 0.0001; // else cubic


/**
 * Returns the bezier curve from the maximal disk of one [[CpNode]] to another
 * [[CpNode]]'s maximal disk.
 * @param cpNodeFrom 
 * @param cpNodeTo 
 */
function getCurveBetween(
        cpNodeFrom: CpNode, 
        cpNodeTo: CpNode) {

    const fromCc = cpNodeFrom.cp.circle.center;
    const fromL = getEdgeDirection(cpNodeFrom);

    const toCc = cpNodeTo.cp.circle.center;
    const toL = getEdgeDirection(cpNodeTo.prevOnCircle);

    const mid = lineLineIntersection(fromL, toL);

    const c = fromTo(fromCc,toCc);

    let twisted: boolean;
    if (!mid) {
        twisted = true;
    } else {
        const a = fromTo(fromCc, mid);
        const b = fromTo(toCc,   mid);
        
        twisted = dot(a,c) < 0 || dot(b,c) > 0;			
    }
    
    if (!twisted) {
        return [fromCc, mid, toCc];
    } 
        
    const r = rotate90Degrees(c);
    const w1 = fromTo(fromL[0], fromL[1]); // This is a unit vector
    const w2 = fromTo(toL[0],  toL[1]);  // This is a unit vector

    const d1 = Math.abs(cross(c, w1)) / (3*3); 
    const d2 = Math.abs(cross(c, w2)) / (3*3); 

    if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
        // TODO - not within tolerance - must add additional 2-prong
        return [fromCc, toCc];
    } 

    if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
        // approximate with cubic bezier
        const m1 = interpolate(fromCc,toCc,1/3);
        const m2 = interpolate(fromCc,toCc,2/3);
        const v1 = translate(r, m1);
        const v2 = translate(r, m2);
        const l1 = [m1,v1];
        const l2 = [m2,v2];
        const mid1 = lineLineIntersection(fromL, l1);
        const mid2 = lineLineIntersection(toL,   l2);

        return [fromCc, mid1, mid2, toCc];
    } 

    // Within tolerance - approximate with a straight line.
    return [fromCc, toCc];
}


export { getCurveBetween }
