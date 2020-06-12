"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimMat = void 0;
const create_new_cp_tree_1 = require("./create-new-cp-tree");
const cull_non_cycles_1 = require("./to-scale-axis/cull-non-cycles");
const clone_1 = require("../cp-node/clone");
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
function trimMat(mat) {
    let cpNode = cull_non_cycles_1.cullNonCycles(clone_1.clone(mat.cpNode));
    if (!cpNode) {
        return undefined;
    }
    return { cpNode, cpTrees: create_new_cp_tree_1.createNewCpTree(cpNode) };
}
exports.trimMat = trimMat;
//# sourceMappingURL=trim-mat.js.map