"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_poly_1 = require("flo-poly");
const flo_bezier3_1 = require("flo-bezier3");
/**
 * Get all intersection points between a line and a bezier within a certain t
 * range.
 */
function getLineBezierIntersection(line, ps, tRange) {
    let t = [-line[0][0], -line[0][1]];
    let p = [
        line[1][0] + t[0],
        line[1][1] + t[1],
    ];
    // Cache
    let lineLength = flo_vector2d_1.len(p);
    let sinθ = -p[1] / lineLength;
    let cosθ = p[0] / lineLength;
    let newPs = flo_vector2d_1.translateThenRotatePs(t, sinθ, cosθ, ps);
    let roots = flo_poly_1.default.allRoots(flo_bezier3_1.getY(newPs), 0, 1);
    return roots.map(t => ({ p: flo_bezier3_1.evaluate(ps)(t), t }));
}
exports.getLineBezierIntersection = getLineBezierIntersection;
