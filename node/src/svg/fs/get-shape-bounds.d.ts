import { Loop } from '../../loop';
import { PointOnShape } from '../../point-on-shape';
declare let getShapeBounds: (a: Loop[]) => {
    minX: PointOnShape;
    minY: PointOnShape;
    maxX: PointOnShape;
    maxY: PointOnShape;
};
declare let getShapesBounds: (a: Loop[][]) => {
    minX: PointOnShape;
    minY: PointOnShape;
    maxX: PointOnShape;
    maxY: PointOnShape;
};
export { getShapeBounds, getShapesBounds };
