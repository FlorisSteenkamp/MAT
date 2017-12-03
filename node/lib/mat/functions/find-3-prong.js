"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const circle_1 = require("../../geometry/classes/circle");
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
const shape_1 = require("../../geometry/classes/shape");
const get_closest_boundary_point_to_point_1 = require("../../geometry/functions/get-closest-boundary-point-to-point");
const three_prong_for_debugging_1 = require("../classes/debug/three-prong-for-debugging");
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
function find3Prong(shape, δs) {
    let bezierPiecess = δs.map(function (δ) {
        return shape_1.default.getBoundaryPieceBeziers(δ);
    });
    let candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng;
    let bestIndx = undefined;
    let smallestError = Number.POSITIVE_INFINITY;
    for (let i = 1; i < δs.length - 1; i++) {
        let { circle, ps, error } = find3ProngForDelta3s(shape, δs, i, bezierPiecess);
        if (typeof window !== 'undefined' && window._debug_) {
            const _debug_ = window._debug_;
            candidateThreeProngs.push({ circle, ps });
        }
        if (error < smallestError) {
            smallestError = error;
            bestIndx = i - 1;
            threeProng = { circle, ps, delta3s: undefined };
        }
    }
    //-------------------------------------
    //---- Add some additional properties
    //-------------------------------------
    let delta3s = [δs[0], δs[bestIndx + 1], δs[δs.length - 1]];
    threeProng.delta3s = delta3s;
    //-------------------------------------
    if (typeof window !== 'undefined' && window._debug_) {
        const _debug_ = window._debug_;
        let threeProngForDebugging = new three_prong_for_debugging_1.default(threeProng, δs, bestIndx, candidateThreeProngs);
        _debug_.generated.threeProngs.push(threeProngForDebugging);
    }
    return threeProng;
}
/**
 * Finds a 3-prong using only the 3 given delta's.
 *
 * @param i - Specific delta indx.
 * @returns {Object}
 */
function find3ProngForDelta3s(shape, deltas, idx, bezierPiecess) {
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
    let circumCenter;
    let ii = 0; // Safeguard
    let x = calcInitial3ProngPoint(shape, delta3s, bezierPiece3s);
    let tolerance = Number.POSITIVE_INFINITY;
    // TODO 10 below is magic, fix or add somewhere as a constant
    while (tolerance > TOLERANCE && ii < 10) {
        ii++;
        ps = getClosestPoints(x, bezierPiece3s);
        circumCenter = flo_vector2d_1.default.circumCenter(ps.map(x => x.p));
        let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter);
        let upds = calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        let V = flo_vector2d_1.default.len(vectorToZeroV);
        ps = upds.newPs;
        tolerance = Math.abs(V - upds.newV);
    }
    let radius = (flo_vector2d_1.default.distanceBetween(x, ps[0].p) +
        flo_vector2d_1.default.distanceBetween(x, ps[1].p) +
        flo_vector2d_1.default.distanceBetween(x, ps[2].p)) / 3;
    let circle = new circle_1.default(x, radius);
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
        let vv = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(p.p, x));
        let v1 = flo_vector2d_1.default.rotate90Degrees(vv);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        let key = point_on_shape_1.default.makeSimpleKey(p.p);
        let dullCorner = shape.dullCornerHash[key];
        if (dullCorner) {
            //if (FloMat._debug_ && FloMat._debug_.log) { console.log(dullCorner); }
            let tans = dullCorner.tans;
            let perps = tans.map(flo_vector2d_1.default.rotate90Degrees);
            if (typeof window !== 'undefined' && window._debug_) {
                const _debug_ = window._debug_;
                if (_debug_.log) {
                    /*
                    FloMat._debug_.fs.draw.line(
                            [p, Vector.translate(p, perps[0])],
                            'thin10 red'
                    );
                    FloMat._debug_.fs.draw.line(
                            [p, Vector.translate(p, perps[1])],
                            'thin10 red'
                    );
                    */
                    // The below must be elem [0,1].
                    //console.log(Vector.cross( perps[0], perps[1] )); 
                }
            }
            let angleError1Pre = flo_vector2d_1.default.cross(perps[0], vv);
            let angleError2Pre = flo_vector2d_1.default.cross(vv, perps[1]);
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
            let ps = p.bezierNode.item.bezier3;
            let v2 = flo_vector2d_1.default.toUnitVector(flo_bezier3_1.default.tangent(ps)(p.t));
            // Cross is more numerically stable than Vector.dot at angles
            // a multiple of Math.PI **and** is close to the actual angle
            // value and can thus just be added to cone method of looking
            // at tolerance.
            // Should be close to zero and is close to the actual angle.
            let cross = Math.abs(Math.asin(flo_vector2d_1.default.cross(v1, v2)));
            totalAngleError += cross;
        }
    }
    //if (FloMat._debug_ && FloMat._debug_.log) { console.log(totalAngleError); }
    //-----------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and 
    // the closest point to the 3-prong. It should be around 0. If not,
    // this is not a good candidate for the 3-prong.
    //-----------------------------------------------------------------
    let closestDs = [];
    for (let i = 0; i < bezierPiecess.length; i++) {
        let p = get_closest_boundary_point_to_point_1.default(bezierPiecess[i], x, undefined, undefined // TODO - bug: we must provide a t value and the
        // parameter order of the last 2 parameters of this function
        // should be swapped. Consider the consequences of leaving this
        // bug unchecked.
        );
        closestDs.push(flo_vector2d_1.default.distanceBetween(p.p, x));
    }
    let closestD = Math.min(...closestDs);
    let radiusDelta = Math.abs(radius - closestD);
    //if (FloMat._debug_ && FloMat._debug_.log) { console.log(radiusDelta); }
    //if (FloMat._debug_ && FloMat._debug_.log) { console.log('---------------------'); }
    //-----------------------------------------------------------------
    // TODO Weights still need to be determined
    let W1 = 1;
    let W2 = 1;
    let error = W1 * radiusDelta + W2 * totalAngleError;
    return { ps, circle, error };
}
let calcVectorToZeroV_StraightToIt = flo_vector2d_1.default.fromTo;
// This function is currently unused
/*
function calcVectorToZeroV_AlongMedial(
        circleCenter: number[],
        ps: number[][]) {

    let v1 = Vector.fromTo(ps[0], ps[2]);
    let v2 = [-v1[1], v1[0]]; // Rotate by 90 degrees
    let l1 = Vector.len(Vector.fromTo(x, circleCenter));
    let v3 = Vector.toUnitVector(v2);
    let v4 = Vector.scale(v3, l1);
    /*
    if (typeof FloMat !== 'undefined' && FloMat._debug_ && !FloMat._debug_.config.isTiming) {
        FloMat._debug_.fs.draw.line([x, Vector.translate(x,vectorToZeroV)], 'thin10 red');
        FloMat._debug_.fs.draw.line([x, Vector.translate(x,v4)], 'thin10 blue');
    }
    */ /*

return v4;
}
*/
/**
 * Find new x and ps that are a better estimate of the 3-prong
 * circle.
 *
 * The potential function, V, is defined as the distance to the
 * actual 3 prong circle center.
 */
