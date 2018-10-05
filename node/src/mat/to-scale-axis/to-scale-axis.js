"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const mat_1 = require("../../mat");
const traverse_edges_1 = require("../traverse-edges");
const traverse_vertices_1 = require("../traverse-vertices");
const smoothen_1 = require("../smoothen/smoothen");
const get_largest_vertex_1 = require("../get-largest-vertex");
const cull_1 = require("./cull");
const create_new_cp_tree_1 = require("../create-new-cp-tree");
const add_debug_info_1 = require("./add-debug-info");
const get_leaves_1 = require("../get-leaves");
/**
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat, s) {
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.sats[0] = performance.now();
        let leaves = get_leaves_1.getLeaves(mat.cpNode);
        _debug_.generated.elems.leaves.push(leaves);
    }
    /** The largest vertex (as measured by its inscribed disk) */
    let cpNode = get_largest_vertex_1.getLargestVertex(traverse_vertices_1.traverseVertices(mat.cpNode.clone()));
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.maxVertex.push(cpNode);
    }
    /**
     * All vertices that are set to be culled initially. This may change to
     * preserve topology.
     */
    let culls = new Set();
    let rMap = new Map();
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
        /** The occulating radius stored with this vertex. */
        let R = rMap.get(cpNode) || s * cpNode.cp.circle.radius;
        let cpNode_ = cpNode.next;
        //let c  = cpNode .cp.circle.center;
        //let c_ = cpNode_.cp.circle.center;
        /** Distance between this vertex and the next. */
        //let l = distanceBetween(c, c_); // Almost always precise enough
        let l = flo_bezier3_1.len([0, 1], cpNode.matCurve);
        let r_ = s * cpNode_.cp.circle.radius;
        if (R - l > r_) {
            for (let cpNode of cpNode_.getNodes()) {
                rMap.set(cpNode, R - l); // Update occulating radii
            }
            culls.add(cpNode_.cp.circle);
        }
    });
    cull_1.cull(culls, cpNode);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.culls.push(Array.from(culls));
    }
    smoothen_1.smoothen(cpNode);
    let sat = new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
    add_debug_info_1.addDebugInfo(sat);
    return sat;
}
exports.toScaleAxis = toScaleAxis;
