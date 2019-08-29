"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../point-on-shape");
/** @hidden */
function getSharpCorners(possPerLoop) {
    let sharpCornersPerLoop = [];
    for (let poss of possPerLoop) {
        let sharpCorners = [];
        for (let pos of poss) {
            if (point_on_shape_1.PointOnShape.isQuiteSharpCorner(pos)) {
                sharpCorners.push(pos);
            }
        }
        sharpCornersPerLoop.push(sharpCorners);
    }
    return sharpCornersPerLoop;
}
exports.getSharpCorners = getSharpCorners;
//# sourceMappingURL=get-sharp-corners.js.map