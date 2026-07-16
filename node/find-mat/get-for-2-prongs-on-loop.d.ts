import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 *
 * @internal
 */
declare function getFor2ProngsOnLoop(minBezLength: number, maxCurviness: number, maxLength: number): (loop: Loop) => PrePointOnShape[];
export { getFor2ProngsOnLoop };
