"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEquidistantPointOnLine = void 0;
/**
 * @hidden
 * @param x
 * @param y
 * @param z
 * @returns The point on the line from y to x that is equidistant from y and z.
 */
function findEquidistantPointOnLine(x, y, z) {
    // Some basic algebra (not shown) finds the required point.
    // Swap axes if x and y are more aligned to y-axis than to x-axis.
    let swapAxes = Math.abs((x[1] - y[1]) / (x[0] - y[0])) > 1;
    // Cache
    let x1, x2, y1, y2, z1, z2;
    if (swapAxes) {
        x1 = x[1];
        x2 = x[0];
        y1 = y[1];
        y2 = y[0];
        z1 = z[1];
        z2 = z[0];
    }
    else {
        x1 = x[0];
        x2 = x[1];
        y1 = y[0];
        y2 = y[1];
        z1 = z[0];
        z2 = z[1];
    }
    // a <= 1 (due to swapped axes)
    let a = (x2 - y2) / (x1 - y1);
    let b = y2 - a * y1;
    let c = (y1 * y1 + y2 * y2 - z1 * z1 - z2 * z2) + 2 * b * (z2 - y2);
    let d = y1 - z1 + a * (y2 - z2);
    let t1 = c / (2 * d);
    let t2 = a * t1 + b;
    return swapAxes ? [t2, t1] : [t1, t2];
}
exports.findEquidistantPointOnLine = findEquidistantPointOnLine;
//# sourceMappingURL=find-equidistant-point-on-line.js.map