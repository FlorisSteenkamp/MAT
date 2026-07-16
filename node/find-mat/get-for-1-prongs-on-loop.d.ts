import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * Get points of maximum curvature.
 *
 * @param loop
 *
 * @internal
 */
declare function getFor1ProngsOnLoop(minBezLength: number): (loop: Loop) => PrePointOnShape[];
export { getFor1ProngsOnLoop };
