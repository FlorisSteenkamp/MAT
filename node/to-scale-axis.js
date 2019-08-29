"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const mat_1 = require("./mat");
const traverse_edges_1 = require("./traverse-edges");
const traverse_vertices_1 = require("./traverse-vertices");
const get_largest_vertex_1 = require("./mat/get-largest-vertex");
const create_new_cp_tree_1 = require("./mat/create-new-cp-tree");
const get_leaves_1 = require("./mat/get-leaves");
const cull_1 = require("./mat/to-scale-axis/cull");
const add_debug_info_1 = require("./mat/to-scale-axis/add-debug-info");
const clone_1 = require("./cp-node/clone");
const get_curve_to_next_1 = require("./get-curve/get-curve-to-next");
function linearScale(s) {
    return function (r) {
        return s * r;
    };
}
/** @hidden */
let len = flo_bezier3_1.length([0, 1]);
/**
 * Apply and returns an enhanced version of the Scale Axis Transform (SAT) to
 * the given MAT. The returned SAT is guaranteed to be a subset of the MAT and
 * preserves topology at any scale.
 *
 * Typically the MAT contains too many branches caused by minute details on the
 * boundary of the shape. The SAT is a simplification of the MAT that preserves
 * less detail the higher the applied scale factor. The severity at which noise
 * are removed depends on the local scale of the shape.
 * @param mat The Medial Axis Transform ([[Mat]]) on which to apply the SAT.
 * @param s The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat, s, f = linearScale) {
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.sats[0] = performance.now();
        let leaves = get_leaves_1.getLeaves(mat.cpNode);
        _debug_.generated.elems.leaves.push(leaves);
    }
    /** The largest vertex (as measured by its inscribed disk) */
    let cpNodes = [];
    traverse_vertices_1.traverseVertices(clone_1.clone(mat.cpNode), cpNode => { cpNodes.push(cpNode); });
    let cpNode = get_largest_vertex_1.getLargestVertex(cpNodes);
    let f_ = f(s);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.maxVertex.push(cpNode);
    }
    /**
     * All vertices that are set to be culled initially. This may change later
     * in order to preserve topology.
     */
    let culls = new Set();
    let rMap = new Map();
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
        /** The occulating radius stored with this vertex. */
        let R = rMap.get(cpNode) || f_(cpNode.cp.circle.radius);
        let cpNode_ = cpNode.next;
        let l = len(get_curve_to_next_1.getCurveToNext(cpNode));
        let r = cpNode_.cp.circle.radius;
        let r_ = f_(r);
        if (R - l > r_) {
            for (let cpNode of cpNode_.getCpNodesOnCircle()) {
                rMap.set(cpNode, R - l); // Update osculating radii
            }
            culls.add(cpNode_.cp.circle);
        }
    });
    cull_1.cull(culls, cpNode);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.culls.push(Array.from(culls));
    }
    let sat = new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
    add_debug_info_1.addDebugInfo(sat);
    return sat;
}
exports.toScaleAxis = toScaleAxis;
//# sourceMappingURL=to-scale-axis.js.map