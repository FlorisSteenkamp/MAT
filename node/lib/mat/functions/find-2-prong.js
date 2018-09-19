"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const mat_constants_1 = require("../../mat-constants");
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const circle_1 = require("../../geometry/classes/circle");
const geometry_1 = require("../../geometry/geometry");
const shape_1 = require("../../geometry/classes/shape");
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
const contact_point_1 = require("../../mat/classes/contact-point");
const mat_circle_1 = require("../../mat/classes/mat-circle");
const get_closest_boundary_point_to_point_1 = require("../../geometry/functions/get-closest-boundary-point-to-point");
const two_prong_for_debugging_1 = require("../classes/debug/two-prong-for-debugging");
/**
 * Adds a 2-prong to the MAT. The first point is given and the second one is
 * found by the algorithm.
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
 *
 * @param shape
 * @param y - The first point of the 2-prong.
 */
function find2Prong(shape, y, holeClosing) {
    /* The failed flag is set if a 2-prong cannot be found. This occurs
     * when the 2 points are too close together and the 2-prong
     * becomes, in the limit, a 1-prong. We do not want these 2-prongs
     * as they push the floating point precision limits when finding
     * their circle center causing too much inaccuracy. Of course, our
     * entire algorithm's precision is limited by floating point
     * doubles.
     */
    let failed = false;
    // The first point on the shape of the 2-prong.
    //let y = pos;
    let bezierNode = y.bezierNode;
    let t = y.t;
    let oCircle = point_on_shape_1.default.getOsculatingCircle(y);
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
    let k = y.bezierNode.loop.indx;
    if (holeClosing) {
        bezierPieces = [];
        for (let k2 = 0; k2 < k; k2++) {
            let pieces = shape_1.default.getBoundaryBeziers(shape, k2);
            bezierPieces.push(...pieces);
        }
    }
    else {
        // TODO - getNeighbouringPoints *can* be eliminated (as with 3-prongs)
        // by keeping track of boundary piece in which it is being searched 
        // - not sure if same can be done with hole-closing 2-prongs.
        let ps = shape_1.default.getNeighbouringPoints(shape, y);
        δ = [ps[0], ps[0]];
        if (!ps[0]) {
            bezierPieces = shape_1.default.getBoundaryBeziers(shape, k);
        }
        else {
            bezierPieces = shape_1.default.getBoundaryPieceBeziers(δ);
        }
    }
    let xs = []; // Trace the convergence.
    let z;
    let squaredError;
    let i = 0;
    do {
        i++;
        let r = flo_vector2d_1.default.squaredDistanceBetween(x, y.p);
        bezierPieces = cullBezierPieces(bezierPieces, x, r);
        z = get_closest_boundary_point_to_point_1.default(bezierPieces, x, bezierNode, t);
        if (typeof window !== 'undefined' && window._debug_) {
            xs.push({ x, y, z, t });
        }
        let d = flo_vector2d_1.default.squaredDistanceBetween(x, z.p);
        if (i === 1 && d + (SQUARED_1PRONG_TOLERANCE) >= r) {
            // It is a 1-prong.
            add1Prong(shape, y);
            return undefined;
        }
        let squaredChordDistance = flo_vector2d_1.default.squaredDistanceBetween(y.p, z.p);
        if (squaredChordDistance <= SQUARED_SEPERATION_TOLERANCE) {
            failed = true;
            break;
        }
        /*
         * Find the point on the line connecting y with x that is
         * equidistant from y and z. This will be our next x.
         */
        let nextX = findEquidistantPointOnLine(x, y.p, z.p);
        squaredError = flo_vector2d_1.default.squaredDistanceBetween(x, nextX);
        /*
         * Prevent oscillation of calculated x (due to floating point
         * inaccuracies). See comment above decleration of
         * shortestSquaredDistance.
         */
        let squaredDistance = flo_vector2d_1.default.squaredDistanceBetween(y.p, nextX);
        if (squaredDistance < shortestSquaredDistance) {
            shortestSquaredDistance = squaredDistance;
        }
        else {
            //failed = true;
            //break;
        }
        x = nextX;
    } while (squaredError > SQUARED_ERROR_TOLERANCE && i < MAX_ITERATIONS);
    if (typeof window !== 'undefined' && window._debug_) {
        xs.push({ x, y, z, t });
    }
    if (i === MAX_ITERATIONS) {
        // This is simply a case of convergence being too slow. The
        // gecko, for example, takes a max of 21 iterations.
        //console.log('max')
        failed = true;
    }
    let circle = new circle_1.default(x, flo_vector2d_1.default.distanceBetween(x, z.p));
    point_on_shape_1.default.setPointOrder(shape, circle, y);
    point_on_shape_1.default.setPointOrder(shape, circle, z);
    if (typeof window !== 'undefined' && window._debug_) {
        let _debug_ = window._debug_;
        recordForDebugging(failed, y, circle, y.p, z.p, δ, xs, holeClosing, _debug_);
    }
    if (failed) {
        //console.log('failed');
        return undefined;
    }
    return { circle, z };
}
function add1Prong(shape, pos) {
    if (pos.type === mat_constants_1.default.pointType.dull) {
        // This is a 1-prong at a dull corner.
        /* TODO IMPORTANT remove this line, uncomment piece below
         * it and implement the following strategy to find the
         * 3-prongs: if deltas are conjoined due to dull corner,
         * split the conjoinment by inserting successively closer
         * (binary division) 2-prongs. If a 2-prong actually fails,
         * simply remove the 1-prong at the dull corner.
         *
         * In this way **all** terminal points are found, e.g.
         * zoom in on top left leg of ant.
         */
        //console.log(posNode);
        //toRemove.push(posNode); /* this */
        if (typeof window !== 'undefined' && window._debug_) {
            let _debug_ = window._debug_;
            // TODO - why would it be NaN in some cases?
            let oCircle = point_on_shape_1.default.getOsculatingCircle(pos);
            if (!Number.isNaN(oCircle.center[0])) {
                _debug_.generated.oneProngsAtDullCorner.push({ pos });
            }
        }
        return;
    }
    let cp = new contact_point_1.default(pos, undefined);
    let delta = shape_1.default.getNeighbouringPoints(shape, pos);
    //let cmp1 = ContactPoint.compare(delta[0].item, cp);
    //let cmp2 = ContactPoint.compare(cp, delta[1].item);
    let cmp1 = delta[0] === undefined ? undefined : contact_point_1.default.compare(delta[0].item, cp);
    let cmp2 = delta[1] === undefined ? undefined : contact_point_1.default.compare(cp, delta[1].item);
    if (typeof window !== 'undefined' && window._debug_) {
        if (cmp1 > 0 || cmp2 > 0) {
            //console.log(`1-PRONG Order is wrong: ${cmp1}, ${cmp2}`);
        }
    }
    // If they are so close together, don't add it - there's already 1
    if (cmp1 === 0 || cmp2 === 0) {
        return;
    }
    let k = pos.bezierNode.loop.indx;
    let newCpNode = shape.contactPointsPerLoop[k].insert(cp, delta[0]);
    let matCircle = mat_circle_1.default.create(
    //pos.osculatingCircle,
    point_on_shape_1.default.getOsculatingCircle(pos), [newCpNode]);
    newCpNode.prevOnCircle = newCpNode; // Trivial loop
    newCpNode.nextOnCircle = newCpNode; // ...
    if (typeof window !== 'undefined' && window._debug_) {
        let _debug_ = window._debug_;
        _debug_.generated.oneProngs.push({ pos });
    }
    return;
}
function recordForDebugging(failed, pos, circle, y, z, δ, xs, holeClosing, _debug_) {
    let twoProngForDebugging = new two_prong_for_debugging_1.default(pos, δ, y, z, circle.center, circle, xs, failed, holeClosing);
    _debug_.generated.twoProngs.push(twoProngForDebugging);
}
/**
 * Cull all bezierPieces not within given radius of a given point.
 *
 * @param {BezierPieces[]} bezierPieces
 * @param {number[]} p
 * @param {number} r
 * @returns {BezierPieces[]}
 */
function cullBezierPieces(bezierPieces, p, rSquared) {
    const CULL_THRESHOLD = 5;
    if (bezierPieces.length <= CULL_THRESHOLD) {
        return bezierPieces;
    }
    let newPieces = [];
    for (let bezierPiece of bezierPieces) {
        let ps = bezierPiece.bezierNode.item.bezier3;
        let rect = flo_bezier3_1.default.getBoundingBox(ps);
        let bd = geometry_1.default.getClosestSquareDistanceToRect(rect, p);
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
exports.default = find2Prong;
