import { PathState } from '../path-state';
/**
 * @hidden
 * H and h: (from www.w3.org)
 *
 * params: x
 *
 * Draws a horizontal line from the current point (cpx, cpy) to (x, cpy). H
 * (uppercase) indicates that absolute coordinates will follow; h (lowercase)
 * indicates that relative coordinates will follow. Multiple x values can be
 * provided (although usually this doesn't make sense). At the end of the
 * command, the new current point becomes (x, cpy) for the final value of x.
 */
declare function h(s: PathState): number[][];
export { h };
