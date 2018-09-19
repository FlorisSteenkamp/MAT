/**
 * Possibly changes the curve into one that is as close to the original as
 * possible but does not have pathological properties (i.e. does not have near
 * infinitely sharp corners, etc) or if that is not possible remove the curve in
 * some circumstances (e.g. if it is of extreme short length, etc.).
 * @param ps Cubic bezier curve points.
 */
declare function dePathologify(ps_: number[][], max: number): number[][];
export { dePathologify };
