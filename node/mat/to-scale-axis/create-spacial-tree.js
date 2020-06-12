"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpacialTree = void 0;
const add_to_tree_1 = require("./add-to-tree");
/** @hidden */
const width = 1620; // TODO change to actual shape coordinates
/** @hidden */
const height = 1560; // ...
/**
 * @hidden
 * @param s
 * @param circles
 */
function createSpacialTree(s, circles) {
    let coordinate = 0;
    let limits = [[0, width], [0, height]];
    let tree = { trees: new Map(), circles: new Set() };
    for (let circle of circles) {
        add_to_tree_1.addToTree(s, tree, coordinate, limits, circle, 0);
    }
    return tree;
}
exports.createSpacialTree = createSpacialTree;
//# sourceMappingURL=create-spacial-tree.js.map