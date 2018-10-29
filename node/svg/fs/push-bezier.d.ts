import { PathState } from '../path-state';
/**
 *
 * @param beziers The array of path curves
 * @param ps_ The bezier
 * @param state The current path state
 */
declare function pushBezier(beziers: number[][][], ps_: number[][], s: PathState, max: number): void;
export { pushBezier };
