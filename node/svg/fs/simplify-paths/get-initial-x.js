"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../../point-on-shape");
const is_path_positively_oriented_1 = require("../../fs/is-path-positively-oriented");
const get_loop_bounds_1 = require("../get-loop-bounds");
const x_1 = require("../../../x/x");
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
    let pos = get_loop_bounds_1.getLoopBounds(loop).minY;
    let xs = intersections.get(pos.curve);
    // If no intersections on this curve, just start at 0
    if (!xs) {
        pos = new point_on_shape_1.PointOnShape(pos.curve, 0);
    }
    let x = new x_1.X(pos, true, undefined, // will be set just below
    dummyLoop);
    x.opposite = x;
    return x;
}
exports.getInitialX = getInitialX;
//# sourceMappingURL=get-initial-x.js.map