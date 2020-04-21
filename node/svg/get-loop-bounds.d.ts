import { Loop } from '../loop';
import { IPointOnShape } from '../point-on-shape';
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
