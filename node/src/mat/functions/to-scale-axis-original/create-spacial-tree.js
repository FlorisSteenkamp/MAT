"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_to_tree_1 = require("./add-to-tree");
const width = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...
function createSpacialTree(s, nodeHash) {
    let coordinate = 0;
    let limits = [[0, width], [0, height]];
    let tree = {};
    for (let key in nodeHash) {
        let node = nodeHash[key];
        add_to_tree_1.addToTree(s, tree, coordinate, limits, node, key, 0);
    }
    if (typeof _debug_ !== 'undefined') {
        /*
        if (FloMat._debug_.shouldDrawSATTree) {
            FloMat._debug_.drawSATTree(tree);
        }
        */
        //_debug_.generated.sat.tree = tree;
    }
    return tree;
}
exports.createSpacialTree = createSpacialTree;
