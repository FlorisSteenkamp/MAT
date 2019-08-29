
import { 
	fromTo, dot, cross, rotate90Degrees, interpolate, translate
} from 'flo-vector2d';
import { CpNode } from '../cp-node';
import { lineLineIntersection } from '../mat/geometry/line-line-intersection';
import { getEdgeDirection } from './get-edge-direction';


const TOLERANCE_ADD_2PRONG = 0.01;
const TOLERANCE_USE_LINE = 0.0001; // else cubic


/**
 * 
 * @param cpNodeFrom 
 * @param cpNodeTo 
 */
function getCurveBetween(
        cpNodeFrom: CpNode, 
        cpNodeTo: CpNode) {

    let fromCc = cpNodeFrom.cp.circle.center;
    let fromL = getEdgeDirection(cpNodeFrom);

    let toCc = cpNodeTo.cp.circle.center;
    let toL = getEdgeDirection(cpNodeTo.prevOnCircle);

    let mid = lineLineIntersection(fromL, toL);

    let c = fromTo(fromCc,toCc);

    let twisted: boolean;
    if (!mid) {
        twisted = true;
    } else {
        let a = fromTo(fromCc, mid);
        let b = fromTo(toCc,   mid);
        
        twisted = dot(a,c) < 0 || dot(b,c) > 0;			
    }
    
    if (!twisted) {
        return [fromCc, mid, toCc];
    } 
        
    let r = rotate90Degrees(c);
    let w1 = fromTo(fromL[0], fromL[1]); // This is a unit vector
    let w2 = fromTo(toL[0],  toL[1]);  // This is a unit vector

    let d1 = Math.abs(cross(c, w1)) / (3*3); 
    let d2 = Math.abs(cross(c, w2)) / (3*3); 

    if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
        // TODO - not within tolerance - must add additional 2-prong
        return [fromCc, toCc];
    } 

    if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
        // approximate with cubic bezier
        let m1 = interpolate(fromCc,toCc,1/3);
        let m2 = interpolate(fromCc,toCc,2/3);
        let v1 = translate(r, m1);
        let v2 = translate(r, m2);
        let l1 = [m1,v1];
        let l2 = [m2,v2];
        let mid1 = lineLineIntersection(fromL, l1);
        let mid2 = lineLineIntersection(toL,   l2);

        return [fromCc, mid1, mid2, toCc];
    } 

    // Within tolerance - approximate with a straight line.
    return [fromCc, toCc];
}


export { getCurveBetween }
