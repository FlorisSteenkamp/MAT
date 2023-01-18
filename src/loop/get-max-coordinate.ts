const max = Math.max;
const abs = Math.abs;


/**
 * @hidden
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
function getLoopsMetrics(loops: number[][][][]): { 
        maxCoordinate: number,
        maxRadius: number } {

    let maxCoordinate = 0;
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const loop of loops) { for (const ps of loop) { for (const p of ps) {
        const x = p[0];
        const y = p[1];
        const c = max(abs(x), abs(y));
        if (c > maxCoordinate) { maxCoordinate = c; }
        if (x < minX) { minX = x; }
        if (x > maxX) { maxX = x; }
        if (y < minY) { minY = y; }
        if (y > maxY) { maxY = y; }
    } } }

    const width  = maxX - minX;
    const height = maxY - minY;
    const maxRadius = max(width, height);

    return { maxCoordinate, maxRadius };
}


export { getLoopsMetrics }
