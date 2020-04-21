import { Loop } from '../loop';
/** @hidden */
declare let getShapeBounds: (a: Loop[]) => {
    minX: import("../point-on-shape").IPointOnShape;
    minY: import("../point-on-shape").IPointOnShape;
    maxX: import("../point-on-shape").IPointOnShape;
    maxY: import("../point-on-shape").IPointOnShape;
};
export { getShapeBounds };
