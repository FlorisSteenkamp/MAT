"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
/**
 * Possibly changes the curve into one that is as close to the original as
 * possible but does not have pathological properties (i.e. does not have near
 * infinitely sharp corners, etc) or if that is not possible remove the curve in
 * some circumstances (e.g. if it is of extreme short length, etc.).
 * @param ps Cubic bezier curve points.
 */
function dePathologify(ps_, max) {
    // TODO 
    // We check if any of the ps are coincident and thus
    // that the bezier is degenerate in some sense. If that is the
    // case we apply a heuristic to get a new similar bezier by 
    // respacing the points. This entire function is very 
    // convoluted.
    // We should investigate a better mathematical solution.
    // Currently if the bezier degenerates more or less into a point
    // we make the next bezier start at the previous bezier's end
    // point else we adjust the bezier to be less pathological.
    let delta = max / 1e4;
    let ds = [
        [
            0,
            flo_vector2d_1.manhattanDistanceBetween(ps_[0], ps_[1]),
            flo_vector2d_1.manhattanDistanceBetween(ps_[0], ps_[2]),
            flo_vector2d_1.manhattanDistanceBetween(ps_[0], ps_[3])
        ],
        [
            flo_vector2d_1.manhattanDistanceBetween(ps_[1], ps_[0]),
            0,
            flo_vector2d_1.manhattanDistanceBetween(ps_[1], ps_[2]),
            flo_vector2d_1.manhattanDistanceBetween(ps_[1], ps_[3]),
        ],
        [
            flo_vector2d_1.manhattanDistanceBetween(ps_[2], ps_[0]),
            flo_vector2d_1.manhattanDistanceBetween(ps_[2], ps_[1]),
            0,
            flo_vector2d_1.manhattanDistanceBetween(ps_[2], ps_[3]),
        ],
        [
            flo_vector2d_1.manhattanDistanceBetween(ps_[3], ps_[0]),
            flo_vector2d_1.manhattanDistanceBetween(ps_[3], ps_[1]),
            flo_vector2d_1.manhattanDistanceBetween(ps_[3], ps_[2]),
            0,
        ]
    ];
    let ps = ps_;
    const SHIFT = 0.02;
    // Check if first or last 3 points are coincident
    if (ds[0][1] < delta && ds[1][2] < delta ||
        ds[1][2] < delta && ds[2][3] < delta) {
        ps = [
            ps_[0],
            flo_vector2d_1.interpolate(ps_[0], ps_[3], 1 / 3),
            flo_vector2d_1.interpolate(ps_[0], ps_[3], 2 / 3),
            ps_[3]
        ];
    }
    // Check if first 2 points are coincident
    if (ds[0][1] < delta) {
        ps[1] = flo_vector2d_1.interpolate(ps_[0], ps_[2], SHIFT);
    }
    // Check if last 2 points are coincident
    if (ds[2][3] < delta) {
        ps[2] = flo_vector2d_1.interpolate(ps_[1], ps_[3], 1 - SHIFT);
    }
    // Check if middle 2 points are coincident
    if (ds[1][2] < delta) {
        ps[1] = flo_vector2d_1.interpolate(ps_[0], ps_[1], 1 - SHIFT);
        ps[2] = flo_vector2d_1.interpolate(ps_[2], ps_[3], SHIFT);
    }
    return ps;
}
exports.dePathologify = dePathologify;
//# sourceMappingURL=de-pathologify.js.map