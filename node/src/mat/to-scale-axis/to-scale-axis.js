"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_1 = require("../../mat");
const get_vertices_as_array_1 = require("../get-vertices-as-array");
const get_largest_vertex_1 = require("./get-largest-vertex");
const create_spacial_tree_1 = require("./create-spacial-tree");
const traverse_spacial_tree_1 = require("./traverse-spacial-tree");
const cull_1 = require("./cull");
const get_engulfed_vertices_1 = require("./get-engulfed-vertices");
const add_debug_info_1 = require("./add-debug-info");
const create_new_cp_tree_1 = require("./create-new-cp-tree");
/**
 * Note: Use toEnhancedScaleAxis instead - it is faster and better.
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat, s) {
    //--------------------------------------------------------------------------
    // Start with the biggest circle (since it is the most likely to eclipse 
    // other circles), multiply its radius by s and see which circles are fully 
    // contained in it and trim it away in the MAT tree.
    //--------------------------------------------------------------------------
    let cpNodes = get_vertices_as_array_1.getVerticesAsArray(mat.cpNode.clone());
    let cpNode = get_largest_vertex_1.getLargestVertex(cpNodes);
    let circles = cpNodes.map(cpNode => cpNode.cp.circle);
    let tree = create_spacial_tree_1.createSpacialTree(s, circles);
    let culls = new Set();
    traverse_spacial_tree_1.traverseSpacialTree(tree, circle => {
        if (circle.radius === 0 || culls.has(circle)) {
            return;
        }
        get_engulfed_vertices_1.getEngulfedVertices(s, tree, circle)
            .forEach(circle => culls.add(circle));
    });
    cull_1.cull(culls, cpNode);
    add_debug_info_1.addDebugInfo(cpNode);
    return new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
}
exports.toScaleAxis = toScaleAxis;
// TODO
// This algorithm might be made somewhat faster by building tree to a depth 
// where there is say less than 4 other circles and only then split the 
// branch once this threshold has been exceeded.
// 
// Also, when searching, search only in relevant branches even when circle 
// overlaps more than one group. 
