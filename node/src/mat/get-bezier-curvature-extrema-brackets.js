"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DELTA = 1e-6;
/**
 * Calculates the curvature extrema brackets of the given cubic bezier.
 * See the paper at http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
 * Note that naming conventions is roughly as in the paper above.
 * @param ps
 */
function calcBezierCurvatureExtremaBrackets(ps) {
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    let brackets = [];
    // Bezier points translated to origin;
    let P_1x = x1 - x0;
    let P_1y = y1 - y0;
    let P_2x = x2 - x0;
    let P_2y = y2 - y0;
    let P_3x = x3 - x0;
    let P_3y = y3 - y0;
    // Distance to consecutive points
    let W_0x = P_1x;
    let W_1x = P_2x - P_1x;
    let W_2x = P_3x - P_2x;
    let W_0y = P_1y;
    let W_1y = P_2y - P_1y;
    let W_2y = P_3y - P_2y;
    // Check for degenerate case in which cubic curve becomes quadratic. 
    if ((Math.abs(W_0x - 2 * W_1x + W_2x) < DELTA) &&
        (Math.abs(W_0y - 2 * W_1y + W_2y) < DELTA)) {
        // TODO - This case is simpler due to being quadratic - still needs to
        // be implemented!. 
    }
    // See http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
    // Rotate curve so that W0 - 2W1 + W2 = (0, (1/3)a), a != 0
    let atan_numer = P_3x - 3 * P_2x + 3 * P_1x;
    let atan_denom = P_3y - 3 * P_2y + 3 * P_1y;
    let atan_numer_squared = atan_numer * atan_numer;
    let atan_denom_squared = atan_denom * atan_denom;
    let rad = Math.sqrt((atan_numer_squared / atan_denom_squared) + 1);
    let cos_theta = 1 / rad;
    let sin_theta;
    if (cos_theta === 0) {
        sin_theta = 1;
    }
    else {
        sin_theta = atan_numer / (atan_denom * rad);
    }
    // Here we skip expensive trig evaluations
    let R_1x = P_1x * cos_theta - P_1y * sin_theta;
    let R_1y = P_1x * sin_theta + P_1y * cos_theta;
    let R_2x = P_2x * cos_theta - P_2y * sin_theta;
    let R_2y = P_2x * sin_theta + P_2y * cos_theta;
    let R_3x = P_3x * cos_theta - P_3y * sin_theta;
    let R_3y = P_3x * sin_theta + P_3y * cos_theta;
    // Modify W_0x, etc. to be correct for new rotated curve 
    W_0x = R_1x;
    W_1x = R_2x - R_1x;
    W_2x = R_3x - R_2x;
    W_0y = R_1y;
    W_1y = R_2y - R_1y;
    W_2y = R_3y - R_2y;
    let a = 3 * (W_0y - 2 * W_1y + W_2y);
    let dif = R_2x - 2 * R_1x; // which = W_1x - W_0x;
    if (dif === 0) {
        // Case 1 (special) - W_1x - W_0x === 0
        // Degenerate to cubic function	
        if (W_0x !== 0) {
            // TODO - finish!
            // TODO - we also still need to check for degenerate cubic (see 
            // beginning of paper)
        }
        else {
            // We have a straight line x=0!
            return [];
        }
    }
    else {
        // Case 2 (usual) - W_1x - W_0x !== 0
        if (dif < 0) {
            // Reflect curve accross y-axis to make dif > 0
            R_1x = -R_1x;
            R_2x = -R_2x;
            R_3x = -R_3x;
            // Modify W_0x, etc. to be correct for new reflected 
            W_0x = -W_0x;
            W_1x = -W_1x;
            W_2x = -W_2x;
            dif = -dif;
        }
        // From the paper:
        // ---------------
        // All curves has exactly one of 4 cases:
        //
        // 1. It has a single inflection point and exactly 2 curvature maxima 
        //    (symmetrically positioned about inflection point). This is the 
        //    case if dif === 0 in above code.
        // 2. TODO - It has a single cusp - ignored for now!
        // 3. It has a point of self-intersection - occurs if d < 0 in paper.
        // 4. It has 2 inflection points, no cusps, no self-intersections.
        //    It can have either 3 or 5 curvature extrema
        //    a. The case of 5 curvature extrema is ignored for now - in the 
        //       paper it is mentioned to even find such a curve is difficult 
        //       and it seems such curves have very sharp curvature at one point 
        //       which does not usually occur in an SVG shape. But this case 
        //       should later be included or we'll miss some points.
        //    b. There are 3 curvature extrema:
        //       Extrema occur in the range (-inf, -sqrt(d)), 
        //       (-sqrt(d), sqrt(d)), (sqrt(d), inf). 
        //       Since we dont know how to select -inf and inf we will just 
        //       choose them to be -10 and 11 (remember bezier runs from t=0 to 
        //       t=1). If Brent's method runs out of the (0,1) interval we stop 
        //       and use 0 or 1 as the extremum? Remember extrema can also occur 
        //       at t=0 and t=1!
        //
        // TODO - At the moment we only test for case 1 and 4b, but in future 
        // we must test and eliminate the other cases.
        let μ = 6 * dif;
        let λ = (3 * a * W_0x) / (μ * μ);
        let γ1 = (3 * a * W_0y) / (μ * μ);
        let γ2 = (3 * (W_1y - W_0y)) / (μ);
        let d = λ * λ - 2 * γ2 * λ + γ1;
        let b = 2 * (γ2 - λ);
        let deParamBoundary = deParameterizeBoundary(λ, μ, a);
        if (d > 0) {
            let ssigd_ = Math.sqrt(d);
            // de-reparametize
            // Note: the sda and sdb here are the inflection points forcase iv! 
            // there are easier ways to calculate these
            let sda = -ssigd_;
            let sdb = ssigd_;
            brackets =
                [
                    [Number.NEGATIVE_INFINITY, sda],
                    [sda, sdb],
                    [sdb, Number.POSITIVE_INFINITY]
                ]
                    .map(deParamBoundary)
                    .map(clipBoundary);
        }
        else if (d < 0) {
            // It is a loop 
            // Note: The loop intersection may be outside t=[0,1] but curvature 
            // maxima may still occur inside t=[0,1] of course.
            // There can be 1 or 3 maxima of curvature.
            let ξ1_ = 2 * b * b - 8 * d - 3;
            if (ξ1_ < 0) {
                brackets = [[0, Math.sqrt(-3 * d)]]
                    .map(deParamBoundary)
                    .map(clipBoundary);
            }
            else {
                let ξ2_ = Math.sqrt(5 * ξ1_);
                let ξ1 = (-5 * b - ξ2_) / 10;
                let ξ2 = (-5 * b + ξ2_) / 10;
                brackets = [
                    [Number.NEGATIVE_INFINITY, ξ1],
                    [ξ1, Math.min(0, ξ2)],
                    [Math.max(0, ξ2), Math.sqrt(-3 * d)]
                ]
                    .map(deParamBoundary)
                    .map(clipBoundary);
            }
        }
        else if (d === 0) {
            // TODO - It is a cusp - still to implement!
        }
    }
    return brackets;
}
exports.calcBezierCurvatureExtremaBrackets = calcBezierCurvatureExtremaBrackets;
/**
 * Clips to [0,1] or returns undefined if not within [0,1].
 * @param range
 */
function clipBoundary(range) {
    let [a, b] = range;
    if ((a < 0 && b < 0) || (a > 1 && b > 1)) {
        return undefined;
    }
    if (a < 0) {
        a = 0;
    }
    if (a > 1) {
        a = 1;
    }
    if (b < 0) {
        b = 0;
    }
    if (b > 1) {
        b = 1;
    }
    return [a, b];
}
/**
 *
 * @param λ
 * @param μ
 * @param a
 */
function deParameterize(λ, μ, a) {
    return (σ) => (σ - λ) * (μ / a);
}
/**
 *
 * @param λ
 * @param μ
 * @param a
 */
function deParameterizeBoundary(λ, μ, a) {
    return (boundary) => boundary.map(deParameterize(λ, μ, a));
}
;
