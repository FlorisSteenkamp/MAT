"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Find point where two lines intersect. Returns he point where the two lines
 * intersect or undefined if they don't intersect or are the same line.
 * @param l1 - The first line
 * @param l2 - The second line
 */
function lineLineIntersection(l1, l2) {
    let [[p1x, p1y], [p2x, p2y]] = l1;
    let [[p3x, p3y], [p4x, p4y]] = l2;
    let v1x = p2x - p1x;
    let v1y = p2y - p1y;
    let v2x = p4x - p3x;
    let v2y = p4y - p3y;
    let cross = v2x * v1y - v2y * v1x;
    if (cross === 0) {
        // parallel
        return undefined;
    }
    let b = ((p3y - p1y) * v1x - (p3x - p1x) * v1y) / cross;
    return [p3x + b * v2x, p3y + b * v2y];
}
exports.lineLineIntersection = lineLineIntersection;
