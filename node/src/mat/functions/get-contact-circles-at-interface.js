"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const point_on_shape_1 = require("../classes/point-on-shape");
// Angle in degrees
const DEGREES = {
    '0': 0.0000,
    '0.25': 0.0050,
    '1': 0.0167,
    '4': 0.0698,
    '15': 0.2588,
    '16': 0.2756,
};
function getContactCirclesAtInterface(curve) {
    let { isQuiteSharp, isQuiteDull } = curve.corner;
    if (isQuiteSharp) {
        return [
            new point_on_shape_1.PointOnShape(curve, 1, mat_constants_1.MAT_CONSTANTS.pointType.sharp)
        ];
    }
    else if (isQuiteDull) {
        return [
            new point_on_shape_1.PointOnShape(curve, 1, mat_constants_1.MAT_CONSTANTS.pointType.dull),
            new point_on_shape_1.PointOnShape(curve.next, 0, mat_constants_1.MAT_CONSTANTS.pointType.dull)
        ];
    }
    return [];
}
exports.getContactCirclesAtInterface = getContactCirclesAtInterface;
