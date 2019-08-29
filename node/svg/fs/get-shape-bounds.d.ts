import { Loop } from '../../loop/loop';
/** @hidden */
declare let getShapeBounds: (a: Loop[]) => {
    minX: import("../../point-on-shape").PointOnShape;
    minY: import("../../point-on-shape").PointOnShape;
    maxX: import("../../point-on-shape").PointOnShape;
    maxY: import("../../point-on-shape").PointOnShape;
};
export { getShapeBounds };
