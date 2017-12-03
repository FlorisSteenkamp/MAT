"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
const traverse_1 = require("./traverse");
function getNodesAsHash(mat) {
    let nodes = {};
    traverse_1.default(mat, function (node) {
        let key = point_on_shape_1.default.makeSimpleKey(node.matCircle.circle.center);
        nodes[key] = node;
    });
    return nodes;
}
exports.default = getNodesAsHash;
