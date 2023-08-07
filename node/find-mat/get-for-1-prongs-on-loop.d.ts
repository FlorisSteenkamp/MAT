import { Loop } from 'flo-boolean';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
declare function getFor1ProngsOnLoop(minBezLength: number): (loop: Loop) => PointOnShape[];
export { getFor1ProngsOnLoop };
