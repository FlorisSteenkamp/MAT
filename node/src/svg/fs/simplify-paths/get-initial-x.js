"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../../point-on-shape");
const is_path_positively_oriented_1 = require("../../fs/is-path-positively-oriented");
const get_loop_bounds_1 = require("../get-loop-bounds");
/**
 * Get initial intersection which is really a dummy intersection.
 * @param loop
 * @param parent
 */
function getInitialX(intersections, parent, loop) {
    let dummyLoop = {
        parent,
        children: new Set(),
        beziers: [],
        loop: undefined,
        orientation: is_path_positively_oriented_1.isPathPositivelyOrientated(loop) ? -1 : +1,
        windingNum: parent.windingNum
    };
    let pos = get_loop_bounds_1.getLoopBounds(loop).minX;
    let curve = intersections.get(pos.curve);
    if (!curve) {
        pos = new point_on_shape_1.PointOnShape(pos.curve, 0);
    }
    let x = {
        loop,
        pos,
        opposite: undefined,
        loopTree: dummyLoop,
    };
    x.opposite = x;
    return x;
}
exports.getInitialX = getInitialX;
