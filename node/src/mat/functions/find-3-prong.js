"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector = require("flo-vector2d");
const Bezier3 = require("flo-bezier3");
const circle_1 = require("../classes/circle");
const point_on_shape_1 = require("../classes/point-on-shape");
const shape_1 = require("../classes/shape");
const three_prong_for_debugging_1 = require("../../debug/classes/three-prong-for-debugging");
const get_closest_boundary_point_to_point_1 = require("../functions/get-closest-boundary-point-to-point");
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
function find3Prong(shape, δs) {
    //try {		
    let bezierPiecess = δs.map(function (δ) {
        return shape_1.Shape.getBoundaryPieceBeziers(δ);
    });
    let candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    let threeProng;
    let bestIndx = undefined;
    let smallestError = Number.POSITIVE_INFINITY;
    for (let i = 1; i < δs.length - 1; i++) {
        let { circle, ps, error } = find3ProngForDelta3s(shape, δs, i, bezierPiecess);
        if (typeof _debug_ !== 'undefined') {
            candidateThreeProngs.push({ circle, ps });
        }
        if (error < smallestError) {
            smallestError = error;
            bestIndx = i - 1;
            threeProng = { circle, ps, δ3s: undefined };
        }
    }
    //-------------------------------------
    //---- Add some additional properties
    //-------------------------------------
    let δ3s = [δs[0], δs[bestIndx + 1], δs[δs.length - 1]];
    threeProng.δ3s = δ3s;
    //-------------------------------------
    if (typeof _debug_ !== 'undefined') {
        let threeProngForDebugging = new three_prong_for_debugging_1.ThreeProngForDebugging(threeProng.circle, threeProng.ps, threeProng.δ3s, δs, bestIndx, candidateThreeProngs, undefined // To be set later
        );
        //_debug_.temp.threeProngForDebugging = threeProngForDebugging;
        _debug_.generated.elems.threeProngs.push({
            data: threeProngForDebugging,
            $svg: _debug_.fs.drawElem.draw3Prong(threeProngForDebugging, _debug_.config.toDraw.threeProngs &&
                _debug_.config.toDraw.threeProngs.all)
        });
    }
    return threeProng;
    /*
    } catch(e) {
        let msg = 'Unable to find 3-prong.';
        /*
        let detail = δs.map(
            δ => ContactPoint.toString(δ[0]) + ContactPoint.toString(δ[1]));
            */ /*
throw new Error(msg/* + '\n' + detail*/ /*);
}*/
}
exports.find3Prong = find3Prong;
/**
 * Finds a 3-prong using only the 3 given delta's.
 * @param i - Specific delta indx.
 */
