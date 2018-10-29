import { Loop } from '../../loop';
import { PointOnShape } from '../../point-on-shape';
declare let getLoopBounds: (a: Loop) => {
    minX: PointOnShape;
    minY: PointOnShape;
    maxX: PointOnShape;
    maxY: PointOnShape;
};
export { getLoopBounds };
