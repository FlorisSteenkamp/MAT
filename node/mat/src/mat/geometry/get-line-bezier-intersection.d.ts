/**
 * Get all intersection points between a line and a bezier within a certain t
 * range.
 */
declare function getLineBezierIntersection(line: number[][], ps: number[][], tRange: number[]): {
    p: number[];
    t: number;
}[];
export { getLineBezierIntersection };
