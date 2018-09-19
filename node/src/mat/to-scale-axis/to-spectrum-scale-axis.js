"use strict";
// TODO - not finished - don't use!
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const mat_1 = require("../../mat");
//import { traverseEdges_     } from '../traverse-edges';
const get_vertices_as_array_1 = require("../get-vertices-as-array");
const get_largest_vertex_1 = require("./get-largest-vertex");
const cull_1 = require("./cull");
const create_new_cp_tree_1 = require("./create-new-cp-tree");
const add_debug_info_1 = require("./add-debug-info");
/**
 * TODO - to be finished - don't use!
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT
 * without pre-specifying the scale. An ordered array of SAT's are returned,
 * such that each consecutive SAT has an additional branch snipped. The scale
 * for each SAT is also returned.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 */
function toSpectrumScaleAxis(mat, s) {
    let cpNodes = get_vertices_as_array_1.getVerticesAsArray(mat.cpNode.clone());
    let cpNode = get_largest_vertex_1.getLargestVertex(cpNodes);
    let culls = new Set();
    let rMap = new Map();
    let i = 0;
    traverseEdges_(cpNode, function (cpNode) {
        i++;
        let p1 = cpNode.cp.circle.center;
        let p2 = cpNode.next.cp.circle.center;
        //_debug_.fs.draw.line([p1, p2], "thin10 red nofill", i*100);
        let r = rMap.get(cpNode);
        let R = r ? r : s * cpNode.cp.circle.radius;
        let cpNodes = cpNode.getCps();
        for (let cpNode of cpNodes) {
            let cpNode_ = cpNode.next;
            // TODO - l should really be the bezier length connecting the mat 
            // circle centers and not the straight line length.
            let center_ = cpNode_.cp.circle.center;
            let center = cpNode.cp.circle.center;
            let l = flo_vector2d_1.distanceBetween(center, center_);
            let r_ = s * cpNode_.cp.circle.radius;
            if (R > l + r_) {
                rMap.set(cpNode_, R - l);
                culls.add(cpNode_.cp.circle);
            }
        }
    });
    cull_1.cull(culls, cpNode);
    add_debug_info_1.addDebugInfo(cpNode);
    return new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
}
exports.toSpectrumScaleAxis = toSpectrumScaleAxis;
/**
 * Traverses all edges (depth first) of a MAT starting at the given vertex.
 * @param cpNode The contact point representing the start vertex
 * @param f A callback function for each cpNode representing the start of and
 * edge.
 */
function traverseEdges_(cpNode, f, inclLeaves = false) {
    let cps = cpNode.getCps();
    while (cps.length) {
        let cp = cps.pop();
        while (!cp.isTerminating()) {
            f(cp, false);
            cp = cp.next;
            if (cp.isThreeProng()) {
                cps.push(cp.nextOnCircle);
            }
        }
        if (inclLeaves) {
            f(cp, true);
        }
    }
}
