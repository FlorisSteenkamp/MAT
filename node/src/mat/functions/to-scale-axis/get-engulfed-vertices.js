"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../classes/circle");
const calc_groups_1 = require("./calc-groups");
const width = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...
/**
 * Returns a map of engulfed MAT nodes determined to be engulfed by the given
 * test node and scale factor and starting from the given spacial tree node.
 * @param s The scale factor
 * @param tree The spacial tree node from where to start
 * @param circle The circle potentially engulfing other nodes
 */
function getEngulfedVertices(s, tree, circle) {
    let c1 = circle_1.Circle.scale(circle, s);
    let cullNodes = new Set();
    let limits = [[0, width], [0, height]];
    f(tree, 0, limits, 0);
    return cullNodes;
    function cullBranch5(tree) {
        let t = tree.trees.get(5);
        if (!t) {
            return;
        }
        let circles = t.circles;
        circles.forEach(function (circle, key) {
            let c2 = circle_1.Circle.scale(circle, s);
            if (circle_1.Circle.engulfsCircle(c1, c2)) {
                cullNodes.add(circle);
                circles.delete(key);
            }
        });
    }
    function f(tree, coordinate, limits, depth) {
        if (limits === null) {
            // If we already reached a circle which spans multiple groups 
            // previously, then check all circles in the tree.
            cullBranch5(tree);
            for (let i = 0; i <= 4; i++) {
                let t = tree.trees.get(i);
                if (t) {
                    f(t, 0, null, depth + 1);
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
                let t = tree.trees.get(group);
                if (t) {
                    f(t, newCoordinate, newLimits, depth + 1);
                }
            }
            else {
                // One of the lower priority even groups (0,2 or 4).
                let branches = [];
                branches.push(tree.trees.get(group));
                if (group > 0) {
                    branches.push(tree.trees.get(group - 1));
                }
                if (group < 4) {
                    branches.push(tree.trees.get(group + 1));
                }
                for (let branch of branches) {
                    if (branch) {
                        f(branch, newCoordinate, newLimits, depth + 1);
                    }
                }
            }
            return;
        }
        cullBranch5(tree);
        // Circle spans multiple groups at this level of the tree. Check all 
        // circles in all branches.
        for (let i = 0; i <= 4; i++) {
            let t = tree.trees.get(i);
            if (!t) {
                continue;
            }
            f(t, 0, null, depth + 1);
        }
    }
}
exports.getEngulfedVertices = getEngulfedVertices;
