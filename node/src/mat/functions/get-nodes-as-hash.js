"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../classes/point-on-shape");
const traverse_nodes_1 = require("../functions/traverse-nodes");
function getMatNodesAsHash(mat) {
    let nodes = {};
    traverse_nodes_1.traverseNodes(mat, function (node) {
        let key = point_on_shape_1.PointOnShape.makeSimpleKey(node.matCircle.circle.center);
        nodes[key] = node;
    });
    return nodes;
}
exports.getMatNodesAsHash = getMatNodesAsHash;
