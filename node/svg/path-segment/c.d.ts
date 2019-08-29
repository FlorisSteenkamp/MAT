import { PathState } from "../path-state";
/**
 * @hidden
 * C and c: (from www.w3.org)
 *
 * params: x1 y1 x2 y2 x y
 *
 * Draws a cubic Bézier curve from the current point to (x,y)
 * using (x1,y1) as the control point at the beginning of the
 * curve and (x2,y2) as the control point at the end of the
 * curve. C (uppercase) indicates that absolute coordinates
 * will follow; c (lowercase) indicates that relative
 * coordinates will follow. Multiple sets of coordinates may
 * be specified to draw a polybézier. At the end of the
 * command, the new current point becomes the final (x,y)
 * coordinate pair used in the polybézier.
 */
declare function c(s: PathState): number[][];
export { c };
