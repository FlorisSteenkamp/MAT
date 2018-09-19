"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const mat_constants_1 = require("../../../mat-constants");
/**
 * Returns a line segment of unit length starting in the given Vertex center and
 * pointing in the direction of the medial axis.
 * @param cpNode
 * @param circleCenter
 * @param isPrev
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
    /*
    console.log(p1, p2);
    console.log(cp1, cp2);
    console.log('------');
    */
    if (pos1.type !== mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
        if (p1[0] === p2[0] && p1[1] === p2[1]) {
            vDir = flo_vector2d_1.fromTo(p1, circleCenter);
        }
        else {
            // Not a 1-prong.
            let spanner = flo_vector2d_1.fromTo(p1, p2);
            vDir = flo_vector2d_1.rotate90Degrees(spanner);
        }
    }
    else {
        if (pos1.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
            let bezierNode1;
            let bezierNode2;
            if (pos1.t === 0) {
                bezierNode1 = pos1.bezierNode;
                bezierNode2 = pos1.bezierNode.prev;
            }
            else if (pos1.t === 1) {
                bezierNode1 = pos1.bezierNode.next;
                bezierNode2 = pos1.bezierNode;
            }
            //let tan1 = Bezier3.tangent(bezierNode1.item.bezier3)(0);
            let tan1 = flo_bezier3_1.tangent(bezierNode1.ps)(0);
            let tan2 = flo_vector2d_1.reverse(
            //Bezier3.tangent(bezierNode2.item.bezier3)(1)
            flo_bezier3_1.tangent(bezierNode2.ps)(1));
            let x = flo_vector2d_1.dot(tan1, tan2);
            // Recall the identities sin(acos(x)) = sqrt(1-x^2), etc. Also 
            // recall the half angle formulas. Then the rotation matrix, R, can 
            // be calculated.
            let cosθ = Math.sqrt((1 + x) / 2);
            let sinθ = Math.sqrt((1 - x) / 2);
            vDir = flo_vector2d_1.rotate(sinθ, cosθ, tan2);
        }
    }
    let v = flo_vector2d_1.translate(flo_vector2d_1.toUnitVector(vDir), circleCenter);
    let l = [circleCenter, v];
    return l;
}
exports.getEdgeDirection = getEdgeDirection;
