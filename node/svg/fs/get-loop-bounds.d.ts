import { Loop } from '../../loop/loop';
import { PointOnShape } from '../../point-on-shape';
declare let getLoopBounds: (loop: Loop) => {
    minX: PointOnShape;
    minY: PointOnShape;
    maxX: PointOnShape;
    maxY: PointOnShape;
};
export { getLoopBounds };
