"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_1 = require("../mat");
const smoothen_1 = require("./smoothen/smoothen");
const create_new_cp_tree_1 = require("./create-new-cp-tree");
const cull_non_cycles_1 = require("./to-scale-axis/cull-non-cycles");
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
function trimMat(mat) {
    let cpNode = cull_non_cycles_1.cullNonCycles(mat.cpNode.clone());
    if (!cpNode) {
        return undefined;
    }
    smoothen_1.smoothen(cpNode);
    let mat_ = new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
    /*
    if (typeof _debug_ !== 'undefined') {
        let generated = _debug_.generated;
        generated.elems.sat.push(mat_);
    }
    */
    return mat_;
}
exports.trimMat = trimMat;
//# sourceMappingURL=trim-mat.js.map