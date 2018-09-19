"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_mat_circles_1 = require("../functions/traverse-mat-circles");
// TODO - memoize
function getMatCirclesAsArray(mat) {
    let circles = [];
    traverse_mat_circles_1.traverseMatCircles(mat, function (node) {
        circles.push(node);
    });
    return circles;
}
exports.getMatCirclesAsArray = getMatCirclesAsArray;
