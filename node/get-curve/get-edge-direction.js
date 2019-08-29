"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const point_on_shape_1 = require("../point-on-shape");
/**
 * @hidden
 * Returns a line segment of unit length starting in the given Vertex center and
 * pointing in the direction of the medial axis (viewed as a rooted tree).
 * @param cpNode
 */
function getEdgeDirection(cpNode) {
    let circleCenter = cpNode.cp.circle.center;
    let cp1 = cpNode;
    let cp2 = cpNode.nextOnCircle;
    let pos1 = cp1.cp.pointOnShape;
    let pos2 = cp2.cp.pointOnShape;
    let p1 = pos1.p;
    let p2 = pos2.p;
    let vDir;
    if (!point_on_shape_1.PointOnShape.isSharpCorner(pos1)) {
        if (p1[0] === p2[0] && p1[1] === p2[1]) {
            vDir = flo_vector2d_1.fromTo(p1, circleCenter); // A 1-prong
        }
        else {
            vDir = flo_vector2d_1.rotate90Degrees(flo_vector2d_1.fromTo(p1, p2)); // not a 1-prong.
        }
    }
    else {
        let curve1;
        let curve2;
        // TODO - test if pos1.t can ever be 0 - it is terminating
        if (pos1.t === 0) {
            curve1 = pos1.curve;
            curve2 = pos1.curve.prev;
        }
        else if (pos1.t === 1) {
            curve1 = pos1.curve.next;
            curve2 = pos1.curve;
        }
        let tan1 = flo_bezier3_1.tangent(curve1.ps)(0);
        let tan2 = flo_vector2d_1.reverse(flo_bezier3_1.tangent(curve2.ps)(1));
        let x = flo_vector2d_1.dot(tan1, tan2);
        // Recall the identities sin(acos(x)) = sqrt(1-x^2), etc. Also 
        // recall the half angle formulas. Then the rotation matrix, R, can 
        // be calculated.
        let cosθ = Math.sqrt((1 + x) / 2);
        let sinθ = Math.sqrt((1 - x) / 2);
        vDir = flo_vector2d_1.rotate(sinθ, cosθ, tan2);
    }
    let v = flo_vector2d_1.translate(flo_vector2d_1.toUnitVector(vDir), circleCenter);
    return [circleCenter, v];
}
exports.getEdgeDirection = getEdgeDirection;
//# sourceMappingURL=get-edge-direction.js.map