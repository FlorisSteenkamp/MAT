"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const flo_poly_1 = require("flo-poly");
const geometry_1 = require("../geometry");
const flo_vector2d_1 = require("flo-vector2d");
const flo_bezier3_1 = require("flo-bezier3");
const Point_on_shape_1 = require("../classes/Point-on-shape");
/**
 * Gets the closest boundary point to the given point, limited to the
 * given bezier pieces.
 *
 * @param bezierPieces
 * @param point
 * @param touchedBezierNode
 * @returns {PointOnShape} The closest point.
 */
function getClosestBoundaryPointToPoint(bezierPieces_, point, touchedBezierNode, t) {
    let bezierPieces = cullBezierPieces(bezierPieces_, point);
    let bestDistance = Number.POSITIVE_INFINITY;
    let pos;
    for (let bezierPiece of bezierPieces) {
        //let bezier = bezierPiece.bezierNode.item;
        let p = closestPointOnBezier(bezierPiece.bezierNode, point, bezierPiece.tRange, touchedBezierNode, t);
        let d = p === undefined
            ? Number.POSITIVE_INFINITY
            : flo_vector2d_1.default.distanceBetween(p.p, point);
        if (d < bestDistance) {
            pos = new Point_on_shape_1.default(bezierPiece.bezierNode, p.t, mat_constants_1.default.pointType.standard, 0, 0);
            bestDistance = d;
        }
    }
    return pos;
}
function cullBezierPieces(bezierPieces, p) {
    const CULL_THRESHOLD = 5; // TODO Put somewhere better.
    let shortCircuit = bezierPieces.length > CULL_THRESHOLD;
    if (shortCircuit) {
        // First get an initial point such that the closest point can not be 
        // further than this point.
        let bestSquaredDistance = getClosePoint(bezierPieces, p);
        bezierPieces = cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance);
        bezierPieces = cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance);
    }
    return bezierPieces;
}
/**
 * Finds an initial point such that the closest point can not be further than
 * this point.
 */
function getClosePoint(bezierPieces, p) {
    let bestSquaredDistance = Number.POSITIVE_INFINITY;
    for (let bezierPiece of bezierPieces) {
        let ps = bezierPiece.bezierNode.item.bezier3;
        let evPs = flo_bezier3_1.default.evaluate(ps);
        let p1 = evPs(bezierPiece.tRange[0]);
        let p2 = evPs(bezierPiece.tRange[1]);
        let d1 = flo_vector2d_1.default.squaredDistanceBetween(p, p1);
        let d2 = flo_vector2d_1.default.squaredDistanceBetween(p, p2);
        let d = Math.min(d1, d2);
        if (d < bestSquaredDistance) {
            bestSquaredDistance = d;
        }
    }
    // The extra bit is to account for floating point precision 
    // TODO change 0.01 below to more meaningfull value dependent on 
    // shape dimensions.
    return bestSquaredDistance + 0.01;
}
/**
 * When checking distances, ignore all those with closest
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance) {
    let candidateBezierPieces = [];
    for (let bezierPiece of bezierPieces) {
        let ps = bezierPiece.bezierNode.item.bezier3;
        let boundingBox = flo_bezier3_1.default.getBoundingBox(ps);
        let d = geometry_1.default.getClosestSquareDistanceToRect(boundingBox, p);
        if (d <= bestSquaredDistance) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
/**
 * When checking distances, ignore all those with closest
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance) {
    let candidateBezierPieces = [];
    for (let bezierPiece of bezierPieces) {
        let ps = bezierPiece.bezierNode.item.bezier3;
        let tightBoundingBox = flo_bezier3_1.default.getBoundingBoxTight(ps);
        let d = geometry_1.default.closestSquaredDistanceToRotatedRect(tightBoundingBox, p);
        if (d <= bestSquaredDistance) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
/**
 * @private
 * @param bezierNode - The bezier
 * @param p - The point from which to check
 * @param tRange - The allowed t range
 * @param touchedBezierNode - The bezier on which p is located
 * @param t - The t value of the bezier that locates p
 */
