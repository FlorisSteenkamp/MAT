import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
/** @internal */
declare function getShapeBounds(loops: Loop[]): {
    minX: PrePointOnShape;
    minY: PrePointOnShape;
    maxX: PrePointOnShape;
    maxY: PrePointOnShape;
};
export { getShapeBounds };
