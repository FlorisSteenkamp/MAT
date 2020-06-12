"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinYPos = void 0;
const get_loop_bounds_1 = require("./get-loop-bounds");
/**
 * @hidden
 * Get topmost PointOnShape of the given loop.
 */
function getMinYPos(loop) {
    return get_loop_bounds_1.getLoopBounds(loop).minY;
}
exports.getMinYPos = getMinYPos;
//# sourceMappingURL=get-min-y-pos.js.map