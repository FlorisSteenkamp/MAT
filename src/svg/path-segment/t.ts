
import { PathState } from '../path-state';


/**
 * T and t: (from www.w3.org) 
 *
 * params: x y
 * 
 * Draws a quadratic Bézier curve from the current point to (x,y). The control 
 * point is assumed to be the reflection of the control point on the previous 
 * command relative to the current point. (If there is no previous command or if 
 * the previous command was not a Q, q, T or t, assume the control point is 
 * coincident with the current point.) T (uppercase) indicates that absolute 
 * coordinates will follow; t (lowercase) indicates that relative coordinates 
 * will follow. At the end of the command, the new current point becomes the 
 * final (x,y) coordinate pair used in the polybézier.
 */
function t(s: PathState) {
    let p: number[] = [undefined, undefined];
    if (s.prev2ndQuadraticControlPoint) {
        p[0] = (s.p[0] - s.prev2ndQuadraticControlPoint[0]) + s.p[0]; 
        p[1] = (s.p[1] - s.prev2ndQuadraticControlPoint[1]) + s.p[1];
    } else {
        p = s.p;
    }

    //---------------------------------------------------
    // Convert quadratic to cubic
    // see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
    //---------------------------------------------------
    
    let QP0 = s.p;
    let QP1 = p;
    let QP2 = [s.vals[0], s.vals[1]];
    
    /*
    // CP1 = QP0 + 2/3 *(QP1-QP0)
    let CP1 = [
        QP0[0] + (2/3)*(QP1[0]-QP0[0]), 
        QP0[1] + (2/3)*(QP1[1]-QP0[1])
    ];
    // CP2 = QP2 + 2/3 *(QP1-QP2)
    let CP2 = [
        QP2[0] + (2/3)*(QP1[0]-QP2[0]), 
        QP2[1] + (2/3)*(QP1[1]-QP2[1])
    ];
    
    let ps = [QP0, CP1, CP2, QP2];
    */

    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = QP1;

    let ps = [QP0, QP1, QP2];
    
    return ps;
}


export { t }
