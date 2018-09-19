"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../../mat-constants");
const Vector = require("flo-vector2d");
const Bezier3 = require("flo-bezier3");
const get_closest_boundary_point_to_point_1 = require("../../functions/get-closest-boundary-point-to-point");
const circle_1 = require("../../classes/circle");
const point_on_shape_1 = require("../../classes/point-on-shape");
const two_prong_for_debugging_1 = require("../../../debug/classes/two-prong-for-debugging");
const get_boundary_beziers_1 = require("../../functions/find-mat/get-boundary-beziers");
const get_neighboring_points_1 = require("../../functions/find-mat/get-neighboring-points");
const add_1_prong_1 = require("../find-mat/add-1-prong");
const get_boundary_beziers_2 = require("../get-boundary-beziers");
const get_closest_square_distance_to_rect_1 = require("../geometry/get-closest-square-distance-to-rect");
const MAX_ITERATIONS = 50;
//TODO Change tolerances to take shape dimension into 
// account, e.g. shapeDim / 10000 for SEPERATION_TOLERANCE;
//CONST SEPERATION_TOLERANCE = 1e-3;
const SEPERATION_TOLERANCE = 1e-3;
const SQUARED_SEPERATION_TOLERANCE = SEPERATION_TOLERANCE * SEPERATION_TOLERANCE;
const _1PRONG_TOLERANCE = 1e-4;
const SQUARED_1PRONG_TOLERANCE = _1PRONG_TOLERANCE * _1PRONG_TOLERANCE;
//const ERROR_TOLERANCE = 1e-3;
const ERROR_TOLERANCE = SEPERATION_TOLERANCE / 10;
const SQUARED_ERROR_TOLERANCE = ERROR_TOLERANCE * ERROR_TOLERANCE;
/**
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and
 * the second one is found by the algorithm.
 *
 * A 2-prong is a MAT circle that touches the shape at exactly 2 points.
 *
 * Before any 2-prongs are added the entire shape is our δΩ (1-prongs do not
 * reduce the boundary).
 *
 * As per the paper by Choi, Choi, Moon and Wee:
 *   "The starting point of this algorithm is a choice of a circle
 *    Br(x) centered at an interior point x which contains two boundary
 *    portions c and d of d-Omega as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand.
 * @param shape
 * @param y - The first point of the 2-prong
 * @param holeClosing True if this is a hole-closing two-prong, false otherwise
 * @param k The loop identifying index for y
 */