function find3ProngForDelta3s(shape, deltas, indx, bezierPiecess) {
    // TODO - Choose a tolerance relative to shape size.
    const TOLERANCE = 1e-7;
    let delta3s = [
        deltas[0],
        deltas[indx],
        deltas[deltas.length - 1]
    ];
    let bezierPiece3s = [
        bezierPiecess[0],
        bezierPiecess[indx],
        bezierPiecess[deltas.length - 1]
    ];
    let ps;
    let circumCenter;
    let ii = 0; // Safeguard
    let x = calcInitial3ProngCenter(shape, delta3s, bezierPiece3s);
    let tolerance = Number.POSITIVE_INFINITY;
    // TODO 10 below is magic, fix or add somewhere as a constant
    while (tolerance > TOLERANCE && ii < 10) {
        ii++;
        ps = getClosestPoints(x, bezierPiece3s);
        if (!ps[0] || !ps[1] || !ps[2]) {
            console.log(x);
            console.log(ps);
            console.log(bezierPiece3s);
        }
        circumCenter = Vector.circumCenter(ps.map(x => x.p));
        let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter);
        let upds = calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        let V = Vector.len(vectorToZeroV);
        ps = upds.newPs;
        tolerance = Math.abs(V - upds.newV);
    }
    let radius = (Vector.distanceBetween(x, ps[0].p) +
        Vector.distanceBetween(x, ps[1].p) +
        Vector.distanceBetween(x, ps[2].p)) / 3;
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
        let vv = Vector.toUnitVector(Vector.fromTo(p.p, x));
        let v1 = Vector.rotate90Degrees(vv);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        let key = point_on_shape_1.PointOnShape.makeSimpleKey(p.p);
        let dullCorner = shape.dullCornerHash[key];
        if (dullCorner) {
            //if (FloMat._debug_ && FloMat._debug_.log) { console.log(dullCorner); }
            let tans = dullCorner.tans;
            let perps = tans.map(Vector.rotate90Degrees);
            if (typeof _debug_ !== 'undefined') {
                //if (_debug_.log) {
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
                //}
            }
            let angleError1Pre = Vector.cross(perps[0], vv);
            let angleError2Pre = Vector.cross(vv, perps[1]);
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
            //let ps = p.bezierNode.item.bezier3;
            let ps = p.bezierNode.item;
            let v2 = Vector.toUnitVector(Bezier3.tangent(ps)(p.t));
            // Cross is more numerically stable than Vector.dot at angles
            // a multiple of Math.PI **and** is close to the actual angle
            // value and can thus just be added to cone method of looking
            // at tolerance.
            // Should be close to zero and is close to the actual angle.
            let cross = Math.abs(Math.asin(Vector.cross(v1, v2)));
            totalAngleError += cross;
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
        closestDs.push(Vector.distanceBetween(p.p, x));
    }
    let closestD = Math.min(...closestDs);
    let radiusDelta = Math.abs(radius - closestD);
    // TODO Weights still need to be determined
    let W1 = 1;
    let W2 = 1;
    let error = W1 * radiusDelta + W2 * totalAngleError;
    return { ps, circle, error };
}
let calcVectorToZeroV_StraightToIt = Vector.fromTo;
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
 *
 * @param bezierPiece3s The three boundary pieces, each of which should contain
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 */
function calcBetterX(bezierPiece3s, x, vectorToZeroV) {
    let V = Vector.len(vectorToZeroV);
    let nu = 1;
    let better;
    let newX;
    let newPs;
    let newV;
    let i = 0; // Safeguard
    do {
        let shift = Vector.scale(vectorToZeroV, nu);
        newX = Vector.translate(shift, x);
        newPs = getClosestPoints(newX, bezierPiece3s);
        // Point of zero V
        let newCircleCenter = Vector.circumCenter(newPs.map(x => x.p));
        let newVectorToZeroV = Vector.fromTo(newX, newCircleCenter);
        newV = Vector.len(newVectorToZeroV);
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
function calcInitial3ProngCenter(shape, delta3s, bezierPiece3s) {
    // TODO - No need to calculate, we already have this info somewhere.
    let twoProngCircleCenter = Vector.mean([
        delta3s[0][0].item.pointOnShape.p,
        delta3s[2][1].item.pointOnShape.p
    ]);
    let point1 = get_closest_boundary_point_to_point_1.getClosestBoundaryPointToPoint(bezierPiece3s[1], twoProngCircleCenter, undefined, // bezierNode
    undefined // t
    );
    let meanPoints = [
        delta3s[0][0].item.pointOnShape.p,
        point1.p,
        delta3s[2][1].item.pointOnShape.p,
    ];
    /*
    let p;
    if (delta3s[0][0].item.pointOnShape.type ===
        MAT_CONSTANTS.pointType.sharp) {
        
        // delta3s start and end at sharp corner. If delta3s start at a sharp
        // corner it will end there also so no need to check for end point as
        // well.
        p = Vector.mean([
            meanPoints[0],
            meanPoints[1]
        ]);
    } else {
        p = Vector.circumCenter(meanPoints);
    }
    */
    let p = Vector.circumCenter(meanPoints);
    /*
    if (!Number.isFinite(p[0])) {
        if (typeof _debug_ !== 'undefined') {
            // TODO - check why this actuall happens sometimes
            //console.log(FloMat._debug_.pointsToNiceStr(meanPoints));
            //console.log(FloMat._debug_.deltasToNiceStr(delta3s));
            //console.log(p, meanPoints);
        }
    }
    if (!Number.isFinite(p[0])) {
        let sames = whichNotSame(meanPoints);
        return Vector.mean([meanPoints[sames[0]], meanPoints[sames[1]]]);
    }
    */
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
        let p = get_closest_boundary_point_to_point_1.getClosestBoundaryPointToPoint(bezierPieces, x, undefined, // bezierNode
        undefined // t
        );
        return p;
    });
}
