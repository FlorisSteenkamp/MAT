"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reverse_orientation_1 = require("../../../svg/fs/reverse-orientation");
const is_path_positively_oriented_1 = require("../../../svg/fs/is-path-positively-oriented");
/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise) and the rest negatively
 * oriented.
 */
function orient(bezierLoops) {
    let orientations = bezierLoops.map(is_path_positively_oriented_1.isPathPositivelyOrientated);
    if (!orientations[0]) {
        return bezierLoops;
    }
    else {
        let loops = bezierLoops.map(function (loop, k) {
            return reverse_orientation_1.reverseOrientation(loop, k);
        });
        return loops;
    }
}
exports.orient = orient;
