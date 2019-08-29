/**
 * @hidden
 * Get an array of corresponding cubic bezier curve parameters for given arc
 * curve paramters.
 */
declare function arcToCubicCurves(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number, angle: number, largeArcFlag: number, sweepFlag: number, _recursive: number[]): number[][];
export { arcToCubicCurves };
