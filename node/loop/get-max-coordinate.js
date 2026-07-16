const { max, abs } = Math;
/**
 * @internal
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
function getLoopsMetrics(loops) {
    let maxCoordinate = 0;
    let minX = +Infinity;
    let maxX = -Infinity;
    let minY = +Infinity;
    let maxY = -Infinity;
    for (const loop of loops) {
        for (const ps of loop) {
            for (const p of ps) {
                const x = p[0];
                const y = p[1];
                const c = max(abs(x), abs(y));
                if (c > maxCoordinate) {
                    maxCoordinate = c;
                }
                if (x < minX) {
                    minX = x;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
        }
    }
    const width = maxX - minX;
    const height = maxY - minY;
    return { maxCoordinate, width, height };
}
export { getLoopsMetrics };
//# sourceMappingURL=get-max-coordinate.js.map