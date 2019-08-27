"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Q and q: (from www.w3.org)
 *
 * params: x1 y1 x y
 *
 * Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1)
 * as the control point. Q (uppercase) indicates that absolute coordinates will
 * follow; q (lowercase) indicates that relative coordinates will follow.
 * Multiple sets of coordinates may be specified to draw a polybézier. At the
 * end of the command, the new current point becomes the final (x,y) coordinate
 * pair used in the polybézier.
 */
function q(s) {
    //---------------------------------------------------
    // Convert quadratic to cubic
    // see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
    //---------------------------------------------------
    let QP0 = s.p;
    let QP1 = [s.vals[0], s.vals[1]];
    let QP2 = [s.vals[2], s.vals[3]];
    /*
    // Endpoints stay the same
    let CP0 = QP0;
    let CP3 = QP2;
    
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
    
    let ps = [CP0, CP1, CP2, CP3];
    */
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = QP1;
    let ps = [QP0, QP1, QP2];
    return ps;
}
exports.q = q;
//# sourceMappingURL=q.js.map