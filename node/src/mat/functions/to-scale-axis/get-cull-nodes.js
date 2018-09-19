"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../classes/circle");
const calc_groups_1 = require("./calc-groups");
const width = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...
function getCullNodes(s, tree, testNode) {
    let c1 = circle_1.Circle.scale(testNode.circle, s);
    let cullNodes = {};
    let limits = [[0, width], [0, height]];
    let circle = testNode.circle;
    helper(tree, 0, limits, 0);
    return cullNodes;
    function cullBranch5(tree) {
        let branch = tree[5];
        if (!branch) {
            return;
        }
        branch.forEach(function (node, key) {
            let c2 = circle_1.Circle.scale(node.circle, s);
            if (circle_1.Circle.engulfsCircle(c1, c2)) {
                cullNodes[key] = node.matNode;
                branch.delete(key);
            }
        });
    }
    function helper(tree, coordinate, limits, depth) {
        if (limits === null) {
            // If we already reached a circle which spans multiple groups 
            // previously, then check all circles in the tree.
            cullBranch5(tree);
            for (let i = 0; i <= 4; i++) {
                let branch = tree[i];
                if (branch) {
                    helper(branch, 0, null, depth + 1);
                }
            }
            return;
        }
        let { groups, newLimits } = calc_groups_1.calcGroups(s, coordinate, limits, circle);
        if (groups.length === 1) {
            cullBranch5(tree);
            let group = groups[0];
            let newCoordinate = coordinate ? 0 : 1;
            if (group === 1 || group === 3) {
                // One of the higher priority left/top or 
                // right/bottom half groups.
                let branch = tree[group];
                if (branch) {
                    helper(branch, newCoordinate, newLimits, depth + 1);
                }
            }
            else {
                // One of the lower priority even 
                // groups (0,2 or 4).
                let branches = [];
                branches.push(tree[group]);
                if (group > 0) {
                    branches.push(tree[group - 1]);
                }
                if (group < 4) {
                    branches.push(tree[group + 1]);
                }
                for (let branch of branches) {
                    if (branch) {
                        helper(branch, newCoordinate, newLimits, depth + 1);
                    }
                }
            }
            return;
        }
        cullBranch5(tree);
        // Circle spans multiple groups at this level of the 
        // tree. Check all circles in all branches.
        for (let i = 0; i <= 4; i++) {
            let branch = tree[i];
            if (branch) {
                helper(branch, 0, null, depth + 1);
            }
        }
    }
}
exports.getCullNodes = getCullNodes;
