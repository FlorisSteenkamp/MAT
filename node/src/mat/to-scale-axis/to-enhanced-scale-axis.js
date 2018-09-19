"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const mat_1 = require("../../mat");
const traverse_edges_1 = require("../traverse-edges");
const get_vertices_as_array_1 = require("../get-vertices-as-array");
const get_largest_vertex_1 = require("./get-largest-vertex");
const cull_1 = require("./cull");
const create_new_cp_tree_1 = require("./create-new-cp-tree");
const add_debug_info_1 = require("./add-debug-info");
const smoothen_1 = require("../smoothen/smoothen");
/**
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toEnhancedScaleAxis(mat, s) {
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.sats[0] = performance.now();
    }
    let cpNodes = get_vertices_as_array_1.getVerticesAsArray(mat.cpNode.clone());
    let cpNode = get_largest_vertex_1.getLargestVertex(cpNodes);
    let culls = new Set();
    let rMap = new Map();
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
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
    smoothen_1.smoothen(cpNode);
    add_debug_info_1.addDebugInfo(cpNode);
    return new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
}
exports.toEnhancedScaleAxis = toEnhancedScaleAxis;
