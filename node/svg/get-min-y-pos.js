import { getLoopBounds } from './get-loop-bounds.js';
/**
 * @internal
 * Get topmost PointOnShape of the given loop.
 */
function getMinYPos(loop) {
    return getLoopBounds(loop).minY;
}
export { getMinYPos };
//# sourceMappingURL=get-min-y-pos.js.map