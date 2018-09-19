/**
 * Get all intersection points between a line and a bezier.
 */
declare function getLineBezierIntersectionPoints(line: number[][], ps: number[][]): {
    p: number[];
    t: number;
}[];
export { getLineBezierIntersectionPoints };
