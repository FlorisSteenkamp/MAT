"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_nodes_1 = require("../functions/traverse-nodes");
const point_on_shape_1 = require("../classes/point-on-shape");
function getMatCirclesAsHash(mat) {
    let circles = {};
    traverse_nodes_1.traverseNodes(mat, function (node) {
        let key = point_on_shape_1.PointOnShape.makeSimpleKey(node.circle.center);
        circles[key] = node;
    });
    return circles;
}
exports.getMatCirclesAsHash = getMatCirclesAsHash;
