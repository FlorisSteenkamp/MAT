"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const Bezier3 = require("flo-bezier3");
const Vector = require("flo-vector2d");
const geometry_1 = require("../functions/geometry");
const traverse_edges_1 = require("../functions/traverse-edges");
const TOLERANCE_ADD_2PRONG = 0.01;
const TOLERANCE_USE_LINE = 0.0001; // else cubic
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
function smoothen(mat) {
    let lines = [];
    let quads = [];
    let cubes = [];
    let i = 0; // testing
    traverse_edges_1.traverseEdges(mat, f);
    function f(fromCp, toCp, fromVertex, toVertex) {
        let prevCc = fromVertex.circle.center;
        let prevL = getEdgeDirection(fromCp, prevCc, true);
        let curCc = toVertex.circle.center;
        let curL = getEdgeDirection(toCp, curCc, false);
        let mid = geometry_1.Geometry.lineLineIntersection(prevL, curL);
        let c = Vector.fromTo(prevCc, curCc);
        let twisted;
        if (mid) {
            let a = Vector.fromTo(prevCc, mid);
            let b = Vector.fromTo(curCc, mid);
            let dot1 = Vector.dot(a, c);
            let dot2 = Vector.dot(b, c);
            twisted = (dot1 < 0 || dot2 > 0);
        }
        else {
            twisted = true;
        }
        if (twisted) {
            //i++;
            let r = Vector.rotate90Degrees(c);
            let w1 = Vector.fromTo(prevL[0], prevL[1]); // This is a unit vector
            let w2 = Vector.fromTo(curL[0], curL[1]); // This is a unit vector
            // The factor of 3 here is intuitive and since the curve does not
            // go through the point another factor of 3 should be about right
            // to get the approximate distance between a good fit cubic curve
            // of our data points and a straight line, i.e. it gives a good 
            // error measure. If d < 1 we should have our Medial Axis max error
            // in this piece at about 1.
            let d1 = Math.abs(Vector.cross(c, w1)) / (3 * 3);
            let d2 = Math.abs(Vector.cross(c, w2)) / (3 * 3);
            if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
                // Not within tolerance - must add additional 2-prong
                /*
                console.log(d1,d2);
                */
                // TODO - replace below with correct code
                _debug_.fs.draw.line(prevL);
                _debug_.fs.draw.line(curL);
                _debug_.fs.draw.line([prevCc, curCc], ' blue thin10 nofill');
            }
            else if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
                // Not within tolerance - approximate with cubic bezier
                let m1 = Vector.interpolate(prevCc, curCc, 1 / 3);
                let m2 = Vector.interpolate(prevCc, curCc, 2 / 3);
                let v1 = Vector.translate(r, m1);
                let v2 = Vector.translate(r, m2);
                let l1 = [m1, v1];
                let l2 = [m2, v2];
                let mid1 = geometry_1.Geometry.lineLineIntersection(prevL, l1);
                let mid2 = geometry_1.Geometry.lineLineIntersection(curL, l2);
                cubes.push([prevCc, mid1, mid2, curCc]);
            }
            else {
                // Within tolerance - approximate with straight line
                lines.push([prevCc, curCc]);
            }
            //}
        }
        else {
            //console.log(prevCc, mid, currCc);
            quads.push([prevCc, mid, curCc]);
        }
    }
    return {
        lines,
        quads,
        cubes,
    };
}
exports.smoothen = smoothen;
/**
 * Divides the given curve roughly in the middle in the sense that the total
 * curvature in the two pieces are roughly the same.
 *
 * This function takes (discontinuous) corners into account.
 */
function divideCurve(cp) {
    return;
}
/**
 * Returns a line segment of unit length starting in the Mat circle center and
 * pointing in the direction of the medial axis.
 * @param cp
 * @param circleCenter
 * @param isPrev
 */
function getEdgeDirection(cp, circleCenter, isPrev) {
    let cp1 = cp.item;
    let cp2 = isPrev
        ? cp.nextOnCircle.item
        : cp.prevOnCircle.item;
    let vDir;
    if (cp1 !== cp2) {
        // Not a 1-prong.
        let spanner = Vector.fromTo(cp1.pointOnShape.p, cp2.pointOnShape.p);
        vDir = Vector.rotate90Degrees(spanner);
    }
    else {
        if (cp1.pointOnShape.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
            let bezierNode1;
            let bezierNode2;
            if (cp1.pointOnShape.t === 0) {
                bezierNode1 = cp1.pointOnShape.bezierNode;
                bezierNode2 = cp1.pointOnShape.bezierNode.prev;
            }
            else if (cp1.pointOnShape.t === 1) {
                bezierNode1 = cp1.pointOnShape.bezierNode.next;
                bezierNode2 = cp1.pointOnShape.bezierNode;
            }
            //let tan1 = Bezier3.tangent(bezierNode1.item.bezier3)(0);
            let tan1 = Bezier3.tangent(bezierNode1.item)(0);
            let tan2 = Vector.reverse(
            //Bezier3.tangent(bezierNode2.item.bezier3)(1)
            Bezier3.tangent(bezierNode2.item)(1));
            let x = Vector.dot(tan1, tan2);
            // Recall the identities sin(acos(x)) = sqrt(1-x^2), etc. Also 
            // recall the half angle formulas. Then the rotation matrix, R, can 
            // be calculated.
            let cosθ = Math.sqrt((1 + x) / 2);
            let sinθ = Math.sqrt((1 - x) / 2);
            vDir = Vector.rotate(sinθ, cosθ, tan2);
        }
        else {
            vDir = Vector.fromTo(cp1.pointOnShape.p, circleCenter);
        }
    }
    let v = Vector.translate(Vector.toUnitVector(vDir), circleCenter);
    let l = [circleCenter, v];
    return l;
}