function closestPointOnBezier(bezierNode, p, tRange, touchedBezierNode, t) {
    let ps = bezierNode.item.bezier3;
    // TODO The site at http://jazzros.blogspot.ca/2011/03/projecting-point-on-bezier-curve.html
    // may hint at requiring much fewer assignments?
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    let [xp, yp] = p;
    let xx0 = x0 - xp;
    let xx1 = x1 - xp;
    let xx2 = x2 - xp;
    let xx3 = x3 - xp;
    let yy0 = y0 - yp;
    let yy1 = y1 - yp;
    let yy2 = y2 - yp;
    let yy3 = y3 - yp;
    let x00 = xx0 * xx0;
    let x01 = 6 * xx0 * xx1;
    let x02 = 6 * xx0 * xx2;
    let x03 = 2 * xx0 * xx3;
    let x11 = 9 * xx1 * xx1;
    let x12 = 18 * xx1 * xx2;
    let x13 = 6 * xx1 * xx3;
    let x22 = 9 * xx2 * xx2;
    let x23 = 6 * xx2 * xx3;
    let x33 = xx3 * xx3;
    let y00 = yy0 * yy0;
    let y01 = 6 * yy0 * yy1;
    let y02 = 6 * yy0 * yy2;
    let y03 = 2 * yy0 * yy3;
    let y11 = 9 * yy1 * yy1;
    let y12 = 18 * yy1 * yy2;
    let y13 = 6 * yy1 * yy3;
    let y22 = 9 * yy2 * yy2;
    let y23 = 6 * yy2 * yy3;
    let y33 = yy3 * yy3;
    let t5 = 6 * ((x33 - x23 + x13 - x03 + x22 - x12 + x02 + x11 - x01 + x00) +
        (y33 - y23 + y13 - y03 + y22 - y12 + y02 + y11 - y01 + y00));
    let t4 = 5 * ((x23 - 2 * x13 + 3 * x03 - 2 * x22 + 3 * x12 - 4 * x02 - 4 * x11 + 5 * x01 - 6 * x00) +
        (y23 - 2 * y13 + 3 * y03 - 2 * y22 + 3 * y12 - 4 * y02 - 4 * y11 + 5 * y01 - 6 * y00));
    let t3 = 4 * ((x13 - 3 * x03 + x22 - 3 * x12 + 6 * x02 + 6 * x11 - 10 * x01 + 15 * x00) +
        (y13 - 3 * y03 + y22 - 3 * y12 + 6 * y02 + 6 * y11 - 10 * y01 + 15 * y00));
    let t2 = 3 * ((x03 + x12 - 4 * x02 - 4 * x11 + 10 * x01 - 20 * x00) +
        (y03 + y12 - 4 * y02 - 4 * y11 + 10 * y01 - 20 * y00));
    let t1 = 2 * ((x02 + x11 - 5 * x01 + 15 * x00) +
        (y02 + y11 - 5 * y01 + 15 * y00));
    let t0 = ((x01 - 6 * x00) +
        (y01 - 6 * y00));
    let poly = [t5, t4, t3, t2, t1, t0];
    if (bezierNode === touchedBezierNode) {
        let deflatedPoly = flo_poly_1.default.deflate(poly, t);
        poly = deflatedPoly;
    }
    let roots = flo_poly_1.default.allRoots(poly, tRange[0], tRange[1]);
    let push0 = true;
    let push1 = true;
    if ((t === 1 && bezierNode === touchedBezierNode.next) ||
        (bezierNode === touchedBezierNode && t === 0)) {
        push0 = false;
    }
    if ((t === 0 && bezierNode === touchedBezierNode.prev) ||
        (bezierNode === touchedBezierNode && t === 1)) {
        push1 = false;
    }
    if (tRange[0] === 0) {
        if (push0) {
            roots.push(tRange[0]);
        }
    }
    else if (tRange[0] === 1) {
        if (push1) {
            roots.push(tRange[0]);
        }
    }
    else {
        roots.push(tRange[0]);
    }
    if (tRange[1] === 0) {
        if (push0) {
            roots.push(tRange[1]);
        }
    }
    else if (tRange[1] === 1) {
        if (push1) {
            roots.push(tRange[1]);
        }
    }
    else {
        roots.push(tRange[1]);
    }
    /*
    let closestPs = roots.map(function(root) {
        return Bezier3.evaluate(ps)(root);
    });
    let closestPoint = Vector.getClosestTo(p, closestPs);
    */
    let closestPs = roots.map(function (root) {
        return { p: flo_bezier3_1.default.evaluate(ps)(root), t: root };
    });
    let closestPoint = getClosest(p, closestPs, function (p1, p2) {
        return flo_vector2d_1.default.squaredDistanceBetween(p1, p2.p);
    });
    return closestPoint;
}
function getClosest(p, ps, f) {
    let cp = undefined; // Closest Point
    let bestd = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        let p_ = ps[i];
        let d = f(p, p_);
        if (d < bestd) {
            cp = p_;
            bestd = d;
        }
    }
    return cp;
}
exports.default = getClosestBoundaryPointToPoint;
