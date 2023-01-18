import { memoize } from 'flo-memoize';
import { getLoopBounds } from './get-loop-bounds.js';
// TODO - move to another library
/** @internal */
const getShapeBounds = memoize(function (loops) {
    let minX_ = Number.POSITIVE_INFINITY;
    let maxX_ = Number.NEGATIVE_INFINITY;
    let minY_ = Number.POSITIVE_INFINITY;
    let maxY_ = Number.NEGATIVE_INFINITY;
    let minX;
    let maxX;
    let minY;
    let maxY;
    for (const loop of loops) {
        const bounds = getLoopBounds(loop);
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
export { getShapeBounds };
//# sourceMappingURL=get-shape-bounds.js.map