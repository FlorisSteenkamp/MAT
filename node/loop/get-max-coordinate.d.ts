/**
 * @hidden
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
declare function getLoopsMetrics(loops: number[][][][]): {
    maxCoordinate: number;
    maxRadius: number;
};
export { getLoopsMetrics };
