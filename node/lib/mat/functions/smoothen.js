"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const geometry_1 = require("../../geometry/geometry");
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
const mat_tree_1 = require("../classes/mat-tree");
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
function smoothen(mat) {
    /**
     * Get the linked contact points. TODO This information to be
     * stored in the MatCircle in the future then there is no need
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
    let lines = [];
    let quads = [];
    let cubes = [];
    mat_tree_1.default.traverse(mat, function (currNode, prevNode) {
        if (!prevNode) {
            return;
        }
        let prevMatCircle = prevNode.matCircle;
        let prevCc = prevMatCircle.circle.center;
        let prevCpNodes = prevMatCircle.cpNodes;
        let currMatCircle = currNode.matCircle;
        let currCc = currMatCircle.circle.center;
        let currCpNodes = currMatCircle.cpNodes;
        let [prevCpNode, currCpNode] = getLinkedCps(prevCpNodes, currCpNodes);
        let prevL = getDirectionToNextMatCircle(prevCpNode, prevCc, true);
        let currL = getDirectionToNextMatCircle(currCpNode, currCc, false);
        function getDirectionToNextMatCircle(cpNode, circleCenter, isPrev) {
            let cp1 = cpNode.item;
            let cp2 = isPrev ?
                cpNode.nextOnCircle.item :
                cpNode.prevOnCircle.item;
            let vDir;
            if (cp1 !== cp2) {
                // Not a 1-prong.
                let spanner = flo_vector2d_1.default.fromTo(cp1.pointOnShape.p, cp2.pointOnShape.p);
                vDir = flo_vector2d_1.default.rotate90Degrees(spanner);
            }
            else {
                if (cp1.pointOnShape.type === mat_constants_1.default.pointType.sharp) {
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
                    let tan1 = flo_bezier3_1.default.tangent(bezierNode1.item.bezier3)(0);
                    let tan2 = flo_vector2d_1.default.reverse(flo_bezier3_1.default.tangent(bezierNode2.item.bezier3)(1));
                    let x = flo_vector2d_1.default.dot(tan1, tan2);
                    // Recall the identities sin(acos(x)) = sqrt(1-x^2),
                    // etc. Also recall the half angle formulas. Then 
                    // the rotation matrix, R, can be calculated.
                    let cosθ = Math.sqrt((1 + x) / 2);
                    let sinθ = Math.sqrt((1 - x) / 2);
                    vDir = flo_vector2d_1.default.rotate(sinθ, cosθ, tan2);
                }
                else {
                    vDir = flo_vector2d_1.default.fromTo(cp1.pointOnShape.p, circleCenter);
                }
            }
            let v = flo_vector2d_1.default.translate(flo_vector2d_1.default.toLength(vDir, 1), circleCenter);
            let l = [circleCenter, v];
            return l;
        }
        let mid = geometry_1.default.lineLineIntersection(prevL, currL);
        let twisted;
        if (mid) {
            let a = flo_vector2d_1.default.fromTo(prevCc, mid);
            let b = flo_vector2d_1.default.fromTo(currCc, mid);
            let c = flo_vector2d_1.default.fromTo(prevCc, currCc);
            let dot1 = flo_vector2d_1.default.dot(a, c);
            let dot2 = flo_vector2d_1.default.dot(b, c);
            twisted = (dot1 < 0 || dot2 > 0);
        }
        if (!mid) {
            lines.push([prevCc, currCc]);
        }
        else if (twisted) {
            let lp1 = flo_vector2d_1.default.mean([prevCc, currCc]);
            let vv1 = flo_vector2d_1.default.fromTo(prevCc, currCc);
            let vvv1 = flo_vector2d_1.default.rotate90Degrees(vv1);
            let lpp1 = flo_vector2d_1.default.translate(vvv1, lp1);
            let l = [lp1, lpp1];
            let mid1 = geometry_1.default.lineLineIntersection(prevL, l);
            let mid2 = geometry_1.default.lineLineIntersection(currL, l);
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
exports.default = smoothen;