function calcBetterX(bezierPiece3s, x, vectorToZeroV) {
    let V = flo_vector2d_1.default.len(vectorToZeroV);
    let nu = 1;
    let better;
    let newX;
    let newPs;
    let newV;
    let i = 0; // Safeguard
    do {
        let shift = flo_vector2d_1.default.scale(vectorToZeroV, nu);
        newX = flo_vector2d_1.default.translate(shift, x);
        newPs = getClosestPoints(newX, bezierPiece3s);
        // Point of zero V
        let newCircleCenter = flo_vector2d_1.default.circumCenter(newPs.map(x => x.p));
        let newVectorToZeroV = flo_vector2d_1.default.fromTo(newX, newCircleCenter);
        newV = flo_vector2d_1.default.len(newVectorToZeroV);
        better = newV < V;
        nu = nu / 2;
        i++;
    } while (!better && i < 3);
    return { newX, newV, newPs };
}
/**
 * Finds an initial 3-prong circle center point from which to iterate.
 * The point must be within the shape.
 *
 * @param delta3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 */
function calcInitial3ProngPoint(shape, delta3s, bezierPiece3s) {
    // TODO - No need to calculate, we already have this info somewhere.
    let twoProngCircleCenter = flo_vector2d_1.default.mean([
        delta3s[0][0].item.pointOnShape.p,
        delta3s[2][1].item.pointOnShape.p
    ]);
    let point1 = get_closest_boundary_point_to_point_1.default(bezierPiece3s[1], twoProngCircleCenter, undefined, // bezierNode
    undefined // t
    );
    let meanPoints = [
        delta3s[0][0].item.pointOnShape.p,
        //Vector.mean([delta3s[1][0].item, delta3s[1][1].item]),
        point1.p,
        delta3s[2][1].item.pointOnShape.p,
    ];
    let p;
    if (delta3s[0][0].item.pointOnShape.type ===
        mat_constants_1.default.pointType.sharp) {
        // delta3s start and end at sharp corner. If delta3s start at a sharp 
        // corner it will end there also so no need to check for end point as 
        // well.
        p = flo_vector2d_1.default.mean([
            meanPoints[0],
            meanPoints[1]
        ]);
    }
    else {
        p = flo_vector2d_1.default.circumCenter(meanPoints);
    }
    if (!Number.isFinite(p[0])) {
        if (typeof window !== 'undefined' && window._debug_) {
            // TODO - check why this actuall happens sometimes
            //console.log(FloMat._debug_.pointsToNiceStr(meanPoints));
            //console.log(FloMat._debug_.deltasToNiceStr(delta3s));
            //console.log(p, meanPoints);
        }
    }
    if (!Number.isFinite(p[0])) {
        let sames = whichNotSame(meanPoints);
        return flo_vector2d_1.default.mean([meanPoints[sames[0]], meanPoints[sames[1]]]);
    }
    return p;
}
function whichNotSame(ps) {
    if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
        return [0, 2];
    }
    else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
        return [0, 2];
    }
    else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
        return [1, 2];
    }
    ;
    return [];
}
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(function (bezierPieces) {
        let p = get_closest_boundary_point_to_point_1.default(bezierPieces, x, undefined, // bezierNode
        undefined // t
        );
        return p;
    });
}
exports.default = find3Prong;
