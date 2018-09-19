
import { PathState } from "../path-state";


/* 
 * A and a: (from www.w3.org) 
 * 
 * params: rx ry x-axis-rotation large-arc-flag sweep-flag x y
 * 
 * Draws an elliptical arc from the current point to (x, y). The size and 
 * orientation of the ellipse are defined by two radii (rx, ry) and an 
 * x-axis-rotation, which indicates how the ellipse as a whole is rotated 
 * relative to the current coordinate system. The center (cx, cy) of the ellipse 
 * is calculated automatically to satisfy the constraints imposed by the other 
 * parameters. large-arc-flag and sweep-flag contribute to the automatic 
 * calculations and help determine how the arc is drawn.
 */
function a(s: PathState): number[][] {
    // TODO - not implemented yet (or not necessary)
    s.prev2ndCubicControlPoint = undefined; 
    s.prev2ndQuadraticControlPoint = undefined;
    
    // Update current point
    //x0 = ? ps[3][0]; 
    //y0 = ? ps[3][1];

    return undefined;
}


export { a }
