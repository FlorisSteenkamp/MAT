
import { PathState } from '../path-state';


/**
 * @hidden
 * V and v: (from www.w3.org) 
 * 
 * params: y
 * 
 * Draws a vertical line from the current point (cpx, cpy) to (cpx, y). V 
 * (uppercase) indicates that absolute coordinates will follow; v (lowercase) 
 * indicates that relative coordinates will follow. Multiple y values can be 
 * provided (although usually this doesn't make sense). At the end of the 
 * command, the new current point becomes (cpx, y) for the final value of y.
 */
function v(s: PathState) {
    let ps = [
        s.p,
        [s.p[0], s.vals[0]]
    ];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    
    return ps;
}


export { v }
