import { Circle } from '../../circle.js';


/**
 * @hidden
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

    const limit = limits[coordinate];
    const l1 = limit[0];
    const l2 = limit[1];

    // Relevant cut-off lines.
    const q = (l2 - l1) / 4;
    const w = q+q;

    // Shift origin
    const r = circle.radius;
    const x = circle.center[coordinate] - l1;
    const x0 = x - (r * s);
    const x1 = x + (r * s); 

    let newLimit: (number | undefined)[] = [,];
    const groups: number[] = []; // Group to which circle belongs;

    const qStart = Math.floor(x0/q);
    const qEnd   = Math.floor(x1/q) + 1;
    const qDiff  = qEnd - qStart; 

    let group: number;
    if (qDiff === 1) {
        // If contained in sliver.
        group = (2 * Math.floor(qStart/2)) + 1;
        groups.push(group);
        
        const lowerLimit = l1 + q*(group-1); 
        newLimit = [lowerLimit, lowerLimit + w];			
        
    } else if (qDiff === 2) {
        group = qStart + 1;
        groups.push(group);
        
        const lowerLimit = l1 + q*(group-1); 
        newLimit = [lowerLimit, lowerLimit + w];
    }

    const newLimits: ((number | undefined)[] | undefined)[] = [,];
    if (groups.length === 1) {
        const otherCoordinate = coordinate ? 0 : 1; 
        
        newLimits[otherCoordinate] = limits[otherCoordinate];
        newLimits[coordinate] = newLimit;
    } 

    return { groups, newLimits };
}


export { calcGroups }
