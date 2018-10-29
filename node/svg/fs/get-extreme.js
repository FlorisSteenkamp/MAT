"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_shape_bounds_1 = require("./get-shape-bounds");
/**
 * Returns the max extreme point coordinate value for the given shape. This is
 * used for floating point tolerance calculations.
 * @param loops
 */
function getExtreme(loops) {
    let bounds = get_shape_bounds_1.getShapeBounds(loops);
    return Math.max(Math.abs(bounds.minX.p[0]), Math.abs(bounds.minY.p[1]), Math.abs(bounds.maxX.p[0]), Math.abs(bounds.maxY.p[1]));
}
exports.getExtreme = getExtreme;
//# sourceMappingURL=get-extreme.js.map