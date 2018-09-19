"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const line_line_intersection_1 = require("../geometry/line-line-intersection");
const traverse_edges_1 = require("../../functions/traverse-edges");
const get_edge_direction_1 = require("./get-edge-direction");
const TOLERANCE_ADD_2PRONG = 0.01;
const TOLERANCE_USE_LINE = 0.0001; // else cubic
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
function smoothen(cpNode) {
    let lines = [];
    let quads = [];
    let cubes = [];
    let i = 0; // testing
    traverse_edges_1.traverseEdges(cpNode, function (cp) {
        let fromVertex = cp.cp.circle;
        let toVertex = cp.next.cp.circle;
        let fromCc = fromVertex.center;
        let fromL = get_edge_direction_1.getEdgeDirection(cp);
        let toCc = toVertex.center;
        let toL = get_edge_direction_1.getEdgeDirection(cp.next.prevOnCircle);
        let mid = line_line_intersection_1.lineLineIntersection(fromL, toL);
        let c = flo_vector2d_1.fromTo(fromCc, toCc);
        let twisted;
        if (mid) {
            let a = flo_vector2d_1.fromTo(fromCc, mid);
            let b = flo_vector2d_1.fromTo(toCc, mid);
            let dot1 = flo_vector2d_1.dot(a, c);
            let dot2 = flo_vector2d_1.dot(b, c);
            twisted = (dot1 < 0 || dot2 > 0);
        }
        else {
            twisted = true;
        }
        if (twisted) {
            //i++;
            let r = flo_vector2d_1.rotate90Degrees(c);
            let w1 = flo_vector2d_1.fromTo(fromL[0], fromL[1]); // This is a unit vector
            let w2 = flo_vector2d_1.fromTo(toL[0], toL[1]); // This is a unit vector
            // The factor of 3 here is intuitive and since the curve does not
            // go through the point another factor of 3 should be about right
            // to get the approximate distance between a good fit cubic curve
            // of our data points and a straight line, i.e. it gives a good 
            // error measure. If d < 1 we should have our Medial Axis max error
            // in this piece at about 1.
            let d1 = Math.abs(flo_vector2d_1.cross(c, w1)) / (3 * 3);
            let d2 = Math.abs(flo_vector2d_1.cross(c, w2)) / (3 * 3);
            if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
                // Not within tolerance - must add additional 2-prong
                // TODO - replace below with correct code
                _debug_.fs.draw.line(fromL);
                _debug_.fs.draw.line(toL);
                _debug_.fs.draw.line([fromCc, toCc], ' blue thin10 nofill');
            }
            else if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
                // Not within tolerance - approximate with cubic bezier
                let m1 = flo_vector2d_1.interpolate(fromCc, toCc, 1 / 3);
                let m2 = flo_vector2d_1.interpolate(fromCc, toCc, 2 / 3);
                let v1 = flo_vector2d_1.translate(r, m1);
                let v2 = flo_vector2d_1.translate(r, m2);
                let l1 = [m1, v1];
                let l2 = [m2, v2];
                let mid1 = line_line_intersection_1.lineLineIntersection(fromL, l1);
                let mid2 = line_line_intersection_1.lineLineIntersection(toL, l2);
                cubes.push([fromCc, mid1, mid2, toCc]);
            }
            else {
                // Within tolerance - approximate with straight line
                lines.push([fromCc, toCc]);
            }
            //}
        }
        else {
            //console.log(prevCc, mid, currCc);
            quads.push([fromCc, mid, toCc]);
        }
    });
    return {
        lines,
        quads,
        cubes,
    };
}
exports.smoothen = smoothen;
