"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
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
    let QP1 = [s.vals[0], s.vals[1]];
    let QP2 = [s.vals[2], s.vals[3]];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = QP1;
    let ps = [s.p, QP1, QP2];
    return ps;
}
exports.q = q;
//# sourceMappingURL=q.js.map