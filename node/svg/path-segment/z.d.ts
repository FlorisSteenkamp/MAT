import { PathState } from '../path-state';
/**
 * @hidden
 * Z and z: (from www.w3.org)
 *
 * params: (none)
 *
 * Close the current subpath by drawing a straight line from the current point
 * to current subpath's initial point. Since the Z and z commands take no
 * parameters, they have an identical effect.
 */
declare function z(s: PathState): number[][];
export { z };
