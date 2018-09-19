"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the spacial tree and calls the given callback function for each
 * MAT circle in the tree and iteravely for each subtree.
 * @param tree The spacial tree to traverse
 * @param f A function to call for each MAT circle in the tree.
 */
function traverseSpacialTree(tree, f) {
    g(tree);
    function g(tree) {
        if (!tree) {
            return;
        }
        if (tree.circles.size) {
            tree.circles.forEach(f);
            return; // Leaf reached 
        }
        [5, 0, 2, 4, 1, 3].forEach(i => g(tree.trees.get(i)));
    }
}
exports.traverseSpacialTree = traverseSpacialTree;
