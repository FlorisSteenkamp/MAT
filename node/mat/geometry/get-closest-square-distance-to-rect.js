"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestSquareDistanceToRect = void 0;
const flo_vector2d_1 = require("flo-vector2d");
/**
 * @hidden
 */
function getClosestSquareDistanceToRect(box, p) {
    let [[x0, y0], [x1, y1]] = box;
    let [xp, yp] = p;
    if (xp < x0) {
        if (yp < y0) {
            return flo_vector2d_1.squaredDistanceBetween(box[0], p);
        }
        else if (yp > y1) {
            return flo_vector2d_1.squaredDistanceBetween([x0, y1], p);
        }
        else {
            return Math.pow((x0 - xp), 2);
        }
    }
    else if (xp > x1) {
        if (yp < y0) {
            return flo_vector2d_1.squaredDistanceBetween([x1, y0], p);
        }
        else if (yp > y1) {
            return flo_vector2d_1.squaredDistanceBetween(box[1], p);
        }
        else {
            return Math.pow((xp - x1), 2);
        }
    }
    else {
        if (yp < y0) {
            return Math.pow((y0 - yp), 2);
        }
        else if (yp > y1) {
            return Math.pow((yp - y1), 2);
        }
        return 0;
    }
}
exports.getClosestSquareDistanceToRect = getClosestSquareDistanceToRect;
//# sourceMappingURL=get-closest-square-distance-to-rect.js.map