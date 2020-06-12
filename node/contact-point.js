"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareCps = void 0;
const point_on_shape_1 = require("./point-on-shape");
/**
 * Primarily for internal use.
 *
 * Compares the two contact points according to their order along the shape
 * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
 * @param a The first contact point.
 * @param b The second contact point.
 */
function compareCps(a, b) {
    //let res = PointOnShape.compare(a.pointOnShape, b.pointOnShape);
    let res = point_on_shape_1.comparePoss(a.pointOnShape, b.pointOnShape);
    if (res === undefined) {
        return undefined;
    }
    if (res !== 0) {
        return res;
    }
    res = a.order - b.order;
    if (res !== 0) {
        return res;
    }
    return a.order2 - b.order2;
}
exports.compareCps = compareCps;
//# sourceMappingURL=contact-point.js.map