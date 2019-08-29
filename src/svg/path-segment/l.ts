
import { PathState } from '../path-state';


/** 
 * @hidden
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
    let ps = [
        s.p,
        s.vals
    ];

    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;

    return ps;
}


export { l }
