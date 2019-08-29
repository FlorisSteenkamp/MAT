import { PathState } from "../path-state";
/**
 * @hidden
 * S and s: (from www.w3.org)
 *
 * params: x2 y2 x y
 *
 * Draws a cubic Bézier curve from the current point to (x,y). The first control
 * point is assumed to be the reflection of the second control point on the
 * previous command relative to the current point. (If there is no previous
 * command or if the previous command was not an C, c, S or s, assume the first
 * control point is coincident with the current point.) (x2,y2) is the second
 * control point (i.e., the control point at the end of the curve). S
 * (uppercase) indicates that absolute coordinates will follow; s (lowercase)
 * indicates that relative coordinates will follow. Multiple sets of coordinates
 * may be specified to draw a polybézier. At the end of the command, the new
 * current point becomes the final (x,y) coordinate pair used in the polybézier.
 */
declare function s(s: PathState): number[][];
export { s };