function find2Prong(
    //shape: Shape, 
    loops, cpGraphs, y, holeClosing, k) {
    // The failed flag is set if a 2-prong cannot be found.
    let failed = false;
    // The first point on the shape of the 2-prong.
    let bezierNode = y.bezierNode;
    let t = y.t;
    let oCircle = point_on_shape_1.PointOnShape.getOsculatingCircle(y);
    let x = oCircle.center;
    /*
     * The shortest distance so far between the first contact point and
     * the circle center - we require this to get shorter on each
     * iteration as convergence occurs. If it does not, oscillation
     * of the algorithm has occured due to floating point inaccuracy
     * and the algorithm must terminate.
     */
    let radius = oCircle.radius;
    let shortestSquaredDistance = radius * radius;
    /* The boundary piece that should contain the other point of
     * the 2-prong circle. (Defined by start and end points).
     */
    let δ;
    let bezierPieces;
    if (holeClosing) {
        bezierPieces = [];
        for (let k2 = 0; k2 < k; k2++) {
            let pieces = get_boundary_beziers_1.getBoundaryBeziers(loops[k2]);
            bezierPieces.push(...pieces);
        }
    }
    else {
        //console.log(y.order, y.order2)
        let order = y.type === mat_constants_1.MAT_CONSTANTS.pointType.dull
            ? y.t === 1 ? -1 : +1
            : 0;
        let ps = get_neighboring_points_1.getNeighbouringPoints(cpGraphs[k], y, order, 0);
        δ = [ps[0], ps[0]];
        if (!ps[0]) {
            bezierPieces = get_boundary_beziers_1.getBoundaryBeziers(loops[k]);
        }
        else {
            bezierPieces = get_boundary_beziers_2.getBoundaryPieceBeziers(δ);
        }
    }
    let xs = []; // Trace the convergence.
    let z;
    let squaredError;
    let i = 0;
    do {
        i++;
        let r = Vector.squaredDistanceBetween(x, y.p);
        bezierPieces = cullBezierPieces(bezierPieces, x, r);
        z = get_closest_boundary_point_to_point_1.getClosestBoundaryPointToPoint(bezierPieces, x, bezierNode, t);
        if (typeof _debug_ !== 'undefined') {
            xs.push({ x, y, z, t });
        }
        let d = Vector.squaredDistanceBetween(x, z.p);
        if (i === 1 && d + (SQUARED_1PRONG_TOLERANCE) >= r) {
            // It is a 1-prong.
            add_1_prong_1.add1Prong(cpGraphs, y);
            return undefined;
        }
        let squaredChordDistance = Vector.squaredDistanceBetween(y.p, z.p);
        if (squaredChordDistance <= SQUARED_SEPERATION_TOLERANCE) {
            failed = true;
            break;
        }
        /*
         * Find the point on the line connecting y with x that is
         * equidistant from y and z. This will be our next x.
         */
        let nextX = findEquidistantPointOnLine(x, y.p, z.p);
        squaredError = Vector.squaredDistanceBetween(x, nextX);
        /*
         * Prevent oscillation of calculated x (due to floating point
         * inaccuracies). See comment above decleration of
         * shortestSquaredDistance.
         */
        let squaredDistance = Vector.squaredDistanceBetween(y.p, nextX);
        if (squaredDistance < shortestSquaredDistance) {
            shortestSquaredDistance = squaredDistance;
        }
        else {
            //failed = true;
            //break;
        }
        x = nextX;
    } while (squaredError > SQUARED_ERROR_TOLERANCE && i < MAX_ITERATIONS);
    if (typeof _debug_ !== 'undefined') {
        xs.push({ x, y, z, t });
    }
    if (i === MAX_ITERATIONS) {
        // This is simply a case of convergence being too slow. The
        // gecko, for example, takes a max of 21 iterations.
        //console.log('max')
        failed = true;
    }
    let circle = new circle_1.Circle(x, Vector.distanceBetween(x, z.p));
    if (typeof _debug_ !== 'undefined') {
        recordForDebugging(failed, y, circle, y.p, z.p, δ, xs, holeClosing);
    }
    if (failed) {
        //console.log('failed');
        return undefined;
    }
    return { circle, z };
}
exports.find2Prong = find2Prong;
function recordForDebugging(failed, pos, circle, y, z, δ, xs, holeClosing) {
    let twoProng = new two_prong_for_debugging_1.TwoProngForDebugging(pos, δ, y, z, circle.center, circle, xs, failed, holeClosing, false, false);
    /*
    let twoProngs = _debug_.generated.twoProngs;
    if (failed) {
        twoProngs.failed.push(twoProng);
    } else if (holeClosing) {
        twoProngs.holeClosing.push(twoProng);
    } else {
        twoProngs.standard.push(twoProng);
    }
    */
    _debug_.generated.elems.twoProngs.push({
        data: twoProng,
        $svg: undefined // to be set later when more info is available
    });
}
/**
 * Cull all bezierPieces not within given radius of a given point.
 *
 * @param bezierPieces
 * @param p
 * @param r
 */
function cullBezierPieces(bezierPieces, p, rSquared) {
    const CULL_THRESHOLD = 5;
    if (bezierPieces.length <= CULL_THRESHOLD) {
        return bezierPieces;
    }
    let newPieces = [];
    for (let bezierPiece of bezierPieces) {
        //let ps = bezierPiece.bezierNode.item.bezier3;
        let ps = bezierPiece.bezierNode.item;
        let rect = Bezier3.getBoundingBox(ps);
        let bd = get_closest_square_distance_to_rect_1.getClosestSquareDistanceToRect(rect, p);
        if (bd <= rSquared + 0.1 /* Make this in relation to shape extents! <- No! Do proper error analysis */) {
            newPieces.push(bezierPiece);
        }
    }
    return newPieces;
}
/**
 *
 * @param x
 * @param y
 * @param z
 * @returns The point on the line from y to x that is equidistant from
 *          y and z.
 *
 * Notes: It is important that this function is numerically stable,
 * but this has not been investigated properly yet.
 */
function findEquidistantPointOnLine(x, y, z) {
    // Some basic algebra (not shown) finds the required point.
    // Swap axis if x and y are more aligned to y-axis than to x-axis.
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
