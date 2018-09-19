import { PathState } from '../path-state';
/**
 * M and m: (from www.w3.org)
 * --------------------------
 * Start a new sub-path at the given (x,y) coordinate. M (uppercase) indicates
 * that absolute coordinates will follow; m (lowercase) indicates that relative
 * coordinates will follow. If a moveto is followed by multiple pairs of
 * coordinates, the subsequent pairs are treated as implicit lineto commands.
 * Hence, implicit lineto commands will be relative if the moveto is relative,
 * and absolute if the moveto is absolute. If a relative moveto (m) appears as
 * the first element of the path, then it is treated as a pair of absolute
 * coordinates. In this case, subsequent pairs of coordinates are treated as
 * relative even though the initial moveto is interpreted as an absolute moveto.
 */
declare function m(s: PathState): number[][];
export { m };
