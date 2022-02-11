import { Loop } from '../loop.js';
/** @hidden */
declare let getShapeBounds: (a: Loop[]) => {
    minX: import("../point-on-shape.js").IPointOnShape;
    minY: import("../point-on-shape.js").IPointOnShape;
    maxX: import("../point-on-shape.js").IPointOnShape;
    maxY: import("../point-on-shape.js").IPointOnShape;
};
export { getShapeBounds };
