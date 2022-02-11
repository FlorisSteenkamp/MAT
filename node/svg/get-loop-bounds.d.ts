import { Loop } from '../loop.js';
import { IPointOnShape } from '../point-on-shape.js';
/**
 * @hidden
 */
declare let getLoopBounds: (a: Loop) => {
    minX: IPointOnShape;
    minY: IPointOnShape;
    maxX: IPointOnShape;
    maxY: IPointOnShape;
};
export { getLoopBounds };
