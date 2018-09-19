
import { PathState } from '../path-state';


/** 
 * L and l: (from www.w3.org)
 * 
 * params: x y 
 * 
 * Draw a line from the current point to the given (x,y) coordinate which 
 * becomes the new current point. L (uppercase) indicates that absolute 
 * coordinates will follow; l (lowercase) indicates that relative coordinates 
 * will follow. A number of coordinates pairs may be specified to draw a 
 * polyline. At the end of the command, the new current point is set to the 
 * final set of coordinates provided.
 */	
function l(s: PathState) {
    let xInterval = (s.vals[0] - s.p[0])/3;
    let yInterval = (s.vals[1] - s.p[1])/3;

    let ps = [
        s.p,
        [s.p[0] + xInterval*1, s.p[1] + yInterval*1],
        [s.p[0] + xInterval*2, s.p[1] + yInterval*2],
        [s.p[0] + xInterval*3, s.p[1] + yInterval*3]
    ];

    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;

    return ps;
}


export { l }
