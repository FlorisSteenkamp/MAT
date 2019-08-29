import { Loop } from '../../loop/loop';
import { PointOnShape } from '../../point-on-shape';
/** @hidden */
declare let getLoopBounds: (a: Loop) => {
    minX: PointOnShape;
    minY: PointOnShape;
    maxX: PointOnShape;
    maxY: PointOnShape;
};
export { getLoopBounds };
