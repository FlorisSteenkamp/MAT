import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 *
 * @param angle
 * @param isHoleClosing `true` if this is a hole-closing two-prong, `false` otherwise
 * @param maxOscRadius the maximum that the osculating circle radius can be
 * @param yPos the source point of the 2-prong to be found
 *
 * @internal
*/
declare function getInitialX(angle: number, isHoleClosing: boolean, maxOscRadius: number, yPos: PrePointOnShape, nnorm: number[]): [number[], number];
export { getInitialX };
