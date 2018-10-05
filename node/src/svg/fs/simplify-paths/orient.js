"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reverse_orientation_1 = require("../../fs/reverse-orientation");
const is_path_positively_oriented_1 = require("../../fs/is-path-positively-oriented");
/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise) and the rest negatively
 * oriented.
 */
function orient(loops) {
    let newLoops = [];
    for (let i = 0; i < loops.length; i++) {
        let loop = loops[i];
        newLoops.push(orientLoop(loop, i !== 0));
    }
    return newLoops;
}
exports.orient = orient;
/**
 * Returns a loop oriented according to the given orientation.
 * @param loop The loop
 * @param positive If true, returns a positively oriented loop, else a negative
 * one.
 */
function orientLoop(loop, positive) {
    console.log('reversing?: ' + (positive !== is_path_positively_oriented_1.isPathPositivelyOrientated(loop)));
    return positive === is_path_positively_oriented_1.isPathPositivelyOrientated(loop)
        ? loop
        : reverse_orientation_1.reverseOrientation(loop);
}
