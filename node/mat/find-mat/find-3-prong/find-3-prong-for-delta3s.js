"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const circle_1 = require("../../../circle");
const point_on_shape_1 = require("../../../point-on-shape");
const get_closest_boundary_point_1 = require("../../closest-boundary-point/get-closest-boundary-point");
const calc_initial_3_prong_center_1 = require("./calc-initial-3-prong-center");
const get_closest_points_1 = require("./get-closest-points");
const calc_better_x_1 = require("./calc-better-x");
const curve_1 = require("../../../curve");
const calcVectorToZeroV_StraightToIt = flo_vector2d_1.fromTo;
/**
 * Finds a 3-prong using only the 3 given δs.
 * @param δs The boundary pieces
 * @param idx δ identifier
 * @param bezierPiecess
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function find3ProngForDelta3s(δs, idx, k, bezierPiecess, extreme) {
    const TOLERANCE = extreme * 1e-10;
    const MAX_ITERATIONS = 10;
    //k = 0;
    /*
    let δ3s = [
        δs[0],
        δs[idx],
        δs[δs.length-1]
    ];
    */
    let δs_ = [
        δs[0],
        δs[idx],
        δs[δs.length - 1]
    ];
    /*
    let bezierPiece3s = [
        bezierPiecess[0],
        bezierPiecess[idx],
        bezierPiecess[δs.length-1]
    ];
    */
    let bezierPieces_ = [
        bezierPiecess[0],
        bezierPiecess[idx],
        bezierPiecess[δs.length - 1]
    ];
    let δ3ss = [
        [δs_[0], δs_[1], δs_[2]],
        [δs_[1], δs_[2], δs_[0]],
        [δs_[2], δs_[0], δs_[1]],
    ];
    let bezierPiecess_ = [
        [bezierPieces_[0], bezierPieces_[1], bezierPieces_[2]],
        [bezierPieces_[1], bezierPieces_[2], bezierPieces_[0]],
        [bezierPieces_[2], bezierPieces_[0], bezierPieces_[1]],
    ];
    let δ3s = δ3ss[k];
    let bezierPiece3s = bezierPiecess_[k];
    if (δ3s[0][0].isSharp()) {
        return undefined;
    }
    let ps;
    let circumCenter_;
    let j = 0; // Safeguard for slow convergence
    let x = calc_initial_3_prong_center_1.calcInitial3ProngCenter(δ3s, bezierPiece3s);
    if (typeof _debug_ !== 'undefined') {
        let threeProngs = _debug_.generated.elems.threeProng;
        let d = threeProngs[threeProngs.length - 1];
        let trace = d.traces[d.traces.length - 1];
        trace.push(x);
    }
    let tolerance = Number.POSITIVE_INFINITY;
    while (tolerance > TOLERANCE && j < MAX_ITERATIONS) {
        j++;
        ps = get_closest_points_1.getClosestPoints(x, bezierPiece3s);
        if (!Number.isFinite(x[0]) || !Number.isFinite(x[1])) {
            // TODO - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }
        circumCenter_ = flo_vector2d_1.circumCenter(ps.map(x => x.p));
        let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter_);
        //console.log('' + x[0] + ' ' + x[1])
        //console.log('' + vectorToZeroV[0] + ' ' + vectorToZeroV[1]);
        if (!Number.isFinite(vectorToZeroV[0]) || !Number.isFinite(vectorToZeroV[1])) {
            // TODO - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }
        let upds = calc_better_x_1.calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        ps = upds.newPs;
        if (typeof _debug_ !== 'undefined') {
            let threeProngs = _debug_.generated.elems.threeProng;
            let d = threeProngs[threeProngs.length - 1];
            let trace = d.traces[d.traces.length - 1];
            trace.push(x);
        }
        let V = flo_vector2d_1.len(vectorToZeroV); // The 'potential'
        tolerance = Math.abs(V - upds.newV);
    }
    //_debug_.fs.draw.dot(_debug_.generated.g, x, 0.05);
    let radius = (flo_vector2d_1.distanceBetween(x, ps[0].p) +
        flo_vector2d_1.distanceBetween(x, ps[1].p) +
        flo_vector2d_1.distanceBetween(x, ps[2].p)) / 3;
    let circle = new circle_1.Circle(x, radius);
    //-------------------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points - they should 
    // be very close to tangent to the boundary piece tangents at those points 
    // (up to sign). Sharp corners are a common special case.
    //-------------------------------------------------------------------------
    let totalAngleError = 0;
    for (let i = 0; i < 3; i++) {
        let p = ps[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        let v = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(p.p, x));
        let v1 = flo_vector2d_1.rotate90Degrees(v);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        if (point_on_shape_1.PointOnShape.isDullCorner(p)) {
            let corner = curve_1.Curve.getCornerAtEnd(p.curve);
            let tans = corner.tangents;
            let perps = tans.map(flo_vector2d_1.rotate90Degrees);
            let angleError1 = Math.asin(flo_vector2d_1.cross(perps[0], v));
            let angleError2 = Math.asin(flo_vector2d_1.cross(v, perps[1]));
            let angleError = 0;
            if (angleError1 > 0) {
                angleError += angleError1;
            }
            if (angleError2 > 0) {
                angleError += angleError2;
            }
            totalAngleError += angleError;
        }
        else {
            //---------------------------
            // Tangent of curve at point
            //---------------------------
            let v2 = flo_vector2d_1.toUnitVector(flo_bezier3_1.tangent(p.curve.ps, p.t));
            // Cross is more numerically stable than Vector.dot at angles a
            // multiple of Math.PI **and** is close to the actual angle value
            // and can thus just be added to cone method of looking at 
            // tolerance.
            // Should be close to zero and is close to the actual angle.
            let cross_ = Math.abs(Math.asin(flo_vector2d_1.cross(v1, v2)));
            totalAngleError += cross_;
        }
    }
    //-------------------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and the closest
    // point to the 3-prong. It should be around 0. If not, this is not a good 
    // candidate for the 3-prong.
    //-------------------------------------------------------------------------
    let closestDs = [];
    for (let i = 0; i < bezierPiecess.length; i++) {
        let p = get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPiecess[i], x, undefined, undefined);
        closestDs.push(flo_vector2d_1.distanceBetween(p.pos.p, x));
    }
    let closestD = Math.min(...closestDs);
    let radiusDelta = Math.abs(radius - closestD);
    // Weights below still need to be optimized.
    let W1 = 1;
    let W2 = 1;
    let error = W1 * radiusDelta + W2 * totalAngleError;
    return { ps, circle, error, δ3s };
}
exports.find3ProngForDelta3s = find3ProngForDelta3s;
//# sourceMappingURL=find-3-prong-for-delta3s.js.map