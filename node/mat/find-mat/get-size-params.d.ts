declare function getSizeParams(bezierLoops: number[][][][], maxCurviness: number, maxLength: number): {
    maxCurviness: number;
    maxLength: number;
    maxCoordinate: number;
    minBezLength: number;
};
export { getSizeParams };
