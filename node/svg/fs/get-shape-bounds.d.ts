import { Loop } from '../../loop/loop';
declare let getShapeBounds: (a: Loop[]) => {
    minX: import("../../point-on-shape").PointOnShape;
    minY: import("../../point-on-shape").PointOnShape;
    maxX: import("../../point-on-shape").PointOnShape;
    maxY: import("../../point-on-shape").PointOnShape;
};
declare let getShapesBounds: (a: Loop[][]) => {
    minX: import("../../point-on-shape").PointOnShape;
    minY: import("../../point-on-shape").PointOnShape;
    maxX: import("../../point-on-shape").PointOnShape;
    maxY: import("../../point-on-shape").PointOnShape;
};
export { getShapeBounds, getShapesBounds };
