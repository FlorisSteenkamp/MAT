"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const line_line_intersection_1 = require("../geometry/line-line-intersection");
const traverse_edges_1 = require("../../traverse-edges");
const get_edge_direction_1 = require("./get-edge-direction");
const TOLERANCE_ADD_2PRONG = 0.01;
const TOLERANCE_USE_LINE = 0.0001; // else cubic
/**
 * Smoothens the given MAT by fitting consecutive mat lines with either lines or
 * quadratic or cubic beziers.
 */
function smoothen(cpNode) {
    traverse_edges_1.traverseEdges(cpNode, f);
    function f(cpNode) {
        let fromCc = cpNode.cp.circle.center;
        let fromL = get_edge_direction_1.getEdgeDirection(cpNode);
        let toCc = cpNode.next.cp.circle.center;
        let toL = get_edge_direction_1.getEdgeDirection(cpNode.next.prevOnCircle);
        let mid = line_line_intersection_1.lineLineIntersection(fromL, toL);
        let c = flo_vector2d_1.fromTo(fromCc, toCc);
        let twisted;
        if (!mid) {
            twisted = true;
        }
        else {
            let a = flo_vector2d_1.fromTo(fromCc, mid);
            let b = flo_vector2d_1.fromTo(toCc, mid);
            twisted = flo_vector2d_1.dot(a, c) < 0 || flo_vector2d_1.dot(b, c) > 0;
        }
        if (!twisted) {
            cpNode.matCurveToNextVertex = [fromCc, mid, toCc];
            cpNode.next.prevOnCircle.matCurveToNextVertex = [toCc, mid, fromCc];
            return;
        }
        let r = flo_vector2d_1.rotate90Degrees(c);
        let w1 = flo_vector2d_1.fromTo(fromL[0], fromL[1]); // This is a unit vector
        let w2 = flo_vector2d_1.fromTo(toL[0], toL[1]); // This is a unit vector
        let d1 = Math.abs(flo_vector2d_1.cross(c, w1)) / (3 * 3);
        let d2 = Math.abs(flo_vector2d_1.cross(c, w2)) / (3 * 3);
        if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
            // TODO - not within tolerance - must add additional 2-prong
            cpNode.matCurveToNextVertex = [fromCc, toCc];
            cpNode.next.prevOnCircle.matCurveToNextVertex = [toCc, fromCc];
            return;
        }
        if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
            // approximate with cubic bezier
            let m1 = flo_vector2d_1.interpolate(fromCc, toCc, 1 / 3);
            let m2 = flo_vector2d_1.interpolate(fromCc, toCc, 2 / 3);
            let v1 = flo_vector2d_1.translate(r, m1);
            let v2 = flo_vector2d_1.translate(r, m2);
            let l1 = [m1, v1];
            let l2 = [m2, v2];
            let mid1 = line_line_intersection_1.lineLineIntersection(fromL, l1);
            let mid2 = line_line_intersection_1.lineLineIntersection(toL, l2);
            cpNode.matCurveToNextVertex = [fromCc, mid1, mid2, toCc];
            cpNode.next.prevOnCircle.matCurveToNextVertex = [toCc, mid2, mid1, fromCc];
            return;
        }
        // Within tolerance - approximate with a straight line.
        cpNode.matCurveToNextVertex = [fromCc, toCc];
        cpNode.next.prevOnCircle.matCurveToNextVertex = [toCc, fromCc];
    }
}
exports.smoothen = smoothen;
//# sourceMappingURL=smoothen.js.map