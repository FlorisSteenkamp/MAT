"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_cull_nodes_1 = require("./get-cull-nodes");
function cullem(node, key, s, tree, cullHash) {
    if (node.circle.radius === 0) {
        return;
    }
    if (cullHash[key]) {
        return;
    }
    let cullNodes = get_cull_nodes_1.getCullNodes(s, tree, node);
    for (let key in cullNodes) {
        if (!cullHash[key]) {
            cullHash[key] = node;
        }
    }
}
exports.cullem = cullem;
