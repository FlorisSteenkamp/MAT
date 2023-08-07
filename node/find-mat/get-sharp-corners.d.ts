import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Loop } from 'flo-boolean';
/** @internal */
declare function getSharpCornersOnLoop(minBezLength: number): (loop: Loop) => PointOnShape[];
export { getSharpCornersOnLoop };
