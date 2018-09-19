"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const circle_1 = require("../../classes/circle");
const point_on_shape_1 = require("../../classes/point-on-shape");
const get_closest_boundary_point_to_point_1 = require("../get-closest-boundary-point-to-point");
const calc_initial_3_prong_center_1 = require("./calc-initial-3-prong-center");
const get_closest_points_1 = require("./get-closest-points");
const calc_better_x_1 = require("./calc-better-x");
const calcVectorToZeroV_StraightToIt = flo_vector2d_1.fromTo;
/**
 * Finds a 3-prong using only the 3 given delta's.
 * @param idx - Delta identifier
 */
function find3ProngForDelta3s(deltas, idx, bezierPiecess) {
    // TODO - Choose a tolerance relative to shape size.
    const TOLERANCE = 1e-7;
    let delta3s = [
        deltas[0],
        deltas[idx],
        deltas[deltas.length - 1]
    ];
    let bezierPiece3s = [
        bezierPiecess[0],
        bezierPiecess[idx],
        bezierPiecess[deltas.length - 1]
    ];
    let ps;
    let circumCenter_;
    let ii = 0; // Safeguard
    let x = calc_initial_3_prong_center_1.calcInitial3ProngCenter(delta3s, bezierPiece3s);
    let tolerance = Number.POSITIVE_INFINITY;
    // TODO 10 below is magic, fix or add somewhere as a constant
    while (tolerance > TOLERANCE && ii < 10) {
        ii++;
        ps = get_closest_points_1.getClosestPoints(x, bezierPiece3s);
        if (!ps[0] || !ps[1] || !ps[2]) {
            console.log(x);
            console.log(ps);
            console.log(bezierPiece3s);
        }
        circumCenter_ = flo_vector2d_1.circumCenter(ps.map(x => x.p));
        let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter_);
        let upds = calc_better_x_1.calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        let V = flo_vector2d_1.len(vectorToZeroV);
        ps = upds.newPs;
        tolerance = Math.abs(V - upds.newV);
    }
    let radius = (flo_vector2d_1.distanceBetween(x, ps[0].p) +
        flo_vector2d_1.distanceBetween(x, ps[1].p) +
        flo_vector2d_1.distanceBetween(x, ps[2].p)) / 3;
    let circle = new circle_1.Circle(x, radius);
    //-----------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points -
    // they should be very close to tangent to the boundary piece 
    // tangents at those points (up to sign). Sharp corners are a
    // common special case.
    //-----------------------------------------------------------------
    let totalAngleError = 0;
    for (let i = 0; i < 3; i++) {
        let p = ps[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        let vv = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(p.p, x));
        let v1 = flo_vector2d_1.rotate90Degrees(vv);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        let dullCorner = point_on_shape_1.PointOnShape.dullCornerAt(p);
        if (dullCorner) {
            let tans = dullCorner.tans;
            let perps = tans.map(flo_vector2d_1.rotate90Degrees);
            let angleError1Pre = flo_vector2d_1.cross(perps[0], vv);
            let angleError2Pre = flo_vector2d_1.cross(vv, perps[1]);
            let angleError1 = Math.asin(angleError1Pre);
            let angleError2 = Math.asin(angleError2Pre);
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
            let ps = p.bezierNode.item;
            let v2 = flo_vector2d_1.toUnitVector(flo_bezier3_1.tangent(ps, p.t));
            // Cross is more numerically stable than Vector.dot at angles
            // a multiple of Math.PI **and** is close to the actual angle
            // value and can thus just be added to cone method of looking
            // at tolerance.
            // Should be close to zero and is close to the actual angle.
            let cross_ = Math.abs(Math.asin(flo_vector2d_1.cross(v1, v2)));
            totalAngleError += cross_;
        }
    }
    //if (_debug_ && _debug_.log) { console.log(totalAngleError); }
    //-----------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and 
    // the closest point to the 3-prong. It should be around 0. If not,
    // this is not a good candidate for the 3-prong.
    //-----------------------------------------------------------------
    let closestDs = [];
    for (let i = 0; i < bezierPiecess.length; i++) {
        let p = get_closest_boundary_point_to_point_1.getClosestBoundaryPointToPoint(bezierPiecess[i], x, undefined, undefined // TODO - bug: we must provide a t value and the
        // parameter order of the last 2 parameters of this function
        // should be swapped. Consider the consequences of leaving this
        // bug unchecked.
        );
        closestDs.push(flo_vector2d_1.distanceBetween(p.p, x));
    }
    let closestD = Math.min(...closestDs);
    let radiusDelta = Math.abs(radius - closestD);
    // TODO Weights still need to be determined
    let W1 = 1;
    let W2 = 1;
    let error = W1 * radiusDelta + W2 * totalAngleError;
    return { ps, circle, error };
}
exports.find3ProngForDelta3s = find3ProngForDelta3s;
