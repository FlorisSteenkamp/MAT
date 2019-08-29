"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 * C and c: (from www.w3.org)
 *
 * params: x1 y1 x2 y2 x y
 *
 * Draws a cubic Bézier curve from the current point to (x,y)
 * using (x1,y1) as the control point at the beginning of the
 * curve and (x2,y2) as the control point at the end of the
 * curve. C (uppercase) indicates that absolute coordinates
 * will follow; c (lowercase) indicates that relative
 * coordinates will follow. Multiple sets of coordinates may
 * be specified to draw a polybézier. At the end of the
 * command, the new current point becomes the final (x,y)
 * coordinate pair used in the polybézier.
 */
function c(s) {
    let ps = [
        s.p,
        [s.vals[0], s.vals[1]],
        [s.vals[2], s.vals[3]],
        [s.vals[4], s.vals[5]]
    ];
    s.prev2ndCubicControlPoint = ps[2];
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.c = c;
//# sourceMappingURL=c.js.map