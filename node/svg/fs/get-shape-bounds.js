"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const get_loop_bounds_1 = require("./get-loop-bounds");
let getShapeBounds = flo_memoize_1.memoize(function (loops) {
    let minX_ = Number.POSITIVE_INFINITY;
    let maxX_ = Number.NEGATIVE_INFINITY;
    let minY_ = Number.POSITIVE_INFINITY;
    let maxY_ = Number.NEGATIVE_INFINITY;
    let minX;
    let maxX;
    let minY;
    let maxY;
    for (let loop of loops) {
        let bounds = get_loop_bounds_1.getLoopBounds(loop);
        if (bounds.minX.p[0] < minX_) {
            minX = bounds.minX;
            minX_ = bounds.minX.p[0];
        }
        if (bounds.maxX.p[0] > maxX_) {
            maxX = bounds.maxX;
            maxX_ = bounds.maxX.p[0];
        }
        if (bounds.minY.p[1] < minY_) {
            minY = bounds.minY;
            minY_ = bounds.minY.p[1];
        }
        if (bounds.maxY.p[1] > maxY_) {
            maxY = bounds.maxY;
            maxY_ = bounds.maxY.p[1];
        }
    }
    return { minX, minY, maxX, maxY };
});
exports.getShapeBounds = getShapeBounds;
let getShapesBounds = flo_memoize_1.memoize(function (loopss) {
    let minX_ = Number.POSITIVE_INFINITY;
    let maxX_ = Number.NEGATIVE_INFINITY;
    let minY_ = Number.POSITIVE_INFINITY;
    let maxY_ = Number.NEGATIVE_INFINITY;
    let minX;
    let maxX;
    let minY;
    let maxY;
    for (let loops of loopss) {
        let bounds = getShapeBounds(loops);
        if (bounds.minX.p[0] < minX_) {
            minX = bounds.minX;
            minX_ = bounds.minX.p[0];
        }
        if (bounds.maxX.p[0] > maxX_) {
            maxX = bounds.maxX;
            maxX_ = bounds.maxX.p[0];
        }
        if (bounds.minY.p[1] < minY_) {
            minY = bounds.minY;
            minY_ = bounds.minY.p[1];
        }
        if (bounds.maxY.p[1] > maxY_) {
            maxY = bounds.maxY;
            maxY_ = bounds.maxY.p[1];
        }
    }
    return { minX, minY, maxX, maxY };
});
exports.getShapesBounds = getShapesBounds;
//# sourceMappingURL=get-shape-bounds.js.map