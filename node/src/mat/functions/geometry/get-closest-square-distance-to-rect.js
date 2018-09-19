"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
/**
 *
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
            let d = x0 - xp;
            return d * d;
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
            let d = xp - x1;
            return d * d;
        }
    }
    else {
        if (yp < y0) {
            let d = y0 - yp;
            return d * d;
        }
        else if (yp > y1) {
            let d = yp - y1;
            return d * d;
        }
        else {
            return 0;
        }
    }
}
exports.getClosestSquareDistanceToRect = getClosestSquareDistanceToRect;
