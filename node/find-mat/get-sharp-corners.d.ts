import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { Loop } from 'flo-boolean';
/** @internal */
declare function getSharpCornersOnLoop(minBezLength: number): (loop: Loop) => PrePointOnShape[];
export { getSharpCornersOnLoop };
