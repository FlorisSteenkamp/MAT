"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const are_all_points_different_1 = require("./are-all-points-different");
const flo_vector2d_1 = require("flo-vector2d");
/**
 * @hidden
 * Returns the same bezier if its points are well-spaced, e.g. all points not
 * coincident, etc., else fix it, if possible, and return the fixed bezier,
 * else return undefined.
 * @param ps A bezier
 */
function fixBezierByPointSpacing(ps, gridSpacing, sendToGrid) {
    // Early filter - if all points coincide, we're done - degenerate to point
    if (flo_bezier3_1.lengthSquaredUpperBound(ps) === 0) {
        return undefined; // Cannot fix
    }
    // Early filter - if no points coincide, we're done - well spaced
    if (are_all_points_different_1.areAllPointsDifferent(ps)) {
        return ps;
    }
    if (arePsEqual(ps[0], ps[ps.length - 1])) {
        //console.log(ps);
        // TODO - If first and last points equal we remove the bezier - in future we 
        // should simply handle this case for cubics - lines and quadratics degenerate
        // into a point and a self-overlapping curve respectively.
        return undefined;
    }
    if (ps.length === 4) {
        return fixCubic(ps, gridSpacing, sendToGrid);
    }
    else if (ps.length === 3) {
        // At this point not all points same and not all points different and 
        // not endpoints coincide, so either:
        // * point 0 and 1 coincide
        // * point 1 and 2 coincide
        // but in that case we simply have a line
        return [ps[0], ps[2]];
    }
    else if (ps.length === 2) {
        // obviously no need to fix line
        return ps;
    }
}
exports.fixBezierByPointSpacing = fixBezierByPointSpacing;
function fixCubic(ps, gridSpacing, sendToGrid) {
    // At this point, either:
    // * point 0, 1 and 2 coincide
    // * point 1, 2 and 3 coincide
    // * points 0,1 AND points 2,3 coincide
    // * only point 0 and point 1 coincides
    // * only point 0 and point 2 coincides        
    // * only point 1 and point 2 coincides
    // * only point 1 and point 3 coincides
    // * only point 2 and point 3 coincides
    // If point 0, 1 and 2 coincide OR point 1, 2 and 3 coincide OR
    // points 0,1 AND points 2,3 coincide we have a line
    if ((arePsEqual(ps[0], ps[1]) &&
        arePsEqual(ps[1], ps[2])) ||
        (arePsEqual(ps[1], ps[2]) &&
            arePsEqual(ps[2], ps[3])) ||
        (arePsEqual(ps[0], ps[1]) &&
            arePsEqual(ps[2], ps[3]))) {
        // Check if first and last point are sufficiently far apart to split
        // the bezier into a line so that all points differ.
        if (ps[0][0] - ps[3][0] > (3 + 1) * gridSpacing ||
            ps[0][1] - ps[3][1] > (3 + 1) * gridSpacing) {
            return [ps[0], ps[ps.length - 1]];
        }
        else {
            // Points are not sufficiently far apart to resolve onto grid -
            // cannot fix it.
            return undefined;
        }
    }
    // At this point, either:
    // * only point 0 and point 1 coincides
    // * only point 0 and point 2 coincides        
    // * only point 1 and point 2 coincides
    // * only point 1 and point 3 coincides
    // * only point 2 and point 3 coincides
    // If points 0,2 OR points 1,3 OR points 1,2 coincide we're done - I
    // don't think these are problematic
    if (arePsEqual(ps[0], ps[2]) ||
        arePsEqual(ps[1], ps[3]) ||
        arePsEqual(ps[1], ps[2])) {
        return ps;
    }
    // At this point, either:
    // * only point 0 and point 1 coincides
    // * only point 2 and point 3 coincides
    if (arePsEqual(ps[0], ps[1])) {
        // Move point 1 towards point 2 without surpassing it and ensuring it
        // will be on a new grid point
        // If squared distance between the points < 4 * gridSpacing just 
        // move them onto each other - this shouldn't affect the overall 
        // accuracy of the algorithm and it ensures the move > gridSpacing.
        if (flo_vector2d_1.squaredDistanceBetween(ps[1], ps[2]) < 4 * gridSpacing) {
            return [
                ps[0],
                ps[2],
                ps[2],
                ps[3]
            ];
        }
        else {
            let v = flo_vector2d_1.toLength(flo_vector2d_1.fromTo(ps[1], ps[2]), 2 * gridSpacing);
            let p1 = flo_vector2d_1.translate(ps[1], v);
            return [
                ps[0],
                sendToGrid(p1),
                ps[2],
                ps[3]
            ];
        }
    }
    if (arePsEqual(ps[2], ps[3])) {
        // Move point 2 towards point 1 without surpassing it and ensuring it
        // will be on a new grid point
        // If squared distance between the points < 4 * gridSpacing just 
        // move them onto each other - this shouldn't affect the overall 
        // accuracy of the algorithm and it ensures the move > gridSpacing.
        if (flo_vector2d_1.squaredDistanceBetween(ps[2], ps[1]) < 4 * gridSpacing) {
            return [
                ps[0],
                ps[1],
                ps[1],
                ps[3]
            ];
        }
        else {
            let v = flo_vector2d_1.toLength(flo_vector2d_1.fromTo(ps[2], ps[1]), 2 * gridSpacing);
            let p2 = flo_vector2d_1.translate(ps[2], v);
            return ps = [
                ps[0],
                ps[1],
                sendToGrid(p2),
                ps[3]
            ];
        }
    }
}
/** Returns true if the points are the same */
function arePsEqual(p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}
//# sourceMappingURL=fix-bezier-by-point-spacing.js.map