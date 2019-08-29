"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 * Z and z: (from www.w3.org)
 *
 * params: (none)
 *
 * Close the current subpath by drawing a straight line from the current point
 * to current subpath's initial point. Since the Z and z commands take no
 * parameters, they have an identical effect.
 */
function z(s) {
    let ps = [
        s.p,
        s.initialPoint
    ];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.z = z;
//# sourceMappingURL=z.js.map