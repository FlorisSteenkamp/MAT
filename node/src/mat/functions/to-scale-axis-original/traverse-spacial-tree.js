"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function traverseSpacialTree(tree, f, s, tree2, cullHash) {
    g(tree);
    function g(tree) {
        if (!tree) {
            return;
        }
        if (tree.size) {
            tree.forEach(function (node, key) {
                f(node, key, s, tree2, cullHash);
            });
            return; // Leaf reached 
        }
        if (tree[5]) {
            g(tree[5]);
        }
        if (tree[0]) {
            g(tree[0]);
        }
        if (tree[2]) {
            g(tree[2]);
        }
        if (tree[4]) {
            g(tree[4]);
        }
        if (tree[1]) {
            g(tree[1]);
        }
        if (tree[3]) {
            g(tree[3]);
        }
    }
}
exports.traverseSpacialTree = traverseSpacialTree;
