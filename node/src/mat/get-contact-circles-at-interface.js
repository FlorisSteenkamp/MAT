"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const curve_1 = require("../curve");
const point_on_shape_1 = require("../point-on-shape");
function getContactCirclesAtInterface(curve) {
    let { isQuiteSharp, isDull, isQuiteDull } = curve_1.Curve.getCornerAtEnd(curve);
    if (isQuiteSharp) {
        return [new point_on_shape_1.PointOnShape(curve, 1)];
    }
    else if (isQuiteDull) {
        return [
            new point_on_shape_1.PointOnShape(curve, 1),
            new point_on_shape_1.PointOnShape(curve.next, 0)
        ];
    }
    else if (isDull) {
    }
    return [];
}
exports.getContactCirclesAtInterface = getContactCirclesAtInterface;
