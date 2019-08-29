"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_loop_bounds_1 = require("./get-loop-bounds");
/**
 * @hidden
 * Get topmost PointOnShape the given loop.
 */
function getMinYPos(loop) {
    let pos = get_loop_bounds_1.getLoopBounds(loop).minY;
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.minY.push(pos);
    }
    return pos;
}
exports.getMinYPos = getMinYPos;
//# sourceMappingURL=get-min-y-pos.js.map