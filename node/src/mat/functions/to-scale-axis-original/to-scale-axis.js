"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_node_1 = require("../../classes/mat-node");
const get_mat_circles_as_hash_1 = require("../../functions/get-mat-circles-as-hash");
const get_biggest_mat_circle_1 = require("./get-biggest-mat-circle");
const create_spacial_tree_1 = require("./create-spacial-tree");
const traverse_spacial_tree_1 = require("./traverse-spacial-tree");
const cullem_1 = require("./cullem");
const cull_it_1 = require("./cull-it");
const cull_the_nodes_1 = require("./cull-the-nodes");
/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 *
 * @param mat_ - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat_, s) {
    //--------------------------------------------------------------------------
    // Start with the biggest circle (since it is the most likely to eclipse 
    // other circles), multiply its radius by s and see which circles are fully 
    // contained in it and trim it away in the MAT tree.
    //--------------------------------------------------------------------------
    // Make a copy of the MAT tree - we're not going to modify the original.
    let mat = mat_node_1.MatNode.copy(mat_);
    let nodes = get_mat_circles_as_hash_1.getMatCirclesAsHash(mat);
    let biggestCircle = get_biggest_mat_circle_1.getBiggestMatCircle(nodes);
    // Grab the MAT tree at its biggest node.
    let sat = biggestCircle.matNode;
    let tree = create_spacial_tree_1.createSpacialTree(s, nodes);
    let cullHash = {};
    traverse_spacial_tree_1.traverseSpacialTree(tree, cullem_1.cullem, s, tree, cullHash);
    // We now walk the MAT tree and keep all non-culled nodes and any
    // nodes that have a non-culled node further down the line toward
    // the tree leaves.
    let cullNodes = [];
    cull_it_1.cullIt(cullHash, cullNodes, sat);
    cull_the_nodes_1.cullTheNodes(cullNodes);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.afterSat = performance.now();
        _debug_.sats.push(sat);
    }
    return sat;
}
exports.toScaleAxis = toScaleAxis;
// TODO - fix highly convoluted typescript typings by modifiying code so that 
// a tree node (i.e. TTree type) does not use type union
// TODO
// This algorithm might be made somewhat faster by building tree to a depth 
// where there is say less than 4 other circles and only then split the 
// branch once this threshold has been exceeded.
// 
// Also, when searching, search only in relevant branches even when circle 
// overlaps more than one group. 
