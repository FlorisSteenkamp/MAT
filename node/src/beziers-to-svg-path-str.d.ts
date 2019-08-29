/**
 * Returns an SVG path string representation of the given cubic bezier loop.
 * @param beziers An array of cubic bezier curves each given as an array of
 * control points.
 * @param decimalPlaces The number of decimal places in the returned path
 * string.
 */
declare function beziersToSvgPathStr(beziers: number[][][], decimalPlaces?: number): string;
export { beziersToSvgPathStr };
