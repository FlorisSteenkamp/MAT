
import { Circle } from '../../circle';


/**
 * Spacially divide into 5 special groups as follows:
 * 
 *   *******||*******|*******|*******|*******||*******
 * 0 <--------------->
 * 1         <--------------->        
 * 2                 <--------------->
 * 3                         <--------------->
 * 4                                 <--------------->
 * 5 - If the circle does not fall in any of above 5 groups.
 * 
 * Note: In the above, the double pipes denote the limits for
 *       a coordinate, so as can be seen groups 0 and 4 go outside
 *       the limits. Also, groups 1 and 3 are preferred and checked
 *       first. 
 *          
 * @param s Scale parameter, e.g. 1.1
 * @param coordinate - 0 -> horizontal or 1 -> vertical.
 * @param limits - The limits within which the circle bounds can fall.
 * @param circle - The circle to categorize into a group. 
 */
function calcGroups(
        s: number, 
        coordinate: number, 
        limits: number[][], 
        circle: Circle) {

    let limit = limits[coordinate];
    let l1 = limit[0];
    let l2 = limit[1];

    // Relevant cut-off lines.
    let q = (l2 - l1) / 4;
    let w = q+q;

    // Shift origin
    let r = circle.radius;
    let x = circle.center[coordinate] - l1;
    let x0 = x - (r * s);
    let x1 = x + (r * s); 

    let newLimit: number[] = [,];
    let groups = []; // Group to which circle belongs;

    let qStart = Math.floor(x0/q);
    let qEnd   = Math.floor(x1/q) + 1;
    let qDiff  = qEnd - qStart; 

    let group;
    if (qDiff === 1) {
        // If contained in sliver.
        group = (2 * Math.floor(qStart/2)) + 1;
        groups.push(group);
        
        let lowerLimit = l1 + q*(group-1); 
        newLimit = [lowerLimit, lowerLimit + w];			
        
    } else if (qDiff === 2) {
        group = qStart + 1;
        groups.push(group);
        
        let lowerLimit = l1 + q*(group-1); 
        newLimit = [lowerLimit, lowerLimit + w];
    }

    let newLimits: number[][] = [,];
    if (groups.length === 1) {
        let otherCoordinate = coordinate ? 0 : 1; 
        
        newLimits[otherCoordinate] = limits[otherCoordinate];
        newLimits[coordinate] = newLimit;
    } 

    return { groups, newLimits };
}


export { calcGroups }
