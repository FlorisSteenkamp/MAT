"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const Bezier3 = require("flo-bezier3");
const Vector = require("flo-vector2d");
const traverse_edges_1 = require("./traverse-edges");
const geometry_1 = require("../functions/geometry");
/**
 * Roughly evenly space 2-prongs along MAT branch (or loop).
 * TODO - FINISH!
 */
function space2ProngsOnBranch(mat) {
    let lines = [];
    let quads = [];
    let cubes = [];
    traverse_edges_1.traverseEdges(mat, function (currNode, prevNode) {
        if (!prevNode) {
            return;
        }
        let prevVertex = prevNode;
        let prevCc = prevVertex.circle.center;
        let prevCpNodes = prevVertex.cps;
        let currVertex = currNode;
        let currCc = currVertex.circle.center;
        let currCpNodes = currVertex.cps;
        let [prevCpNode, currCpNode] = getLinkedCps(prevCpNodes, currCpNodes);
        let prevL = getDirectionToNextVertex(prevCpNode, prevCc, true);
        let currL = getDirectionToNextVertex(currCpNode, currCc, false);
        let mid = geometry_1.Geometry.lineLineIntersection(prevL, currL);
        let twisted;
        if (mid) {
            let a = Vector.fromTo(prevCc, mid);
            let b = Vector.fromTo(currCc, mid);
            let c = Vector.fromTo(prevCc, currCc);
            let dot1 = Vector.dot(a, c);
            let dot2 = Vector.dot(b, c);
            twisted = (dot1 < 0 || dot2 > 0);
        }
        if (!mid) {
            lines.push([prevCc, currCc]);
        }
        else if (twisted) {
            let lp1 = Vector.mean([prevCc, currCc]);
            let vv1 = Vector.fromTo(prevCc, currCc);
            let vvv1 = Vector.rotate90Degrees(vv1);
            let lpp1 = Vector.translate(vvv1, lp1);
            let l = [lp1, lpp1];
            let mid1 = geometry_1.Geometry.lineLineIntersection(prevL, l);
            let mid2 = geometry_1.Geometry.lineLineIntersection(currL, l);
            cubes.push([prevCc, mid1, mid2, currCc]);
        }
        else {
            //console.log(prevCc, mid, currCc);
            quads.push([prevCc, mid, currCc]);
        }
    });
    return {
        lines,
        quads,
        cubes,
    };
}
exports.space2ProngsOnBranch = space2ProngsOnBranch;
/**
 * Get the linked contact points. TODO This information to be
 * stored in the Vertex in the future then there is no need
 * to actually search for it!
 */
function getLinkedCps(prevCpNodes, currCpNodes) {
    for (let i = 0; i < prevCpNodes.length; i++) {
        let prevCpNode = prevCpNodes[i];
        for (let j = 0; j < currCpNodes.length; j++) {
            let currCpNode = currCpNodes[j];
            if (prevCpNode.next === currCpNode) {
                return [prevCpNode, currCpNode];
            }
        }
    }
}
function getDirectionToNextVertex(cpNode, circleCenter, isPrev) {
    let cp1 = cpNode.item;
    let cp2 = isPrev ?
        cpNode.nextOnCircle.item :
        cpNode.prevOnCircle.item;
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
            // Recall the identities sin(acos(x)) = sqrt(1-x^2),
            // etc. Also recall the half angle formulas. Then 
            // the rotation matrix, R, can be calculated.
            let cosθ = Math.sqrt((1 + x) / 2);
            let sinθ = Math.sqrt((1 - x) / 2);
            vDir = Vector.rotate(sinθ, cosθ, tan2);
        }
        else {
            vDir = Vector.fromTo(cp1.pointOnShape.p, circleCenter);
        }
    }
    let v = Vector.translate(Vector.toLength(vDir, 1), circleCenter);
    let l = [circleCenter, v];
    return l;
}
