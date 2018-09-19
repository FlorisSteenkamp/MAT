"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calc_groups_1 = require("./calc-groups");
// DEPTH_LIMIT can be anything from 1 to 16, but from 2 to 6 seem to be the 
// fastest.
const DEPTH_LIMIT = 6;
function addToTree(s, tree, coordinate, limits, node, key, depth) {
    let circle = node.circle;
    let { groups, newLimits } = calc_groups_1.calcGroups(s, coordinate, limits, circle);
    // Create new branch if it does not exist yet.
    if (groups.length === 1 && depth !== DEPTH_LIMIT) {
        let group = groups[0];
        //let tree_ = tree as { [index:number]: TTree }; 
        if (!tree[group]) {
            tree[group] = {};
        }
        let branch = tree[group];
        // Flip coordinates
        let newCoordinate = coordinate ? 0 : 1;
        addToTree(s, branch, newCoordinate, newLimits, node, key, depth + 1);
        return;
    }
    if (!tree[5]) {
        (tree[5]) = new Map();
    }
    let branch = (tree[5]);
    branch.set(key, node);
}
exports.addToTree = addToTree;
