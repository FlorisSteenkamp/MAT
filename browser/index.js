(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FloMat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_("./index").default;

},{"./index":2}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat_1 = _dereq_("./src/mat");
exports.Mat = mat_1.Mat;
var loop_1 = _dereq_("./src/loop");
exports.Loop = loop_1.Loop;
var curve_1 = _dereq_("./src/curve");
exports.Curve = curve_1.Curve;
var cp_node_1 = _dereq_("./src/cp-node");
exports.CpNode = cp_node_1.CpNode;
var point_on_shape_1 = _dereq_("./src/point-on-shape");
exports.PointOnShape = point_on_shape_1.PointOnShape;
var circle_1 = _dereq_("./src/circle");
exports.Circle = circle_1.Circle;
var contact_point_1 = _dereq_("./src/contact-point");
exports.ContactPoint = contact_point_1.ContactPoint;
var bezier_piece_1 = _dereq_("./src/bezier-piece");
exports.BezierPiece = bezier_piece_1.BezierPiece;
var x_1 = _dereq_("./src/x");
exports.X = x_1.X;
var smoothen_1 = _dereq_("./src/mat/smoothen/smoothen");
exports.smoothen = smoothen_1.smoothen;
var find_mats_1 = _dereq_("./src/mat/find-mat/find-mats");
exports.findMats = find_mats_1.findMats;
var trim_mat_1 = _dereq_("./src/mat/trim-mat");
exports.trimMat = trim_mat_1.trimMat;
var to_scale_axis_1 = _dereq_("./src/mat/to-scale-axis/to-scale-axis");
exports.toScaleAxis = to_scale_axis_1.toScaleAxis;
var traverse_edges_1 = _dereq_("./src/mat/traverse-edges");
exports.traverseEdges = traverse_edges_1.traverseEdges;
var traverse_vertices_1 = _dereq_("./src/mat/traverse-vertices");
exports.traverseVertices = traverse_vertices_1.traverseVertices;
var debug_1 = _dereq_("./src/debug/debug");
exports.MatDebug = debug_1.MatDebug;
var svg_1 = _dereq_("./src/svg/svg");
exports.getPathsFromStr = svg_1.getPathsFromStr;
var cp_node_for_debugging_1 = _dereq_("./src/debug/cp-node-for-debugging");
exports.CpNodeForDebugging = cp_node_for_debugging_1.CpNodeForDebugging;
var get_closest_boundary_point_1 = _dereq_("./src/mat/get-closest-boundary-point");
exports.getClosestBoundaryPoint = get_closest_boundary_point_1.getClosestBoundaryPoint;
exports.closestPointOnBezier = get_closest_boundary_point_1.closestPointOnBezier;
var Svg = _dereq_("./src/svg/svg");
exports.Svg = Svg;

},{"./src/bezier-piece":51,"./src/circle":53,"./src/contact-point":54,"./src/cp-node":55,"./src/curve":56,"./src/debug/cp-node-for-debugging":57,"./src/debug/debug":58,"./src/loop":84,"./src/mat":85,"./src/mat/find-mat/find-mats":108,"./src/mat/get-closest-boundary-point":117,"./src/mat/smoothen/smoothen":125,"./src/mat/to-scale-axis/to-scale-axis":129,"./src/mat/traverse-edges":130,"./src/mat/traverse-vertices":131,"./src/mat/trim-mat":132,"./src/point-on-shape":133,"./src/svg/svg":171,"./src/x":172}],3:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var Vector = _dereq_("flo-vector2d");
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_gauss_quadrature_1 = _dereq_("flo-gauss-quadrature");
var flo_graham_scan_1 = _dereq_("flo-graham-scan");
var get_x_1 = _dereq_("./src/get-x");
exports.getX = get_x_1.getX;
var get_y_1 = _dereq_("./src/get-y");
exports.getY = get_y_1.getY;
var get_dx_1 = _dereq_("./src/get-dx");
exports.getDx = get_dx_1.getDx;
var get_dy_1 = _dereq_("./src/get-dy");
exports.getDy = get_dy_1.getDy;
var evaluate_x_1 = _dereq_("./src/evaluate-x");
exports.evaluateX = evaluate_x_1.evaluateX;
var evaluate_y_1 = _dereq_("./src/evaluate-y");
exports.evaluateY = evaluate_y_1.evaluateY;
var evaluate_1 = _dereq_("./src/evaluate");
exports.evaluate = evaluate_1.evaluate;
var evaluate_dx_1 = _dereq_("./src/evaluate-dx");
exports.evaluateDx = evaluate_dx_1.evaluateDx;
var evaluate_dy_1 = _dereq_("./src/evaluate-dy");
exports.evaluateDy = evaluate_dy_1.evaluateDy;
var tangent_1 = _dereq_("./src/tangent");
exports.tangent = tangent_1.tangent;
var normal_1 = _dereq_("./src/normal");
exports.normal = normal_1.normal;
var from_0_to_T_1 = _dereq_("./src/from-0-to-T");
exports.from0ToT = from_0_to_T_1.from0ToT;
var from_T_to_1_1 = _dereq_("./src/from-T-to-1");
exports.fromTTo1 = from_T_to_1_1.fromTTo1;
var from_to_1 = _dereq_("./src/from-to");
exports.fromTo = from_to_1.fromTo;
var to_hybrid_quadratic_1 = _dereq_("./src/to-hybrid-quadratic");
exports.toHybridQuadratic = to_hybrid_quadratic_1.toHybridQuadratic;
var coincident_1 = _dereq_("./src/coincident");
exports.coincident = coincident_1.coincident;
var line_intersection_1 = _dereq_("./src/line-intersection");
exports.lineIntersection = line_intersection_1.lineIntersection;
var bezier3_intersection_1 = _dereq_("./src/bezier3-intersection/bezier3-intersection");
exports.bezier3Intersection = bezier3_intersection_1.bezier3Intersection;
var bezier3_intersection_sylvester_1 = _dereq_("./src/bezier3-intersection-sylvester/bezier3-intersection-sylvester");
exports.bezier3IntersectionSylvester = bezier3_intersection_sylvester_1.bezier3IntersectionSylvester;
var ts_at_x_1 = _dereq_("./src/ts-at-x");
exports.tsAtX = ts_at_x_1.tsAtX;
var ts_at_y_1 = _dereq_("./src/ts-at-y");
exports.tsAtY = ts_at_y_1.tsAtY;
var debug_1 = _dereq_("./src/debug/debug");
exports.BezDebug = debug_1.BezDebug;
var fat_line_1 = _dereq_("./src/debug/fat-line");
exports.FatLine = fat_line_1.FatLine;
var de_casteljau_1 = _dereq_("./src/de-casteljau");
exports.deCasteljau = de_casteljau_1.deCasteljau;
var eval_de_casteljau_1 = _dereq_("./src/eval-de-casteljau");
exports.evalDeCasteljau = eval_de_casteljau_1.evalDeCasteljau;
// Possibly typescript bug? Below line does not work
//const { rotatePs: rotate, translatePs: translate } = Vector;
var rotate = Vector.rotatePs;
exports.rotate = rotate;
var translate = Vector.translatePs;
exports.translate = translate;
var memoize = flo_memoize_1.default.m1;
/**
 * Returns the second derivative of the power basis representation of the
 * bezier's x-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The twice differentiated power basis polynomial from
 * highest power to lowest, e.g. at + b is returned as [a,b]
 */
var getDdx = memoize(function (ps) {
    return flo_poly_1.default.differentiate(get_dx_1.getDx(ps));
});
exports.getDdx = getDdx;
/**
 * Returns the second derivative of the power basis representation of the
 * bezier's y-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The twice differentiated power basis polynomial from
 * highest power to lowest, e.g. at + b is returned as [a,b]
 */
var getDdy = memoize(function (ps) {
    return flo_poly_1.default.differentiate(get_dy_1.getDy(ps));
});
exports.getDdy = getDdy;
/**
 * Returns the third derivative of the power basis representation of the
 * bezier's x-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The thrice differentiated power basis polynomial (a
 * constant in array from), e.g. a is returned as [a]
 */
var getDddx = memoize(function (ps) {
    return flo_poly_1.default.differentiate(getDdx(ps));
});
exports.getDddx = getDddx;
/**
 * Returns the third derivative of the power basis representation of the
 * bezier's y-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The thrice differentiated power basis polynomial (a
 * constant in array from), e.g. a is returned as [a]
 */
var getDddy = memoize(function (ps) {
    return flo_poly_1.default.differentiate(getDdy(ps));
});
exports.getDddy = getDddy;
/**
 * Returns the convex hull of a bezier's control points. This hull bounds the
 * bezier curve. This function is memoized.
 *
 * The tolerance at which the cross product of two nearly collinear lines of the
 * hull are considered collinear is 1e-12.
 * @param ps - A bezier curve, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns An ordered array of convex hull points.
 */
var getBoundingHull = memoize(flo_graham_scan_1.default);
exports.getBoundingHull = getBoundingHull;
/**
 * Returns a cubic bezier from the given line with evenly spaced control points.
 * @param l - a 2d line represented by two points
 * @returns Control points of the cubic bezier.
 */
function fromLine(l) {
    var _l = _slicedToArray(l, 2),
        _l$ = _slicedToArray(_l[0], 2),
        x0 = _l$[0],
        y0 = _l$[1],
        _l$2 = _slicedToArray(_l[1], 2),
        x1 = _l$2[0],
        y1 = _l$2[1];

    var xInterval = (x1 - x0) / 3;
    var yInterval = (y1 - y0) / 3;
    return [[x0, y0], [x0 + xInterval, y0 + yInterval], [x0 + xInterval * 2, y0 + yInterval * 2], [x1, y1]];
}
exports.fromLine = fromLine;
/**
 * Returns the given bezier's inflection points.
 **/
function findInflectionPoints(ps) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        x1 = _ps$2[0],
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        x2 = _ps$3[0],
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        x3 = _ps$4[0],
        y3 = _ps$4[1];
    // From http://www.caffeineowl.com/graphics/2d/vectorial/cubic-inflexion.html eq. 4


    var ax = x1 - x0;
    var ay = y1 - y0;
    var bx = x2 - x1 - ax;
    var by = y2 - y1 - ay;
    var cx = x3 - x2 - ax - 2 * bx;
    var cy = y3 - y2 - ay - 2 * by;
    // From http://www.caffeineowl.com/graphics/2d/vectorial/cubic-inflexion.html eq. 6:
    //   infl(t) := ax*by - ay*bx + t*(ax*cy - ay*cx) + t^2*(bx*cy - by*cx);
    // We find the roots of the quadratic - a,b,c are the quadratic coefficients
    var a = bx * cy - by * cx;
    var b = ax * cy - ay * cx;
    var c = ax * by - ay * bx;
    var inflectionTs = flo_poly_1.default.allRoots([a, b, c], 0, 1);
    var evPs = evaluate_1.evaluate(ps);
    return inflectionTs.map(evPs);
}
function κ(ps, t) {
    var evDx = evaluate_dx_1.evaluateDx(ps);
    var evDy = evaluate_dy_1.evaluateDy(ps);
    var evDdx = evaluateDdx(ps);
    var evDdy = evaluateDdy(ps);
    function f(t) {
        var dx = evDx(t);
        var dy = evDy(t);
        var ddx = evDdx(t);
        var ddy = evDdy(t);
        var a = dx * ddy - dy * ddx;
        var b = Math.sqrt(Math.pow(dx * dx + dy * dy, 3));
        return a / b;
    }
    // Curry
    return t === undefined ? f : f(t);
}
exports.κ = κ;
/**
 * Alias of κ.
 */
var curvature = κ;
exports.curvature = curvature;
function κds(ps, t) {
    var evDx = evaluate_dx_1.evaluateDx(ps);
    var evDy = evaluate_dy_1.evaluateDy(ps);
    var evDdx = evaluateDdx(ps);
    var evDdy = evaluateDdy(ps);
    function f(t) {
        var dx = evDx(t);
        var dy = evDy(t);
        var ddx = evDdx(t);
        var ddy = evDdy(t);
        var a = dx * ddy - dy * ddx;
        var b = dx * dx + dy * dy;
        return a / b;
    }
    // Curry
    return t === undefined ? f : f(t);
}
function dκMod(ps, t) {
    var _ps2 = _slicedToArray(ps, 4),
        _ps2$ = _slicedToArray(_ps2[0], 2),
        x0 = _ps2$[0],
        y0 = _ps2$[1],
        _ps2$2 = _slicedToArray(_ps2[1], 2),
        x1 = _ps2$2[0],
        y1 = _ps2$2[1],
        _ps2$3 = _slicedToArray(_ps2[2], 2),
        x2 = _ps2$3[0],
        y2 = _ps2$3[1],
        _ps2$4 = _slicedToArray(_ps2[3], 2),
        x3 = _ps2$4[0],
        y3 = _ps2$4[1];

    function f(t) {
        var ts = t * t;
        var omt = 1 - t;
        var a = ts * x3;
        var b = ts * y3;
        var c = 2 * t - 3 * ts;
        var d = (3 * t - 1) * omt;
        var e = omt * omt;
        var f = 3 * (a + c * x2 - d * x1 - e * x0);
        var g = 3 * (b + c * y2 - d * y1 - e * y0);
        var h = 6 * (t * y3 - (3 * t - 1) * y2 + (3 * t - 2) * y1 + omt * y0);
        var i = 6 * (t * x3 - (3 * t - 1) * x2 + (3 * t - 2) * x1 + omt * x0);
        var j = Math.sqrt(f * f + g * g);
        return 4 * (f * (y3 - 3 * y2 + 3 * y1 - y0) - g * (x3 - 3 * x2 + 3 * x1 - x0)) * Math.pow(j, 3) - (f * h - i * g) * (2 * h * g + 2 * i * f) * j;
    }
    return t === undefined ? f : f(t);
}
exports.dκMod = dκMod;
/**
 * Categorizes the given cubic bezier curve according to whether it has a loop,
 * a cusp, or zero, one or two inflection points all of which are mutually
 * exclusive.
 *
 * See <a href="http://graphics.pixar.com/people/derose/publications/CubicClassification/paper.pdf">
 * this</a> paper.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns A value of 'L', 'C', '0', '1', or '2' depending on whether
 * the curve has a loop, a cusp, or zero, one or two inflection points.
 */
function categorize(ps) {
    // TODO - finish
}
function totalCurvature(ps, interval) {
    var tanPs = tangent_1.tangent(ps);
    function f(interval) {
        return flo_gauss_quadrature_1.default(κds(ps), interval);
        // TODO
        /*
        let [a,b] = interval;
        let tangentA = tanPs(a);
        let tangentB = tanPs(b);
        let sinθ = Vector.cross(tanA, tanB)
        */
    }
    // Curry
    return interval === undefined ? f : f(interval);
}
exports.totalCurvature = totalCurvature;
function totalAbsoluteCurvature(ps, interval) {
    function f() {
        var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 1];

        // Numerically integrate the absolute curvature
        var result = flo_gauss_quadrature_1.default(function (t) {
            return Math.abs(κds(ps)(t));
        }, interval);
        return result;
    }
    // Curry
    return interval === undefined ? f : f(interval);
}
exports.totalAbsoluteCurvature = totalAbsoluteCurvature;
function len(interval, ps) {
    function f(ps) {
        if (interval[0] === interval[1]) {
            return 0;
        }

        var _ps3 = _slicedToArray(ps, 4),
            _ps3$ = _slicedToArray(_ps3[0], 2),
            x0 = _ps3$[0],
            y0 = _ps3$[1],
            _ps3$2 = _slicedToArray(_ps3[1], 2),
            x1 = _ps3$2[0],
            y1 = _ps3$2[1],
            _ps3$3 = _slicedToArray(_ps3[2], 2),
            x2 = _ps3$3[0],
            y2 = _ps3$3[1],
            _ps3$4 = _slicedToArray(_ps3[3], 2),
            x3 = _ps3$4[0],
            y3 = _ps3$4[1];
        // Keep line below to ensure zero length curve returns zero!


        if (x0 === x1 && x1 === x2 && x2 === x3 && y0 === y1 && y1 === y2 && y2 === y3) {
            return 0;
        }
        var evDs = ds(ps);
        return flo_gauss_quadrature_1.default(evDs, interval);
    }
    // Curry
    return ps === undefined ? f : f(ps);
}
exports.len = len;
function getTAtLength(ps, s) {
    var lenAtT = function lenAtT(t) {
        return len([0, t], ps);
    };
    function f(s) {
        return flo_poly_1.default.brent(function (t) {
            return lenAtT(t) - s;
        }, 0, 1);
    }
    // Curry
    return s === undefined ? f : f(s);
}
exports.getTAtLength = getTAtLength;
function ds(ps, t) {
    var evDx = evaluate_dx_1.evaluateDx(ps);
    var evDy = evaluate_dy_1.evaluateDy(ps);
    function f(t) {
        var dx = evDx(t);
        var dy = evDy(t);
        return Math.sqrt(dx * dx + dy * dy);
    }
    // Curry
    return t === undefined ? f : f(t);
}
function evaluateDdx(ps, t) {
    var ddPs = getDdx(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(ddPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDdx = evaluateDdx;
function evaluateDdy(ps, t) {
    var ddPs = getDdy(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(ddPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDdy = evaluateDdy;
function evaluateDddx(ps, t) {
    var dddPs = getDddx(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dddPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDddx = evaluateDddx;
function evaluateDddy(ps, t) {
    var dddPs = getDddy(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dddPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDddy = evaluateDddy;
// TODO - refactor getBounds, getBoundingBox, etc.
/**
 * Helper function. Returns the bounding box of the normalized (i.e. first point
 * moved to origin and rotated so that last point lies on x-axis) given cubic
 * bezier.
 * @ignore
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param sinθ - Sine of angle made by line from first bezier point to
 * last with x-axis.
 * @param cosθ - Cosine of angle made by line from first bezier point
 * to last with x-axis.
 * @returns Bounding box in the form [[minX, minY], [maxX,maxY]
 */
function getNormalizedBoundingBox(ps, sinθ, cosθ) {
    var vectorToOrigin = Vector.transform(ps[0], function (x) {
        return -x;
    });
    var boundingPs = Vector.translateThenRotatePs(vectorToOrigin, -sinθ, cosθ, ps);
    return getBoundingBox(boundingPs);
}
/**
 * Returns the tight bounding box of the given cubic bezier.
 * @returns The tight bounding box of the bezier as four ordered
 * points of a rotated rectangle.
 * TODO - test case of baseLength === 0
 */
var getBoundingBoxTight = memoize(function (ps) {
    var _ps4 = _slicedToArray(ps, 4),
        _ps4$ = _slicedToArray(_ps4[0], 2),
        x0 = _ps4$[0],
        y0 = _ps4$[1],
        _ps4$2 = _slicedToArray(_ps4[1], 2),
        x1 = _ps4$2[0],
        y1 = _ps4$2[1],
        _ps4$3 = _slicedToArray(_ps4[2], 2),
        x2 = _ps4$3[0],
        y2 = _ps4$3[1],
        _ps4$4 = _slicedToArray(_ps4[3], 2),
        x3 = _ps4$4[0],
        y3 = _ps4$4[1];

    var baseLength = Math.sqrt((x3 - x0) * (x3 - x0) + (y3 - y0) * (y3 - y0));
    var sinθ = (y3 - y0) / baseLength;
    var cosθ = (x3 - x0) / baseLength;
    var box = getNormalizedBoundingBox(ps, sinθ, cosθ);

    var _box = _slicedToArray(box, 2),
        _box$ = _slicedToArray(_box[0], 2),
        p0x = _box$[0],
        p0y = _box$[1],
        _box$2 = _slicedToArray(_box[1], 2),
        p1x = _box$2[0],
        p1y = _box$2[1];

    var axisAlignedBox = [box[0], [p1x, p0y], box[1], [p0x, p1y]];
    return Vector.rotateThenTranslatePs(sinθ, cosθ, ps[0], axisAlignedBox);
});
exports.getBoundingBoxTight = getBoundingBoxTight;
/**
 * Returns the axis-aligned bounding box of a given bezier.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns the axis-aligned bounding box in the form
 * [[minx, miny], [maxx,maxy]
 */
var getBoundingBox = memoize(function (ps) {
    return getBounds(ps).box;
});
exports.getBoundingBox = getBoundingBox;
/**
 * Calculates and returns general bezier bounds.
 * @returns The axis-aligned bounding box together with the t values
 * where the bounds on the bezier are reached.
 */
var getBounds = memoize(function (ps) {
    // Roots of derivative
    var roots = [get_dx_1.getDx(ps), get_dy_1.getDy(ps)].map(function (poly) {
        return flo_poly_1.default.allRoots(poly, 0, 1);
    });
    // Endpoints
    roots[0].push(0, 1);
    roots[1].push(0, 1);
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    var minY = Number.POSITIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    var tMinX = undefined;
    var tMinY = undefined;
    var tMaxX = undefined;
    var tMaxY = undefined;
    // Test points
    for (var i = 0; i < roots[0].length; i++) {
        var t = roots[0][i];
        var x = evaluate_x_1.evaluateX(ps, t);
        if (x < minX) {
            minX = x;
            tMinX = t;
        }
        if (x > maxX) {
            maxX = x;
            tMaxX = t;
        }
    }
    for (var _i = 0; _i < roots[1].length; _i++) {
        var _t = roots[1][_i];
        var y = evaluate_y_1.evaluateY(ps, _t);
        if (y < minY) {
            minY = y;
            tMinY = _t;
        }
        if (y > maxY) {
            maxY = y;
            tMaxY = _t;
        }
    }
    var ts = [[tMinX, tMinY], [tMaxX, tMaxY]];
    var box = [[minX, minY], [maxX, maxY]];
    return { ts: ts, box: box };
});
exports.getBounds = getBounds;
/**
 * Returns 2 new beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1]. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the curve should be split
 */
function splitAt(ps, t) {
    var _ps5 = _slicedToArray(ps, 4),
        _ps5$ = _slicedToArray(_ps5[0], 2),
        x0 = _ps5$[0],
        y0 = _ps5$[1],
        _ps5$2 = _slicedToArray(_ps5[1], 2),
        x1 = _ps5$2[0],
        y1 = _ps5$2[1],
        _ps5$3 = _slicedToArray(_ps5[2], 2),
        x2 = _ps5$3[0],
        y2 = _ps5$3[1],
        _ps5$4 = _slicedToArray(_ps5[3], 2),
        x3 = _ps5$4[0],
        y3 = _ps5$4[1];

    var s = 1 - t;
    var t2 = t * t;
    var t3 = t2 * t;
    var s2 = s * s;
    var s3 = s2 * s;
    var ps1 = [[x0, y0], [t * x1 + s * x0, t * y1 + s * y0], [t2 * x2 + 2 * s * t * x1 + s2 * x0, t2 * y2 + 2 * s * t * y1 + s2 * y0], [t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0, t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0]];
    var ps2 = [ps1[3], [t2 * x3 + 2 * t * s * x2 + s2 * x1, t2 * y3 + 2 * t * s * y2 + s2 * y1], [t * x3 + s * x2, t * y3 + s * y2], [x3, y3]];
    return [ps1, ps2];
}
exports.splitAt = splitAt;
/**
 * Returns a new bezier from the given bezier by limiting its t range.
 *
 * Uses de Casteljau's algorithm.
 *
 * @param ps A bezier
 * @param tRange A t range
 */
function bezierFromBezierPiece(ps, tRange) {
    // If tRange = [0,1] then return original bezier.
    if (tRange[0] === 0 && tRange[1] === 1) {
        return ps;
    }
    // If tRange[0] === tRange[1] then return a single point degenerated bezier.
    if (tRange[0] === tRange[1]) {
        var p = evaluate_1.evaluate(ps)(tRange[0]);
        return [p, p, p, p];
    }
    if (tRange[0] === 0) {
        return from_0_to_T_1.from0ToT(ps, tRange[1]);
    }
    if (tRange[1] === 1) {
        return from_T_to_1_1.fromTTo1(ps, tRange[0]);
    }
    // At this stage we know the t range is not degenerate and tRange[0] !== 0 
    // and tRange[1] !== 1
    return from_0_to_T_1.from0ToT(from_T_to_1_1.fromTTo1(ps, tRange[0]), (tRange[1] - tRange[0]) / (1 - tRange[0]));
}
exports.bezierFromBezierPiece = bezierFromBezierPiece;
/**
 * Returns a human readable string representation of the given bezier.
 * @param ps - A bezier curve
 */
function toString(ps) {
    var _ps6 = _slicedToArray(ps, 4),
        _ps6$ = _slicedToArray(_ps6[0], 2),
        x0 = _ps6$[0],
        y0 = _ps6$[1],
        _ps6$2 = _slicedToArray(_ps6[1], 2),
        x1 = _ps6$2[0],
        y1 = _ps6$2[1],
        _ps6$3 = _slicedToArray(_ps6[2], 2),
        x2 = _ps6$3[0],
        y2 = _ps6$3[1],
        _ps6$4 = _slicedToArray(_ps6[3], 2),
        x3 = _ps6$4[0],
        y3 = _ps6$4[1];

    return "[[" + x0 + "," + y0 + "],[" + x1 + "," + y1 + "],[" + x2 + "," + y2 + "],[" + x3 + "," + y3 + "]]";
}
/**
 * Scales all control points of the given bezier by the given factor.
 * @param ps - A bezier curve
 * @param c - The scale factor
 */
function scale(ps, c) {
    return ps.map(function (x) {
        return [x[0] * c, x[1] * c];
    });
}
exports.scale = scale;
/**
 * Returns the best least squares quadratic bezier approximation to the given
 * cubic bezier. Note that the two bezier endpoints differ in general.
 * @param ps - A cubic bezier curve.
 */
function toQuadratic(ps) {
    var _ps7 = _slicedToArray(ps, 4),
        _ps7$ = _slicedToArray(_ps7[0], 2),
        x0 = _ps7$[0],
        y0 = _ps7$[1],
        _ps7$2 = _slicedToArray(_ps7[1], 2),
        x1 = _ps7$2[0],
        y1 = _ps7$2[1],
        _ps7$3 = _slicedToArray(_ps7[2], 2),
        x2 = _ps7$3[0],
        y2 = _ps7$3[1],
        _ps7$4 = _slicedToArray(_ps7[3], 2),
        x3 = _ps7$4[0],
        y3 = _ps7$4[1];

    return [[19 / 20 * x0 + 3 / 20 * x1 + -3 / 20 * x2 + 1 / 20 * x3, 19 / 20 * y0 + 3 / 20 * y1 + -3 / 20 * y2 + 1 / 20 * y3], [-1 / 4 * x0 + 3 / 4 * x1 + 3 / 4 * x2 + -1 / 4 * x3, -1 / 4 * y0 + 3 / 4 * y1 + 3 / 4 * y2 + -1 / 4 * y3], [1 / 20 * x0 + -3 / 20 * x1 + 3 / 20 * x2 + 19 / 20 * x3, 1 / 20 * y0 + -3 / 20 * y1 + 3 / 20 * y2 + 19 / 20 * y3]];
}
exports.toQuadratic = toQuadratic;
/**
 * Evaluates the given hybrid quadratic at the given t and th parameters. (see
 * toHybridQuadratic for details).
 * @param hq - A hybrid quadratic
 * @param t - The bezier parameter value
 * @param th - The parameter value for the hybrid quadratic point.
 */
function evaluateHybridQuadratic(hq, t, th) {
    var P0 = hq[0];
    var P1_ = hq[1];
    var P2 = hq[2];
    var P1 = evaluateLinear(hq[1], th);
    return evaluateQuadratic([P0, P1, P2], t);
}
exports.evaluateHybridQuadratic = evaluateHybridQuadratic;
/**
 * Evaluates the given linear bezier (line) at a specific t value.
 * @param ps - A linear bezier curve.
 * @param t - The value where the bezier should be evaluated
 */
function evaluateLinear(ps, t) {
    var _ps8 = _slicedToArray(ps, 2),
        _ps8$ = _slicedToArray(_ps8[0], 2),
        x0 = _ps8$[0],
        y0 = _ps8$[1],
        _ps8$2 = _slicedToArray(_ps8[1], 2),
        x1 = _ps8$2[0],
        y1 = _ps8$2[1];

    var x = x0 * (1 - t) + x1 * t;
    var y = y0 * (1 - t) + y1 * t;
    return [x, y];
}
exports.evaluateLinear = evaluateLinear;
/**
 * Returns a clone of the given cubic bezier. Use sparingly; this is not in the
 * spirit of functional programming.
 * @param ps - A cubic bezier given by its array of control points
 */
function clone(ps) {
    var _ps9 = _slicedToArray(ps, 4),
        _ps9$ = _slicedToArray(_ps9[0], 2),
        x0 = _ps9$[0],
        y0 = _ps9$[1],
        _ps9$2 = _slicedToArray(_ps9[1], 2),
        x1 = _ps9$2[0],
        y1 = _ps9$2[1],
        _ps9$3 = _slicedToArray(_ps9[2], 2),
        x2 = _ps9$3[0],
        y2 = _ps9$3[1],
        _ps9$4 = _slicedToArray(_ps9[3], 2),
        x3 = _ps9$4[0],
        y3 = _ps9$4[1];

    return [[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
}
exports.clone = clone;
/**
 * Evaluates the given quadratic bezier at a specific t value.
 * @param ps - A quadratic bezier curve.
 * @param t - The value where the bezier should be evaluated
 */
function evaluateQuadratic(ps, t) {
    var _ps10 = _slicedToArray(ps, 3),
        _ps10$ = _slicedToArray(_ps10[0], 2),
        x0 = _ps10$[0],
        y0 = _ps10$[1],
        _ps10$2 = _slicedToArray(_ps10[1], 2),
        x1 = _ps10$2[0],
        y1 = _ps10$2[1],
        _ps10$3 = _slicedToArray(_ps10[2], 2),
        x2 = _ps10$3[0],
        y2 = _ps10$3[1];

    var x = x0 * Math.pow(1 - t, 2) + x1 * 2 * (1 - t) * t + x2 * Math.pow(t, 2);
    var y = y0 * Math.pow(1 - t, 2) + y1 * 2 * (1 - t) * t + y2 * Math.pow(t, 2);
    return [x, y];
}
exports.evaluateQuadratic = evaluateQuadratic;
/**
 * Returns the cubic version of the given quadratic bezier curve. Quadratic
 * bezier curves can always be represented by cubics - the converse is false.
 * @param ps - A quadratic bezier curve.
 */
function toCubic(ps) {
    var _ps11 = _slicedToArray(ps, 3),
        _ps11$ = _slicedToArray(_ps11[0], 2),
        x0 = _ps11$[0],
        y0 = _ps11$[1],
        _ps11$2 = _slicedToArray(_ps11[1], 2),
        x1 = _ps11$2[0],
        y1 = _ps11$2[1],
        _ps11$3 = _slicedToArray(_ps11[2], 2),
        x2 = _ps11$3[0],
        y2 = _ps11$3[1];

    return [[x0, y0], [1 / 3 * x0 + 2 / 3 * x1, 1 / 3 * y0 + 2 / 3 * y1], [2 / 3 * x1 + 1 / 3 * x2, 2 / 3 * y1 + 1 / 3 * y2], [x2, y2]];
}
exports.toCubic = toCubic;
/**
 * Returns the given points (e.g. bezier) in reverse order.
 * @param ps
 */
function reverse(ps) {
    return ps.slice().reverse();
}
exports.reverse = reverse;
function equal(psA, psB) {
    var _psA = _slicedToArray(psA, 4),
        _psA$ = _slicedToArray(_psA[0], 2),
        ax0 = _psA$[0],
        ay0 = _psA$[1],
        _psA$2 = _slicedToArray(_psA[1], 2),
        ax1 = _psA$2[0],
        ay1 = _psA$2[1],
        _psA$3 = _slicedToArray(_psA[2], 2),
        ax2 = _psA$3[0],
        ay2 = _psA$3[1],
        _psA$4 = _slicedToArray(_psA[3], 2),
        ax3 = _psA$4[0],
        ay3 = _psA$4[1];

    var _psB = _slicedToArray(psB, 4),
        _psB$ = _slicedToArray(_psB[0], 2),
        bx0 = _psB$[0],
        by0 = _psB$[1],
        _psB$2 = _slicedToArray(_psB[1], 2),
        bx1 = _psB$2[0],
        by1 = _psB$2[1],
        _psB$3 = _slicedToArray(_psB[2], 2),
        bx2 = _psB$3[0],
        by2 = _psB$3[1],
        _psB$4 = _slicedToArray(_psB[3], 2),
        bx3 = _psB$4[0],
        by3 = _psB$4[1];

    return ax0 === bx0 && ax1 === bx1 && ax2 === bx2 && ax3 === bx3 && ay0 === by0 && ay1 === by1 && ay2 === by2 && ay3 === by3;
}
exports.equal = equal;



},{"./src/bezier3-intersection-sylvester/bezier3-intersection-sylvester":4,"./src/bezier3-intersection/bezier3-intersection":5,"./src/coincident":11,"./src/de-casteljau":12,"./src/debug/debug":13,"./src/debug/fat-line":15,"./src/eval-de-casteljau":16,"./src/evaluate":21,"./src/evaluate-dx":17,"./src/evaluate-dy":18,"./src/evaluate-x":19,"./src/evaluate-y":20,"./src/from-0-to-T":22,"./src/from-T-to-1":23,"./src/from-to":24,"./src/get-dx":25,"./src/get-dy":26,"./src/get-x":27,"./src/get-y":28,"./src/line-intersection":29,"./src/normal":30,"./src/tangent":31,"./src/to-hybrid-quadratic":32,"./src/ts-at-x":33,"./src/ts-at-y":34,"flo-gauss-quadrature":35,"flo-graham-scan":36,"flo-memoize":41,"flo-poly":42,"flo-vector2d":50}],4:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var get_x_1 = _dereq_("../get-x");
var get_y_1 = _dereq_("../get-y");
var DELTA = 10 - 6;
// Belongs in graveyard because it is not numerically stable enough, e.g. if
// the cubic bezier resembles a quadratic no intersection can be found.
/**
 * Returns the intersection points between two cubic beziers. This function is
 * not numerically stable and thus not publically exposed. It can not, for
 * instance, handle cases where one or both beziers degenerate into a quadratic
 * bezier. Use for experimentation and comparison only.
 * @ignore
 * @param ps1 - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param ps2 - Another cubic bezier
 * @returns The t-value pairs at intersection of the first
 * and second beziers respectively.
 * See <a href="http://mat.polsl.pl/sjpam/zeszyty/z6/Silesian_J_Pure_Appl_Math_v6_i1_str_155-176.pdf">
 * this paper</a>
 */
function bezier3IntersectionSylvester(ps1, ps2) {
    var _ps1$ = _slicedToArray(ps1[0], 2),
        x1 = _ps1$[0],
        y1 = _ps1$[1];

    var _ps2$ = _slicedToArray(ps2[0], 2),
        x2 = _ps2$[0],
        y2 = _ps2$[1];
    // Rotate by θ so that Δx ≡ d_0x - c_0x === 0 (as suggested by the paper)


    var rotatedPs1 = void 0;
    var rotatedPs2 = void 0;
    if (Math.abs(x1 - x2) > 1e-12) {
        var tanθ = (x1 - x2) / (y1 - y2);
        var tanθ2 = tanθ * tanθ;
        var sinθ = tanθ2 / (1 + tanθ2); // Trig. identity
        var cosθ = sinθ / tanθ;
        var rotatedPs1_ = flo_vector2d_1.rotatePs(sinθ, cosθ, ps1);
        var rotatedPs2_ = flo_vector2d_1.rotatePs(sinθ, cosθ, ps2);
        rotatedPs1 = rotatedPs1_;
        rotatedPs2 = rotatedPs2_;
    } else {
        rotatedPs1 = ps1;
        rotatedPs2 = ps2;
    }
    // Cache

    var _get_x_1$getX = get_x_1.getX(rotatedPs1),
        _get_x_1$getX2 = _slicedToArray(_get_x_1$getX, 4),
        c_3x = _get_x_1$getX2[0],
        c_2x = _get_x_1$getX2[1],
        c_1x = _get_x_1$getX2[2],
        c_0x = _get_x_1$getX2[3];

    var _get_y_1$getY = get_y_1.getY(rotatedPs1),
        _get_y_1$getY2 = _slicedToArray(_get_y_1$getY, 4),
        c_3y = _get_y_1$getY2[0],
        c_2y = _get_y_1$getY2[1],
        c_1y = _get_y_1$getY2[2],
        c_0y = _get_y_1$getY2[3];

    var _get_x_1$getX3 = get_x_1.getX(rotatedPs2),
        _get_x_1$getX4 = _slicedToArray(_get_x_1$getX3, 4),
        d_3x = _get_x_1$getX4[0],
        d_2x = _get_x_1$getX4[1],
        d_1x = _get_x_1$getX4[2],
        d_0x = _get_x_1$getX4[3];

    var _get_y_1$getY3 = get_y_1.getY(rotatedPs2),
        _get_y_1$getY4 = _slicedToArray(_get_y_1$getY3, 4),
        d_3y = _get_y_1$getY4[0],
        d_2y = _get_y_1$getY4[1],
        d_1y = _get_y_1$getY4[2],
        d_0y = _get_y_1$getY4[3];

    var a = d_3x,
        b = c_3x,
        c = d_2x,
        d = c_2x,
        e = d_1x,
        f = c_1x;
    //let Δx = d_0x - c_0x; // === 0 after rotation

    var m = d_3y,
        n = c_3y,
        p = d_2y,
        q = c_2y,
        r = d_1y,
        s = c_1y;

    var Δy = d_0y - c_0y;
    var a2 = a * a;
    var b2 = b * b;
    var c2 = c * c;
    var d2 = d * d;
    var e2 = e * e;
    var f2 = f * f;
    var m2 = m * m;
    var n2 = n * n;
    var p2 = p * p;
    var q2 = q * q;
    var r2 = r * r;
    var s2 = s * s;
    var Δy2 = Δy * Δy;
    var a3 = a2 * a;
    var b3 = b2 * b;
    var c3 = c2 * c;
    var d3 = d2 * d;
    var e3 = e2 * e;
    var f3 = f2 * f;
    var Δy3 = Δy2 * Δy;
    var dΔy = d * Δy;
    var dΔy2 = d * Δy2;
    var bdΔy = b * dΔy;
    var bdΔy2 = b * dΔy2;
    var cΔy = c * Δy;
    var cΔy2 = c * Δy2;
    var bΔy = b * Δy;
    var bΔy2 = b * Δy2;
    var bΔy3 = b * Δy3;
    // Rotate both beziers so that delta-x = 0, i.e. so that the x-coordinate of 
    // both beziers are equal. This reduces the complexity of calculating the 
    // determinant of the Sylvester matrix.
    var k9 = -b2 * Δy * f * s2 + bdΔy * f * q * s + 2 * bΔy * f2 * n * s - d2 * Δy * f * n * s - b2 * dΔy2 * s - bΔy * f2 * q2 + dΔy * f2 * n * q - 2 * b2 * Δy2 * f * q + d2 * bΔy2 * q - Δy * f3 * n2 + 3 * bdΔy2 * f * n - d3 * Δy2 * n - b3 * Δy3;
    var k8 = b2 * Δy * e * s2 + 2 * b2 * Δy * f * r * s - bdΔy * e * q * s - 4 * bΔy * e * f * n * s + d2 * Δy * e * n * s - bdΔy * f * q * r - 2 * bΔy * f2 * n * r + d2 * Δy * f * n * r + b2 * dΔy2 * r + 2 * bΔy * e * f * q2 - 2 * dΔy * e * f * n * q + 2 * b2 * Δy2 * e * q + 3 * Δy * e * f2 * n2 - 3 * bdΔy2 * e * n;
    var k7 = -2 * b2 * Δy * e * r * s - b * cΔy * f * q * s - bdΔy * f * p * s + 2 * c * dΔy * f * n * s + 2 * bΔy * e2 * n * s + b2 * cΔy2 * s - b2 * Δy * f * r2 + bdΔy * e * q * r + 4 * bΔy * e * f * n * r - d2 * Δy * e * n * r - bΔy * e2 * q2 + 2 * bΔy * f2 * p * q - cΔy * f2 * n * q + dΔy * e2 * n * q - 2 * b * c * dΔy2 * q - dΔy * f2 * n * p + 2 * b2 * Δy2 * f * p - b * d2 * Δy2 * p - 3 * Δy * e2 * f * n2 - 3 * b * cΔy2 * f * n + 3 * c * d2 * Δy2 * n;
    var k6 = 2 * a * bΔy * f * s2 - a * dΔy * f * q * s + b * cΔy * e * q * s + bdΔy * e * p * s - 2 * a * Δy * f2 * n * s - 2 * c * dΔy * e * n * s - 2 * bΔy * f2 * m * s + d2 * Δy * f * m * s + 2 * a * bdΔy2 * s + b2 * Δy * e * r2 + b * cΔy * f * q * r + bdΔy * f * p * r - 2 * c * dΔy * f * n * r - 2 * bΔy * e2 * n * r - b2 * cΔy2 * r + a * Δy * f2 * q2 - 4 * bΔy * e * f * p * q + 2 * cΔy * e * f * n * q - dΔy * f2 * m * q + 4 * a * bΔy2 * f * q - a * d2 * Δy2 * q + 2 * dΔy * e * f * n * p - 2 * b2 * Δy2 * e * p + Δy * e3 * n2 + 2 * Δy * f3 * m * n - 3 * a * dΔy2 * f * n + 3 * b * cΔy2 * e * n - 3 * bdΔy2 * f * m + d3 * Δy2 * m + 3 * a * b2 * Δy3;
    var k5 = -2 * a * bΔy * e * s2 - 4 * a * bΔy * f * r * s + a * dΔy * e * q * s + b * cΔy * f * p * s + 4 * a * Δy * e * f * n * s - c2 * Δy * f * n * s + 4 * bΔy * e * f * m * s - d2 * Δy * e * m * s + a * dΔy * f * q * r - b * cΔy * e * q * r - bdΔy * e * p * r + 2 * a * Δy * f2 * n * r + 2 * c * dΔy * e * n * r + 2 * bΔy * f2 * m * r - d2 * Δy * f * m * r - 2 * a * bdΔy2 * r - 2 * a * Δy * e * f * q2 + 2 * bΔy * e2 * p * q - cΔy * e2 * n * q + 2 * dΔy * e * f * m * q - 4 * a * bΔy2 * e * q + b * c2 * Δy2 * q - bΔy * f2 * p2 + cΔy * f2 * n * p - dΔy * e2 * n * p + 2 * b * c * dΔy2 * p - 6 * Δy * e * f2 * m * n + 3 * a * dΔy2 * e * n - 3 * c2 * dΔy2 * n + 3 * bdΔy2 * e * m;
    var k4 = 4 * a * bΔy * e * r * s + a * cΔy * f * q * s + a * dΔy * f * p * s - b * cΔy * e * p * s - 2 * a * Δy * e2 * n * s + c2 * Δy * e * n * s - 2 * c * dΔy * f * m * s - 2 * bΔy * e2 * m * s - 2 * a * b * cΔy2 * s + 2 * a * bΔy * f * r2 - a * dΔy * e * q * r - b * cΔy * f * p * r - 4 * a * Δy * e * f * n * r + c2 * Δy * f * n * r - 4 * bΔy * e * f * m * r + d2 * Δy * e * m * r + a * Δy * e2 * q2 - 2 * a * Δy * f2 * p * q + cΔy * f2 * m * q - dΔy * e2 * m * q + 2 * a * c * dΔy2 * q + 2 * bΔy * e * f * p2 - 2 * cΔy * e * f * n * p + dΔy * f2 * m * p - 4 * a * bΔy2 * f * p + a * d2 * Δy2 * p + 6 * Δy * e2 * f * m * n + 3 * a * cΔy2 * f * n + 3 * b * cΔy2 * f * m - 3 * c * d2 * Δy2 * m;
    var k3 = -a2 * Δy * f * s2 - a * cΔy * e * q * s - a * dΔy * e * p * s + 2 * a * Δy * f2 * m * s + 2 * c * dΔy * e * m * s - a2 * dΔy2 * s - 2 * a * bΔy * e * r2 - a * cΔy * f * q * r - a * dΔy * f * p * r + b * cΔy * e * p * r + 2 * a * Δy * e2 * n * r - c2 * Δy * e * n * r + 2 * c * dΔy * f * m * r + 2 * bΔy * e2 * m * r + 2 * a * b * cΔy2 * r + 4 * a * Δy * e * f * p * q - 2 * cΔy * e * f * m * q - 2 * a2 * Δy2 * f * q - bΔy * e2 * p2 + cΔy * e2 * n * p - 2 * dΔy * e * f * m * p + 4 * a * bΔy2 * e * p - b * c2 * Δy2 * p - 2 * Δy * e3 * m * n - 3 * a * cΔy2 * e * n + c3 * Δy2 * n - Δy * f3 * m2 + 3 * a * dΔy2 * f * m - 3 * b * cΔy2 * e * m - 3 * a2 * bΔy3;
    var k2 = a2 * Δy * e * s2 + 2 * a2 * Δy * f * r * s - a * cΔy * f * p * s - 4 * a * Δy * e * f * m * s + c2 * Δy * f * m * s + a * cΔy * e * q * r + a * dΔy * e * p * r - 2 * a * Δy * f2 * m * r - 2 * c * dΔy * e * m * r + a2 * dΔy2 * r - 2 * a * Δy * e2 * p * q + cΔy * e2 * m * q + 2 * a2 * Δy2 * e * q - a * c2 * Δy2 * q + a * Δy * f2 * p2 - cΔy * f2 * m * p + dΔy * e2 * m * p - 2 * a * c * dΔy2 * p + 3 * Δy * e * f2 * m2 - 3 * a * dΔy2 * e * m + 3 * c2 * dΔy2 * m;
    var k1 = -2 * a2 * Δy * e * r * s + a * cΔy * e * p * s + 2 * a * Δy * e2 * m * s - c2 * Δy * e * m * s + a2 * cΔy2 * s - a2 * Δy * f * r2 + a * cΔy * f * p * r + 4 * a * Δy * e * f * m * r - c2 * Δy * f * m * r - 2 * a * Δy * e * f * p2 + 2 * cΔy * e * f * m * p + 2 * a2 * Δy2 * f * p - 3 * Δy * e2 * f * m2 - 3 * a * cΔy2 * f * m;
    var k0 = a2 * Δy * e * r2 - a * cΔy * e * p * r - 2 * a * Δy * e2 * m * r + c2 * Δy * e * m * r - a2 * cΔy2 * r + a * Δy * e2 * p2 - cΔy * e2 * m * p - 2 * a2 * Δy2 * e * p + a * c2 * Δy2 * p + Δy * e3 * m2 + 3 * a * cΔy2 * e * m - c3 * Δy2 * m + a3 * Δy3;
    var poly = [k9, k8, k7, k6, k5, k4, k3, k2, k1, k0];
    var roots = flo_poly_1.default.allRoots(poly, 0);
    var tPairs = [];
    for (var i = 0; i < roots.length; i++) {
        var k = roots[i];
        var _k = k * k;
        var _k2 = _k * k;
        var ps1k = {
            x: [c_3x * _k2, c_2x * _k, c_1x * k, c_0x],
            y: [c_3y * _k2, c_2y * _k, c_1y * k, c_0y]
        };
        var ps2k = {
            x: [d_3x * _k2, d_2x * _k, d_1x * k, d_0x],
            y: [d_3y * _k2, d_2y * _k, d_1y * k, d_0y]
        };
        var xx = flo_poly_1.default.subtract(get_x_1.getX(rotatedPs2), ps1k.x);
        var yy = flo_poly_1.default.subtract(get_y_1.getY(rotatedPs2), ps1k.y);
        var rootsx = flo_poly_1.default.allRoots(xx, 0, 1);
        var rootsy = flo_poly_1.default.allRoots(yy, 0, 1);
        for (var j = 0; j < rootsx.length; j++) {
            var rootx = rootsx[j];
            for (var l = 0; l < rootsy.length; l++) {
                var rooty = rootsy[l];
                if (Math.abs(rootx - rooty) < DELTA) {
                    var t = (rootx + rooty) / 2;
                    var tk = t * k;
                    if (t >= 0 && t <= 1 && tk >= 0 && tk <= 1) {
                        tPairs.push([tk, t]);
                    }
                }
            }
        }
    }
    return tPairs;
}
exports.bezier3IntersectionSylvester = bezier3IntersectionSylvester;



},{"../get-x":27,"../get-y":28,"flo-poly":42,"flo-vector2d":50}],5:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var coincident_1 = _dereq_("../coincident");
var from_to_1 = _dereq_("../from-to");
var get_distance_to_line_function_1 = _dereq_("./get-distance-to-line-function");
var calc_other_t_1 = _dereq_("./calc-other-t");
var geo_clip_1 = _dereq_("./geo-clip");
var center_1 = _dereq_("./center");
var evaluate_1 = _dereq_("../evaluate");
var fat_line_1 = _dereq_("../debug/fat-line");
/**
 * Extremely accurate and extremely fast (cubically convergent in general with
 * fast iteration steps) algorithm that returns the intersections between two
 * cubic beziers.
 *
 * At stretches where the two curves run extremely close to (or on top of) each
 * other and curve the same direction an interval is returned instead of a
 * point. This tolerance can be set by the Δ parameter.
 *
 * The algorithm is based on a <a href="http://scholarsarchive.byu.edu/cgi/viewcontent.cgi?article=2206&context=etd">paper</a>
 * that finds the intersection of a fat line and a so-called geometric interval
 * making it faster and more accurate than the standard fat-line intersection
 * algorithm. The algorithm has been modified to prevent run-away recursion
 * by checking for coincident pieces at subdivision steps.
 *
 * @param ps1 - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param ps2 - Another cubic bezier
 * @param δ - An optional tolerance to within which the t parameter
 * should be calculated - defaults to the minimum value of 24*Number.EPSILON or
 * approximately 5e-15. Note that it might not make sense to set this to as
 * large as say 1e-5 since only a single iteration later the maximum accuracy
 * will be attained and not much speed will be gained anyway. Similarly if δ is
 * set to 1e-2 only two iterations will be saved. This is due to the algorithm
 * being cubically convergent (usually converging in about 4 to 8 iterations for
 * typical intersections).
 * @param Δ - A tolerance that indicates how closely a stretch of the
 * beziers can run together before being considered coincident. Defaults to the
 * minimum possible value of 1e-6 if not specified.
 * @returns An array that contains the t-value pairs at intersection
 * of the first and second beziers respectively. The array can also contain t
 * range pairs for coincident pieces that can be either used or ignored
 * depending on the application, e.g. the return value might be [[0.1,0.2],
 * [0.3,0.5],[[0.4,0.5],[0.6,0.7]]] that indicates intersection points at t
 * values of t1=0.1 and t2=0.2 for the first and second bezier respectively as
 * well as at t1=0.3 and t2=0.5 and finally indicates the curves to be nearly
 * coincident from t1=0.4 to t1=0.5 for the first bezier and t2=0.6 to t=0.7 for
 * the second bezier.
 */
function bezier3Intersection(ps1, ps2, δ, Δ) {
    // The minimum value Δ can be. If it is too small the algorithm may take too
    // long in cases where the two curves run extremely close to each other for
    // their entire length and curve the same direction.
    var ΔMin = 1e-6;
    // This is an estimate of the relative floating point error during clipping.
    // A bound is given by |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k
    // are the control points indexed by k=0,1,2,3 and η is machine epsilon, 
    // i.e. Number.EPSILON. We quadruple the bound to be sure.
    //const δMin = 6*4*Number.EPSILON; 
    var δMin = 6 * 4 * 8 * Number.EPSILON;
    // Maximum error - limited to take rounding error into account.
    if (δ === undefined) {
        δ = 0;
    }
    δ = Math.max(δ, δMin);
    if (Δ === undefined) {
        Δ = ΔMin;
    }
    Δ = Math.max(Δ, ΔMin);
    var flip = 0;
    // Intersection t values for both beziers
    var tss = [];
    var kk = 0;
    if (typeof _bez_debug_ !== 'undefined') {
        _bez_debug_.generated.elems.beziers.push([ps1, ps2]);
        _bez_debug_.generated.elems.fatLine.push(new fat_line_1.FatLine([[0, 0], [1e-10, 1e-10]], 0, 0) // unused
        );
    }
    var stack = [];
    stack.push({ ps1: ps1, ps2: ps2, tRange1: [0, 1], tRange2: [0, 1], idx: 1 });
    while (stack.length !== 0) {
        var toCheck = stack.pop();
        var _ps = toCheck.ps1,
            _ps2 = toCheck.ps2,
            tRange1 = toCheck.tRange1,
            tRange2 = toCheck.tRange2,
            idx = toCheck.idx;

        f(_ps, _ps2, tRange1, tRange2, idx);
    }
    //f(ps1, ps2, [0,1], [0,1], 1);
    if (typeof _bez_debug_ !== 'undefined') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = tss[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var ts = _step.value;

                _bez_debug_.generated.elems.intersection.push(evaluate_1.evaluate(ps1, ts[0]));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return tss;
    // Helper function
    function f(Q_, P_, qRange, pRange, idx) {
        var cidx = idx === 0 ? 1 : 0; // Counter flip-flop index
        // Move intersection toward the origin to prevent floating point issues
        // that are introduced specifically by the getLineEquation function. 
        // This allows us to get a relative error in the final result usually in 
        // the 10 ULPS or less range.
        //let [mx, my] = cc(P_, Q_); // TODO - REMOVE! JUST FOR TESTING

        var _center_1$center = center_1.center(P_, Q_);

        var _center_1$center2 = _slicedToArray(_center_1$center, 2);

        P_ = _center_1$center2[0];
        Q_ = _center_1$center2[1];

        if (typeof _bez_debug_ !== 'undefined') {
            _bez_debug_.generated.elems.beziers.push([P_, Q_]);
        }

        var _Q_ = Q_,
            _Q_2 = _slicedToArray(_Q_, 4),
            Q0 = _Q_2[0],
            Q3 = _Q_2[3];
        // Get the implict line equation for the line defined by the first and 
        // last control point of Q. This equation gives the distance between any 
        // point and the line.


        var dQ = void 0;
        var dMin = void 0;
        var dMax = void 0;
        flip++;
        var doA = flip === 1 || flip === 2;
        if (flip === 4) {
            flip = 0;
        }
        //if (doA) {
        dQ = get_distance_to_line_function_1.getDistanceToLineFunction([Q0, Q3]);
        // Calculate the distance from the control points of Q to the line 
        var dQi = function dQi(i) {
            return dQ(Q_[i]);
        };

        var _map = [1, 2].map(dQi),
            _map2 = _slicedToArray(_map, 2),
            dQ1 = _map2[0],
            dQ2 = _map2[1];
        // Calculate the fat line of Q.


        var C = dQ1 * dQ2 > 0 ? 3 / 4 : 4 / 9;
        dMin = C * Math.min(0, dQ1, dQ2);
        dMax = C * Math.max(0, dQ1, dQ2);
        if (typeof _bez_debug_ !== 'undefined') {
            _bez_debug_.generated.elems.fatLine.push(new fat_line_1.FatLine([Q0, Q3], dMin, dMax));
        }
        /*} else if (!doA) {
            
            let mid = [(Q0[0] + Q3[0]) / 2, (Q0[1] + Q3[1]) / 2];
            // Rotate line [Q0,Q3]
            let l_ = [[-Q0[1], Q0[0]], [-Q3[1], Q3[0]]];
              let v = [l_[1][0] - l_[0][0], l_[1][1] - l_[0][1]];
            let l = [
                [mid[0], mid[1]],
                [mid[0] + v[0], mid[1] + v[1]]
            ];
            dQ = getDistanceToLineFunction(l);
              // Calculate the distance from the control points of Q to the line
            let dQi = (i: number) => dQ(Q_[i]);
            let dQs = [0,1,2,3].map(dQi);
            let [dQ0,dQ1,dQ2,dQ3] = dQs;
              // Calculate the fat line of Q.
            dMin = Math.min(0,dQ0,dQ1,dQ2,dQ3);
            dMax = Math.max(0,dQ0,dQ1,dQ2,dQ3);
              //console.log(dMin, dMax)
            if (typeof _bez_debug_ !== 'undefined') {
                _bez_debug_.generated.elems.fatLine.push(
                    new FatLine(l, dMin, dMax)
                );
            }
        }*/

        var _geo_clip_1$geoClip = geo_clip_1.geoClip(P_, dQ, dMin, dMax),
            tMin = _geo_clip_1$geoClip.tMin,
            tMax = _geo_clip_1$geoClip.tMax;

        if (tMin === Number.POSITIVE_INFINITY) {
            return; // No intersection
        }
        // The paper calls for a heuristic that if less than 30% will be
        // clipped, rather split the longest curve and find intersections in the
        // two halfs seperately.
        if (tMax - tMin > 0.7) {
            // Some length measure
            var pSpan = pRange[1] - pRange[0];
            var qSpan = qRange[1] - qRange[0];
            var pq = coincident_1.coincident(P_, Q_);
            if (pq !== undefined) {
                return;
            }
            // Split the curve in half
            if (pSpan <= qSpan) {
                cidx = idx;
                var _ref = [Q_, P_];
                P_ = _ref[0];
                Q_ = _ref[1];
                var _ref2 = [qRange, pRange];
                pRange = _ref2[0];
                qRange = _ref2[1];
            }
            // Update t range.
            var _span = pRange[1] - pRange[0];
            // 1st half
            var tMinA = pRange[0];
            var tMaxA = tMinA + _span / 2;
            // 2nd half
            var tMinB = tMaxA;
            var tMaxB = pRange[1];
            var A = from_to_1.fromTo(P_)(0, 0.5);
            var B = from_to_1.fromTo(P_)(0.5, 1);
            stack.push({ ps1: A, ps2: Q_, tRange1: [tMinA, tMaxA], tRange2: qRange, idx: cidx });
            stack.push({ ps1: B, ps2: Q_, tRange1: [tMinB, tMaxB], tRange2: qRange, idx: cidx });
            //f(A, Q_, [tMinA, tMaxA], qRange, cidx);
            //f(B, Q_, [tMinB, tMaxB], qRange, cidx);
            return;
        }
        // Update t range.
        var span = pRange[1] - pRange[0];
        var tMin_ = tMin * span + pRange[0];
        var tMax_ = tMax * span + pRange[0];
        // Clip
        P_ = from_to_1.fromTo(P_)(tMin, tMax);
        if (Math.abs(tMax_ - tMin_) < δ) {
            var t1 = (tMax_ + tMin_) / 2;
            var _pq = idx === 0 ? [ps1, ps2] : [ps2, ps1];
            var t2 = calc_other_t_1.calcOtherT(t1, _pq[0], _pq[1]);
            if (t2 === undefined) {
                return undefined;
            }
            var _ts = idx === 0 ? [t1, t2] : [t2, t1];
            tss.push(_ts);
            return;
        }
        // Swap Q and P and iterate.
        stack.push({ ps1: P_, ps2: Q_, tRange1: [tMin_, tMax_], tRange2: qRange, idx: cidx });
        //f(P_, Q_, [tMin_,tMax_], qRange, cidx);
    }
}
exports.bezier3Intersection = bezier3Intersection;



},{"../coincident":11,"../debug/fat-line":15,"../evaluate":21,"../from-to":24,"./calc-other-t":6,"./center":7,"./geo-clip":8,"./get-distance-to-line-function":9}],6:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var evaluate_1 = _dereq_("../evaluate");
var ts_at_x_1 = _dereq_("../ts-at-x");
var ts_at_y_1 = _dereq_("../ts-at-y");
/**
 * Calculates the t-value of the closest point on Q to P(t).
 * @param δ
 * @param t
 * @param P
 * @param Q
 */
function calcOtherT(t, P, Q) {
    // Get some length measure on P and Q
    var max = Math.max(P[0][0], P[0][1], P[1][0], P[1][1], P[2][0], P[2][1], P[3][0], P[3][1], Q[0][0], Q[0][1], Q[1][0], Q[1][1], Q[2][0], Q[2][1], Q[3][0], Q[3][1]);
    var pp = evaluate_1.evaluate(P)(t);

    var _pp = _slicedToArray(pp, 2),
        x = _pp[0],
        y = _pp[1];

    var tqsh = ts_at_y_1.tsAtY(Q, y);
    var tqsv = ts_at_x_1.tsAtX(Q, x);
    if (!tqsh.length && !tqsv.length) {
        return undefined;
    }
    var tqs = [].concat(_toConsumableArray(tqsh), _toConsumableArray(tqsv));
    var bestT = undefined;
    var bestD = Number.POSITIVE_INFINITY;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = tqs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tq = _step.value;

            var pq = evaluate_1.evaluate(Q)(tq);
            var d = flo_vector2d_1.squaredDistanceBetween(pp, pq);
            if (d < bestD) {
                bestD = d;
                bestT = tq;
            }
        }
        // If the best distance > the max allowed tolerance then no intersection
        // occured - this happens only in special cases where clipping occured at
        // the endpoint of a curve.
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var maxTolerance = 256 * 24 * Number.EPSILON * max;
    if (bestD > maxTolerance * maxTolerance) {
        return undefined;
    }
    return bestT;
}
exports.calcOtherT = calcOtherT;



},{"../evaluate":21,"../ts-at-x":33,"../ts-at-y":34,"flo-vector2d":50}],7:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
/**
 * Return the given two beziers but translated such that the shorter (by
 * some length measure) is closer to the origin.
 * @private
 * @param P
 * @param Q
 */
function center(P, Q) {
    var _P = P,
        _P2 = _slicedToArray(_P, 4),
        P0 = _P2[0],
        P1 = _P2[1],
        P2 = _P2[2],
        P3 = _P2[3];

    var _Q = Q,
        _Q2 = _slicedToArray(_Q, 4),
        Q0 = _Q2[0],
        Q1 = _Q2[1],
        Q2 = _Q2[2],
        Q3 = _Q2[3];

    var lengthP = flo_vector2d_1.squaredDistanceBetween(P0, P1) + flo_vector2d_1.squaredDistanceBetween(P1, P2) + flo_vector2d_1.squaredDistanceBetween(P2, P3);
    var lengthQ = flo_vector2d_1.squaredDistanceBetween(Q0, Q1) + flo_vector2d_1.squaredDistanceBetween(Q1, Q2) + flo_vector2d_1.squaredDistanceBetween(Q2, Q3);
    var moveX = void 0;
    var moveY = void 0;
    if (lengthQ < lengthP) {
        moveX = (Q0[0] + Q1[0] + Q2[0] + Q3[0]) / 4;
        moveY = (Q0[1] + Q1[1] + Q2[1] + Q3[1]) / 4;
    } else {
        moveX = (P0[0] + P1[0] + P2[0] + P3[0]) / 4;
        moveY = (P0[1] + P1[1] + P2[1] + P3[1]) / 4;
    }
    P = P.map(function (x) {
        return [x[0] - moveX, x[1] - moveY];
    });
    Q = Q.map(function (x) {
        return [x[0] - moveX, x[1] - moveY];
    });
    return [P, Q];
}
exports.center = center;



},{"flo-vector2d":50}],8:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var to_hybrid_quadratic_1 = _dereq_("../to-hybrid-quadratic");
/**
 * @param P
 * @param dQ
 * @param dMin
 * @param dMax
 */
function geoClip(P, dQ, dMin, dMax) {
    var hq = to_hybrid_quadratic_1.toHybridQuadratic(P);
    var dH0 = dQ(hq[0]);
    var dH2 = dQ(hq[2]);
    var dH10 = dQ(hq[1][0]);
    var dH11 = dQ(hq[1][1]);
    var dHmin = Math.min(dH10, dH11);
    var dHmax = Math.max(dH10, dH11);
    var DyMin = [dH0 - 2 * dHmin + dH2, -2 * dH0 + 2 * dHmin, dH0];
    var DyMax = [dH0 - 2 * dHmax + dH2, -2 * dH0 + 2 * dHmax, dH0];
    var errorBound = 2 * Math.max(flo_poly_1.default.hornerErrorBound(DyMin, 1), flo_poly_1.default.hornerErrorBound(DyMax, 1));
    dMin = dMin - errorBound;
    dMax = dMax + errorBound;
    var DyMinMin = DyMin.slice();
    DyMinMin[2] = DyMinMin[2] - dMin;
    var DyMinMax = DyMin.slice();
    DyMinMax[2] = DyMinMax[2] - dMax;
    var DyMaxMin = DyMax.slice();
    DyMaxMin[2] = DyMaxMin[2] - dMin;
    var DyMaxMax = DyMax.slice();
    DyMaxMax[2] = DyMaxMax[2] - dMax;
    var tMin = Number.POSITIVE_INFINITY;
    var tMax = Number.NEGATIVE_INFINITY;
    var rootsMinMin = flo_poly_1.default.allRoots(DyMinMin, 0, 1);
    var rootsMinMax = flo_poly_1.default.allRoots(DyMinMax, 0, 1);
    var rootsMaxMin = flo_poly_1.default.allRoots(DyMaxMin, 0, 1);
    var rootsMaxMax = flo_poly_1.default.allRoots(DyMaxMax, 0, 1);
    tMin = Math.min.apply(Math, _toConsumableArray(rootsMinMin).concat(_toConsumableArray(rootsMinMax), _toConsumableArray(rootsMaxMin), _toConsumableArray(rootsMaxMax)));
    tMax = Math.max.apply(Math, _toConsumableArray(rootsMinMin).concat(_toConsumableArray(rootsMinMax), _toConsumableArray(rootsMaxMin), _toConsumableArray(rootsMaxMax)));
    if (dH0 >= dMin && dH0 <= dMax) {
        tMin = 0;
    }
    if (dH2 >= dMin && dH2 <= dMax) {
        tMax = 1;
    }
    if (tMin < 0) {
        tMin = 0;
    }
    if (tMax > 1) {
        tMax = 1;
    }
    return { tMin: tMin, tMax: tMax };
}
exports.geoClip = geoClip;



},{"../to-hybrid-quadratic":32,"flo-poly":42}],9:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var get_line_equation_1 = _dereq_("./get-line-equation");
/**
 * @private
 * @param l
 */
function getDistanceToLineFunction(l) {
    var _get_line_equation_1$ = get_line_equation_1.getLineEquation(l),
        _get_line_equation_1$2 = _slicedToArray(_get_line_equation_1$, 3),
        a = _get_line_equation_1$2[0],
        b = _get_line_equation_1$2[1],
        c = _get_line_equation_1$2[2];

    return function (p) {
        return a * p[0] + b * p[1] + c;
    };
}
exports.getDistanceToLineFunction = getDistanceToLineFunction;



},{"./get-line-equation":10}],10:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the implicit line equation from two 2d points in the form f(x,y) ax + by + c = 0
 * returned as the array [a,b,c].
 * @param l - A line given by two points, e.g. [[2,0],[3,3]]
 */
function getLineEquation(l) {
    var _l = _slicedToArray(l, 2),
        _l$ = _slicedToArray(_l[0], 2),
        x1 = _l$[0],
        y1 = _l$[1],
        _l$2 = _slicedToArray(_l[1], 2),
        x2 = _l$2[0],
        y2 = _l$2[1];

    var a = y1 - y2;
    var b = x2 - x1;
    var c = x1 * y2 - x2 * y1;
    var d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return [a / d, b / d, c / d];
}
exports.getLineEquation = getLineEquation;



},{}],11:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector = _dereq_("flo-vector2d");
var evaluate_1 = _dereq_("./evaluate");
var line_intersection_1 = _dereq_("./line-intersection");
var normal_1 = _dereq_("./normal");
var sdst = Vector.squaredDistanceBetween;
/**
 * Check if the two given cubic beziers are nearly coincident everywhere along
 * a finite stretch and returns the coincident stretch (if any), otherwise
 * returns undefined.
 * @param P - A cubic bezier curve.
 * @param Q - Another cubic bezier curve.
 * @param δ - An indication of how closely the curves should stay to
 * each other before considered coincident.
 */
function coincident(P, Q) {
    var δ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;

    //let [P0, P1, P2, P3] = P; 
    //let [Q0, Q1, Q2, Q3] = Q; 
    var PtoQs = [0.01, 0.99].map(function (i) {
        return calcPointAndNeighbor(P, Q, i);
    });
    var QtoPs = [0.01, 0.99].map(function (i) {
        return calcPointAndNeighbor(Q, P, i);
    });
    // Check if start and end points are coincident.
    var tStartQ = 0.01;
    var tEndQ = 0.99;
    var tStartP = 0.01;
    var tEndP = 0.99;
    /*
    let c = 0;
    if (PtoQs[0].d <= δ) { tStartQ = PtoQs[0].t;  c++; }
    if (PtoQs[1].d <= δ) { tEndQ   = PtoQs[1].t;  c++; }
    if (QtoPs[0].d <= δ) { tStartP = QtoPs[0].t;  c++; }
    if (QtoPs[1].d <= δ) { tEndP   = QtoPs[1].t;  c++; }
    // At least 2 endpoints must be coincident.
    if (c < 2) { return undefined; }
    */
    if (PtoQs[0].d <= δ) {
        tStartQ = PtoQs[0].t;
    }
    if (PtoQs[1].d <= δ) {
        tEndQ = PtoQs[1].t;
    }
    if (QtoPs[0].d <= δ) {
        tStartP = QtoPs[0].t;
    }
    if (QtoPs[1].d <= δ) {
        tEndP = QtoPs[1].t;
    }
    if (tStartP > tEndP) {
        var _ref = [tEndP, tStartP];
        tStartP = _ref[0];
        tEndP = _ref[1];
    }
    if (tStartQ > tEndQ) {
        var _ref2 = [tEndQ, tStartQ];
        tStartQ = _ref2[0];
        tEndQ = _ref2[1];
    }
    var tSpanP = tEndP - tStartP;
    var tSpanQ = tEndQ - tStartQ;
    // We must check at least 10 points to ensure entire curve is coincident, 
    // otherwise we may simply have found intersection points. We cannot simply 
    // check the control points for closeness since well seperated control 
    // points does not necessarily translate into well seperated curves.
    //let lengthP = sdst(P0,P1) + sdst(P1,P2) + sdst(P2,P3);
    //let lengthQ = sdst(Q0,Q1) + sdst(Q1,Q2) + sdst(Q2,Q3);
    // If the overlapping part is smaller than 1/10 (a heuristical value) then
    // do not consider pieces overlapping.
    if (tSpanP < 0.1 && tSpanQ < 0.1) {
        return undefined;
    }
    var res = true;
    //for (let i=1; i<10; i++) {
    for (var i = 0; i < 10; i++) {
        var t = tStartP + tSpanP * (i / 10);

        var _calcPointAndNeighbor = calcPointAndNeighbor(P, Q, t),
            d = _calcPointAndNeighbor.d;

        if (d > δ) {
            return undefined;
        }
    }
    return { p: [tStartP, tEndP], q: [tStartQ, tEndQ] };
}
exports.coincident = coincident;
function calcPointAndNeighbor(P, Q, t) {
    // TODO - must also check crossing of normals - for if two curves open
    // at endpoints and stop essentially at same point.
    var pp1 = evaluate_1.evaluate(P)(t);
    //let normalVector = normal(P)(0);
    var normalVector = normal_1.normal(P)(t);
    var pp2 = Vector.translate(pp1, normalVector);
    var ts = line_intersection_1.lineIntersection(Q, [pp1, pp2]);
    var bestT = undefined;
    var bestQ = undefined;
    var bestD = Number.POSITIVE_INFINITY;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = ts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _t = _step.value;

            var q = evaluate_1.evaluate(Q)(_t);
            var d = Vector.distanceBetween(q, pp1);
            if (d < bestD) {
                bestT = _t;
                bestQ = q;
                bestD = d;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return { t: bestT, p: bestQ, d: bestD };
}



},{"./evaluate":21,"./line-intersection":29,"./normal":30,"flo-vector2d":50}],12:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function deCasteljau(cs, t) {
    // See https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
    function f(t) {
        if (t === 0) {
            return [[cs[0], cs[0], cs[0], cs[0]], cs];
        }
        if (t === 1) {
            return [cs, [cs[3], cs[3], cs[3], cs[3]]];
        }
        var t_ = 1 - t;
        // j === 0, ..., n (with n === 3 -> cubic bezier)
        var b00 = cs[0]; // i === 0 
        var b10 = cs[1]; // i === 1 
        var b20 = cs[2]; // i === 2 
        var b30 = cs[3]; // i === 3 
        // j === 1
        var b01 = b00 * t_ + b10 * t; // i === 0
        var b11 = b10 * t_ + b20 * t; // i === 1
        var b21 = b20 * t_ + b30 * t; // i === 2
        // j === 2
        var b02 = b01 * t_ + b11 * t; // i === 0
        var b12 = b11 * t_ + b21 * t; // i === 1
        // j === 3
        var b03 = b02 * t_ + b12 * t; // i === 0
        return [[b00, b01, b02, b03], [b03, b12, b21, b30]];
    }
    return t === undefined ? f : f(t); // Curry
}
exports.deCasteljau = deCasteljau;



},{}],13:[function(_dereq_,module,exports){
"use strict";
//import * as Vector from 'flo-vector2d';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var draw_elem_1 = _dereq_("./draw-elem/draw-elem");

var BezDebug =
/**
 * @param config - configuration settings.
 * @param fs - some useful functions.
 * @private
 */
function BezDebug(draw, g) {
    _classCallCheck(this, BezDebug);

    //(this as any).Bezier3 = Bezier3; // Included only for quick debugging from console
    //(this as any).Vector2d = Vector; // ...
    this.draw = draw;
    this.g = g;
    //-----------------------------------------------
    // Generated by debug object for later inspection
    //-----------------------------------------------
    this.generated = {
        elems: {
            beziers: [],
            fatLine: [],
            looseBoundingBox: [],
            tightBoundingBox: [],
            extreme: [],
            boundingHull: [],
            intersection: []
        }
    };
    this.fs = {
        draw: draw,
        drawElem: draw_elem_1.drawElemFunctions
    };
};

exports.BezDebug = BezDebug;



},{"./draw-elem/draw-elem":14}],14:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
function fatLine(g, fatLine) {
    var draw = _bez_debug_.fs.draw;
    var l = fatLine.l,
        minD = fatLine.minD,
        maxD = fatLine.maxD;

    var _l = _slicedToArray(l, 2),
        lp1 = _l[0],
        lp2 = _l[1];

    var E = 1024;
    var lv = flo_vector2d_1.fromTo(lp1, lp2);
    var lvTimes10 = [+E * lv[0], +E * lv[1]];
    var reverseLvTimes10 = [-E * lv[0], -E * lv[1]];
    var normal = [-lv[1], lv[0]]; // Rotate by -90 degrees
    var normMin = flo_vector2d_1.toLength(normal, minD);
    var normMax = flo_vector2d_1.toLength(normal, maxD);
    var extLp1 = flo_vector2d_1.translate(lp1, reverseLvTimes10);
    var extLp2 = flo_vector2d_1.translate(lp2, lvTimes10);
    var nl11 = flo_vector2d_1.translate(extLp1, normMin);
    var nl12 = flo_vector2d_1.translate(extLp2, normMin);
    var nl21 = flo_vector2d_1.translate(extLp1, normMax);
    var nl22 = flo_vector2d_1.translate(extLp2, normMax);
    var nl1 = [nl11, nl12];
    var nl2 = [nl21, nl22];
    var $line1 = draw.line(g, nl1);
    var $line2 = draw.line(g, nl2);
    return [].concat(_toConsumableArray($line1), _toConsumableArray($line2));
}
function beziers(g, beziers) {
    var draw = _bez_debug_.fs.draw;
    var $bezier1 = draw.bezier(g, beziers[0], 'blue thin5 nofill');
    var $bezier2 = draw.bezier(g, beziers[1], 'green thin5 nofill');
    var size = getSize([].concat(_toConsumableArray(beziers[0]), _toConsumableArray(beziers[1]))) / 400;
    var $dots = [].concat(_toConsumableArray(draw.dot(g, beziers[0][0], size, 'blue')), _toConsumableArray(draw.dot(g, beziers[0][1], size, 'blue')), _toConsumableArray(draw.dot(g, beziers[0][2], size, 'blue')), _toConsumableArray(draw.dot(g, beziers[0][3], size, 'blue')), _toConsumableArray(draw.dot(g, beziers[1][0], size, 'green')), _toConsumableArray(draw.dot(g, beziers[1][1], size, 'green')), _toConsumableArray(draw.dot(g, beziers[1][2], size, 'green')), _toConsumableArray(draw.dot(g, beziers[1][3], size, 'green')));
    return [].concat(_toConsumableArray($bezier1), _toConsumableArray($bezier2), _toConsumableArray($dots));
}
function getSize(ps) {
    var minX = Number.POSITIVE_INFINITY;
    var minY = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = ps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            if (p[0] < minX) {
                minX = p[0];
            }
            if (p[1] < minY) {
                minY = p[1];
            }
            if (p[0] > maxX) {
                maxX = p[0];
            }
            if (p[1] > maxY) {
                maxY = p[1];
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var width = maxX - minX;
    var height = maxY - minY;
    return Math.max(width, height);
}
function intersection(g, p) {
    var $elems = _bez_debug_.fs.draw.crossHair(g, p, 'red thin5 nofill', 0.05);
    return $elems;
}
function extreme(g, extreme) {
    var $elems = _bez_debug_.fs.draw.crossHair(g, extreme.p, 'red thin10 nofill', 0.05);
    return $elems;
}
function boundingHull(g, hull) {
    var $polygon = _bez_debug_.fs.draw.polygon(g, hull, 'thin5 black nofill');
    return $polygon;
}
function looseBoundingBox(g, box) {
    var $box = _bez_debug_.fs.draw.rect(g, box, 'thin5 brown nofill');
    return $box;
}
function tightBoundingBox(g, box) {
    var $box = _bez_debug_.fs.draw.polygon(g, box, 'thin5 black nofill');
    return $box;
}
var drawElemFunctions = {
    beziers: beziers,
    intersection: intersection,
    extreme: extreme,
    boundingHull: boundingHull,
    looseBoundingBox: looseBoundingBox,
    tightBoundingBox: tightBoundingBox,
    fatLine: fatLine
};
exports.drawElemFunctions = drawElemFunctions;



},{"flo-vector2d":50}],15:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var FatLine = function FatLine(l, minD, maxD) {
    _classCallCheck(this, FatLine);

    this.l = l;
    this.minD = minD;
    this.maxD = maxD;
};

exports.FatLine = FatLine;



},{}],16:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var de_casteljau_1 = _dereq_("./de-casteljau");
function evalDeCasteljau(ps, t) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        x1 = _ps$2[0],
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        x2 = _ps$3[0],
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        x3 = _ps$4[0],
        y3 = _ps$4[1];

    var evX = de_casteljau_1.deCasteljau([x0, x1, x2, x3]);
    var evY = de_casteljau_1.deCasteljau([y0, y1, y2, y3]);
    function f(t) {
        if (t === 0) {
            return [x0, y0];
        } else if (t === 1) {
            return [x3, y3];
        }
        return [evX(t)[1][0], evY(t)[1][0]];
    }
    return t === undefined ? f : f(t);
}
exports.evalDeCasteljau = evalDeCasteljau;



},{"./de-casteljau":12}],17:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var get_dx_1 = _dereq_("./get-dx");
function evaluateDx(ps, t) {
    var dPs = get_dx_1.getDx(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDx = evaluateDx;



},{"./get-dx":25,"flo-poly":42}],18:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var get_dy_1 = _dereq_("./get-dy");
function evaluateDy(ps, t) {
    var dPs = get_dy_1.getDy(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dPs);
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateDy = evaluateDy;



},{"./get-dy":26,"flo-poly":42}],19:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var get_x_1 = _dereq_("./get-x");
function evaluateX(ps, t) {
    var xPs = get_x_1.getX(ps); // Speed optimizing cache
    var evPs = flo_poly_1.default.evaluate(xPs);
    function f(t) {
        if (t === 0) {
            return ps[0][0];
        }
        if (t === 1) {
            return ps[3][0];
        }
        return evPs(t);
    }
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateX = evaluateX;



},{"./get-x":27,"flo-poly":42}],20:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var get_y_1 = _dereq_("./get-y");
function evaluateY(ps, t) {
    var yPs = get_y_1.getY(ps); // Speed optimizing cache
    var evPs = flo_poly_1.default.evaluate(yPs);
    function f(t) {
        if (t === 0) {
            return ps[0][1];
        }
        if (t === 1) {
            return ps[3][1];
        }
        return evPs(t);
    }
    return t === undefined ? f : f(t); // Curry
}
exports.evaluateY = evaluateY;



},{"./get-y":28,"flo-poly":42}],21:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var evaluate_x_1 = _dereq_("./evaluate-x");
var evaluate_y_1 = _dereq_("./evaluate-y");
function evaluate(ps, t) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[3], 2),
        x3 = _ps$2[0],
        y3 = _ps$2[1];

    var evX = evaluate_x_1.evaluateX(ps);
    var evY = evaluate_y_1.evaluateY(ps);
    function f(t) {
        if (t === 0) {
            return [x0, y0];
        } else if (t === 1) {
            return [x3, y3];
        }
        return [evX(t), evY(t)];
    }
    return t === undefined ? f : f(t);
}
exports.evaluate = evaluate;



},{"./evaluate-x":19,"./evaluate-y":20}],22:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var de_casteljau_1 = _dereq_("./de-casteljau");
/**
 * Returns a cubic bezier curve that starts at the given curve's t=0 and ends
 * at the given t parameter. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the resultant bezier should end
 */
/*
function from0ToT(ps: number[][], t: number): number[][] {
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    
    let s  = 1  - t;
    let t2 = t  * t;
    let t3 = t2 * t;
    let s2 = s  * s;
    let s3 = s2 * s;

    return [
        [x0, y0],
        [t*x1  + s*x0, t*y1 + s*y0],
        [t2*x2 + 2*s*t*x1 + s2*x0, t2*y2 + 2*s*t*y1 + s2*y0],
        [t3*x3 + 3*s*t2*x2 + 3*s2*t*x1 + s3*x0,
         t3*y3 + 3*s*t2*y2 + 3*s2*t*y1 + s3*y0]
    ];
}
*/
function from0ToT(ps, t) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        x1 = _ps$2[0],
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        x2 = _ps$3[0],
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        x3 = _ps$4[0],
        y3 = _ps$4[1];

    var xs = [x0, x1, x2, x3];
    var ys = [y0, y1, y2, y3];

    var _de_casteljau_1$deCas = _slicedToArray(de_casteljau_1.deCasteljau(xs, t)[0], 4),
        x0_ = _de_casteljau_1$deCas[0],
        x1_ = _de_casteljau_1$deCas[1],
        x2_ = _de_casteljau_1$deCas[2],
        x3_ = _de_casteljau_1$deCas[3];

    var _de_casteljau_1$deCas2 = _slicedToArray(de_casteljau_1.deCasteljau(ys, t)[0], 4),
        y0_ = _de_casteljau_1$deCas2[0],
        y1_ = _de_casteljau_1$deCas2[1],
        y2_ = _de_casteljau_1$deCas2[2],
        y3_ = _de_casteljau_1$deCas2[3];

    return [[x0_, y0_], [x1_, y1_], [x2_, y2_], [x3_, y3_]];
}
exports.from0ToT = from0ToT;



},{"./de-casteljau":12}],23:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var de_casteljau_1 = _dereq_("./de-casteljau");
/**
 * Returns a cubic bezier curve that starts at the given t parameter and
 * ends at t=1. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the resultant bezier should start
 */
/*
function fromTTo1(ps: number[][], t: number): number[][] {
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    
    let s  = 1  - t;
    let t2 = t  * t;
    let t3 = t2 * t;
    let s2 = s  * s;
    let s3 = s2 * s;

    return [
        [t3*x3 + 3*s*t2*x2 + 3*s2*t*x1 + s3*x0,
         t3*y3 + 3*s*t2*y2 + 3*s2*t*y1 + s3*y0],
        [t2*x3 + 2*t*s*x2 + s2*x1, t2*y3 + 2*t*s*y2 + s2*y1],
        [t*x3 + s*x2, t*y3 + s*y2],
        [x3, y3]
    ];
}
*/
function fromTTo1(ps, t) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        x1 = _ps$2[0],
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        x2 = _ps$3[0],
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        x3 = _ps$4[0],
        y3 = _ps$4[1];

    var xs = [x0, x1, x2, x3];
    var ys = [y0, y1, y2, y3];

    var _de_casteljau_1$deCas = _slicedToArray(de_casteljau_1.deCasteljau(xs, t)[1], 4),
        x0_ = _de_casteljau_1$deCas[0],
        x1_ = _de_casteljau_1$deCas[1],
        x2_ = _de_casteljau_1$deCas[2],
        x3_ = _de_casteljau_1$deCas[3];

    var _de_casteljau_1$deCas2 = _slicedToArray(de_casteljau_1.deCasteljau(ys, t)[1], 4),
        y0_ = _de_casteljau_1$deCas2[0],
        y1_ = _de_casteljau_1$deCas2[1],
        y2_ = _de_casteljau_1$deCas2[2],
        y3_ = _de_casteljau_1$deCas2[3];

    return [[x0_, y0_], [x1_, y1_], [x2_, y2_], [x3_, y3_]];
}
exports.fromTTo1 = fromTTo1;



},{"./de-casteljau":12}],24:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var evaluate_1 = _dereq_("./evaluate");
var from_0_to_T_1 = _dereq_("./from-0-to-T");
var from_T_to_1_1 = _dereq_("./from-T-to-1");
/**
 * Returns a cubic bezier curve that starts at the given curve and ends at the
 * given t parameter. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2*2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t1 - The t parameter where the resultant bezier should start
 * @param t2 - The t parameter where the resultant bezier should end
 */
function fromTo(ps) {
    return function (t1, t2) {
        if (t1 === t2) {
            // Degenerate case
            var p = evaluate_1.evaluate(ps, t1);
            return [p, p, p, p];
        } else if (t1 === 0 && t2 === 1) {
            return ps;
        } else if (t1 === 0) {
            return from_0_to_T_1.from0ToT(ps, t2);
        } else if (t2 === 1) {
            return from_T_to_1_1.fromTTo1(ps, t1);
        }
        var t = from_T_to_1_1.fromTTo1(ps, t1);
        return from_0_to_T_1.from0ToT(t, (t2 - t1) / (1 - t1));
    };
}
exports.fromTo = fromTo;



},{"./evaluate":21,"./from-0-to-T":22,"./from-T-to-1":23}],25:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_memoize_1 = _dereq_("flo-memoize");
var get_x_1 = _dereq_("./get-x");
var memoize = flo_memoize_1.default.m1;
/**
 * Returns the derivative of the power basis representation of the bezier's
 * x-coordinates. This function is memoized on its points parameter by object
 * reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
var getDx = memoize(function (ps) {
  return flo_poly_1.default.differentiate(get_x_1.getX(ps));
});
exports.getDx = getDx;



},{"./get-x":27,"flo-memoize":41,"flo-poly":42}],26:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_memoize_1 = _dereq_("flo-memoize");
var get_y_1 = _dereq_("./get-y");
var memoize = flo_memoize_1.default.m1;
/**
 * Returns the derivative of the power basis representation of the bezier's
 * y-coordinates. This function is memoized on its points parameter by object
 * reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The differentiated power basis polynomial from highest
 * power to lowest, e.g. at^2 + bt + c is returned as [a,b,c]
 */
var getDy = memoize(function (ps) {
  return flo_poly_1.default.differentiate(get_y_1.getY(ps));
});
exports.getDy = getDy;



},{"./get-y":28,"flo-memoize":41,"flo-poly":42}],27:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_memoize_1 = _dereq_("flo-memoize");
var memoize = flo_memoize_1.default.m1;
/**
 * Returns the power basis representation of the bezier's x-coordinates.
 * This function is memoized on its points parameter by object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The power basis polynomial from highest power to lowest,
 * e.g. at^3 + bt^2 + ct + d is returned as [a,b,c,d]
 */
var getX = memoize(function (ps) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 1),
        x0 = _ps$[0],
        _ps$2 = _slicedToArray(_ps[1], 1),
        x1 = _ps$2[0],
        _ps$3 = _slicedToArray(_ps[2], 1),
        x2 = _ps$3[0],
        _ps$4 = _slicedToArray(_ps[3], 1),
        x3 = _ps$4[0];

    return [x3 - 3 * x2 + 3 * x1 - x0, 3 * x2 - 6 * x1 + 3 * x0, 3 * x1 - 3 * x0, x0];
});
exports.getX = getX;



},{"flo-memoize":41}],28:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_memoize_1 = _dereq_("flo-memoize");
var memoize = flo_memoize_1.default.m1;
/**
 * Returns the power basis representation of the bezier's y-coordinates.
 * This function is memoized on its points parameter by object reference.
 * @param ps - A bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
var getY = memoize(function (ps) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        y3 = _ps$4[1];

    return [y3 - 3 * y2 + 3 * y1 - y0, 3 * y2 - 6 * y1 + 3 * y0, 3 * y1 - 3 * y0, y0];
});
exports.getY = getY;



},{"flo-memoize":41}],29:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var get_y_1 = _dereq_("./get-y");
/**
 * Returns the bezier t values of the intersection between the given cubic
 * bezier and the given line.
 * @param ps - The bezier curve
 * @param l - The line given as a start and end point
 */
function lineIntersection(ps, l) {
    var _l = _slicedToArray(l, 2),
        _l$ = _slicedToArray(_l[0], 2),
        x0 = _l$[0],
        y0 = _l$[1],
        _l$2 = _slicedToArray(_l[1], 2),
        x1 = _l$2[0],
        y1 = _l$2[1];

    var x = x1 - x0,
        y = y1 - y0;

    if (x === 0 && y === 0) {
        return [];
    } // It is not a line, it's a point. 
    // Move the line and the bezier together so the line's first point is on the
    // origin.
    ps = flo_vector2d_1.translatePs([-x0, -y0], ps);
    // Rotate the bezier and line together so the line is y=0.
    var len = Math.sqrt(x * x + y * y);
    var sinθ = y / len;
    var cosθ = x / len;
    ps = flo_vector2d_1.rotatePs(-sinθ, cosθ, ps);
    // Find the intersection t values
    return flo_poly_1.default.allRoots(get_y_1.getY(ps), 0, 1);
}
exports.lineIntersection = lineIntersection;



},{"./get-y":28,"flo-poly":42,"flo-vector2d":50}],30:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tangent_1 = _dereq_("./tangent");
function normal(ps, t) {
    var tanPs = tangent_1.tangent(ps);
    function f(t) {
        var v = tanPs(t);
        return [v[1], -v[0]];
    }
    // Curry
    return t === undefined ? f : f(t);
}
exports.normal = normal;



},{"./tangent":31}],31:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var evaluate_dx_1 = _dereq_("./evaluate-dx");
var evaluate_dy_1 = _dereq_("./evaluate-dy");
function tangent(ps, t) {
    var evDx = evaluate_dx_1.evaluateDx(ps);
    var evDy = evaluate_dy_1.evaluateDy(ps);
    function f(t) {
        var dx = evDx(t);
        var dy = evDy(t);
        var d = Math.sqrt(dx * dx + dy * dy);
        return [dx / d, dy / d];
    }
    // Curry
    return t === undefined ? f : f(t);
}
exports.tangent = tangent;



},{"./evaluate-dx":17,"./evaluate-dy":18}],32:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the hybrid quadratic version of the given cubic bezier. For a
 * definition of hybrid quadratic bezier curves see <a href="http://scholarsarchive.byu.edu/cgi/viewcontent.cgi?article=2206&context=etd">
 * this paper</a>.
 * @param ps - A cubic bezier curve.
 * @returns An array of three quadratic bezier points where the
 * middle point is a 'hybrid' point represented as a line (itself represented
 * by two points (a linear bezier curve)) which can be evaluated at a different
 * t value (call it th). If evaluated at the same t value the result is the same
 * as evaluating the original cubic bezier at t. The set generated by evaluating
 * the hybrid quadratic curve for all (t,th) value pairs forms a geometric area
 * bound around the orginal cubic bezier curve. The length of the linear bezier
 * curve mentioned above is a measure of how closely the cubic can be
 * represented as a quadratic bezier curve.
 */
function toHybridQuadratic(ps) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        x1 = _ps$2[0],
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        x2 = _ps$3[0],
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        x3 = _ps$4[0],
        y3 = _ps$4[1];

    return [[x0, y0], [[(3 * x1 - x0) / 2, (3 * y1 - y0) / 2], [(3 * x2 - x3) / 2, (3 * y2 - y3) / 2]], [x3, y3] // evaluated at t
    ];
}
exports.toHybridQuadratic = toHybridQuadratic;



},{}],33:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var get_x_1 = _dereq_("./get-x");
/**
 * Returns the bezier t values of the intersection between the given cubic
 * bezier and the given vertical line.
 * @param ps - The bezier curve
 * @param y - The y value of the horizontal line
 */
function tsAtX(ps, x) {
  // Translate ps so that x = 0.
  ps = ps.map(function (p) {
    return [p[0] - x, p[1]];
  });
  // Find the intersection t values
  return flo_poly_1.default.allRoots(get_x_1.getX(ps), 0, 1);
}
exports.tsAtX = tsAtX;



},{"./get-x":27,"flo-poly":42}],34:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var get_y_1 = _dereq_("./get-y");
/**
 * Returns the bezier t values of the intersection between the given cubic
 * bezier and the given horizontal line.
 * @param ps - The bezier curve
 * @param y - The y value of the horizontal line
 */
function tsAtY(ps, y) {
  // Translate ps so that y = 0.
  ps = ps.map(function (p) {
    return [p[0], p[1] - y];
  });
  // Find the intersection t values
  return flo_poly_1.default.allRoots(get_y_1.getY(ps), 0, 1);
}
exports.tsAtY = tsAtY;



},{"./get-y":28,"flo-poly":42}],35:[function(_dereq_,module,exports){
"use strict";
// TODO A future improvement can be to use the Gauss–Kronrod rules
// to estimate the error and thus choose a number of constants based
// on the error.
// TODO In future, the constants can be calculated and cached so we can
// chooce any value for the order.

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * <p>
 * Integrates the given function using the Gaussian Quadrature method.
 * </p>
 * <p>
 * See https://en.wikipedia.org/wiki/Gaussian_quadrature
 * </p>
 * <p>
 * See http://pomax.github.io/bezierinfo/#arclength
 * </p>
 * @param f - The univariate function to be integrated
 * @param interval - The integration interval
 * @param order - Can be 2, 4, 8, or 16. Higher values give
 * more accurate results but is slower - defaults to 16.
 */
function gaussQuadrature(f, interval) {
    var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;

    if (interval[0] === interval[1]) {
        return 0;
    }
    var _GAUSS_CONSTANTS$orde = GAUSS_CONSTANTS[order],
        weights = _GAUSS_CONSTANTS$orde.weights,
        abscissas = _GAUSS_CONSTANTS$orde.abscissas;

    var _interval = _slicedToArray(interval, 2),
        a = _interval[0],
        b = _interval[1];

    var result = 0;
    var m1 = (b - a) / 2;
    var m2 = (b + a) / 2;
    for (var i = 0; i <= order - 1; i++) {
        result += weights[i] * f(m1 * abscissas[i] + m2);
    }
    return m1 * result;
}
// The Gaussian Legendre Quadrature method constants. 
var GAUSS_CONSTANTS = {
    2: {
        weights: [1, 1],
        abscissas: [-0.5773502691896257, 0.5773502691896257]
    },
    4: {
        weights: [0.6521451548625461, 0.6521451548625461, 0.3478548451374538, 0.3478548451374538],
        abscissas: [-0.3399810435848563, 0.3399810435848563, -0.8611363115940526, 0.8611363115940526]
    },
    8: {
        weights: [0.3626837833783620, 0.3626837833783620, 0.3137066458778873, 0.3137066458778873, 0.2223810344533745, 0.2223810344533745, 0.1012285362903763, 0.1012285362903763],
        abscissas: [-0.1834346424956498, 0.1834346424956498, -0.5255324099163290, 0.5255324099163290, -0.7966664774136267, 0.7966664774136267, -0.9602898564975363, 0.9602898564975363]
    },
    // Taken from http://keisan.casio.com/exec/system/1330940731
    16: {
        abscissas: [-0.989400934991649932596, -0.944575023073232576078, -0.86563120238783174388, -0.7554044083550030338951, -0.6178762444026437484467, -0.4580167776572273863424, -0.28160355077925891323, -0.0950125098376374401853, 0.0950125098376374401853, 0.28160355077925891323, 0.4580167776572273863424, 0.617876244402643748447, 0.755404408355003033895, 0.8656312023878317438805, 0.944575023073232576078, 0.989400934991649932596],
        weights: [0.0271524594117540948518, 0.062253523938647892863, 0.0951585116824927848099, 0.1246289712555338720525, 0.1495959888165767320815, 0.169156519395002538189, 0.182603415044923588867, 0.189450610455068496285, 0.1894506104550684962854, 0.182603415044923588867, 0.1691565193950025381893, 0.149595988816576732081, 0.124628971255533872053, 0.095158511682492784809, 0.062253523938647892863, 0.027152459411754094852]
    }
};
exports.default = gaussQuadrature;

},{}],36:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = _dereq_("flo-vector2d");
const DELTA = 1e-10;
/**
 * Performs a functional stable sort on the given array and
 * returns the newly sorted array.
 * @ignore
 */
function stableSort(arr, f) {
    let indxArray = [];
    for (let i = 0; i < arr.length; i++) {
        indxArray.push(i);
    }
    indxArray.sort(function (a, b) {
        let res = f(arr[a], arr[b]);
        if (res !== 0) {
            return res;
        }
        return a - b;
    });
    let sorted = [];
    for (let i = 0; i < arr.length; i++) {
        sorted.push(arr[indxArray[i]]);
    }
    return sorted;
}
/**
 * In-place swap two elements in the given array.
 * @ignore
 */
function swap(arr, a, b) {
    if (a === b) {
        return;
    }
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
/**
 * @private
 */
function getSmallestIndxYThenX(ps) {
    let smallest = [
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY
    ];
    let smallestI;
    for (let i = 0; i < ps.length; i++) {
        let y = ps[i][1];
        if ((y < smallest[1]) ||
            (y === smallest[1] && ps[i][0] < smallest[0])) {
            smallestI = i;
            smallest = ps[i];
        }
    }
    return smallestI;
}
/**
 * <p>
 * Finds the convex hull of the given set of 2d points using the
 * Graham Scan algorithm and returns the hull as an array of points.
 * </p>
 * <p>
 * See https://en.wikipedia.org/wiki/Graham_scan
 * </p>
 * @param ps_ - A set of points
 * @param includeAllBoundaryPoints - Set this to true to if all boundary points
 * should be returned, even redundant ones - defaults to false
 * @param delta - Tolerance at which three points are considered collinear -
 * defaults to 1e-10
 */
function grahamScan(ps_, includeAllBoundaryPoints = false, delta = DELTA) {
    includeAllBoundaryPoints = !!includeAllBoundaryPoints;
    function fail(p1, p2, p3) {
        let res = flo_vector2d_1.default.ccw(p1, p2, p3, delta);
        if (includeAllBoundaryPoints) {
            return res < 0;
        }
        return res <= 0;
    }
    let ps = ps_.slice();
    let n = ps.length;
    let idx = getSmallestIndxYThenX(ps);
    let [p] = ps.splice(idx, 1);
    ps = stableSort(ps, function (a, b) {
        let res = flo_vector2d_1.default.cross(flo_vector2d_1.default.fromTo(p, b), flo_vector2d_1.default.fromTo(p, a));
        res = Math.abs(res) < delta ? 0 : res;
        if (res !== 0) {
            return res;
        }
        res = a[1] - b[1];
        res = Math.abs(res) < delta ? 0 : res;
        if (res !== 0) {
            return res;
        }
        return a[0] - b[0];
    });
    ps.unshift(p);
    let m = 1;
    for (let i = 2; i < n; i++) {
        while (fail(ps[m - 1], ps[m], ps[i])) {
            if (m > 1) {
                m -= 1;
                continue;
            }
            else if (i === n - 1) {
                m -= 1;
                break;
            }
            else {
                i += 1;
            }
        }
        m += 1;
        swap(ps, m, i);
    }
    return ps.slice(0, m + 1);
}
exports.default = grahamScan;

},{"flo-vector2d":50}],37:[function(_dereq_,module,exports){
"use strict";
/*
 * Concise, Destructive, Left Leaning Red Black Tree implementation.
 * See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
 * See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var tree_node_1 = _dereq_("./src/tree-node");
var tree_node_color_1 = _dereq_("./src/tree-node-color");
var tree_node_direction_1 = _dereq_("./src/tree-node-direction");
function isRed(node) {
    return node && node.color === tree_node_color_1.default.RED;
}
/**
 * @param compare
 * @param datas
 * @param replaceDups - If true then if a duplicate is
 * inserted (as per the equivalence relation induced by the compare)
 * then replace it. If false then keep an array of values at the relevant
 * node.
 */

var LlRbTree = function () {
    function LlRbTree(compare, datas, replaceDups) {
        _classCallCheck(this, LlRbTree);

        this.getMinNode = this.getMinOrMaxNode(tree_node_direction_1.default.LEFT);
        this.getMaxNode = this.getMinOrMaxNode(tree_node_direction_1.default.RIGHT);
        var tree = this;
        tree.setComparator(compare, replaceDups);
        tree.replaceDups = replaceDups;
        tree.root = null;
        if (!datas) {
            return;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = datas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var data = _step.value;

                tree.insert(data);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    /**
     * Destructively sets the tree compare. This function can be used for for e.g.
     * the Bentley Ottmann algorithm.
     */


    _createClass(LlRbTree, [{
        key: "setComparator",
        value: function setComparator(compare, replaceDups) {
            if (replaceDups) {
                this.compare = compare;
            } else {
                this.compare = function (a, b) {
                    return compare(a, b[0]);
                };
            }
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return !this.root;
        }
        /**
         * Find the node in the tree with the given data using the tree compare
         * function.
         * @returns {Node} node or null if not found.
         */

    }, {
        key: "find",
        value: function find(data) {
            var tree = this;
            var node = this.root;
            while (node) {
                var c = tree.compare(data, node.data);
                if (c === 0) {
                    return node;
                } else {
                    node = node[c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
                }
            }
            return null;
        }
        /**
         * .
         */

    }, {
        key: "toArrayInOrder",
        value: function toArrayInOrder() {
            var nodes = [];
            f(this.root);
            function f(node) {
                if (!node) {
                    return;
                }
                f(node[tree_node_direction_1.default.LEFT]);
                nodes.push(node);
                f(node[tree_node_direction_1.default.RIGHT]);
            }
            return nodes;
        }
        /**
         * Inserts a node with the given data into the tree.
         */

    }, {
        key: "insert",
        value: function insert(data) {
            var tree = this;
            tree.root = f(tree.root, data);
            tree.root.color = tree_node_color_1.default.BLACK;
            tree.root.parent = undefined;
            function f(h, data) {
                if (!h) {
                    return new tree_node_1.default(data, !tree.replaceDups);
                }
                var c = tree.compare(data, h.data);
                if (c === 0) {
                    if (tree.replaceDups) {
                        h.data = data;
                    } else {
                        h.data.push(data);
                    }
                } else {
                    var dir = c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT;
                    h[dir] = f(h[dir], data);
                    h[dir].parent = h;
                }
                if (isRed(h[tree_node_direction_1.default.RIGHT]) && !isRed(h[tree_node_direction_1.default.LEFT])) {
                    h = rotate(tree_node_direction_1.default.LEFT, h);
                }
                if (isRed(h[tree_node_direction_1.default.LEFT]) && isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
                    h = rotate(tree_node_direction_1.default.RIGHT, h);
                }
                if (isRed(h[tree_node_direction_1.default.LEFT]) && isRed(h[tree_node_direction_1.default.RIGHT])) {
                    flipColors(h);
                }
                return h;
            }
        }
        /**
         * Removes an item from the tree based on the given data.
         * @param {LlRbTree} tree
         * @param {*} data
         * @param {boolean} all - If the data is an array, remove all.
         */

    }, {
        key: "remove",
        value: function remove(data, all) {
            var tree = this;
            tree.root = f(tree.root, data);
            if (tree.root) {
                tree.root.color = tree_node_color_1.default.BLACK;
                tree.root.parent = undefined;
            }
            function f(h, data) {
                //let h = h_;
                var c = tree.compare(data, h.data);
                if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                    removeFromArray(data, h.data);
                    return h;
                }
                if (c < 0 && !h[tree_node_direction_1.default.LEFT] || c > 0 && !h[tree_node_direction_1.default.RIGHT]) {
                    return h;
                }
                if (c < 0) {
                    if (!isRed(h[tree_node_direction_1.default.LEFT]) && !isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
                        h = moveRedLeft(h);
                    }
                    h[tree_node_direction_1.default.LEFT] = f(h[tree_node_direction_1.default.LEFT], data);
                    if (h[tree_node_direction_1.default.LEFT]) {
                        h[tree_node_direction_1.default.LEFT].parent = h;
                    }
                    return fixUp(h);
                }
                if (isRed(h[tree_node_direction_1.default.LEFT])) {
                    h = rotate(tree_node_direction_1.default.RIGHT, h);
                    c = tree.compare(data, h.data);
                    if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                        removeFromArray(data, h.data);
                        return h;
                    }
                }
                if (c === 0 && !h[tree_node_direction_1.default.RIGHT]) {
                    return null;
                }
                if (!isRed(h[tree_node_direction_1.default.RIGHT]) && !isRed(h[tree_node_direction_1.default.RIGHT][tree_node_direction_1.default.LEFT])) {
                    h = moveRedRight(h);
                    c = tree.compare(data, h.data);
                    if (!tree.replaceDups && c === 0 && !all && h.data.length > 1) {
                        removeFromArray(data, h.data);
                        return h;
                    }
                }
                if (c === 0) {
                    h.data = tree.min(h[tree_node_direction_1.default.RIGHT]);
                    h[tree_node_direction_1.default.RIGHT] = removeMin(h[tree_node_direction_1.default.RIGHT]);
                } else {
                    h[tree_node_direction_1.default.RIGHT] = f(h[tree_node_direction_1.default.RIGHT], data);
                }
                if (h[tree_node_direction_1.default.RIGHT]) {
                    h[tree_node_direction_1.default.RIGHT].parent = h;
                }
                return fixUp(h);
            }
        }
        /**
         * Returns the two ordered nodes bounding the data. If the
         * data falls on a node, that node and the next (to the right) is
         * returned.
         * @returns {Node[]}
         */

    }, {
        key: "findBounds",
        value: function findBounds(data) {
            var tree = this;
            var node = tree.root;
            var bounds = [undefined, undefined];
            if (node === null) {
                return bounds;
            }
            while (node) {
                var c = tree.compare(data, node.data);
                if (c >= 0) {
                    bounds[0] = node;
                } else {
                    bounds[1] = node;
                }
                node = node[c >= 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
            }
            return bounds;
        }
        /**
         * @param {LlRbTree} tree
         * @param {*} data
         * @returns {Node[]} The two ordered nodes bounding the data. If the
         * data falls on a node, returns the nodes before and after this one.
         */

    }, {
        key: "findBoundsExcl",
        value: function findBoundsExcl(data) {
            var tree = this;
            var node = tree.root;
            var bounds = [undefined, undefined];
            if (node === null) {
                return bounds;
            }
            f(node);
            function f(node) {
                while (node) {
                    var c = tree.compare(data, node.data);
                    if (c === 0) {
                        // Search on both sides
                        f(node[tree_node_direction_1.default.LEFT]);
                        f(node[tree_node_direction_1.default.RIGHT]);
                        return;
                    }
                    if (c > 0) {
                        bounds[0] = node;
                    } else if (c < 0) {
                        bounds[1] = node;
                    }
                    node = node[c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
                }
            }
            return bounds;
        }
        /**
         *
         */

    }, {
        key: "findAllInOrder",
        value: function findAllInOrder(data) {
            var tree = this;
            var nodes = [];
            f(tree.root);
            function f(node) {
                while (node) {
                    var c = tree.compare(data, node.data);
                    if (c === 0) {
                        f(node[tree_node_direction_1.default.LEFT]);
                        nodes.push(node);
                        f(node[tree_node_direction_1.default.RIGHT]);
                        return;
                    }
                    node = node[c > 0 ? tree_node_direction_1.default.RIGHT : tree_node_direction_1.default.LEFT];
                }
            }
            return nodes;
        }
    }, {
        key: "getMinOrMaxNode",
        value: function getMinOrMaxNode(dir) {
            return function (node) {
                if (!node) {
                    return undefined;
                }
                while (node[dir]) {
                    node = node[dir];
                }
                return node;
            };
        }
    }, {
        key: "min",
        value: function min(node) {
            return this.getMinNode(node).data;
        }
    }, {
        key: "max",
        value: function max(node) {
            return this.getMaxNode(node).data;
        }
    }]);

    return LlRbTree;
}();
/**
 * Removes the data from the tuple using ===.
 * Note this function uses === and not the compare function!
 */


function removeFromArray(elem, arr) {
    var index = arr.indexOf(elem);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
/**
 * Destructively rotates the given node, say h, in the
 * given direction as far as tree rotations go.
 * @param {boolean} dir true -> right, false -> left
 * @param {Node} h
 * @returns The node that is at the top after the rotation.
 */
function rotate(dir, h) {
    var otherDir = dir ? tree_node_direction_1.default.LEFT : tree_node_direction_1.default.RIGHT;
    var x = h[otherDir];
    h[otherDir] = x[dir];
    if (x[dir]) {
        x[dir].parent = h;
    }
    x[dir] = h;
    h.parent = x;
    x.color = h.color;
    h.color = tree_node_color_1.default.RED;
    return x;
}
function removeMin(h) {
    if (!h[tree_node_direction_1.default.LEFT]) {
        return null;
    }
    if (!isRed(h[tree_node_direction_1.default.LEFT]) && !isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
        h = moveRedLeft(h);
    }
    h[tree_node_direction_1.default.LEFT] = removeMin(h[tree_node_direction_1.default.LEFT]);
    if (h[tree_node_direction_1.default.LEFT]) {
        h[tree_node_direction_1.default.LEFT].parent = h;
    }
    return fixUp(h);
}
function flipColor(color) {
    return color === tree_node_color_1.default.RED ? tree_node_color_1.default.BLACK : tree_node_color_1.default.RED;
}
/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors.
 * @param {Node} h
 */
function flipColors(h) {
    h.color = flipColor(h.color);
    h[tree_node_direction_1.default.LEFT].color = flipColor(h[tree_node_direction_1.default.LEFT].color);
    h[tree_node_direction_1.default.RIGHT].color = flipColor(h[tree_node_direction_1.default.RIGHT].color);
}
/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedLeft(h) {
    flipColors(h);
    if (isRed(h[tree_node_direction_1.default.RIGHT][tree_node_direction_1.default.LEFT])) {
        var a = rotate(tree_node_direction_1.default.RIGHT, h[tree_node_direction_1.default.RIGHT]);
        h[tree_node_direction_1.default.RIGHT] = a;
        a.parent = h;
        h = rotate(tree_node_direction_1.default.LEFT, h);
        flipColors(h);
    }
    return h;
}
/**
 * @description
 * @param h
 * @returns The node that is at the top after the move.
 */
function moveRedRight(h) {
    flipColors(h);
    if (isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
        h = rotate(tree_node_direction_1.default.RIGHT, h);
        flipColors(h);
    }
    return h;
}
/**
 * @description Fix right-leaning red nodes.
 * @returns The node that is at the top after the fix.
 */
function fixUp(h) {
    if (isRed(h[tree_node_direction_1.default.RIGHT])) {
        h = rotate(tree_node_direction_1.default.LEFT, h);
    }
    if (isRed(h[tree_node_direction_1.default.LEFT]) && isRed(h[tree_node_direction_1.default.LEFT][tree_node_direction_1.default.LEFT])) {
        h = rotate(tree_node_direction_1.default.RIGHT, h);
    }
    // Split 4-nodes.
    if (isRed(h[tree_node_direction_1.default.LEFT]) && isRed(h[tree_node_direction_1.default.RIGHT])) {
        flipColors(h);
    }
    return h;
}
exports.default = LlRbTree;

},{"./src/tree-node":40,"./src/tree-node-color":38,"./src/tree-node-direction":39}],38:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeNodeColor;
(function (TreeNodeColor) {
    TreeNodeColor[TreeNodeColor["BLACK"] = 0] = "BLACK";
    TreeNodeColor[TreeNodeColor["RED"] = 1] = "RED";
})(TreeNodeColor || (TreeNodeColor = {}));
exports.default = TreeNodeColor;

},{}],39:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeNodeDirection;
(function (TreeNodeDirection) {
    TreeNodeDirection[TreeNodeDirection["LEFT"] = 0] = "LEFT";
    TreeNodeDirection[TreeNodeDirection["RIGHT"] = 1] = "RIGHT";
})(TreeNodeDirection || (TreeNodeDirection = {}));
exports.default = TreeNodeDirection;

},{}],40:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var tree_node_color_1 = _dereq_("./tree-node-color");
/**
 * Red Black Tree node.
 * @constructor
 * @param {*} data
 */

var TreeNode = function TreeNode(data, asArray) {
    _classCallCheck(this, TreeNode);

    if (asArray) {
        this.data = [data];
    } else {
        this.data = data;
    }
    this.color = tree_node_color_1.default.RED;
};

exports.default = TreeNode;

},{"./tree-node-color":38}],41:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SUPPORTED = typeof WeakMap === 'function';
/**
 * Memoize the given arity 1 function.
 */
function m1(f) {
    if (!SUPPORTED) {
        return f;
    }
    var results = new WeakMap();
    return function (a) {
        var result = results.get(a);
        if (result !== undefined) {
            //console.log('cache hit');
            return result;
        }
        //console.log('cache miss');
        result = f(a);
        results.set(a, result);
        return result;
    };
}
var Memoize = { m1: m1 };
exports.default = Memoize;

},{}],42:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_operators_1 = _dereq_("./src/core-operators");
var root_operators_1 = _dereq_("./src/root-operators");
var root_bounds_1 = _dereq_("./src/root-bounds");
var all_roots_recursive_1 = _dereq_("./src/all-roots-recursive");
var random_1 = _dereq_("./src/random");
var error_analysis_1 = _dereq_("./src/error-analysis");
var from_roots_1 = _dereq_("./src/from-roots");
var multiply = core_operators_1.default.multiply;
/**
* Simple & fast practical library functions for functional univariate
* polynomials over the reals (actually ECMAScript numbers, i.e. double
* floats).
*
* All polinomials are represented as a simple array starting with the
* highest non-zero power, e.g.
*   3x^3 + 5x^2 + 7x + 2 -> [3,5,7,2]
*
* @ignore
*/
var FloPoly = Object.assign({}, core_operators_1.default, root_operators_1.default, root_bounds_1.default, error_analysis_1.default, { random: random_1.default,
    fromRoots: from_roots_1.default,
    allRoots: all_roots_recursive_1.default });
exports.default = FloPoly;

},{"./src/all-roots-recursive":43,"./src/core-operators":44,"./src/error-analysis":45,"./src/from-roots":46,"./src/random":47,"./src/root-bounds":48,"./src/root-operators":49}],43:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_operators_1 = _dereq_("./core-operators");
var root_operators_1 = _dereq_("./root-operators");
var root_bounds_1 = _dereq_("./root-bounds");
var _core_operators_1$def = core_operators_1.default,
    clip0 = _core_operators_1$def.clip0,
    evaluate = _core_operators_1$def.evaluate,
    differentiate = _core_operators_1$def.differentiate,
    toCasStr = _core_operators_1$def.toCasStr;
var _root_operators_1$def = root_operators_1.default,
    brent = _root_operators_1$def.brent,
    quadraticRoots = _root_operators_1$def.quadraticRoots;
var _root_bounds_1$defaul = root_bounds_1.default,
    rootMagnitudeUpperBound_fujiwara = _root_bounds_1$defaul.rootMagnitudeUpperBound_fujiwara,
    positiveRootUpperBound_LMQ = _root_bounds_1$defaul.positiveRootUpperBound_LMQ,
    positiveRootLowerBound_LMQ = _root_bounds_1$defaul.positiveRootLowerBound_LMQ,
    negativeRootUpperBound_LMQ = _root_bounds_1$defaul.negativeRootUpperBound_LMQ,
    negativeRootLowerBound_LMQ = _root_bounds_1$defaul.negativeRootLowerBound_LMQ;

var INF = Number.POSITIVE_INFINITY;
/**
 * <p>Finds a near optimal approximation to the real roots (or those
 * within a range) of the input polynomial.
 * </p>
 * <p>
 * Only multiple roots of even order that is very close together may be
 * missed. (This is rarely a problem in practice - in a geometrical
 * application, for instance, this may mean two objects are barely
 * touching and returning either, all, or none of the repeated even
 * roots should not break the algorithm).
 * </p>
 * @param p - The polynomial
 * @param a - Lower limit of root values that should be returned -
 * defaults to -∞
 * @param b - Upper limit of root values that should be returned -
 * defaults to +∞
 * @example
 * FloPoly.allRoots([1, -10, 35, -50, 24]); //=> [1, 2.0000000000000036, 3.0000000000000067, 4]
 */
function allRoots(p) {
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -INF;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : +INF;

    p = clip0(p);
    var d = p.length - 1;
    var rangeFilter = inRange(a, b);
    if (d === 2) {
        return quadraticRoots(p).filter(rangeFilter);
        // Investigate if any numerically stable algorithm could be as fast
        // as this algorithm (i.e by finding cubic roots within quadratic
        // root demarcated intervals via Brent's method. The cubicRoots 
        // algoritm below has been removed since it was numerically 
        // unstable.
        /*} else if (d === 3) {
            return cubicRoots(p)
                .filter(rangeFilter)
                .sort((a,b) => a-b)
        } else if (d > 3) {*/
    } else if (d > 2) {
        // TODO The root bounding function below might have an impact on 
        // performance - it would probably be better to use 
        // positiveRootUpperBound_LMQ or (possibly) even better, the 
        // linear version of it (see paper of Viglas, Akritas and 
        // Strzebonski) and re-calculate bounds on every iteration.
        var lowerBound = void 0;
        var upperBound = void 0;
        if (a === -INF || b === +INF) {
            //let magnitudeBound = rootMagnitudeUpperBound_fujiwara(p);
            //lowerBound = a === -INF ? -magnitudeBound : a;
            //upperBound = b === +INF ? +magnitudeBound : b;
            if (a === -INF) {
                lowerBound = negativeRootLowerBound_LMQ(p);
            } else {
                lowerBound = a;
            }
            if (b === +INF) {
                upperBound = positiveRootUpperBound_LMQ(p);
            } else {
                upperBound = b;
            }
        } else {
            lowerBound = a;
            upperBound = b;
        }
        // If the roots of the differentiated polynomial is out of range 
        // then the roots of the polynomial itself will also be out of 
        // range.
        var dp = differentiate(p);
        var roots = allRoots(dp, lowerBound, upperBound).filter(rangeFilter);
        if (roots[0] !== lowerBound) {
            // For code coverage to cover the 'else' case we would need
            // to find a case where the lower bound actually matches the
            // root which would be very rare - needs further 
            // investigation.
            // Not an actual root.
            roots.unshift(lowerBound);
        }
        if (roots[roots.length - 1] !== upperBound) {
            // Not an actual root.
            roots.push(upperBound);
        }
        return rootsWithin(p, roots);
    } else if (d === 1) {
        // Less likely so put near bottom (micro optimization)
        return [-p[1] / p[0]].filter(rangeFilter);
    } else if (d === 0) {
        return []; // y = c -> no roots	
    }
    // Least likely so put at bottom (micro optimization)
    // d === -1
    // y = 0 -> infinite number of roots
    return [];
}
/**
 * Returns a function that returns true if x is in the range [a,b].
 * @param a
 * @param b
 * @private
 */
function inRange(a, b) {
    return function (x) {
        return x >= a && x <= b;
    };
}
/**
 * Finds all roots of the given polynomial within the given intervals.
 * @private
 * @param p
 * @param intervals
 */
function rootsWithin(p, intervals) {
    var roots = [];
    var peval = evaluate(p);
    var prevRoot = void 0;
    var a = intervals[0];
    for (var i = 1; i < intervals.length; i++) {
        var root = void 0;
        var b = intervals[i];
        var evA = peval(a);
        var evB = peval(b);
        var k = evA * evB;
        if (k === 0) {
            if (evA === 0) {
                root = a;
            } else if (evB === 0 && i === intervals.length - 1) {
                root = b;
            }
        } else if (evA * evB < 0) {
            root = brent(peval, a, b);
        }
        // Add root if it exists and suppress exact duplicates
        if (root !== undefined && root !== prevRoot) {
            roots.push(root);
            prevRoot = root;
        }
        a = b;
    }
    return roots;
}
exports.default = allRoots;

},{"./core-operators":44,"./root-bounds":48,"./root-operators":49}],44:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if two polynomials are exactly equal by comparing
 * coefficients.
 * @param p1 - A polynomial
 * @param p2 - Another polynomial
 * @example
 * FloPoly.equal([1,2,3,4], [1,2,3,4]);   //=> true
 * FloPoly.equal([1,2,3,4], [1,2,3,4,5]); //=> false
 */
function equal(p1, p2) {
    if (p1.length !== p2.length) {
        return false;
    }
    for (var i = 0; i < p1.length; i++) {
        if (p1[i] !== p2[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Adds two polynomials.
 * @param p1 - The first polynomial
 * @param p2 - The second polynomial
 * @example
 * FloPoly.add([1,2,3],[3,4]); //=> [1,5,7]
 */
function add(p1, p2) {
    // Initialize result array  
    var d1 = p1.length - 1;
    var d2 = p2.length - 1;
    var Δd = d1 - d2;
    var Δd1 = 0;
    var Δd2 = 0;
    if (Δd > 0) {
        Δd2 = -Δd;
    } else if (Δd < 0) {
        Δd1 = +Δd;
    }
    var d = Math.max(d1, d2);
    // Add coefficients
    var result = [];
    for (var i = 0; i < d + 1; i++) {
        var c1 = p1[i + Δd1];
        var c2 = p2[i + Δd2];
        result.push((c1 || 0) + (c2 || 0));
    }
    // Ensure the result is a valid polynomial representation
    return clip0(result);
}
/**
 * Subtracts the second polynomial from first (p1 - p2).
 * @param p1 - The polynomial from which will be subtracted
 * @param p2 - The polynomial that will be subtracted
 * @example
 * FloPoly.subtract([2,3],[4,4]); //=> [-2, -1]
 */
function subtract(p1, p2) {
    // Initialize result array  
    var d1 = p1.length - 1;
    var d2 = p2.length - 1;
    var Δd = d1 - d2;
    var Δd1 = 0;
    var Δd2 = 0;
    if (Δd > 0) {
        Δd2 = -Δd;
    } else if (Δd < 0) {
        Δd1 = +Δd;
    }
    var d = Math.max(d1, d2);
    // Add coefficients
    var result = [];
    for (var i = 0; i < d + 1; i++) {
        var c1 = p1[i + Δd1];
        var c2 = p2[i + Δd2];
        result.push((c1 || 0) - (c2 || 0));
    }
    // Ensure the result is a valid polynomial representation
    return clip0(result);
}
/**
 * Negate the given polynomial (p -> -p).
 * @param p - The polynomial
 * @example
 * FloPoly.negate([0.1, -0.2]); //=> [-0.1, 0.2]
 */
function negate(p) {
    return multiplyByConst(-1, p);
}
/**
 * Differentiates the given polynomial.
 * @param p - The polynomial
 * @example
 * FloPoly.differentiate([5, 4, 3, 2, 1]); //=> [20, 12, 6, 2]
 */
function differentiate(p) {
    var result = [];
    var d = p.length - 1;
    for (var i = 0; i < d; i++) {
        result.push((d - i) * p[i]);
    }
    return result;
}
/**
 * <p>
 * Multiplies the two given polynomials and returns the result.
 * </p>
 * <p>
 * See <a href="https://en.wikipedia.org/wiki/Polynomial_arithmetic">polynomial arithmetic</a>
 * </p>
 * <p>
 * See <a href="https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Polynomial_multiplication">polynomial multiplication</a>
 * </p>
 * <p>
 * See <a herf="http://web.cs.iastate.edu/~cs577/handouts/polymultiply.pdf">polynomial multiplication (pdf)</a>
 * </p>
 * @param p1 - The one polynomial.
 * @param p2 - The other polynomial.
 * @example
 * FloPoly.multiply([1,2,3], [2,5,3,5]); //=> [2, 9, 19, 26, 19, 15]
 */
function multiply(p1, p2) {
    var d1 = p1.length - 1;
    var d2 = p2.length - 1;
    var d = d1 + d2;
    var result = new Array(d + 1).fill(0);
    for (var i = 0; i < d1 + 1; i++) {
        for (var j = 0; j < d2 + 1; j++) {
            result[d - (i + j)] += p1[d1 - i] * p2[d2 - j];
        }
    }
    return clip0(result);
}
/**
 * Multiplies 2 polynomials by a constant.
 * @param c - The constant
 * @param p - The polynomial
 * @example
 * FloPoly.multiplyByConst(0.25, [3,2,1]); //=> [0.75, 0.5, 0.25]
 */
function multiplyByConst(c, p) {
    if (c === 0) {
        return [];
    }
    var d = p.length - 1;
    var result = [];
    for (var i = 0; i < d + 1; i++) {
        result.push(c * p[i]);
    }
    // We have to clip due to possible floating point underflow
    return clip0(result);
}
/**
 * Returns the degree of the polynomial.
 * @param p - The polynomial
 * @example
 * FloPoly.degree([9,8,7,6,5,4,3,2,1]); //=> 9
 */
function degree(p) {
    return p.length - 1;
}
function evaluate(p, a) {
    function f(a) {
        //if p.length === 0 { return 0; }
        var result = p[0];
        for (var i = 1; i < p.length; i++) {
            result = p[i] + result * a;
        }
        return result;
    }
    // Curry the function
    return a === undefined ? f : f(a);
}
/**
 * Evaluates the given polynomial at 0 - it is much faster than at an
 * arbitrary point.
 * @param p - The polynomial
 * @example
 * FloPoly.evaluateAt0([3,2,99]); //=> 99
 */
function evaluateAt0(p) {
    return p[p.length - 1];
}
;
/**
 * <p>
 * Returns the number of sign changes in the polynomial coefficents
 * when ordered in descending order; zeros are ignored.
 * </p>
 * <p>
 * Descartes' rule of signs states (quoted from Wikipedia):
 * "if the terms of a polynomial are ordered by descending variable
 * exponent, then the number of positive roots of the polynomial is
 * either equal to the number of sign differences between consecutive
 * nonzero coefficients, or is less than it by an even number. Multiple
 * roots of the same value are counted separately."
 * </p>
 * See https://en.wikipedia.org/wiki/Descartes%27_rule_of_signs
 * @param p - The polynomial
 * @example
 * FloPoly.signChanges([1,2,-3,0,0,3,-1]); //=> 3
 */
function signChanges(p) {
    var d = p.length - 1;
    var result = 0;
    var prevSign = Math.sign(p[0]);
    for (var i = 1; i < d + 1; i++) {
        var sign = Math.sign(p[i]);
        if (sign !== prevSign && sign !== 0) {
            result++;
            prevSign = sign;
        }
    }
    return result;
}
/**
 * Deflates the given polynomial by removing a factor (x - r), where
 * r is a root of the polynomial.
 * @param p - The polynomial
 * @param root - A pre-calculated root of the polynomial.
 * @example
 * // The polynomial x^3 - 5x^2 + 8x - 4 has a root at 1 and a double root at 2
 * FloPoly.deflate([1, -5, 8, -4], 2); //=> [1, -3, 2]
 * FloPoly.deflate([1, -3, 2], 2);     //=> [1,-1]
 * FloPoly.deflate([1, -1], 1);        //=> [1]
 */
function deflate(p, root) {
    var d = p.length - 1;
    var bs = [p[0]];
    for (var i = 1; i < d; i++) {
        bs.push(p[i] + root * bs[i - 1]);
    }
    return bs;
}
/**
 * Inverts the given polynomial by reversing the order of the
 * coefficients, i.e. p(x) -> x^deg(p) * p(1/x)
 * @param p - The polynomial
 * @example
 * FloPoly.invert([1,2,3,4]); // => [4,3,2,1]
 * FloPoly.invert([3,2,-5]);  // => [-5,2,3]
 */
function invert(p) {
    return p.slice().reverse();
}
/**
 * <p>
 * Performs a change of variables of the form: p(x) <- p(ax + b).
 * </p>
 * <p>
 * See <a href="http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system">this stackoverflow question</a>
 * </p>
 * @param p - The polynomial
 * @param a
 * @param b
 * @example
 * FloPoly.changeVariables([1,2,7], 3, 4); //=> [9, 30, 31]
 */
function changeVariables(p, a, b) {
    // We let the coefficients of p(ax + b) be denoted by d_i in the 
    // code below. 
    // d_i is calculated as d = T*c, where c are the original 
    // coefficients.
    var d = p.length - 1;
    // Initialize a zero matrix
    var t = [];
    for (var i = 0; i < d + 1; i++) {
        t.push(new Array(d + 1).fill(0));
    }
    // Calculate the triangular matrix T
    t[0][0] = 1;
    for (var j = 1; j <= d; j++) {
        t[0][j] = b * t[0][j - 1];
        for (var _i = 1; _i <= j; _i++) {
            t[_i][j] = b * t[_i][j - 1] + a * t[_i - 1][j - 1];
        }
    }
    // Multiply
    var res = new Array(d + 1).fill(0);
    for (var _i2 = 0; _i2 <= d; _i2++) {
        res[d - _i2] = 0;
        for (var _j = _i2; _j <= d; _j++) {
            var acc = t[_i2][_j] * p[d - _j];
            res[d - _i2] += acc;
        }
    }
    return res;
}
/**
 * Reflects the given polynomial about the Y-axis, i.e. perform the
 * change of variables: p(x) <- p(-x).
 * @param p - The polynomial to reflect
 * @example
 * FloPoly.reflectAboutYAxis([5,4,3,2,1]); //=> [5, -4, 3, -2, 1]
 */
function reflectAboutYAxis(p) {
    var d = p.length - 1;
    var result = p.slice();
    for (var i = 0; i < d + 1; i++) {
        if (i % 2) {
            result[i] = -result[i];
        }
    }
    return result;
}
/**
 * Generates a sturm chain for the given polynomial.
 * See https://en.wikipedia.org/wiki/Sturm%27s_theorem
 * @param p - The polynomial
 * @example
 * FloPoly.sturmChain([-3,4,2,-2]); //=> [[-3, 4, 2, -2], [-9, 8, 2], [-2.5185185185185186, 1.7037037037037037], [-3.2932525951557086]]
 */
function sturmChain(p) {
    /**
     * Returns the negative of the remainder when dividing the first
     * polynomial (the dividend) by the second (the divisor) provided
     * that deg(p1) - deg(p2) === 1.
     * @private
     * @param p1 - The first polynomial (dividend)
     * @param p2 - The second polynomial (divisor)
     * See https://en.wikipedia.org/wiki/Sturm%27s_theorem
     */
    function negRemainder(p1, p2) {
        var d1 = p1.length - 1;
        var d2 = p2.length - 1;
        var d = d1 - d2;
        var a = p1[1] / p1[0] - p2[1] / p2[0];
        var b = p1[0] / p2[0];
        var p3 = multiply(multiplyByConst(b, p2), [1, a]);
        return subtract(p3, p1);
    }
    var m = []; // Sturm chain
    m.push(p);
    m.push(differentiate(p));
    //const δ = 10 * Number.EPSILON;
    var i = 1;
    while (m[i].length - 1 > 0) {
        var pnext = negRemainder(m[i - 1], m[i]);
        //pnext = clip(pnext, δ);
        // If the polynomial degree was not reduced due to roundoff
        // such that the first 1 or more terms are very small.
        while (m[i].length - pnext.length < 1) {
            pnext.shift();
        }
        /*
        if (pnext.length === 0) {
            break;
        }
        */
        m.push(pnext);
        i++;
    }
    return m;
}
/**
 * If the highest power coefficient is small in the sense that the
 * highest power term has a negligible contribution (compared to the
 * other terms) at x = 1 then clip() can be called to remove all such
 * highest terms. A contribution of less than Number.EPSILON of the
 * highest coefficient will be considered negligible by default.
 * @param p - The polynomial to be clipped.
 * @param δ - The optional contribution tolerence else
 *        Number.EPSILON will be used by default.
 * @example
 * FloPoly.clip([1e-18, 1e-10, 1e-5]); //=> [1e-18, 1e-10, 1e-5]
 * FloPoly.clip([1e-18, 1e-10, 1e-1]); //=> [1e-10, 1e-1]
 */
function clip(p, δ) {
    δ = δ === undefined ? Number.EPSILON : δ;
    var c = maxCoefficient(p);
    if (c === 0) {
        return [];
    }
    if (Math.abs(p[0]) > δ * c) {
        return p;
    }
    var p_ = p.slice(1);
    while (Math.abs(p_[0]) < δ * c) {
        p_ = p_.slice(1);
    }
    return clip(p_, δ);
}
/**
 * If the highest power coefficient is 0 then clip() can be called to
 * remove all such highest terms so that the array is a valid
 * presentation of a polynomial.
 * @param p - The polynomial to be clipped.
 * @example
 * FloPoly.clip0([1e-18, 1e-10, 1e-1]); //=> [1e-18, 1e-10, 1e-1]
 * FloPoly.clip0([0, 1e-10, 1e-1]); //=> [1e-10, 1e-1]
 */
function clip0(p) {
    return p[0] !== 0 ? p : clip0(p.slice(1));
}
/**
 * Returns the absolute value of the highest coefficient of the polynomial.
 * @param p - The polynomial.
 * @example
 * FloPoly.maxCoefficient([-2, 0.1, 0.2]); //=> 2
 */
function maxCoefficient(p) {
    var max = 0;
    for (var i = 0; i < p.length; i++) {
        var c = Math.abs(p[i]);
        if (c > max) {
            max = c;
        }
    }
    return max;
}
/**
 * Returns a string representing the given polynomial that is readable
 * by a human or a CAS (Computer Algebra System).
 * @param p - The polynomial
 * @example
 * FloPoly.toCasStr([5,4,3,2,1]); //=> "x^4*5 + x^3*4 + x^2*3 + x*2 + 1"
 */
function toCasStr(p) {
    var d = p.length - 1;
    var str = '';
    for (var i = 0; i < d + 1; i++) {
        var cStr = p[i].toString();
        if (i === d) {
            str += cStr;
        } else if (i === d - 1) {
            str += 'x*' + cStr + ' + ';
        } else {
            str += 'x^' + (d - i).toString() + '*' + cStr + ' + ';
        }
    }
    return str;
}
var coreOperators = {
    equal: equal,
    add: add,
    subtract: subtract,
    multiplyByConst: multiplyByConst,
    negate: negate,
    differentiate: differentiate,
    multiply: multiply,
    degree: degree,
    evaluate: evaluate,
    evaluateAt0: evaluateAt0,
    signChanges: signChanges,
    invert: invert,
    changeVariables: changeVariables,
    reflectAboutYAxis: reflectAboutYAxis,
    sturmChain: sturmChain,
    clip: clip,
    clip0: clip0,
    deflate: deflate,
    maxCoefficient: maxCoefficient,
    toCasStr: toCasStr
};
exports.default = coreOperators;

},{}],45:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_operators_1 = _dereq_("./core-operators");
var evaluate = core_operators_1.default.evaluate;
/**
 * <p>
 * Approximate condition number for polynomial evaluation multiplied by the
 * exact value of the polynomial evaluation.
 * </p>
 * <p>
 * See <a href="http://www-pequan.lip6.fr/~jmc/polycopies/Compensation-horner.pdf">Compensated Horner Scheme - paragraph 1.1</a>
 * </p>
 * @ignore
 * @param p - The polynomial
 * @param x - The evaluation point
 */

function conditionNumber(p, x) {
    var d = p.length - 1;
    var res = 0;
    for (var i = 0; i < d; i++) {
        res += Math.abs(p[i] * Math.pow(x, d - i));
    }
    return res;
}
/**
 * <p>
 * Classic rule of thumb approximate error bound when using Horner's
 * method to evaluate polynomials.
 * </p>
 * <p>
 * See for instance <a href="http://www-pequan.lip6.fr/~jmc/polycopies/Compensation-horner.pdf">compensated horner evaluation</a>
 * </p>
 * @param p - The polynomial
 * @param x - Value at which polynomial is evaluated.
  * @example
 * hornerErrorBound([1.1,2.2,-3.3], 1.5); //=> 5.1292303737682235e-15
 */
function hornerErrorBound(p, x) {
    var δ = Number.EPSILON;
    var d = p.length - 1;
    return 2 * d * δ * conditionNumber(p, x);
}
var errorAnalysis = {
    hornerErrorBound: hornerErrorBound
};
exports.default = errorAnalysis;

},{"./core-operators":44}],46:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_operators_1 = _dereq_("./core-operators");
var multiply = core_operators_1.default.multiply;
/**
 * <p>
 * Constructs a polynomial from the given roots by multiplying out the
 * factors (x - root1)(x - root2)... Note that the resulting polynomial
 * will not have any complex roots.
 * </p>
 * <p>
 * Mostly provided for testing purposes. Note that the real roots of the
 * constructed polynomial may not be exactly the same as the roots that
 * the polynomial has been constructed from due to floating-point
 * round-off.
 * </p>
 *
 * @param roots - The roots
 * @example
 * FloPoly.fromRoots([1,2,3,3]); //=> [1, -9, 29, -39, 18]
 * FloPoly.allRoots([1, -9, 29, -39, 18]); //=> [1.0000000000000007, 2.000000000000004]
 * // In the above note the rounding error. Also note the multiple root of 3 that has been missed but as stated previously this does not generally pose a problem for even multiple roots. See the examples below.
 * FloPoly.allRoots([1, -9, 29, -39, 17.99999999999999]); //=> [0.9999999999999973, 2.00000000000002, 2.9999999999999982]
 * FloPoly.allRoots([1, -9, 29, -39, 17.9999999999999]); //=> [0.999999999999975, 2.0000000000000986, 2.9999997898930832, 3.0000002095475775]
 */

function fromRoots(roots) {
    var p = [1];
    for (var i = 0; i < roots.length; i++) {
        p = multiply(p, [1, -roots[i]]);
    }
    return p;
}
exports.default = fromRoots;

},{"./core-operators":44}],47:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var from_roots_1 = _dereq_("./from-roots");
/**
 * Some seed value for the simple random number generator.
 * @ignore
 */
var SEED = 123456789;
/**
 * The range for the simple random number generator, i.e. the generated
 * numbers will be in [0,RANGE].
 * @ignore
 */
var RANGE = 4294967296;
/**
 * Creates a function from the given function with parameters similar
 * to flatRoots but with an extra parameter in the beginning indicating
 * the length of the array generated by the original function.
 * @private
 * @param {function} f
 * @returns {function}
 */
function createArrFunction(f) {
    return function (n, d, a, b) {
        var seed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : SEED;
        var odds = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        var res = [];
        for (var i = 0; i < n; i++) {
            var v = f(d, a, b, seed, odds);
            var p = v.p;
            seed = v.seed;
            res.push(p);
        }
        return res;
    };
}
/**
 * Generates an array of random polynomials with parameters as specified
 * by flatRoots. The exact same polynomials will be created on each
 * call to this function if the same seed is used - this is by design to
 * improve testability.
 * @memberof Random
 * @param n - The number of polynomials to generate.
 * @param d - The degree of the polynomials
 * @param a - The lower bound of the distribution - defaults
 * to 0
 * @param b - The upper bound of the distribution - defaults
 * to 1
 * @param seed - A seed value for generating random values (so
 * that the results are reproducable)
 * @param odds - The odds that a root will be doubled (applied
 * recursively so that some roots will be tripled, etc. - defaults to 0
 * @example
 * FloPoly.Random.flatRootsArr(2,3,0,10); //=> [[1, -17.27247918024659, 97.33487287168995, -179.34094494147305], [1, -14.934967160224915, 57.624514485645406, -14.513933300587215]]
 * FloPoly.Random.flatRootsArr(2,3,0,10); //=> [[1, -17.27247918024659, 97.33487287168995, -179.34094494147305], [1, -14.934967160224915, 57.624514485645406, -14.513933300587215]]
 */
var flatRootsArr = createArrFunction(flatRoots);
/**
 * Generates an array of random polynomials as specified by
 * flatCoefficients. The exact same polynomials will be created on each
 * call to this function if the same seed is used - this is by design to
 * improve testability.
 *
 * @memberof Random
 * @param n - The number of polynomials to generate.
 * @param d - The degree of the polynomials
 * @param a - The lower bound of the distribution - defaults
 * to 0
 * @param b - The upper bound of the distribution - defaults
 * to 1
 * @param seed - A seed value for generating random values (so
 * that the results are reproducable)
 * @returns {number[][]} The array of random polynomials.
 * @example
 * FloPoly.Random.flatCoefficientsArr(2,3,-2,2); //=> [[0.1749166026711464, -0.20349335670471191, 0.9375684261322021], [1.0617692470550537, -1.8918039798736572, 0.8040215969085693]]
 * FloPoly.Random.flatCoefficientsArr(2,3,-2,2); //=> [[0.1749166026711464, -0.20349335670471191, 0.9375684261322021], [1.0617692470550537, -1.8918039798736572, 0.8040215969085693]]
 */
var flatCoefficientsArr = createArrFunction(flatCoefficients);
/**
 * Returns a quasi-random number to be used as the next input to this function.
 * See https://stackoverflow.com/questions/3062746/special-simple-random-number-generator
 * @private
 * @param seed
 */
function predictiveRandom(seed) {
    var a = 134775813;
    return (a * seed + 1) % RANGE;
}
/**
 * Generates a random array of numbers picked from a bounded flat
 * distribution (i.e. a rectangular distribution) with specified odds of
 * duplication of consecutive values.
 *
 * @ignore
 * @param n - The number of values to generate.
 * @param a - The lower bound of the distribution - defaults
 * to 0
 * @param b - The upper bound of the distribution - defaults
 * to 1
 * @param seed - A seed value for generating random values (so
 * that the results are reproducable)
 * @param odds - The odds that a root will be doubled (applied
 * recursively so that some roots will be tripled, etc. - defaults to 0
 */
function randomArray(n, a, b) {
    var seed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SEED;
    var odds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var vs = [];
    for (var i = 0; i < n; i++) {
        seed = predictiveRandom(seed);
        var v = seed / RANGE * (b - a) + a;
        seed = push(seed, vs, v, odds);
    }
    vs = vs.slice(0, n);
    return { vs: vs, seed: seed };
}
/**
 * Helper function that will add more numbers to the passed array - modifies the
 * values parameter.
 * @private
 * @param seed
 * @param values - An existing array of values - will be modified!
 * @param x - The number that will be added (possibly multiple times)
 * @param odds - The odds that the number will be added again (recursively).
 */
function push(seed, values, x, odds) {
    seed = predictiveRandom(seed);
    values.push(x);
    if (seed / RANGE < odds) {
        seed = push(seed, values, x, odds);
    }
    return seed;
}
/**
 * Generates a random polynomial with roots picked from a bounded flat
 * distribution (i.e. a rectangular distribution) with specified odds of
 * duplication of consecutive values. Note that the resulting polynomial
 * won't have any complex roots.
 * @memberof Random
 * @param d - The degree of the polynomials
 * @param a - The lower bound of the distribution - defaults
 * to 0
 * @param b - The upper bound of the distribution - defaults
 * to 1
 * @param seed - A seed value for generating random values (so
 * that the results are reproducable)
 * @param odds - The odds that a root will be doubled (applied
 * recursively so that some roots will be tripled, etc. - defaults to 0
 * @example
 * FloPoly.Random.flatRoots(3,0,10); //=> { p: [1, -17.27247918024659, 97.33487287168995, -179.34094494147305], seed: 939629312 }
 */
function flatRoots(d) {
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var seed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SEED;
    var odds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var randArr = randomArray(d, a, b, seed, odds);
    seed = randArr.seed;
    var p = from_roots_1.default(randArr.vs);
    return { p: p, seed: seed };
}
/**
 * Generates a random polynomial with coefficients picked from a bounded
 * flat distribution (i.e. a rectangular distribution).
 * @memberof Random
 * @param d - The degree of the polynomials
 * @param a - The lower bound of the distribution - defaults to -1
 * @param b - The upper bound of the distribution - defaults to 1
 * @param seed - A seed value for generating random values (so that the results
 * are reproducable)
 * @example
 * FloPoly.Random.flatCoefficients(3,-5,5); //=> { p: [0.437291506677866, -0.5087333917617798, 2.3439210653305054], seed: 939629312 }
 */
function flatCoefficients(d) {
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : +1;
    var seed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SEED;

    a = a === undefined ? -1 : a;
    b = b === undefined ? +1 : b;
    seed = seed === undefined ? SEED : seed;
    var randArr = randomArray(d, a, b, seed);
    seed = randArr.seed;
    var p = randArr.vs;
    return { p: p, seed: seed };
}
var random = {
    flatRoots: flatRoots,
    flatRootsArr: flatRootsArr,
    flatCoefficients: flatCoefficients,
    flatCoefficientsArr: flatCoefficientsArr
};
exports.default = random;

},{"./from-roots":46}],48:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var core_operators_1 = _dereq_("./core-operators");
var _core_operators_1$def = core_operators_1.default,
    invert = _core_operators_1$def.invert,
    negate = _core_operators_1$def.negate,
    reflectAboutYAxis = _core_operators_1$def.reflectAboutYAxis;
/**
 * Returns the maximum magnitude value within the supplied array of numbers.
 * @private
 */

function maxAbs(ns) {
    return Math.max.apply(Math, _toConsumableArray(ns.map(function (n) {
        return Math.abs(n);
    })));
}
/**
 * Finds an upper bound on the magnitude (absolute value) of the roots
 * (including complex roots) of the given polynomial using Rouche's
 * Theorem with k = n. This function is fast but the bound is not tight.
 * @param p - The polynomial.
 */
function rootMagnitudeUpperBound_rouche(p) {
    var d = p.length - 1;
    var R = 1 + 1 / p[0] * maxAbs(p.slice(1));
    return R;
}
/**
 * Finds an upper bound on the magnitude (absolute value) of the roots
 * of the given polynomial using the near-optimal Fujiwara bound. Note
 * that the bound includes complex roots. The bound is tight but slow
 * due to usage of Math.pow().
 * See https://en.wikipedia.org/wiki/Properties_of_polynomial_roots#cite_note-Fujiwara1916-4
 * @param p - The polynomial.
 * @example
 * FloPoly.rootMagnitudeUpperBound_fujiwara([2,-3,6,5,-130]); //=> 6.753296750770361
 * FloPoly.allRoots([2,-3,6,5,-130]); //=> [-2.397918624065303, 2.8793785310848383]
 */
function rootMagnitudeUpperBound_fujiwara(p) {
    var d = p.length - 1;
    var an = p[0];
    var bs = [];
    for (var i = 1; i < d; i++) {
        var b = Math.pow(Math.abs(p[i] / an), 1 / i);
        bs.push(b);
    }
    bs.push(Math.pow(Math.abs(p[d] / 2 * an), 1 / d));
    return 2 * Math.max.apply(undefined, bs);
}
var POWERS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152];
/**
 * <p>
 * Returns an upper bound for the positive real roots of the given
 * polynomial.
 * </p>
 * <p>
 * See algoritm 6 of the paper by Vigklas, Akritas and Strzeboński,
 * specifically the LocalMaxQuadratic algorithm hence LMQ.
 * </p>
 * @param p - The polynomial
 * @example
 * FloPoly.positiveRootUpperBound_LMQ([2,-3,6,5,-130]); //=> 4.015534272870436
 * FloPoly.positiveRootUpperBound_LMQ([2,3]);           //=> 0
 * FloPoly.positiveRootUpperBound_LMQ([-2,-3,-4]);      //=> 0
 */
function positiveRootUpperBound_LMQ(p) {
    var deg = p.length - 1;
    if (deg < 1) {
        return 0;
    }
    if (p[0] < 0) {
        p = negate(p);
    }
    var timesUsed = [];
    for (var i = 0; i < deg; i++) {
        timesUsed.push(1);
    }
    var ub = 0;
    for (var m = 0; m <= deg; m++) {
        if (p[m] >= 0) continue;
        var tempub = Number.POSITIVE_INFINITY;
        var any = false;
        for (var k = 0; k < m; k++) {
            if (p[k] <= 0) {
                continue;
            }
            // Table lookup is about 70% faster but both are
            // extemely fast anyway. 
            // Result is at https://www.measurethat.net/Benchmarks/ShowResult/6610
            var pow = timesUsed[k];
            var powres = void 0;
            if (pow > 20) {
                powres = Math.pow(2, pow);
            } else {
                powres = POWERS[pow];
            }
            var temp = Math.pow(-p[m] / (p[k] / powres), 1 / (m - k));
            timesUsed[k]++;
            if (tempub > temp) {
                tempub = temp;
            }
            any = true;
        }
        if (any && ub < tempub) ub = tempub;
    }
    return ub;
}
/**
 * <p>
 * Calculates a lower bound for the positive roots of the given
 * polynomial.
 * </p>
 * <p>
 * See algoritm 6 of the paper by Vigklas, Akritas and Strzeboński,
 * specifically the LocalMaxQuadratic algorithm hence LMQ.
 * </p>
 * @param p - The polynomial
 * @example
 * FloPoly.positiveRootLowerBound_LMQ([2,-3,6,5,-130]); //=> 1.6883241876925903
 * FloPoly.positiveRootLowerBound_LMQ([2,3]);           //=> 0
 * FloPoly.positiveRootLowerBound_LMQ([-2,-3,-4]);      //=> 0
 */
function positiveRootLowerBound_LMQ(p) {
    var ub = positiveRootUpperBound_LMQ(invert(p));
    if (ub === 0) {
        return 0;
    }
    return 1 / ub;
}
/**
 * See positiveRootUpperBound_LMQ
 *
 * @param p - The polynomial
 * @returns {number} An upper bound.
 */
function negativeRootUpperBound_LMQ(p) {
    return -positiveRootLowerBound_LMQ(reflectAboutYAxis(p));
}
/**
 * See positiveRootLowerBound_LMQ
 *
 * @param p - The polynomial
 * @returns {number} A lower bound.
 */
function negativeRootLowerBound_LMQ(p) {
    return -positiveRootUpperBound_LMQ(reflectAboutYAxis(p));
}
var rootBounds = {
    rootMagnitudeUpperBound_fujiwara: rootMagnitudeUpperBound_fujiwara,
    positiveRootUpperBound_LMQ: positiveRootUpperBound_LMQ,
    positiveRootLowerBound_LMQ: positiveRootLowerBound_LMQ,
    negativeRootUpperBound_LMQ: negativeRootUpperBound_LMQ,
    negativeRootLowerBound_LMQ: negativeRootLowerBound_LMQ,
    rootMagnitudeUpperBound_rouche: rootMagnitudeUpperBound_rouche
};
exports.default = rootBounds;

},{"./core-operators":44}],49:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var core_operators_1 = _dereq_("./core-operators");
var _core_operators_1$def = core_operators_1.default,
    sturmChain = _core_operators_1$def.sturmChain,
    evaluate = _core_operators_1$def.evaluate,
    signChanges = _core_operators_1$def.signChanges;
/**
 * <p>
 * Floating-point-stably calculates and returns the ordered quadratic
 * roots of the given quadratic polynomial.
 * </p>
 * <p>
 * This function is included only because it might be slightly faster
 * than calling allRoots due to allRoots first checking if the
 * polynomial is quadratic and checking if the roots are within the
 * given range.
 * </p>
 * @param p - The 2nd order polynomial
 * @example
 * FloPoly.quadraticRoots([1, -3, 2]); //=> [1,2]
 */

function quadraticRoots(p) {
    var _p = _slicedToArray(p, 3),
        a = _p[0],
        b = _p[1],
        c = _p[2];

    var delta = b * b - 4 * a * c;
    if (delta < 0) {
        // No real roots;
        return [];
    }
    if (delta === 0) {
        return [-b / (2 * a)];
    }
    delta = Math.sqrt(delta);
    var root1 = void 0;
    var root2 = void 0;
    if (b >= 0) {
        root1 = (-b - delta) / (2 * a);
        root2 = 2 * c / (-b - delta);
    } else {
        root1 = 2 * c / (-b + delta);
        root2 = (-b + delta) / (2 * a);
    }
    if (root1 < root2) {
        return [root1, root2];
    }
    return [root2, root1];
}
/**
 * Calculates the roots of the given cubic polynomial.
 *
 * This code is mostly from the Pomax guide found at
 * https://pomax.github.io/bezierinfo/#extremities
 *
 * @param p - A cubic polynomial.
 */
// TODO - This function as it currently stands is very sensitive to
// the first coefficient if it is very small, e.g. compare:
// cubicRoots([1e-5, 1560,-1740,96]) = [1.1903631761670113, -156000001.1153846, -0.07497859001159668] 
// vs
// quadraticRoots([1560,-1740,96]) = [0.05821032751613551, 1.0571742878684798]
// It is completely useless in some ranges of its input domain:
// the part of the function 'if (discriminant < 0) {}'
// is highly problematic for numerical stability.
// Simply use allRoots / allRootsRecursive instead.
/*
function cubicRoots(p) {

    function cuberoot(v) {
        return v < 0
            ? -Math.pow(-v, 1/3)
            : +Math.pow(v, 1/3);
    }
    
    let cbrt = Math.cbrt || cuberoot;
    
    let d = p[0];
    let a = p[1] / d;
    let b = p[2] / d;
    let c = p[3] / d;
    
    let s  = (3*b - a*a) / 9;
    let q  = (2*a*a*a - 9*a*b + 27*c) / 54;
    
    let s3 = s*s*s;
    let q2 = q*q;
    
    let discriminant = q2 + s3;

    if (!Number.isFinite(discriminant)) {
        
        // Overflow occured - in which case one root will be very large.
        // We might want to report such large roots as positive or
        // negative infinity but since they are rarely of interest we
        // report only the smaller roots.
        
        // Here q*q   === (729*c^2 - 486*a*b*c + 108*a^3*c + 81*a^2*b^2 - 36*a^4*b + 4*a^6) / (729*4)
        // and  s*s*s === (27*b^3 - 27*a^2*b^2 + 9*a^4*b - a^6) / (729*1)
        
        return quadraticRoots(p.slice(1));
    }
    
    if (discriminant < 0) {
        // three real roots
        
        let r = Math.sqrt(-s3);
        let t = -q / r;
        
        let cosphi = t < -1 ? -1 : t > 1 ? 1 : t;
        let phi    = Math.acos(cosphi);
        let	t1     = 2*cbrt(r);
        
        let ao3 = a/3;
        
        return [
            t1*Math.cos((phi            )/3) - ao3,
            t1*Math.cos((phi + 2*Math.PI)/3) - ao3,
            t1*Math.cos((phi + 4*Math.PI)/3) - ao3
        ]
    } else if (discriminant === 0) {
        // three real roots, but two of them are equal
        
        let u1 = q < 0 ? cbrt(-q) : -cbrt(q);
        let ao3 = a/3;
        
        return [
            2*u1 - ao3,
            -u1 - ao3
        ];
    } else {
        // one real root, two complex roots
        
        let sd = Math.sqrt(discriminant);
        let u1 = cbrt(sd - q);
        let v1 = cbrt(sd + q);
        
        return [u1 - v1 - a/3];
    }
}
*/
/**
 * Returns the number of real roots in the interval (a,b) of the given
 * polynomial.
 * @param p - The polynomial
 * @param a - The lower bound
 * @param b - The upper bound
 * @example
 * let p = [1, 1, -64, 236, -240];
 * FloPoly.numRootsWithin(p,-20,-11); //=> 0
 * FloPoly.numRootsWithin(p,-11,-9);  //=> 1
 * FloPoly.numRootsWithin(p,-11,3.5); //=> 3
 * FloPoly.numRootsWithin(p,-11,5);   //=> 4
 */
function numRootsWithin(p, a, b) {
    var ps = sturmChain(p);
    var ev = evaluate(p);
    var as = ps.map(function (p) {
        return evaluate(p)(a);
    });
    var bs = ps.map(function (p) {
        return evaluate(p)(b);
    });
    return signChanges(as) - signChanges(bs);
}
/**
 * <p>
 * Searches an interval (a,b) for a root (i.e. zero) of the
 * given function with respect to its first argument using the Bisection
 * Method root-finding algorithm. Any function can be supplied (it does
 * not even have to be continuous) as long as the root is bracketed.
 * </p>
 * <p>
 * Note: This function has no advantages above the Brent method except
 * for its simpler implementation and can be much slower. Use brent
 * instead.
 * </p>
 * @param f - The function for which the root is sought.
 * @param a - The lower limit of the search interval.
 * @param b - The upper limit of the search interval.
 * @example
 * let p = FloPoly.fromRoots([-10,2,3,4]);  //=> [1, 1, -64, 236, -240]
 * let f = FloPoly.evaluate(p);
 * FloPoly.bisection(f,2.2,3.8); //=> 3
 * FloPoly.bisection(f,2.2,3.1); //=> 3.0000000000000044
 */
function bisection(f, a, b) {
    if (a === b) {
        // Presumably the root is already found.
        return a;
    } else if (b < a) {
        // Swap a and b 
        var _ref = [b, a];
        a = _ref[0];
        b = _ref[1];
    }
    var fa = f(a);
    var fb = f(b);
    if (fa === 0) {
        return a;
    }
    if (fb === 0) {
        return b;
    }
    if (fa * fb > 0) {
        // Root is not bracketed - this is a precondition.
        throw new Error('Root not bracketed');
    }
    while (true) {
        var c = a + (b - a) / 2; // Take midpoint
        var fc = f(c);
        if (fc === 0) {
            return c;
        }
        if (fa * fc < 0) {
            b = c;
        } else {
            a = c;
        }
        // We don't add Number.EPSILON in the line below because we want
        // accuracy to improve even below 1.
        var δ = 2 * Number.EPSILON * Math.abs(b) /*+ Number.EPSILON*/;
        if (Math.abs(a - b) <= δ) {
            return b;
        }
    }
}
/**
 * <p>
 * Searches an interval (a,b) for a root (i.e. zero) of the
 * given function with respect to its first argument using the Brent's
 * Method root-finding algorithm. Any function can be supplied (it does
 * not even have to be continuous) as long as the root is bracketed.
 * </p>
 * <p>
 * Brent's Method is an excellent root-finding choice since it is
 * (1) guaranteed to converge (unlike the Newton and other so-called
 * single-point methods), (2) converges in a reasonable number of
 * iterations even for highly contrived functions (unlike Dekker's
 * Method) and (3) nearly always converges extremely fast, i.e. super-
 * linearly (unlike the Secant and Regula-Falsi methods).
 * </p>
 * <p>
 * The max error, δ, is set equal to 2*Number.EPSILON*Math.abs(b)
 * after each iteration where b is the max of the current 2 best
 * guesses.
 * </p>
 * <p>
 * See <a href="https://en.wikipedia.org/wiki/Brent%27s_method">Wikipedia</a>
 * </p>
 * <p>
 * See <a href="https://maths-people.anu.edu.au/~brent/pd/rpb011i.pdf">Brent (page 47)</a>
 * </p>
 * @param f - The function for which the root is sought.
 * @param a - The lower limit of the search interval.
 * @param b - The upper limit of the search interval.
 * about 1e-15 multiplied by the root magnitued).
 * @example
 * let p = FloPoly.fromRoots([-10,2,3,4]);  //=> [1, 1, -64, 236, -240]
 * let f = FloPoly.evaluate(p);
 * FloPoly.brent(f,2.2,3.8); //=> 3.000000000000003
 * FloPoly.brent(f,2.2,3.1); //=> 3.000000000000001
 */
function brent(f, a, b) {
    if (a === b) {
        // Presumably the root is already found.
        return a;
    }
    // We assume on the first iteration f(a) !== 0 && f(b) !== 0. 
    var fa = f(a);
    var fb = f(b);
    if (fa * fb > 0) {
        // Root is not bracketed - this is a precondition.
        throw new Error('Root not bracketed');
    }
    var c = void 0; // Value of previous guess - set to a initially 
    if (Math.abs(fa) < Math.abs(fb)) {
        // Swap a,b
        c = a;
        a = b;
        b = c;
        // Swap fa,fb
        var temp = fa;
        fa = fb;
        fb = temp;
    }
    c = a;
    var mflag = true;
    var d = void 0; // Value of guess before previous guess
    while (true) {
        var δ = 2 * Number.EPSILON * Math.abs(b); // + Number.EPSILON;
        var fc = f(c);
        // Calculate provisional interpolation value
        var s = void 0;
        if (fa !== fc && fb !== fc) {
            // 3 points available - inverse quadratic interpolation
            var fac = fa - fc;
            var fab = fa - fb;
            var fbc = fb - fc;
            // The below has been multiplied out to speed up the algorithm.
            /*s = ((a * fb * fc) / ( fab * fac)) +
                  ((b * fa * fc) / (-fab * fbc)) +
                  ((c * fa * fb) / ( fac * fbc));*/
            s = ((a * fb * fbc - b * fa * fac) * fc + c * fa * fab * fb) / (fab * fac * fbc);
        } else {
            // only 2 points available - secant method
            s = b - fb * ((b - a) / (fb - fa));
        }
        var t1 = (3 * a + b) / 4;
        var b_c = Math.abs(b - c);
        var s_b = Math.abs(s - b);
        var c_d = Math.abs(c - d);
        if (!(s > t1 && s < b || s < t1 && s > b) || mflag && (
        // condition 2
        s_b >= b_c / 2 ||
        // condition 4
        b_c < δ) || !mflag && (
        // condition 3
        s_b >= c_d / 2 ||
        // condition 5
        c_d < δ)) {
            // Bisection
            s = (a + b) / 2;
            mflag = true;
        } else {
            mflag = false;
        }
        var fs = f(s);
        d = c;
        c = b;
        if (fa * fs < 0) {
            b = s;
        } else {
            a = s;
        }
        if (Math.abs(fa) < Math.abs(fb)) {
            // Swap a,b
            var _temp = a;
            a = b;
            b = _temp;
        }
        if (fb === 0) {
            return b;
        }
        if (fs === 0) {
            return s;
        }
        if (Math.abs(a - b) <= δ) {
            return b;
        }
        fa = f(a);
        fb = f(b);
    }
}
var rootOperators = {
    quadraticRoots: quadraticRoots,
    numRootsWithin: numRootsWithin,
    brent: brent,
    bisection: bisection
};
exports.default = rootOperators;

},{"./core-operators":44}],50:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var DELTA = 1e-10;
/**
 * Curry the given arity two function.
 * @param f - A function
 */
function curry2(f) {
    function g(t, u) {
        return u === undefined ? function (u) {
            return f(t, u);
        } : f(t, u);
    }
    return g;
}
/**
* Creates a transformation function that operates on multiple points from the
* given arity two function.
* @private
*/
function mapCurry2(f) {
    function g(t, us) {
        var h = f(t);
        var hUs = function hUs(us) {
            return us.map(h);
        };
        // Curry the function
        return us === undefined ? hUs : hUs(us);
    }
    return g;
}
/**
* Creates a transformation function that operates on multiple points from the
* given arity 3 curried function (keeping the first two parameters uncurried).
* @private
*/
function specialMapCurry(f) {
    function g(s, t, us) {
        var h = f(s, t);
        var hUs = function hUs(us) {
            return us.map(h);
        };
        // Curry the function
        return us === undefined ? hUs : hUs(us);
    }
    return g;
}
/**
 * Returns the dot (inner) product between two 2-vectors.
 * @param a - The first vector
 * @param b - The second vector
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}
exports.dot = dot;
/**
 * Returns the cross product signed magnitude between two 2-vectors.
 * @param a - The first vector
 * @param b - The second vector
 */
function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}
exports.cross = cross;
/**
 * Three 2d points are a counter-clockwise turn if ccw > 0, clockwise if
 * ccw < 0, and colinear if ccw = 0 because ccw is a determinant that gives
 * twice the signed area of the triangle formed by p1, p2 and p3.
 * @param p1 - The first point
 * @param p2 - The second point
 * @param p3 - The third point
 * @param delta - The tolerance at which the three points are considered
 * collinear - defaults to 1e-10.
 */
function ccw(p1, p2, p3) {
    var delta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DELTA;

    var res = (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    return Math.abs(res) <= delta ? 0 : res;
}
exports.ccw = ccw;
/**
* <p>
* Returns the point where two line segments intersect or undefined if they
* don't intersect or a line if they intersect at infinitely many points.
* </p>
* <p>
* See <a href="http://algs4.cs.princeton.edu/91primitives">Geometric primitves</a>
* </p>
* @param ab - The first line
* @param cd - The second line
* @param delta - The tolerance at which the lines are considered parallel -
* defaults to 1e-10.
*/
function segSegIntersection(ab, cd) {
    var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DELTA;

    var _ab = _slicedToArray(ab, 2),
        a = _ab[0],
        b = _ab[1];

    var _cd = _slicedToArray(cd, 2),
        c = _cd[0],
        d = _cd[1];

    var denom = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);
    var rNumer = (a[1] - c[1]) * (d[0] - c[0]) - (a[0] - c[0]) * (d[1] - c[1]);
    var sNumer = (a[1] - c[1]) * (b[0] - a[0]) - (a[0] - c[0]) * (b[1] - a[1]);
    if (Math.abs(denom) <= delta) {
        // parallel
        if (Math.abs(rNumer) <= delta) {
            // colinear
            // TODO Check if x-projections and y-projections intersect
            // and return the line of intersection if they do.
            return undefined;
        }
        return undefined;
    }
    var r = rNumer / denom;
    var s = sNumer / denom;
    if (0 <= r && r <= 1 && 0 <= s && s <= 1) {
        return [a[0] + r * (b[0] - a[0]), a[1] + r * (b[1] - a[1])];
    }
    return undefined;
}
exports.segSegIntersection = segSegIntersection;
/**
* Returns true if the two given 2d line segments intersect, false otherwise.
* @param a - A line segment
* @param b - Another line segment
*/
function doesSegSegIntersect(a, b) {
    if (ccw(a[0], a[1], b[0]) * ccw(a[0], a[1], b[1]) > 0) {
        return false;
    } else if (ccw(b[0], b[1], a[0]) * ccw(b[0], b[1], a[1]) > 0) {
        return false;
    }
    return true;
}
exports.doesSegSegIntersect = doesSegSegIntersect;
/**
* Returns the squared distance between two 2d points.
* @param p1 - A point
* @param p2 - Another point
*/
function squaredDistanceBetween(p1, p2) {
    var x = p2[0] - p1[0];
    var y = p2[1] - p1[1];
    return x * x + y * y;
}
exports.squaredDistanceBetween = squaredDistanceBetween;
/**
* Returns a scaled version of the given 2-vector.
* @param p - A vector
* @param factor - A scale factor
*/
function scale(p, factor) {
    return [p[0] * factor, p[1] * factor];
}
exports.scale = scale;
/**
* Returns the given 2-vector reversed.
* @param p - A vector
*/
function reverse(p) {
    return [-p[0], -p[1]];
}
exports.reverse = reverse;
/**
* Returns the given 2-vector scaled to a length of one.
* @param p - A vector
*/
function toUnitVector(p) {
    var scaleFactor = 1 / len(p);
    return [p[0] * scaleFactor, p[1] * scaleFactor];
}
exports.toUnitVector = toUnitVector;
/**
* Returns the given 2-vector scaled to the given length.
* @param p - A vector
* @param length - The length to scale to
*/
function toLength(p, length) {
    var scaleFactor = length / len(p);
    return [p[0] * scaleFactor, p[1] * scaleFactor];
}
exports.toLength = toLength;
/**
* Returns the second 2-vector minus the first.
* @param p1 - The first vector
* @param p2 - The second vector
*/
function fromTo(p1, p2) {
    return [p2[0] - p1[0], p2[1] - p1[1]];
}
exports.fromTo = fromTo;
/**
* Performs linear interpolation between two 2d points and returns the resultant point.
* @param p1 - The first point.
* @param p2 - The second point.
* @param t - The interpolation fraction (often in [0,1]).
*/
function interpolate(p1, p2, t) {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}
exports.interpolate = interpolate;
/**
* Returns the mean of two 2d points.
* @param ps - The two points
*/
function mean(ps) {
    var p1 = ps[0];
    var p2 = ps[1];
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}
exports.mean = mean;
/**
* Returns the distance between two 2d points.
* @param p1 - A point.
* @param p2 - Another point.
*/
function distanceBetween(p1, p2) {
    return Math.sqrt(squaredDistanceBetween(p1, p2));
}
exports.distanceBetween = distanceBetween;
/**
* Returns the length of the given 2-vector.
* @param p - A vector
*/
function len(p) {
    return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}
exports.len = len;
/**
* Returns the squared length of the given 2-vector.
* @param p - A vector
*/
function lengthSquared(v) {
    return v[0] * v[0] + v[1] * v[1];
}
exports.lengthSquared = lengthSquared;
/**
* Returns the Manhattan distance between two 2d points.
* @param p1 - A point.
* @param p2 - Another point.
*/
function manhattanDistanceBetween(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}
exports.manhattanDistanceBetween = manhattanDistanceBetween;
/**
* Returns the Manhattan length of the given 2-vector.
* @param p - A vector
*/
function manhattanLength(p) {
    return Math.abs(p[0]) + Math.abs(p[1]);
}
exports.manhattanLength = manhattanLength;
/**
* <p>
* Returns the distance between the given point and line.
* </p>
* <p>
* See <a href="https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points">
* this Wikipedia article</a>
* </p>
* @param p - A point
* @param l - A line
*/
function distanceBetweenPointAndLine(p, l) {
    var _p = _slicedToArray(p, 2),
        x0 = _p[0],
        y0 = _p[1];

    var _l = _slicedToArray(l, 2),
        _l$ = _slicedToArray(_l[0], 2),
        x1 = _l$[0],
        y1 = _l$[1],
        _l$2 = _slicedToArray(_l[1], 2),
        x2 = _l$2[0],
        y2 = _l$2[1];

    var y = y2 - y1;
    var x = x2 - x1;
    var a = y * x0 - x * y0 + x2 * y1 - y2 * x1;
    var b = Math.sqrt(x * x + y * y);
    return Math.abs(a / b);
}
exports.distanceBetweenPointAndLine = distanceBetweenPointAndLine;
/**
* Returns the squared distance between the given point and line segment.
* @param p - A point
* @param l - A line
*/
function squaredDistanceBetweenPointAndLineSegment(p, l) {
    var sqDst = squaredDistanceBetween;
    var v = l[0];
    var w = l[1];
    var l2 = sqDst(v, w);
    if (l2 == 0) {
        return sqDst(p, v);
    }
    var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    var d2 = sqDst(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
    return d2;
}
exports.squaredDistanceBetweenPointAndLineSegment = squaredDistanceBetweenPointAndLineSegment;
/**
* Returns the circumcenter of the given 2d triangle.
* @param triangle
*/
function circumCenter(triangle) {
    // See wikipedia
    var p1 = triangle[0];
    var p2 = triangle[1];
    var p3 = triangle[2];
    var sqLen = lengthSquared;
    var Sx = 0.5 * det3([sqLen(p1), p1[1], 1], [sqLen(p2), p2[1], 1], [sqLen(p3), p3[1], 1]);
    var Sy = 0.5 * det3([p1[0], sqLen(p1), 1], [p2[0], sqLen(p2), 1], [p3[0], sqLen(p3), 1]);
    var a = det3([p1[0], p1[1], 1], [p2[0], p2[1], 1], [p3[0], p3[1], 1]);
    var b = det3([p1[0], p1[1], sqLen(p1)], [p2[0], p2[1], sqLen(p2)], [p3[0], p3[1], sqLen(p3)]);
    return [Sx / a, Sy / a];
}
exports.circumCenter = circumCenter;
/**
* <p>
* Returns the incenter of the given triangle.
* </p>
* <p>
* See Wikipedia - https://en.wikipedia.org/wiki/Incenter
* </p>
* @param triangle
*/
function inCenter(triangle) {
    var dst = distanceBetween;
    var p1 = triangle[0];
    var p2 = triangle[1];
    var p3 = triangle[2];
    var l1 = dst(p2, p3);
    var l2 = dst(p1, p3);
    var l3 = dst(p1, p2);
    var lengthSum = l1 + l2 + l3;
    return [(l1 * p1[0] + l2 * p2[0] + l3 * p3[0]) / lengthSum, (l1 * p1[1] + l2 * p2[1] + l3 * p3[1]) / lengthSum];
}
exports.inCenter = inCenter;
/**
* Returns the centroid of the given polygon, e.g. triangle. The polygon
* must be simple, i.e. not self-intersecting.
* @param polygon
*/
function centroid(polygon) {
    if (polygon.length === 3) {
        var p1 = polygon[0];
        var p2 = polygon[1];
        var p3 = polygon[2];
        var x = p1[0] + p2[0] + p3[0];
        var y = p1[1] + p2[1] + p3[1];
        return [x / 3, y / 3];
    }
    // polygon.length assumed > 3 and assumed to be non-self-intersecting
    // See wikipedia
    // First calculate the area, A, of the polygon
    var A = 0;
    for (var i = 0; i < polygon.length; i++) {
        var p0 = polygon[i];
        var _p2 = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];
        A = A + (p0[0] * _p2[1] - _p2[0] * p0[1]);
    }
    A = A / 2;
    var C = [0, 0];
    for (var _i = 0; _i < polygon.length; _i++) {
        var _p3 = polygon[_i];
        var _p4 = _i === polygon.length - 1 ? polygon[0] : polygon[_i + 1];
        C[0] = C[0] + (_p3[0] + _p4[0]) * (_p3[0] * _p4[1] - _p4[0] * _p3[1]);
        C[1] = C[1] + (_p3[1] + _p4[1]) * (_p3[0] * _p4[1] - _p4[0] * _p3[1]);
    }
    return [C[0] / (6 * A), C[1] / (6 * A)];
}
exports.centroid = centroid;
/**
* Calculate the determinant of three 3d vectors, i.e. 3x3 matrix
* @ignore
* @param x - A 2d vector
* @param y - Another 2d vector
* @param z - Another 2d vector
*/
function det3(x, y, z) {
    return x[0] * (y[1] * z[2] - y[2] * z[1]) - x[1] * (y[0] * z[2] - y[2] * z[0]) + x[2] * (y[0] * z[1] - y[1] * z[0]);
}
exports.det3 = det3;
function translate(a, b) {
    function f(b) {
        return [a[0] + b[0], a[1] + b[1]];
    }
    // Curry the function
    return b === undefined ? f : f(b);
}
exports.translate = translate;
/**
* Return the given 2d points translated by the given 2d vector. This
* function is curried.
* @param v
* @param ps
*/
var translatePs = mapCurry2(translate);
exports.translatePs = translatePs;
/**
* Return the given 2d points translated by the given 2d vector. This function
* is curried.
* @param sinθ
* @param cosθ
* @param ps
*/
var rotatePs = specialMapCurry(rotate);
exports.rotatePs = rotatePs;
function rotate(sinθ, cosθ, p) {
    var a = translatePs([1, 2]);
    function rotateByθ(p) {
        return [p[0] * cosθ - p[1] * sinθ, p[0] * sinθ + p[1] * cosθ];
    }
    // Curry the function
    return p === undefined ? rotateByθ : rotateByθ(p);
}
exports.rotate = rotate;
/**
* Returns true if two 2-vectors are identical (by value), false otherwise.
* @param a - A 2d vector
* @param b - Another 2d vector
*/
function equal(a, b) {
    return a[0] === b[0] && a[1] === b[1];
}
exports.equal = equal;
/**
* Returns a anti-clockwise rotated version of the given 2-vector given the
* sine and cosine of the angle.
* @param p - A 2d vector
* @param sinθ
* @param cosθ
*/
function reverseRotate(sinθ, cosθ, p) {
    return [+p[0] * cosθ + p[1] * sinθ, -p[0] * sinθ + p[1] * cosθ];
}
exports.reverseRotate = reverseRotate;
/**
* Returns a 90 degrees rotated version of the given 2-vector.
* @param p - A 2d vector
*/
function rotate90Degrees(p) {
    return [-p[1], p[0]];
}
exports.rotate90Degrees = rotate90Degrees;
/**
* Returns a negative 90 degrees rotated version of the given 2-vector.
* @param p - A 2d vector
*/
function rotateNeg90Degrees(p) {
    return [p[1], -p[0]];
}
exports.rotateNeg90Degrees = rotateNeg90Degrees;
/**
* Transforms the given 2-vector by applying the given function to each
* coordinate.
* @param p - A 2d vector
* @param f - A transformation function
*/
function transform(p, f) {
    return [f(p[0]), f(p[1])];
}
exports.transform = transform;
/**
* Returns the closest point to the array of 2d points, optionally providing
* a distance function.
* @param p
* @param ps
* @param f - Optional distance function - defaults to
* squaredDistanceBetween.
*/
function getClosestTo(p, ps) {
    var closestPoint = undefined;
    var closestDistance = Number.POSITIVE_INFINITY;
    for (var i = 0; i < ps.length; i++) {
        var q = ps[i];
        var d = squaredDistanceBetween(p, q);
        if (d < closestDistance) {
            closestPoint = q;
            closestDistance = d;
        }
    }
    return closestPoint;
}
exports.getClosestTo = getClosestTo;
/**
* Returns the closest point to the array of 2d points, optionally providing
* a distance function.
* @param p
* @param ps
* @param f - Optional distance function - defaults to
* squaredDistanceBetween.
*/
function getObjClosestTo(p, ps, f) {
    var closestObj = undefined; // Closest Point
    var closestDistance = Number.POSITIVE_INFINITY;
    for (var i = 0; i < ps.length; i++) {
        var o = ps[i];
        var d = squaredDistanceBetween(p, f(o));
        if (d < closestDistance) {
            closestObj = o;
            closestDistance = d;
        }
    }
    return closestObj;
}
exports.getObjClosestTo = getObjClosestTo;
/**
* Returns an array of points by applying a translation and then rotation to
* the given points.
* @param v - The translation vector
* @param sinθ
* @param cosθ
* @param ps - The input points
**/
function translateThenRotatePs(v, sinθ, cosθ, ps) {
    var f = translate(v);
    return ps.map(function (p) {
        return rotate(sinθ, cosθ, f(p));
    });
}
exports.translateThenRotatePs = translateThenRotatePs;
/**
* Returns an array of points by applying a rotation and then translation to
* the given points.
* @param sinθ
* @param cosθ
* @param v - The translation vector
* @param ps - The input points
**/
function rotateThenTranslatePs(sinθ, cosθ, v, ps) {
    return ps.map(function (p) {
        return translate(v, rotate(sinθ, cosθ, p));
    });
}
exports.rotateThenTranslatePs = rotateThenTranslatePs;
;
//export  Vector2d;

},{}],51:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var BezierPiece =
/**
 * @param curve
 * @param ts The start and end t parameter of the original bezier curve
 */
function BezierPiece(curve, ts) {
    _classCallCheck(this, BezierPiece);

    this.curve = curve;
    this.ts = ts;
};

exports.BezierPiece = BezierPiece;

},{}],52:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var EVENT_LEFT = 0;
var EVENT_RIGHT = 1;
/**
 * Find and return axis-aligned open boxes that intersect via a sweepline
 * algorithm.
 */
function findBbIntersections(boxes) {
    // Initialize event queue to equal all box x-axis endpoints.
    var events = [];
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        var smallerSide = box[0][0] < box[1][0] ? 0 : 1;
        var largerSide = smallerSide === 0 ? 1 : 0;
        events.push(new Event(0, box, box[smallerSide]));
        events.push(new Event(1, box, box[largerSide]));
    }
    events.sort(Event.compare);
    var activeBoxes = new Set();
    var intersections = [];
    for (var _i = 0; _i < events.length; _i++) {
        var event = events[_i];
        var _box = event.box;
        if (event.type === EVENT_LEFT) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = activeBoxes.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var activeBox = _step.value;

                    if (areBoxesIntersecting(_box, activeBox)) {
                        intersections.push({
                            box1: _box, box2: activeBox
                        });
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            activeBoxes.add(_box);
        } else if (event.type === EVENT_RIGHT) {
            activeBoxes.delete(event.box);
        }
    }
    return intersections;
}

var Event = function () {
    /**
     * Event class constructor
     * @param type - 0 -> left side, 1 -> right side
     * @param box - An axis-aligned 2-box described by 2 points
     * @param p - A point.
     */
    function Event(type, box, p) {
        _classCallCheck(this, Event);

        this.type = type;
        this.box = box;
        this.p = p;
    }
    /**
     * Compare two Events by their x-axis and then by their type. Since it is
     * open boxes that are compare we must let the right endpoint type come
     * before the left.
     * @param a A point (within an object)
     * @param b A point (within an object)
     */


    _createClass(Event, null, [{
        key: "compare",
        value: function compare(a, b) {
            var res = a.p[0] - b.p[0];
            if (res !== 0) {
                return res;
            }
            if (a.box === b.box) {
                return a.type === EVENT_RIGHT ? -1 : +1;
            }
            return a.type === EVENT_LEFT ? +1 : -1;
        }
    }]);

    return Event;
}();
/**
 * Returns true if the 2 given (open) boxes intersect. At this stage we already
 * know their x-axis intersect.
 */


function areBoxesIntersecting(a, b) {
    var _a = _slicedToArray(a, 2),
        _a$ = _slicedToArray(_a[0], 2),
        a0 = _a$[1],
        _a$2 = _slicedToArray(_a[1], 2),
        a1 = _a$2[1];

    var _b = _slicedToArray(b, 2),
        _b$ = _slicedToArray(_b[0], 2),
        b0 = _b$[1],
        _b$2 = _slicedToArray(_b[1], 2),
        b1 = _b$2[1];

    if (a0 > a1) {
        var _ref = [a1, a0];
        a0 = _ref[0];
        a1 = _ref[1];
    }
    ;
    if (b0 > b1) {
        var _ref2 = [b1, b0];
        b0 = _ref2[0];
        b1 = _ref2[1];
    }
    ;
    if (a0 === b0) {
        if (a0 === a1 || b0 === b1) {
            return false;
        }
        return true;
    }
    if (a0 < b0) {
        if (a1 <= b0) {
            return false;
        }
        return true;
    }
    if (a0 > b0) {
        if (b1 <= a0) {
            return false;
        }
        return true;
    }
}
exports.default = findBbIntersections;

},{}],53:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");

var Circle = function () {
    /**
    * @param center
    * @param radius
    */
    function Circle(center, radius) {
        _classCallCheck(this, Circle);

        this.center = center;
        this.radius = radius;
    }
    /**
     * Returns a scaled version of the given circle without changing its center.
     * @param circle
     * @param s multiplier
     */


    _createClass(Circle, null, [{
        key: "scale",
        value: function scale(circle, s) {
            return new Circle(circle.center, circle.radius * s);
        }
        /**
         * Returns true if the first circle engulfs the second.
         * @param c1
         * @param c2
         */

    }, {
        key: "engulfsCircle",
        value: function engulfsCircle(c1, c2) {
            if (c1.radius <= c2.radius) {
                return false;
            }
            var d = flo_vector2d_1.squaredDistanceBetween(c1.center, c2.center);
            var dr = c1.radius - c2.radius;
            var δ = dr * dr;
            return δ > d;
        }
        /**
         * Returns a human-readable string description of the given circle.
         * @param circle
         */

    }, {
        key: "toString",
        value: function toString(circle) {
            return 'c: ' + circle.center + ' r: ' + circle.radius;
        }
    }]);

    return Circle;
}();

exports.Circle = Circle;

},{"flo-vector2d":50}],54:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("./point-on-shape");

var ContactPoint = function () {
    /**
     * Representation of a point on a loop (or shape).
     * @param pointOnShape
     * @param vertex
     */
    function ContactPoint(pointOnShape, circle, order, order2) {
        _classCallCheck(this, ContactPoint);

        this.pointOnShape = pointOnShape;
        this.circle = circle;
        this.order = order;
        this.order2 = order2;
    }

    _createClass(ContactPoint, null, [{
        key: "compare",
        value: function compare(a, b) {
            var res = point_on_shape_1.PointOnShape.compare(a.pointOnShape, b.pointOnShape);
            if (res === undefined) {
                return undefined;
            }
            if (res !== 0) {
                return res;
            }
            res = a.order - b.order;
            if (res !== 0) {
                return res;
            }
            return a.order2 - b.order2;
        }
    }]);

    return ContactPoint;
}();

exports.ContactPoint = ContactPoint;

},{"./point-on-shape":133}],55:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var contact_point_1 = _dereq_("./contact-point");
var cp_node_for_debugging_1 = _dereq_("./debug/cp-node-for-debugging");
var EDGES = ['prev', 'next', 'prevOnCircle', 'nextOnCircle'];
/**
 * Representation of a ContactPoint node having various edges, two of which
 * ('prev' and 'next') enforce a cyclic ordering on the CpNodes.
 */

var CpNode = function () {
    /**
     * @param cp The actual item stored at a node
     * @param prev The previous contact point on the boundary
     * @param next The next contact point on the boundary
     * @param prevOnCircle The previous contact point on the inscribed circle
     * @param prev The next contact point on the inscribed circle
     * @param matCurve The actual medial axis curve from this ContactPoint's
     * circle to the next ContactPoint's circle. It is a bezier curve of order
     * 1 to 3.
     * @param isHoleClosing
     */
    function CpNode(cp, isHoleClosing, isIntersection) {
        var prev = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
        var next = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
        var prevOnCircle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
        var nextOnCircle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : undefined;
        var matCurve = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : undefined;

        _classCallCheck(this, CpNode);

        this.cp = cp;
        this.isHoleClosing = isHoleClosing;
        this.isIntersection = isIntersection;
        this.prev = prev;
        this.next = next;
        this.prevOnCircle = prevOnCircle;
        this.nextOnCircle = nextOnCircle;
        this.matCurve = matCurve;
    }

    _createClass(CpNode, [{
        key: "clone",
        value: function clone() {
            // Don't change this function to be recursive, the call stack may 
            // overflow if there are too many CpNodes.
            var nodeMap = new Map();
            var cpNode = this;
            var newCpNode = new CpNode(cpNode.cp, cpNode.isHoleClosing, cpNode.isIntersection);
            newCpNode.matCurve = cpNode.matCurve;
            nodeMap.set(cpNode, newCpNode);
            var cpStack = [{ cpNode: cpNode, newCpNode: newCpNode }];
            while (cpStack.length) {
                var _cpStack$pop = cpStack.pop(),
                    _cpNode = _cpStack$pop.cpNode,
                    _newCpNode = _cpStack$pop.newCpNode;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = EDGES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var edge = _step.value;

                        var node = _cpNode[edge];
                        var newNode = nodeMap.get(node);
                        if (!newNode) {
                            newNode = new CpNode(node.cp, node.isHoleClosing, node.isIntersection);
                            newNode.matCurve = node.matCurve;
                            nodeMap.set(node, newNode);
                            cpStack.push({ cpNode: node, newCpNode: newNode });
                        }
                        _newCpNode[edge] = newNode;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            return newCpNode;
        }
        /**
         * Insert an item into the linked loop after the specified point and returns
         * the freshly inserted item.
         * @param cp - Item to insert
         * @param prev_ - Inserts the new item right after this item if the loop is
         * not empty, else insert the new item as the only item in the loop.
         */

    }, {
        key: "remove",
        value: function remove(cpTree, cpNode) {
            var prev = cpNode.prev;
            var next = cpNode.next;
            prev.next = next;
            next.prev = prev;
            cpTree.remove(cpNode, false);
        }
        /**
         * Return this and the the other CpNodes around the vertex circle in order.
         */

    }, {
        key: "getNodes",
        value: function getNodes() {
            var startCp = this;
            var cp = startCp;
            var cps = [];
            do {
                cps.push(cp);
                cp = cp.nextOnCircle;
            } while (cp !== startCp);
            return cps;
        }
    }, {
        key: "isTerminating",
        value: function isTerminating() {
            var cp = this;
            return cp === cp.next.prevOnCircle;
        }
    }, {
        key: "isSharp",
        value: function isSharp() {
            var cpNode = this;
            return cpNode.cp.circle.radius === 0;
        }
        /**
         * Returns true if this ListNode is a one-prong (including
         * sharp corners).
         */

    }, {
        key: "isOneProng",
        value: function isOneProng() {
            var cp = this;
            if (cp.isSharp()) {
                return true;
            }
            if (cp.isThreeProng()) {
                return false;
            }
            var cp2 = cp.nextOnCircle;
            var p1 = cp.cp.pointOnShape.p;
            var p2 = cp2.cp.pointOnShape.p;
            return p1[0] === p2[0] && p1[1] === p2[1];
        }
    }, {
        key: "isThreeProng",
        value: function isThreeProng() {
            var cp = this;
            return cp.getNodes().length === 3;
        }
        /**
         * Advances the node by the given number of steps. This is slow ( O(n) );
         * use mostly for debugging.
         * @param node - Node to start counting from
         * @param n - Number of steps to advance
         */

    }], [{
        key: "insert",
        value: function insert(isHoleClosing, isIntersection, cpTree, cp, prev_) {
            var cpNode = new CpNode(cp, isHoleClosing, isIntersection);
            if (typeof _debug_ !== 'undefined') {
                _debug_.generated.elems.cpNode.push(new cp_node_for_debugging_1.CpNodeForDebugging(_debug_.generated, cpNode));
            }
            var prev = void 0;
            var next = void 0;
            if (!prev_) {
                prev = cpNode;
                next = cpNode;
            } else {
                prev = prev_;
                next = prev.next;
            }
            next.prev = cpNode;
            prev.next = cpNode;
            cpNode.prev = prev;
            cpNode.next = next;
            cpTree.insert(cpNode);
            return cpNode;
        }
    }, {
        key: "advanceNSteps",
        value: function advanceNSteps(node, n) {
            for (var i = 0; i < n; i++) {
                node = node.next;
            }
            return node;
        }
    }]);

    return CpNode;
}();

CpNode.comparator = function (a, b) {
    return contact_point_1.ContactPoint.compare(a.cp, b.cp);
};
exports.CpNode = CpNode;

},{"./contact-point":54,"./debug/cp-node-for-debugging":57}],56:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var memoize = flo_memoize_1.default.m1;

var Curve = function () {
    /**
     * Representation of a curve in a linked loop (of bezier curves).
     * @param loop The linked loop this node belongs to.
     * @param ps The bezier points.
     * @param prev The previous curve.
     * @param next The next curve.
     * @param idx The curve's ordered index in the loop.
     */
    function Curve(loop, ps, prev, next, idx) {
        _classCallCheck(this, Curve);

        this.loop = loop;
        this.ps = ps;
        this.prev = prev;
        this.next = next;
        this.idx = idx;
    }

    _createClass(Curve, null, [{
        key: "getCornerAtEnd",
        value: function getCornerAtEnd(curve) {
            return _getCornerAtEnd(curve);
        }
    }]);

    return Curve;
}();

exports.Curve = Curve;
// Angle in degrees
var DEGREES = {
    //'0'    : 0.0000,
    0.25: 0.0050,
    1: 0.0167,
    4: 0.0698,
    16: 0.2756
};
var DEGREE_LIMIT = DEGREES[1];
/**
 * Gets the cross of the unit tangents of the vector at the end of this
 * curve and the start of the next curve.
 */
var _getCornerAtEnd = memoize(function (curve) {
    var tans = [flo_bezier3_1.tangent(curve.ps, 1), flo_bezier3_1.tangent(curve.next.ps, 0)];
    var crossTangents = flo_vector2d_1.cross(tans[0], tans[1]);
    return {
        tans: tans,
        crossTangents: crossTangents,
        isSharp: crossTangents < 0,
        isDull: crossTangents > 0,
        isQuiteSharp: crossTangents < -DEGREE_LIMIT,
        isQuiteDull: crossTangents > +DEGREE_LIMIT
    };
});

},{"flo-bezier3":3,"flo-memoize":41,"flo-vector2d":50}],57:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class used for debugging only.
 */

var CpNodeForDebugging = function CpNodeForDebugging(generated, cpNode) {
    _classCallCheck(this, CpNodeForDebugging);

    this.generated = generated;
    this.cpNode = cpNode;
};

exports.CpNodeForDebugging = CpNodeForDebugging;

},{}],58:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Vector = _dereq_("flo-vector2d");
var Bezier3 = _dereq_("flo-bezier3");
var Svg = _dereq_("../svg/svg");
var general_1 = _dereq_("./functions/general");
var two_prong_1 = _dereq_("./functions/two-prong");
var three_prong_1 = _dereq_("./functions/three-prong");
var draw_elem_1 = _dereq_("./functions/draw-elem/draw-elem");

var Generated = function Generated(path, g) {
    _classCallCheck(this, Generated);

    this.path = path;
    this.g = g;
    this.elems = {
        twoProng_regular: [],
        twoProng_failed: [],
        twoProng_notAdded: [],
        twoProng_deleted: [],
        twoProng_holeClosing: [],
        looseBoundingBox: [],
        tightBoundingBox: [],
        oneProng: [],
        oneProngAtDullCorner: [],
        sharpCorner: [],
        dullCorner: [],
        minY: [],
        threeProng: [],
        boundingHull: [],
        mat: [],
        sat: [],
        cpNode: [],
        loop: [],
        loops: [],
        maxVertex: [],
        leaves: [],
        culls: [],
        intersection: []
    };
    this.timing = {
        simplify: [0, 0],
        holeClosers: [0, 0],
        oneAnd2Prongs: [0, 0],
        threeProngs: [0, 0],
        mats: [0, 0],
        sats: [0, 0]
    };
};

exports.Generated = Generated;

var MatDebug = function () {
    /**
     * @param fs - some useful functions.
     */
    function MatDebug(draw) {
        _classCallCheck(this, MatDebug);

        /* The current path for which MATs are being found */
        this.generated = undefined;
        /* Generated by debug object for later inspection */
        this.generatedAll = new Map();
        // These are included only for quick debugging from console
        this.Bezier3 = Bezier3;
        this.Vector2d = Vector;
        this.Svg = Svg;
        this.directives = {
            stopAfterHoleClosers: false,
            stopAfterHoleClosersNum: undefined,
            stopAfterTwoProngs: false,
            stopAfterTwoProngsNum: undefined,
            stopAfterThreeProngs: false
        };
        /**
         * These functions are meant to be used in the console, e.g. in the
         * console try typing d.fs.twoProng.traceConvergence(0);
         */
        this.fs = Object.assign({ draw: draw }, general_1.generalDebugFunctions, { twoProng: two_prong_1.twoProngDebugFunctions, threeProng: three_prong_1.threeProngDebugFunctions, drawElem: draw_elem_1.drawElemFunctions });
    }

    _createClass(MatDebug, [{
        key: "createNewGenerated",
        value: function createNewGenerated(loops, path, g) {
            this.generated = new Generated(path, g);
            this.generatedAll.set(loops, this.generated);
        }
    }]);

    return MatDebug;
}();

exports.MatDebug = MatDebug;

},{"../svg/svg":171,"./functions/draw-elem/draw-elem":62,"./functions/general":79,"./functions/three-prong":80,"./functions/two-prong":81,"flo-bezier3":3,"flo-vector2d":50}],59:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function boundingHull(g, hull) {
    var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'thin5 black nofill';

    var $polygon = _debug_.fs.draw.polygon(g, hull, style);
    return $polygon;
}
exports.boundingHull = boundingHull;

},{}],60:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function culls(g, culls) {
    var $elems = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = culls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var circle = _step.value;

            var p = circle.center;
            $elems.push(drawCircle(g, p, 0.4, 'cyan thin5 nofill'));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return $elems;
}
exports.culls = culls;
function drawCircle(g, center, radiusPercent, classes) {
    var XMLNS = 'http://www.w3.org/2000/svg';
    var $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", center[0].toString());
    $circle.setAttributeNS(null, "cy", center[1].toString());
    $circle.setAttributeNS(null, "r", radiusPercent.toString() + '%');
    $circle.setAttributeNS(null, "class", classes);
    g.appendChild($circle);
    return $circle;
}

},{}],61:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function drawCirclePercent(g, center, radiusPercent, classes) {
    var XMLNS = 'http://www.w3.org/2000/svg';
    var $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", center[0].toString());
    $circle.setAttributeNS(null, "cy", center[1].toString());
    $circle.setAttributeNS(null, "r", radiusPercent.toString() + '%');
    $circle.setAttributeNS(null, "class", classes);
    g.appendChild($circle);
    return $circle;
}
exports.drawCirclePercent = drawCirclePercent;

},{}],62:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var one_prong_1 = _dereq_("./one-prong");
var two_prong_1 = _dereq_("./two-prong");
var three_prong_1 = _dereq_("./three-prong");
var vertex_1 = _dereq_("./vertex");
var min_y_1 = _dereq_("./min-y");
var bounding_hull_1 = _dereq_("./bounding-hull");
var loose_bounding_box_1 = _dereq_("./loose-bounding-box");
var tight_bounding_box_1 = _dereq_("./tight-bounding-box");
var sharp_corner_1 = _dereq_("./sharp-corner");
var dull_corner_1 = _dereq_("./dull-corner");
var mat_1 = _dereq_("./mat");
var loop_1 = _dereq_("./loop");
var loops_1 = _dereq_("./loops");
var max_vertex_1 = _dereq_("./max-vertex");
var leaves_1 = _dereq_("./leaves");
var culls_1 = _dereq_("./culls");
var intersection_1 = _dereq_("./intersection");
var one_prong_at_dull_corner_1 = _dereq_("./one-prong-at-dull-corner");
var drawElemFunctions = {
    oneProng: one_prong_1.oneProng,
    oneProngAtDullCorner: one_prong_at_dull_corner_1.oneProngAtDullCorner,
    twoProng_regular: two_prong_1.twoProng,
    twoProng_failed: two_prong_1.twoProng,
    twoProng_notAdded: two_prong_1.twoProng,
    twoProng_deleted: two_prong_1.twoProng,
    twoProng_holeClosing: two_prong_1.twoProng,
    threeProng: three_prong_1.threeProng,
    minY: min_y_1.minY,
    boundingHull: bounding_hull_1.boundingHull,
    looseBoundingBox: loose_bounding_box_1.looseBoundingBox,
    tightBoundingBox: tight_bounding_box_1.tightBoundingBox,
    sharpCorner: sharp_corner_1.sharpCorner,
    dullCorner: dull_corner_1.dullCorner,
    vertex: vertex_1.vertex,
    mat: mat_1.mat('mat', true),
    sat: mat_1.mat('sat', true),
    loop: loop_1.loop,
    loops: loops_1.loops,
    maxVertex: max_vertex_1.maxVertex,
    leaves: leaves_1.leaves,
    culls: culls_1.culls,
    intersection: intersection_1.intersection
};
exports.drawElemFunctions = drawElemFunctions;

},{"./bounding-hull":59,"./culls":60,"./dull-corner":63,"./intersection":64,"./leaves":65,"./loop":66,"./loops":67,"./loose-bounding-box":68,"./mat":69,"./max-vertex":70,"./min-y":71,"./one-prong":73,"./one-prong-at-dull-corner":72,"./sharp-corner":74,"./three-prong":75,"./tight-bounding-box":76,"./two-prong":77,"./vertex":78}],63:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function dullCorner(g, pos) {
    var scaleFactor = 0.1;
    var $pos = _debug_.fs.draw.dot(g, pos.p, 0.5 * scaleFactor, 'orange');
    return $pos;
}
exports.dullCorner = dullCorner;

},{}],64:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var draw_circle_percent_1 = _dereq_("./draw-circle-percent");
function intersection(g, x) {
    return [draw_circle_percent_1.drawCirclePercent(g, x.pos.p, 0.7, 'purple thin2 nofill')];
}
exports.intersection = intersection;

},{"./draw-circle-percent":61}],65:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var draw_circle_percent_1 = _dereq_("./draw-circle-percent");
function leaves(g, leaves) {
    var $elems = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = leaves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cpNode = _step.value;

            var cp = cpNode.cp;
            var p = cp.circle.center;
            $elems.push(draw_circle_percent_1.drawCirclePercent(g, p, 0.5, 'pinker thin5 nofill'));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return $elems;
}
exports.leaves = leaves;

},{"./draw-circle-percent":61}],66:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// TODO - finish
function loop(g, loop) {
    /*
    for (let curve of loop.curves) {
        _debug_.fs.draw.bezier(g, curve.ps, undefined, 1000);
    }
    */
    return [];
}
exports.loop = loop;

},{}],67:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// TODO - finish
function loops(g, loops) {
    return [];
}
exports.loops = loops;

},{}],68:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function looseBoundingBox(g, box) {
    var $box = _debug_.fs.draw.rect(g, box, 'thin5 brown nofill');
    return $box;
}
exports.looseBoundingBox = looseBoundingBox;

},{}],69:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var traverse_edges_1 = _dereq_("../../../mat/traverse-edges");
function mat(type, smooth) {
    var classes = type === 'mat' ? 'thin5 purple nofill' : 'thin10 red nofill';
    return f;
    function f(g, mat) {
        var cpNode = mat.cpNode;
        if (!cpNode) {
            return undefined;
        }
        var draw = _debug_.fs.draw;
        var $svgs = [];
        //const DRAW_CLASS_LINE = 'thin20 blue1 nofill';
        //const DRAW_CLASS_QUAD = 'thin20 blue2 nofill';
        //const DRAW_CLASS_CUBE = 'thin20 blue3 nofill';
        traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
            if (cpNode.isTerminating()) {
                return;
            }
            if (!smooth) {
                var p1 = cpNode.cp.circle.center;
                var p2 = cpNode.next.cp.circle.center;
                $svgs.push.apply($svgs, _toConsumableArray(draw.line(g, [p1, p2], classes)));
                return;
            }
            var bezier = cpNode.matCurve;
            if (!bezier) {
                return;
            }
            var fs = [,, draw.line, draw.quadBezier, draw.bezier];
            $svgs.push.apply($svgs, _toConsumableArray(fs[bezier.length](g, bezier, classes)));
        });
        return $svgs;
    }
}
exports.mat = mat;

},{"../../../mat/traverse-edges":130}],70:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function maxVertex(g, cpNode) {
    var draw = _debug_.fs.draw;
    var circle = cpNode.cp.circle;
    var $elems = draw.circle(g, circle, 'brown thin10 nofill');
    return $elems;
}
exports.maxVertex = maxVertex;

},{}],71:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
function minY(g, pos) {
    var p = flo_bezier3_1.evaluate(pos.curve.ps, pos.t);
    var $elems = _debug_.fs.draw.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
exports.minY = minY;

},{"flo-bezier3":3}],72:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../../point-on-shape");
function oneProngAtDullCorner(g, pos) {
    var oCircle = point_on_shape_1.PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    var $center = _debug_.fs.draw.dot(g, pos.p, 0.1, 'orange');
    var $circle = _debug_.fs.draw.dot(g, oCircle.center, 0.25, 'orange');
    var $pos = _debug_.fs.draw.circle(g, oCircle, 'orange thin10 nofill');
    return [].concat(_toConsumableArray($center), _toConsumableArray($circle), _toConsumableArray($pos));
}
exports.oneProngAtDullCorner = oneProngAtDullCorner;

},{"../../../point-on-shape":133}],73:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../../point-on-shape");
var circle_1 = _dereq_("../../../circle");
var scaleFactor = 0.5;
function oneProng(g, pos) {
    var draw = _debug_.fs.draw;
    var circle = circle_1.Circle.scale(point_on_shape_1.PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos), 1);
    var $center = draw.dot(g, pos.p, 0.1 * scaleFactor, 'gray');
    var $circle = draw.dot(g, circle.center, 0.25 * scaleFactor, 'gray');
    var $pos = draw.circle(g, circle, 'gray thin10 nofill');
    return [].concat(_toConsumableArray($center), _toConsumableArray($circle), _toConsumableArray($pos));
}
exports.oneProng = oneProng;

},{"../../../circle":53,"../../../point-on-shape":133}],74:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function sharpCorner(g, pos) {
    var scaleFactor = 0.1;
    var $pos = _debug_.fs.draw.dot(g, pos.p, 0.6 * scaleFactor, 'green');
    return $pos;
}
exports.sharpCorner = sharpCorner;

},{}],75:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = _dereq_("../../../circle");
var scaleFactor = 0.3;
function threeProng(g, threeProng) {
    var draw = _debug_.fs.draw;
    var circle = circle_1.Circle.scale(threeProng.circle, 1);
    var poss = threeProng.poss;
    var $cp1 = draw.dot(g, poss[0].p, 0.1 * 1 * scaleFactor, 'blue');
    var $cp2 = draw.dot(g, poss[1].p, 0.1 * 2 * scaleFactor, 'blue');
    var $cp3 = draw.dot(g, poss[2].p, 0.1 * 3 * scaleFactor, 'blue');
    var $center = draw.dot(g, circle.center, 0.3 * scaleFactor, 'blue');
    var $circle = draw.circle(g, circle, 'blue thin2 nofill');
    return [].concat(_toConsumableArray($center), _toConsumableArray($cp1), _toConsumableArray($cp2), _toConsumableArray($cp3), _toConsumableArray($circle));
}
exports.threeProng = threeProng;

},{"../../../circle":53}],76:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function tightBoundingBox(g, box) {
    var $box = _debug_.fs.draw.polygon(g, box, 'thin5 black nofill');
    return $box;
}
exports.tightBoundingBox = tightBoundingBox;

},{}],77:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var get_two_prong_type_1 = _dereq_("../../../mat/get-two-prong-type");
function twoProng(g, twoProng) {
    //let scaleFactor = width/200;		
    var scaleFactor = 0.3;
    var $failedDot = [];
    var $center = [];
    var $circle = [];
    var $cp1 = [];
    var $cp2 = [];
    var color = void 0;
    var thin = void 0;
    var draw = _debug_.fs.draw;
    switch (get_two_prong_type_1.getTwoProngType(twoProng)) {
        case 'twoProng_regular':
            {
                color = 'red ';
                thin = '2';
                break;
            }
        case 'twoProng_failed':
            {
                $failedDot = draw.dot(g, twoProng.pos.p, 1 * scaleFactor, 'black');
                return;
            }
        case 'twoProng_notAdded':
            {
                color = 'brown ';
                thin = '10';
                break;
            }
        case 'twoProng_deleted':
            {
                color = 'gray ';
                thin = '2';
                break;
            }
        case 'twoProng_holeClosing':
            {
                color = 'cyan ';
                thin = '10';
                break;
            }
    }
    if (twoProng.failed) {
        $failedDot = draw.dot(g, twoProng.pos.p, 1 * scaleFactor, 'black');
    } else if (!twoProng.failed) {
        $center = draw.dot(g, twoProng.circle.center, 0.05 * scaleFactor, 'yellow');
        $circle = draw.circle(g, twoProng.circle, color + 'thin' + thin + ' nofill');
        $cp1 = draw.dot(g, twoProng.pos.p, 0.035 * scaleFactor, color);
        $cp2 = draw.dot(g, twoProng.z, 0.07 * scaleFactor, color);
    }
    return [].concat(_toConsumableArray($failedDot), _toConsumableArray($center), _toConsumableArray($circle), _toConsumableArray($cp1), _toConsumableArray($cp2));
}
exports.twoProng = twoProng;

},{"../../../mat/get-two-prong-type":122}],78:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
function vertex(g, cpNode) {
    var visible = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var displayDelay = arguments[3];

    var visibleClass = visible ? '' : ' invisible';
    var circle = cpNode.cp.circle;
    var draw = _debug_.fs.draw;
    var THIN = 'thin20';
    var cps = cpNode.getNodes();
    console.log(cps);
    var $svgs = [];
    var $circle = draw.circle(g, circle, 'red ' + THIN + ' nofill ' + visibleClass, displayDelay);
    var $crossHair = draw.crossHair(g, circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
    $svgs = [].concat(_toConsumableArray($circle), _toConsumableArray($crossHair));
    for (var i = 0; i < cps.length; i++) {
        var _$svgs, _$svgs2;

        var cp = cps[i];
        var edgeCircle = cp.next.cp.circle;
        var _$circle = draw.circle(g, edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, displayDelay);
        var _$crossHair = draw.crossHair(g, edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
        (_$svgs = $svgs).push.apply(_$svgs, _toConsumableArray(_$circle).concat(_toConsumableArray(_$crossHair)));
        var p1 = circle.center;
        var p2 = edgeCircle.center;
        var thin = i === 0 ? 'thin10' : i === 1 ? 'thin20' : 'thin35';
        var $line = draw.line(g, [p1, p2], 'yellow ' + thin + ' nofill ' + visibleClass, displayDelay);
        (_$svgs2 = $svgs).push.apply(_$svgs2, _toConsumableArray($line));
    }
    return $svgs;
}
exports.vertex = vertex;

},{}],79:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../point-on-shape");
var i = 0;
/** Name the given object - for debugging purposes only */
function nameObj(o) {
    var pre = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    o.name = '' + pre + i++;
}
/**
 * Transforms a boundary piece (δ) into a human readable string.
 * @param cpNodes A boundary piece given by two CpNodes.
 */
function δToString(cpNodes) {
    return cpNodes.map(function (cpNode) {
        return point_on_shape_1.PointOnShape.toHumanString(cpNode.cp.pointOnShape);
    });
}
/**
 * Transforms an array of boundary pieces (δs) into a human readable string.
 * @param cpNodes An array of boundary pieces.
 */
function δsToString(cpNodes) {
    return cpNodes.map(δToString);
}
/**
 * Convert the given points into a human readable string.
 * @param ps
 */
function pointsToStr(ps) {
    var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

    return ps.map(function (p) {
        return pointToStr(p, decimalPlaces);
    });
}
/**
 * Converts the given point into a human readable string.
 * @param p - The point
 * @param decimalPlaces - number of decimal places
 */
function pointToStr(p) {
    var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

    return p[0].toFixed(decimalPlaces) + ', ' + p[1].toFixed(decimalPlaces);
}
var generalDebugFunctions = {
    δToString: δToString,
    δsToString: δsToString,
    pointToStr: pointToStr,
    pointsToStr: pointsToStr,
    nameObj: nameObj
};
exports.generalDebugFunctions = generalDebugFunctions;

},{"../../point-on-shape":133}],80:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var circle_1 = _dereq_("../../circle");
/**
 * Draws 3 lines from the given 3-prong center to its 3 contact points.
 * @param n - The 3-prong's zero-based index.
 */
function drawSpokes(n) {
    var threeProng = _debug_.generated.elems.threeProng[n];
    var g = threeProng.generated.g;
    var cc = threeProng.circle.center;
    var poss = threeProng.poss;
    _debug_.fs.draw.line(g, [poss[0].p, cc], 'thin5 red');
    _debug_.fs.draw.line(g, [poss[1].p, cc], 'thin5 red');
    _debug_.fs.draw.line(g, [poss[2].p, cc], 'thin5 red');
}
/**
 * Shows the circle for each boundary iteration.
 * @param n_ - The 3-prong's zero-based index. If ommitted, all will be shown.
 * @param idx - The specific boundary iteration index to view. If ommitted, all
 * will be shown.
 */
function traceConvergence(n_, idx) {
    var sIndx = void 0;
    var eIndx = void 0;
    if (n_ === undefined) {
        sIndx = 0;
        eIndx = _debug_.generated.elems.threeProng.length;
    } else {
        sIndx = n_;
        eIndx = n_ + 1;
    }
    for (var n = sIndx; n < eIndx; n++) {
        var forDebugging = _debug_.generated.elems.threeProng[n];
        var g = forDebugging.generated.g;
        console.log(forDebugging);
        var candidateThreeProngs = forDebugging.candidateThreeProngs;
        //-----------------------------
        //---- Get start and end index
        //-----------------------------
        var startIndx = void 0;
        var endIndx = void 0;
        if (n_ === undefined || idx === -1) {
            startIndx = forDebugging.bestIndx;
            endIndx = forDebugging.bestIndx + 1;
        } else {
            if (idx === undefined) {
                startIndx = 0;
                endIndx = candidateThreeProngs.length;
            } else {
                startIndx = idx;
                endIndx = idx + 1;
            }
        }
        //---------------------------------
        //---- Draw candidate three-prongs
        //---------------------------------
        for (var i = startIndx; i < endIndx; i++) {
            var circle = candidateThreeProngs[i].circle;
            if (forDebugging.bestIndx === i) {
                _debug_.fs.draw.dot(g, circle.center, 0.2, 'green');
                _debug_.fs.draw.circle(g, circle, 'black thin10 nofill');
            } else {
                _debug_.fs.draw.dot(g, circle.center, 0.2, 'cyan');
                _debug_.fs.draw.circle(g, circle, 'cyan thin5 nofill');
            }
        }
    }
}
/**
 * Shows the actual boundary for each iteration.
 * @param n The 3-prong's zero-based index.
 * @param idx The specific boundary iteration index to view. If ommitted will
 * show all.
 */
function showBoundary(n, idx) {
    var debugInfo = _debug_.generated.elems.threeProng[n];
    var g = debugInfo.generated.g;
    var candidateThreeProngs = debugInfo.candidateThreeProngs;
    var startIndx = idx === undefined ? 0 : idx;
    var endIndx = idx === undefined ? candidateThreeProngs.length : idx;
    // Draw relevant δs
    var cpss = debugInfo.cpss;
    var j = 0;
    // For each iteration of δ3s (indexed by j)
    for (var _idx = 1; _idx < cpss.length - 1; _idx++) {
        if (!(j >= startIndx && j <= endIndx)) {
            j++;
            continue;
        }
        var δ3s = [cpss[0], cpss[_idx], cpss[cpss.length - 1]];
        // For each of the 3 δs
        for (var i = 0; i < 3; i++) {
            var δ = δ3s[i];
            var δS = δ[0]; // Delta Start
            var δE = δ[1]; // Delta End
            var posS = δS.cp.pointOnShape;
            var posE = δE.cp.pointOnShape;
            var pS = posS.p;
            var pE = posE.p;
            var r = 1 + i * 0.5;
            if (flo_vector2d_1.equal(pS, pE)) {
                _debug_.fs.draw.crossHair(g, pS, 'red thin10 nofill', r);
            } else {
                _debug_.fs.draw.crossHair(g, pS, 'green thin10 nofill', r);
                _debug_.fs.draw.crossHair(g, pE, 'blue thin10 nofill', r);
            }
        }
        j++;
    }
}
/**
 * @param n The 3-prong's zero-based index.
 */
function logδs(n) {
    var threeProng = _debug_.generated.elems.threeProng[n];
    console.log(threeProng.cpss);
}
/**
 *
 * @param p
 */
function logNearest(p) {
    var inclSpokes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var inclTrace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var inclBoundaries = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var closestPerLoops = [];
    _debug_.generatedAll.forEach(function (generated) {
        var threeProng = flo_vector2d_1.getObjClosestTo(p, generated.elems.threeProng, function (threeProng) {
            return threeProng.circle.center;
        });
        closestPerLoops.push(threeProng);
    });
    var threeProng = flo_vector2d_1.getObjClosestTo(p, closestPerLoops, function (threeProng) {
        return threeProng.circle.center;
    });
    var circle = threeProng.circle;
    var g = threeProng.generated.g;
    console.log(threeProng);
    var circle2 = new circle_1.Circle(circle.center, circle.radius || 1);
    var draw = _debug_.fs.draw;
    draw.circle(g, circle2, 'green thin10 nofill', 1000);
    // Boundaries
    var boundaries = threeProng.boundaries;
    var boundaryS = boundaries[0];
    var boundaryE = boundaries[boundaries.length - 1];
    draw.beziers(g, boundaryS, 'red thin5 nofill');
    for (var i = 1; i < boundaries.length - 1; i++) {
        var boundary = boundaries[i];
        draw.beziers(g, boundary, 'green thin5 nofill');
    }
    draw.beziers(g, boundaryE, 'blue thin5 nofill');
    // Trace
    var traces = threeProng.traces;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = traces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var trace = _step.value;

            draw.polyline(g, trace, 'red thin5 nofill');
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
var threeProngDebugFunctions = {
    drawSpokes: drawSpokes,
    traceConvergence: traceConvergence,
    showBoundary: showBoundary,
    logδs: logδs,
    logNearest: logNearest
};
exports.threeProngDebugFunctions = threeProngDebugFunctions;

},{"../../circle":53,"flo-vector2d":50}],81:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = _dereq_("../../circle");
var flo_vector2d_1 = _dereq_("flo-vector2d");
/**
 *
 */
function logδ(n) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'twoProng_regular';

    var δ = _debug_.generated.elems[type][n].δ;
    console.log(δ);
}
/**
 *
 */
function log(n) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'twoProng_regular';

    var twoProng = _debug_.generated.elems[type][n];
    console.log(twoProng);
}
/**
 *
 */
function drawNormal(n) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'twoProng_regular';

    var twoProngs = _debug_.generated.elems[type];
    // If not specified which, draw all
    if (n === undefined) {
        for (var i = 0; i < twoProngs.length; i++) {
            drawNormal(i);
        }
    }
    var twoProng = twoProngs[n];
    var g = twoProng.generated.g;
    if (!twoProng) {
        return;
    }
    _debug_.fs.draw.line(g, [twoProng.pos.p, twoProng.circle.center], 'thin10 blue');
}
/**
 *
 */
function logδBasic(n) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'twoProng_regular';

    var delta = _debug_.generated.elems[type][n].δ;
    function f(x) {
        var pos = x.cp.pointOnShape;
        return {
            bez: pos.curve.ps,
            t: pos.t
        };
    }
    console.log(f(delta[0]));
    console.log(f(delta[1]));
}
/**
 *
 */
function logNearest(p) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'twoProng_regular';

    var closestPerLoops = [];
    _debug_.generatedAll.forEach(function (generated, loops) {
        var twoProng = flo_vector2d_1.getObjClosestTo(p, generated.elems[type], function (twoProng) {
            return twoProng.circle.center;
        });
        closestPerLoops.push(twoProng);
    });
    var twoProng = flo_vector2d_1.getObjClosestTo(p, closestPerLoops, function (twoProng) {
        return twoProng.circle.center;
    });
    var g = twoProng.generated.g;
    console.log(twoProng);
    var circle_ = twoProng.circle;
    var circle = new circle_1.Circle(circle_.center, circle_.radius || 1);
    _debug_.fs.draw.circle(g, circle, 'green thin10 nofill', 1000);
    var n = void 0;
    for (var i = 0; i < _debug_.generated.elems[type].length; i++) {
        var twoProng_ = _debug_.generated.elems[type][i];
        if (twoProng_ === twoProng) {
            n = i;
            break;
        }
    }
    if (n !== undefined) {
        traceConvergence(n, true);
    }
}
/**
 *
 * @param n - The 2-prong's zero-based index.
 * @param range
 * cascade of convergence)
 */
function traceConvergence(n, finalOnly) {
    var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'twoProng_regular';

    if (n === undefined) {
        return;
    }
    var twoProngInfo = _debug_.generated.elems[type][n];
    var xs = twoProngInfo.xs;
    var g = twoProngInfo.generated.g;
    console.log(twoProngInfo);
    console.log(twoProngInfo.xs.map(function (x) {
        return {
            x: x.x,
            y: x.y,
            z: x.z,
            d: x.z ? flo_vector2d_1.squaredDistanceBetween(x.y.p, x.z.p) : 0,
            t: x.t
        };
    }));
    for (var i = 0; i < xs.length; i++) {
        if (range && (i < range[0] || i >= range[1])) {
            continue;
        }
        if (finalOnly && i !== xs.length - 1) {
            continue;
        }
        var x = twoProngInfo.xs[i];
        var circle = new circle_1.Circle(x.x, flo_vector2d_1.distanceBetween(x.x, x.y.p));
        _debug_.fs.draw.crossHair(g, x.x, 'red thin10 nofill');
        _debug_.fs.draw.circle(g, circle, 'blue thin10 nofill');
        if (x.z !== undefined) {
            _debug_.fs.draw.crossHair(g, x.z.p, 'yellow thin10 nofill', 2);
        }
    }
    twoProngDebugFunctions.drawNormal(n);
}
var twoProngDebugFunctions = {
    logδ: logδ,
    log: log,
    drawNormal: drawNormal,
    logδBasic: logδBasic,
    traceConvergence: traceConvergence,
    logNearest: logNearest
};
exports.twoProngDebugFunctions = twoProngDebugFunctions;

},{"../../circle":53,"flo-vector2d":50}],82:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../point-on-shape");
/**
 * Class used in debugging. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */

var ThreeProngForDebugging = function () {
  /**
   * @param circle The best fit circle found for the 3-prong.
   * @param poss The best fit 3 points found for the 3-prong.
   * @param cp3ss The 3 boundary pieces on which the three prong points were
   * found.
   * @param cpss The boundary pieces that were used to search the three prong
   * on.
   * @param bestIndx
   * @param candidateThreeProngs An array of 3-prongs, each of which may be a
   * best fit 3-prong.
   */
  function ThreeProngForDebugging() {
    _classCallCheck(this, ThreeProngForDebugging);
  }

  _createClass(ThreeProngForDebugging, [{
    key: "cpsSimple",
    get: function get() {
      return this.cpss.map(function (δ) {
        return [point_on_shape_1.PointOnShape.toHumanString(δ[0].cp.pointOnShape), point_on_shape_1.PointOnShape.toHumanString(δ[1].cp.pointOnShape)];
      });
    }
  }]);

  return ThreeProngForDebugging;
}();

exports.ThreeProngForDebugging = ThreeProngForDebugging;

},{"../point-on-shape":133}],83:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var TwoProngForDebugging = function TwoProngForDebugging(generated, bezierPieces, pos, δ, z, circle, xs, failed, holeClosing, notAdded, deleted) {
    _classCallCheck(this, TwoProngForDebugging);

    this.generated = generated;
    this.bezierPieces = bezierPieces;
    this.pos = pos;
    this.δ = δ;
    this.z = z;
    this.circle = circle;
    this.xs = xs;
    this.failed = failed;
    this.holeClosing = holeClosing;
    this.notAdded = notAdded;
    this.deleted = deleted;
};

exports.TwoProngForDebugging = TwoProngForDebugging;

},{}],84:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var curve_1 = _dereq_("./curve");
/**
 * Represents a two-way linked loop of Curves.
 */

var Loop = function () {
    /**
     * @param items - A pre-ordered array of items to add initially
     */
    function Loop() {
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Loop);

        this.items = items;
        this.curves = [];
        var loop = this;
        if (items.length === 0) {
            return undefined;
        }
        var head = void 0;
        var prev = null;
        var node = void 0;
        for (var i = 0; i < items.length; i++) {
            node = new curve_1.Curve(loop, items[i], prev, null, i);
            loop.curves.push(node);
            if (prev) {
                prev.next = node;
            }
            prev = node;
            if (i === 0) {
                head = node;
            }
        }
        // Close loop
        head.prev = node;
        node.next = head;
        this.head = head;
    }

    _createClass(Loop, [{
        key: "toBeziers",
        value: function toBeziers() {
            var beziers = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.curves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var curve = _step.value;

                    beziers.push(curve.ps);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return beziers;
        }
    }], [{
        key: "perturb",
        value: function perturb(loop, x) {
            if (!x) {
                return loop;
            }
            var seed = 2311; // Just some value
            var newItems = [];
            for (var i = 0; i < loop.items.length; i++) {
                // This gets us a predictable random number between 0 and 1;
                var rand1 = flo_poly_1.default.random.flatCoefficients(6, -1, 1, seed);
                var rs = rand1.p;
                seed = rand1.seed; // Get next seed.
                var vs = rs.map(function (r) {
                    return r * x;
                });
                console.log(vs);
                var ps = loop.items[i];

                var _ps = _slicedToArray(ps, 3),
                    _ps$ = _slicedToArray(_ps[0], 2),
                    x0 = _ps$[0],
                    y0 = _ps$[1],
                    _ps$2 = _slicedToArray(_ps[1], 2),
                    x1 = _ps$2[0],
                    y1 = _ps$2[1],
                    _ps$3 = _slicedToArray(_ps[2], 2),
                    x2 = _ps$3[0],
                    y2 = _ps$3[1];

                var newPs = [[x0 + vs[0], y0 + vs[1]], [x1 + vs[2], y1 + vs[3]], [x2 + vs[4], y2 + vs[5]], [0, 0]];
                if (i !== 0) {
                    var _prev = newItems[newItems.length - 1];
                    _prev[3][0] = newPs[0][0];
                    _prev[3][1] = newPs[0][1];
                }
                newItems.push(newPs);
            }
            var last = newItems[newItems.length - 1];
            last[3][0] = newItems[0][0][0];
            last[3][1] = newItems[0][0][1];
            return new Loop(newItems);
        }
    }]);

    return Loop;
}();

exports.Loop = Loop;

},{"./curve":56,"flo-poly":42}],85:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
;
/**
 * Represents a complete Medial Axis Transform (MAT).
 */

var Mat =
/**
 * @param cpNode
 * @param cpTrees
 */
function Mat(cpNode, cpTrees) {
  _classCallCheck(this, Mat);

  this.cpNode = cpNode;
  this.cpTrees = cpTrees;
};

exports.Mat = Mat;

},{}],86:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contact_point_1 = _dereq_("../contact-point");
var cp_node_1 = _dereq_("../cp-node");
var get_neighboring_cps_1 = _dereq_("./get-neighboring-cps");
function addToCpGraph(circle, orders, cpTrees, poss, neighbors) {
    var newCps = poss.map(function (pos, i) {
        var cpTree = cpTrees.get(pos.curve.loop);
        var newCp_ = new contact_point_1.ContactPoint(pos, circle, orders[i], 0);
        var neighboringCp = neighbors ? neighbors[i] : get_neighboring_cps_1.getNeighbouringPoints(cpTree, pos, orders[i], 0);
        var newCp = cp_node_1.CpNode.insert(false, false, cpTree, newCp_, neighboringCp[0]);
        return newCp;
    });
    var len = poss.length;
    for (var i = 0; i < len; i++) {
        var indxPrev = i === 0 ? len - 1 : i - 1;
        var indxNext = i === len - 1 ? 0 : i + 1;
        newCps[i].prevOnCircle = newCps[indxPrev];
        newCps[i].nextOnCircle = newCps[indxNext];
    }
}
exports.addToCpGraph = addToCpGraph;

},{"../contact-point":54,"../cp-node":55,"./get-neighboring-cps":121}],87:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_ll_rb_tree_1 = _dereq_("flo-ll-rb-tree");
var cp_node_1 = _dereq_("../cp-node");
var traverse_edges_1 = _dereq_("./traverse-edges");
function createNewCpTree(cpNode) {
    var newCpTrees = new Map();
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
        var loop = cpNode.cp.pointOnShape.curve.loop;
        var cpTree = newCpTrees.get(loop);
        if (!cpTree) {
            cpTree = new flo_ll_rb_tree_1.default(cp_node_1.CpNode.comparator, [], true);
            newCpTrees.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    });
    return newCpTrees;
}
exports.createNewCpTree = createNewCpTree;

},{"../cp-node":55,"./traverse-edges":130,"flo-ll-rb-tree":37}],88:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../point-on-shape");
var add_to_cp_graph_1 = _dereq_("../add-to-cp-graph");
var is_another_cp_closeby_1 = _dereq_("../is-another-cp-closeby");
/**
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos
 */
function add1Prong(maxOsculatingCircleRadius, cpGraphs, pos) {
    if (point_on_shape_1.PointOnShape.isDullCorner(pos)) {
        // This is a 1-prong at a dull corner.
        // TODO IMPORTANT 
        // Remove this line, uncomment piece below it and implement the 
        // following strategy to find the 3-prongs: if deltas are conjoined due 
        // to dull corner, split the conjoinment by inserting successively 
        // closer (binary division) 2-prongs. If a 2-prong actually fails, 
        // simply remove the 1-prong at the dull corner. In this way **all** 
        // terminal points are found, e.g. zoom in on top left leg of ant.
        // Afterthought: there is a better way - split points by two prongs.
        //toRemove.push(posNode); // this!
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.elems.oneProngAtDullCorner.push(pos);
        }
        return;
    }
    var circle = point_on_shape_1.PointOnShape.getOsculatingCircle(maxOsculatingCircleRadius, pos);
    //console.log(maxOsculatingCircleRadius)
    var order = point_on_shape_1.PointOnShape.calcOrder(circle, pos);
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    if (is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, pos, circle, order, 0, 1000, 'magenta')) {
        return;
    }
    add_to_cp_graph_1.addToCpGraph(circle, [-0.5, +0.5], cpGraphs, [pos, pos]);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.oneProng.push(pos);
    }
}
exports.add1Prong = add1Prong;

},{"../../point-on-shape":133,"../add-to-cp-graph":86,"../is-another-cp-closeby":123}],89:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cp_node_1 = _dereq_("../../cp-node");
var contact_point_1 = _dereq_("../../contact-point");
var point_on_shape_1 = _dereq_("../../point-on-shape");
var is_another_cp_closeby_1 = _dereq_("../is-another-cp-closeby");
var get_neighboring_cps_1 = _dereq_("../get-neighboring-cps");
/**
 * Adds a 2-prong contact circle to the shape.
 * @param cpGraphs
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param holeClosing True if this is a hole-closing 2-prong, false otherwise
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function add2Prong(cpGraphs, circle, posSource, posAntipode, holeClosing, extreme) {
    var orderSource = point_on_shape_1.PointOnShape.calcOrder(circle, posSource);
    var orderAntipode = point_on_shape_1.PointOnShape.calcOrder(circle, posAntipode);
    var t_s = posSource.t;
    var curve = void 0;
    if (t_s === 0) {
        t_s = 1;
        curve = posSource.curve.prev;
        posSource = new point_on_shape_1.PointOnShape(curve, t_s);
    }
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    if (is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, posSource, circle, orderSource, 0, extreme, 'red') || is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, posAntipode, circle, orderAntipode, 0, extreme, 'red')) {
        if (typeof _debug_ !== 'undefined') {
            if (holeClosing) {
                _debug_.generated.elems['twoProng_holeClosing'].pop();
            } else {
                _debug_.generated.elems['twoProng_regular'].pop();
            }
        }
        return;
    }
    // Antipode
    var cpAntipode = new contact_point_1.ContactPoint(posAntipode, circle, orderAntipode, 0);
    var loopAntipode = posAntipode.curve.loop;
    var cpTreeAntipode = cpGraphs.get(loopAntipode);
    var deltaAntipode = get_neighboring_cps_1.getNeighbouringPoints(cpTreeAntipode, posAntipode, orderAntipode, 0);
    var newCpAntipode = cp_node_1.CpNode.insert(holeClosing, false, cpTreeAntipode, cpAntipode, deltaAntipode[0]);
    //console.log(cpAntipode.pointOnShape.t);
    // Source
    var cpSource = new contact_point_1.ContactPoint(posSource, circle, orderSource, 0);
    var loopSource = posSource.curve.loop;
    var cpTreeSource = cpGraphs.get(loopSource);
    var deltaSource = get_neighboring_cps_1.getNeighbouringPoints(cpTreeSource, posSource, orderSource, 0);
    var newCpSource = cp_node_1.CpNode.insert(holeClosing, false, cpTreeSource, cpSource, deltaSource[0]);
    //console.log(cpSource.pointOnShape.t);
    // Connect graph
    newCpSource.prevOnCircle = newCpAntipode;
    newCpSource.nextOnCircle = newCpAntipode;
    newCpAntipode.prevOnCircle = newCpSource;
    newCpAntipode.nextOnCircle = newCpSource;
    if (holeClosing) {
        // Duplicate ContactPoints
        var cpB2 = new contact_point_1.ContactPoint(posAntipode, circle, cpAntipode.order, +1);
        var newCpB2Node = cp_node_1.CpNode.insert(true, false, cpTreeAntipode, cpB2, newCpAntipode);
        var cpB1 = new contact_point_1.ContactPoint(posSource, circle, cpSource.order, -1);
        var newCpB1Node = cp_node_1.CpNode.insert(true, false, cpTreeSource, cpB1, newCpSource.prev);
        // Connect graph
        newCpB1Node.prevOnCircle = newCpB2Node;
        newCpB1Node.nextOnCircle = newCpB2Node;
        newCpB2Node.prevOnCircle = newCpB1Node;
        newCpB2Node.nextOnCircle = newCpB1Node;
        newCpAntipode.next = newCpSource;
        newCpSource.prev = newCpAntipode;
        newCpB1Node.next = newCpB2Node;
        newCpB2Node.prev = newCpB1Node;
    }
    return newCpSource;
}
exports.add2Prong = add2Prong;

},{"../../contact-point":54,"../../cp-node":55,"../../point-on-shape":133,"../get-neighboring-cps":121,"../is-another-cp-closeby":123}],90:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var add_to_cp_graph_1 = _dereq_("../add-to-cp-graph");
var is_another_cp_closeby_1 = _dereq_("../is-another-cp-closeby");
/**
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated)
 * points on the shape.
 * @param cpTrees
 * @param orders
 * @param threeProng
 */
function add3Prong(cpTrees, orders, threeProng) {
    var circle = threeProng.circle,
        ps = threeProng.ps,
        δ3s = threeProng.δ3s;
    // Keep for possible future debugging.	
    /*
    if (typeof _debug_ !== 'undefined') {
        for (let i=0; i<3; i++) {
            let cpBef = threeProng.δ3s[i][0].cp;
            let cpAft = threeProng.δ3s[i][1].cp;
            //let cmpBef = PointOnShape.compareInclOrder(cpBef.pointOnShape, ps[i], cpBef.order, orders[i]);
            //let cmpAft = PointOnShape.compareInclOrder(cpAft.pointOnShape, ps[i], cpAft.order, orders[i]);
              let cmpBef = PointOnShape.compare(cpBef.pointOnShape, ps[i]);
            let cmpAft = PointOnShape.compare(cpAft.pointOnShape, ps[i]);
              // len is used by debug functions to reference a particular
            // three-prong.
            let len = _debug_.generated.elems.threeProng.length-1;
            if (cmpBef > 0) {
                console.log('----------------------------------------');
                console.log(`3-prong order is wrong (bef) : i: ${i} - cmp: ${cmpBef} - n: ${len}`);
                console.log(threeProng);
                console.log(cpBef);
                console.log(cpAft);
                console.log(ps[i]);
            }
            if (cmpAft < 0) {
                console.log('----------------------------------------');
                console.log(`3-prong order is wrong (aft) : i: ${i} - cmp: ${cmpAft} - n: ${len}`);
                console.log(threeProng);
                console.log(cpBef);
                console.log(cpAft);
                console.log(ps[i]);
            }
        }
    }
    */
    // TODO - replace 1000 below with correct value

    is_another_cp_closeby_1.isAnotherCpCloseby(cpTrees, ps[0], circle, orders[0], 0, 1000, 'blue');
    is_another_cp_closeby_1.isAnotherCpCloseby(cpTrees, ps[1], circle, orders[1], 0, 1000, 'blue');
    is_another_cp_closeby_1.isAnotherCpCloseby(cpTrees, ps[2], circle, orders[2], 0, 1000, 'blue');
    add_to_cp_graph_1.addToCpGraph(circle, orders, cpTrees, ps, δ3s);
    return circle;
}
exports.add3Prong = add3Prong;

},{"../add-to-cp-graph":86,"../is-another-cp-closeby":123}],91:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var point_on_shape_1 = _dereq_("../../point-on-shape");
function addDebugInfo1(loops) {
    var _generated$elems$loop;

    if (typeof _debug_ === 'undefined') {
        return;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = loops[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var loop = _step.value;

            _debug_.fs.nameObj(loop, 'l|');
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var generated = _debug_.generated;
    generated.timing.holeClosers[0] = performance.now();
    (_generated$elems$loop = generated.elems.loop).push.apply(_generated$elems$loop, _toConsumableArray(loops));
    generated.elems.loops.push(loops);

    var _loop2 = function _loop2(_loop) {
        var i = 0;
        _loop.curves.forEach(function (curve) {
            var ps = curve.ps;
            var hull = flo_bezier3_1.getBoundingHull(ps);
            generated.elems.boundingHull.push(hull);
            var looseBoundingBox = flo_bezier3_1.getBoundingBox(ps);
            generated.elems.looseBoundingBox.push(looseBoundingBox);
            var tightBoundingBox = flo_bezier3_1.getBoundingBoxTight(ps);
            generated.elems.tightBoundingBox.push(tightBoundingBox);
            i++;
        });
    };

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = loops[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _loop = _step2.value;

            _loop2(_loop);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}
exports.addDebugInfo1 = addDebugInfo1;
function addDebugInfo2(pointOnShapeArrPerLoop) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    var generated = _debug_.generated;
    var timing = generated.timing;
    var now = performance.now();
    timing.holeClosers[1] += now - timing.holeClosers[0];
    timing.oneAnd2Prongs[0] = now;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = pointOnShapeArrPerLoop[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var pointsOnShape = _step3.value;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = pointsOnShape[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var pos = _step4.value;

                    if (point_on_shape_1.PointOnShape.isSharpCorner(pos)) {
                        generated.elems.sharpCorner.push(pos);
                    } else {
                        if (point_on_shape_1.PointOnShape.isDullCorner(pos)) {
                            generated.elems.dullCorner.push(pos);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
}
exports.addDebugInfo2 = addDebugInfo2;
function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    var generated = _debug_.generated;
    var timing = generated.timing;
    var now = performance.now();
    timing.oneAnd2Prongs[1] += now - timing.oneAnd2Prongs[0];
    timing.threeProngs[0] = now;
}
exports.addDebugInfo3 = addDebugInfo3;
function addDebugInfo4(mat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    var generated = _debug_.generated;
    var timing = generated.timing;
    generated.elems.mat.push(mat);
    timing.threeProngs[1] += performance.now() - timing.threeProngs[0];
    timing.mats[1] = timing.holeClosers[1] + timing.oneAnd2Prongs[1] + timing.threeProngs[1];
}
exports.addDebugInfo4 = addDebugInfo4;

},{"../../point-on-shape":133,"flo-bezier3":3}],92:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var get_contact_circles_at_interface_1 = _dereq_("../get-contact-circles-at-interface");
var get_bezier_curvature_extrema_1 = _dereq_("../get-bezier-curvature-extrema");
var point_on_shape_1 = _dereq_("../../point-on-shape");
/**
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
function createGetInterestingPointsOnLoop() {
    var additionalPointCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    return function (loop) {
        var allPoints = [];
        for (var i = 0; i < loop.curves.length; i++) {
            var curve = loop.curves[i];

            var _get_bezier_curvature = get_bezier_curvature_extrema_1.getBezierCurvatureExtrema(curve),
                maxCurvaturePoss = _get_bezier_curvature.maxCurvaturePoss,
                maxNegativeCurvaturePoss = _get_bezier_curvature.maxNegativeCurvaturePoss;

            allPoints.push.apply(allPoints, _toConsumableArray(get_contact_circles_at_interface_1.getContactCirclesAtInterface(curve)).concat(_toConsumableArray(maxCurvaturePoss), _toConsumableArray(maxNegativeCurvaturePoss)));
            var n = additionalPointCount + 1;
            for (var _i = 1; _i < n; _i++) {
                allPoints.push(new point_on_shape_1.PointOnShape(curve, _i / n));
            }
        }
        allPoints.sort(point_on_shape_1.PointOnShape.compare);
        return allPoints;
    };
}
exports.createGetInterestingPointsOnLoop = createGetInterestingPointsOnLoop;

},{"../../point-on-shape":133,"../get-bezier-curvature-extrema":115,"../get-contact-circles-at-interface":118}],93:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_ll_rb_tree_1 = _dereq_("flo-ll-rb-tree");
var circle_1 = _dereq_("../../circle");
var cp_node_1 = _dereq_("../../cp-node");
var contact_point_1 = _dereq_("../../contact-point");
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
function createInitialCpGraph(loops, cpTrees, sharpCornerss, xMap) {
    var cpNode = void 0;
    for (var k = 0; k < sharpCornerss.length; k++) {
        var sharpCorners = sharpCornerss[k];
        var cpTree = new flo_ll_rb_tree_1.default(cp_node_1.CpNode.comparator, [], true);
        var cpNode1 = undefined;
        var cpNode2 = undefined;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sharpCorners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var pos = _step.value;

                var ps = pos.curve.next.ps;
                var x = xMap.get(ps);
                var isIntersection = !!x;
                var circle = new circle_1.Circle(pos.p, 0);
                var cp1 = new contact_point_1.ContactPoint(pos, circle, -1, 0);
                var cp2 = new contact_point_1.ContactPoint(pos, circle, +1, 0);
                cpNode1 = cp_node_1.CpNode.insert(false, isIntersection, cpTree, cp1, cpNode2);
                cpNode2 = cp_node_1.CpNode.insert(false, isIntersection, cpTree, cp2, cpNode1);
                cpNode1.prevOnCircle = cpNode2;
                cpNode2.prevOnCircle = cpNode1;
                cpNode1.nextOnCircle = cpNode2;
                cpNode2.nextOnCircle = cpNode1;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (!cpNode) {
            cpNode = cpNode1;
        }
        var loop = loops[k];
        cpTrees.set(loop, cpTree);
    }
    return cpNode;
}
exports.createInitialCpGraph = createInitialCpGraph;

},{"../../circle":53,"../../contact-point":54,"../../cp-node":55,"flo-ll-rb-tree":37}],94:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var two_prong_for_debugging_1 = _dereq_("../../../debug/two-prong-for-debugging");
var get_two_prong_type_1 = _dereq_("../../get-two-prong-type");
function addDebugInfo(bezierPieces, failed, pos, circle, z, δ, xs, holeClosing) {
    var twoProng = new two_prong_for_debugging_1.TwoProngForDebugging(_debug_.generated, bezierPieces, pos, δ, z ? z.p : undefined, circle, xs, failed, holeClosing, false, false);
    var twoProngType = get_two_prong_type_1.getTwoProngType(twoProng);
    _debug_.generated.elems[twoProngType].push(twoProng);
}
exports.addDebugInfo = addDebugInfo;

},{"../../../debug/two-prong-for-debugging":83,"../../get-two-prong-type":122}],95:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var get_closest_square_distance_to_rect_1 = _dereq_("../../geometry/get-closest-square-distance-to-rect");
/**
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
function cullBezierPieces(bezierPieces, p, rSquared) {
    var CULL_THRESHOLD = 5;
    var TOLERANCE = 1 + 1e-3;
    if (bezierPieces.length <= CULL_THRESHOLD) {
        return bezierPieces;
    }
    var newPieces = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = bezierPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var bezierPiece = _step.value;

            var ps = bezierPiece.curve.ps;
            var rect = flo_bezier3_1.getBoundingBox(ps);
            var bd = get_closest_square_distance_to_rect_1.getClosestSquareDistanceToRect(rect, p);
            if (bd <= rSquared * TOLERANCE) {
                newPieces.push(bezierPiece);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return newPieces;
}
exports.cullBezierPieces = cullBezierPieces;

},{"../../geometry/get-closest-square-distance-to-rect":111,"flo-bezier3":3}],96:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var line_line_intersection_1 = _dereq_("../../geometry/line-line-intersection");
var get_closest_boundary_point_1 = _dereq_("../../get-closest-boundary-point");
var circle_1 = _dereq_("../../../circle");
var point_on_shape_1 = _dereq_("../../../point-on-shape");
var add_1_prong_1 = _dereq_("../add-1-prong");
var add_debug_info_1 = _dereq_("./add-debug-info");
var cull_bezier_pieces_1 = _dereq_("./cull-bezier-pieces");
var find_equidistant_point_on_line_1 = _dereq_("./find-equidistant-point-on-line");
var get_initial_bezier_pieces_1 = _dereq_("./get-initial-bezier-pieces");
/**
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and
 * the second one is found by the algorithm.
 *
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2
 * points.
 *
 * Before any 2-prongs are added the entire shape is our δΩ (1-prongs do not
 * reduce the boundary).
 *
 * As per the paper by Choi, Choi, Moon and Wee:
 *   "The starting point of this algorithm is a choice of a circle Br(x)
 *    centered at an interior point x which contains two boundary portions c and
 *    d of dΩ as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand.
 * @param loops A shape represented by path loops
 * @param extreme The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape
 * bounding box.
 * @param y The source point of the 2-prong to be found
 * @param isHoleClosing True if this is a hole-closing two-prong, false otherwise
 * @param k The loop array index
 */
function find2Prong(loops, extreme, squaredDiagonalLength, cpTrees, y, isHoleClosing, k) {
    var MAX_ITERATIONS = 25;
    var squaredSeperationTolerance = Math.pow(1e-6 * extreme, 2);
    //const oneProngTolerance = 1+1e-4;
    var oneProngTolerance = Math.pow(1e-4, 2);
    var squaredErrorTolerance = 1e-2 * squaredSeperationTolerance;
    var maxOsculatingCircleRadiusSquared = squaredDiagonalLength;
    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).

    var _get_initial_bezier_p = get_initial_bezier_pieces_1.getInitialBezierPieces(isHoleClosing, k, loops, cpTrees, y),
        bezierPieces = _get_initial_bezier_p.bezierPieces,
        δ = _get_initial_bezier_p.δ;
    /** The center of the two-prong (successively refined) */


    var x = void 0;
    var p = void 0;
    var r = void 0;
    if (isHoleClosing) {
        p = [y.p[0], y.p[1]];
        x = [p[0], p[1] - Math.sqrt(maxOsculatingCircleRadiusSquared)];
        r = maxOsculatingCircleRadiusSquared;
    } else {
        p = y.p;
        x = point_on_shape_1.PointOnShape.getOsculatingCircle(maxOsculatingCircleRadiusSquared, y).center;
        r = flo_vector2d_1.squaredDistanceBetween(p, x);
    }
    // The lines below is an optimization.
    var r_ = reduceRadius(extreme, bezierPieces, p, x);
    if (r > r_) {
        x = flo_vector2d_1.interpolate(p, x, Math.sqrt(r_ / r));
    }
    var xs = []; // Trace the convergence (for debugging).
    var z = void 0; // The antipode if the two-prong (successively refined)
    var i = 0;
    var done = 0;
    var failed = false; // The failed flag is set if a 2-prong cannot be found.
    var bezierPieces_ = bezierPieces;
    do {
        i++;
        var _r = flo_vector2d_1.squaredDistanceBetween(x, y.p);
        bezierPieces_ = cull_bezier_pieces_1.cullBezierPieces(bezierPieces_, x, _r);
        z = get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPieces_, x, y.curve, y.t);
        /*
        if (z.t === 0 || z.t === 1) {
            console.log(z, z.t)
        }
        */
        if (z === undefined) {
            if (typeof _debug_ !== 'undefined') {
                var elems = _debug_.generated.elems;
                var elem = isHoleClosing ? elems.twoProng_holeClosing : elems.twoProng_regular;
                var elemStr = isHoleClosing ? 'hole-closing: ' + elem.length : 'regular: ' + elem.length;
                console.log('failed: no closest point - ' + elemStr);
            }
            failed = true;
            break;
        }
        if (typeof _debug_ !== 'undefined') {
            xs.push({ x: x, y: y, z: z, t: y.t });
        }
        var d = flo_vector2d_1.squaredDistanceBetween(x, z.p);
        //if (i === 1 && d*oneProngTolerance >= r) {
        if (i === 1 && _r < d + oneProngTolerance) {
            // It is a 1-prong.
            add_1_prong_1.add1Prong(Math.sqrt(maxOsculatingCircleRadiusSquared), cpTrees, y);
            return undefined;
        }
        // TODO - squaredSeperationTolerance should in future be replaced with
        // a relative error, i.e. distance between y (or z) / length(y (or z)).
        if (!isHoleClosing && flo_vector2d_1.squaredDistanceBetween(y.p, z.p) <= squaredSeperationTolerance) {
            if (typeof _debug_ !== 'undefined') {
                var _elems = _debug_.generated.elems;
                var _elem = isHoleClosing ? _elems.twoProng_holeClosing : _elems.twoProng_regular;
                var _elemStr = isHoleClosing ? 'hole-closing: ' + _elem.length : 'regular: ' + _elem.length;
                /*
                console.log(
                    'failed: two-prong radius too small - ' + elemStr
                );
                */
            }
            failed = true;
            break;
        }
        // Find the point on the line connecting y with x that is  
        // equidistant from y and z. This will be our next x.
        var nextX = find_equidistant_point_on_line_1.findEquidistantPointOnLine(x, y.p, z.p);
        var squaredError = flo_vector2d_1.squaredDistanceBetween(x, nextX);
        x = nextX;
        if (squaredError < squaredErrorTolerance) {
            done++; // Do one more iteration
        } else if (i === MAX_ITERATIONS) {
            // Convergence was too slow.
            failed = true;
            break; // We're done
        }
    } while (done < 1);
    var circle = void 0;
    if (z !== undefined) {
        circle = new circle_1.Circle(x, flo_vector2d_1.distanceBetween(x, z.p));
    }
    if (typeof _debug_ !== 'undefined') {
        xs.push({ x: x, y: y, z: z, t: y.t });
        add_debug_info_1.addDebugInfo(bezierPieces, failed, y, circle, z, δ, xs, isHoleClosing);
    }
    return failed ? undefined : { circle: circle, z: z };
}
exports.find2Prong = find2Prong;
/**
 * Reduces the circle radius initially as an optimization step.
 */
function reduceRadius(extreme, bezierPieces, p, x) {
    var TOLERANCE = extreme * 1e-3;
    var prevP = undefined;
    var minRadius = Number.POSITIVE_INFINITY;
    for (var i = 0; i < bezierPieces.length; i++) {
        var bezierPiece = bezierPieces[i];
        var ps = bezierPiece.curve.ps;
        var ev = flo_bezier3_1.evaluate(ps);
        var p1 = ev(bezierPiece.ts[0]);
        var r1 = Number.POSITIVE_INFINITY;
        // Prevent evaluating the same points twice
        if (!prevP || prevP[0] !== p1[0] || prevP[1] !== p1[1]) {
            var cc1 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1);
            if (cc1) {
                r1 = flo_vector2d_1.squaredDistanceBetween(p, cc1);
            }
        }
        var r2 = Number.POSITIVE_INFINITY;
        var p2 = ev(bezierPiece.ts[1]);
        var cc2 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p2);
        if (cc2) {
            r2 = flo_vector2d_1.squaredDistanceBetween(p, cc2);
        }
        prevP = p2;
        var d = Math.min(r1, r2);
        if (d < minRadius) {
            minRadius = d;
        }
    }
    // The extra bit is to account for floating point precision.
    return minRadius + TOLERANCE;
}
/**
 *
 * @param p A point on the circle with normal pointing to x towards the center
 * of the circle.
 * @param x
 * @param p1 Another point on the circle.
 */
function getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1) {
    var TOLERANCE = Math.pow(1e-4 * extreme, 2);
    // Ignore if p and p1 are too close together
    if (flo_vector2d_1.squaredDistanceBetween(p, p1) < TOLERANCE) {
        return undefined;
    }
    /** The perpindicular bisector between the two given points on the circle */
    var pb = [(p[0] + p1[0]) / 2, (p[1] + p1[1]) / 2];
    var tangent = [p1[0] - p[0], p1[1] - p[1]];
    var normal = [-tangent[1], tangent[0]]; // Rotate by 90 degrees
    var pb2 = [pb[0] + normal[0], pb[1] + normal[1]];
    var res = line_line_intersection_1.lineLineIntersection([p, x], [pb, pb2]);
    if (!res) {
        return undefined;
    }
    var resO = [res[0] - p[0], res[1] - p[1]];
    var xO = [x[0] - p[0], x[1] - p[1]];
    if (flo_vector2d_1.dot(resO, xO) < 0) {
        return undefined;
    }
    return res;
}

},{"../../../circle":53,"../../../point-on-shape":133,"../../geometry/line-line-intersection":113,"../../get-closest-boundary-point":117,"../add-1-prong":88,"./add-debug-info":94,"./cull-bezier-pieces":95,"./find-equidistant-point-on-line":97,"./get-initial-bezier-pieces":98,"flo-bezier3":3,"flo-vector2d":50}],97:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param x
 * @param y
 * @param z
 * @returns The point on the line from y to x that is equidistant from y and z.
 */
function findEquidistantPointOnLine(x, y, z) {
    // Some basic algebra (not shown) finds the required point.
    // Swap axes if x and y are more aligned to y-axis than to x-axis.
    var swapAxes = Math.abs((x[1] - y[1]) / (x[0] - y[0])) > 1;
    // Cache
    var x1 = void 0,
        x2 = void 0,
        y1 = void 0,
        y2 = void 0,
        z1 = void 0,
        z2 = void 0;
    if (swapAxes) {
        x1 = x[1];
        x2 = x[0];
        y1 = y[1];
        y2 = y[0];
        z1 = z[1];
        z2 = z[0];
    } else {
        x1 = x[0];
        x2 = x[1];
        y1 = y[0];
        y2 = y[1];
        z1 = z[0];
        z2 = z[1];
    }
    // a <= 1 (due to swapped axes)
    var a = (x2 - y2) / (x1 - y1);
    var b = y2 - a * y1;
    var c = y1 * y1 + y2 * y2 - z1 * z1 - z2 * z2 + 2 * b * (z2 - y2);
    var d = y1 - z1 + a * (y2 - z2);
    var t1 = c / (2 * d);
    var t2 = a * t1 + b;
    return swapAxes ? [t2, t1] : [t1, t2];
}
exports.findEquidistantPointOnLine = findEquidistantPointOnLine;

},{}],98:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var get_neighboring_cps_1 = _dereq_("../../get-neighboring-cps");
var get_boundary_piece_beziers_1 = _dereq_("../../get-boundary-piece-beziers");
var bezier_piece_1 = _dereq_("../../../bezier-piece");
var point_on_shape_1 = _dereq_("../../../point-on-shape");
function getInitialBezierPieces(isHoleClosing, k, loops, cpTrees, y) {
    var bezierPieces = void 0;
    var δ = void 0;
    if (isHoleClosing) {
        bezierPieces = [];
        for (var k2 = 0; k2 < k; k2++) {
            var _bezierPieces;

            //let pieces = getBoundaryBeziers(loops[k2]);
            var pieces = loops[k2].curves.map(function (curve) {
                return new bezier_piece_1.BezierPiece(curve, [0, 1]);
            });
            (_bezierPieces = bezierPieces).push.apply(_bezierPieces, _toConsumableArray(pieces));
        }
    } else {
        var order = point_on_shape_1.PointOnShape.isDullCorner(y) ? y.t === 1 ? -1 : +1 : 0;
        var loop = loops[k];
        var cpNode = get_neighboring_cps_1.getNeighbouringPoints(cpTrees.get(loop), y, order, 0)[0];
        δ = [cpNode, cpNode];
        if (!cpNode ||
        // The special case if there is only a single sharp corner or 
        // terminating 2-prong currently in the MAT. Don't remove!
        cpNode === cpNode.next.next) {
            bezierPieces = loop.curves.map(function (curve) {
                return new bezier_piece_1.BezierPiece(curve, [0, 1]);
            });
        } else {
            bezierPieces = get_boundary_piece_beziers_1.getBoundaryPieceBeziers(δ);
        }
    }
    return { bezierPieces: bezierPieces, δ: δ };
}
exports.getInitialBezierPieces = getInitialBezierPieces;

},{"../../../bezier-piece":51,"../../../point-on-shape":133,"../../get-boundary-piece-beziers":116,"../../get-neighboring-cps":121}],99:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var get_closest_points_1 = _dereq_("./get-closest-points");
/**
 * Find new x and ps that are a better estimate of the 3-prong circle.
 * The potential function, V, is defined as the distance to the actual 3 prong
 * circle center.
 * @param bezierPiece3s The three boundary pieces, each of which should contain
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 * @param vectorToZeroV
 * @param extreme
 */
function calcBetterX(bezierPiece3s, x, vectorToZeroV) {
    var V = flo_vector2d_1.len(vectorToZeroV);
    var nu = 1;
    var better = void 0;
    var newX = void 0;
    var newPs = void 0;
    var newV = void 0;
    var i = 0; // Safeguard
    do {
        var shift = flo_vector2d_1.scale(vectorToZeroV, nu);
        newX = flo_vector2d_1.translate(shift, x);
        newPs = get_closest_points_1.getClosestPoints(newX, bezierPiece3s);
        //console.log(newPs.map(pos => '' + pos.p[0] + ' ' + pos.p[1]))
        // Point of zero V
        var newCircleCenter = flo_vector2d_1.circumCenter(newPs.map(function (pos) {
            return pos.p;
        }));
        var newVectorToZeroV = flo_vector2d_1.fromTo(newX, newCircleCenter);
        newV = flo_vector2d_1.len(newVectorToZeroV);
        better = newV < V;
        nu = nu / 2;
        i++;
    } while (!better && i < 3);
    return { newX: newX, newV: newV, newPs: newPs };
}
exports.calcBetterX = calcBetterX;

},{"./get-closest-points":103,"flo-vector2d":50}],100:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var get_closest_boundary_point_1 = _dereq_("../../get-closest-boundary-point");
/**
 * Finds an initial 3-prong circle center point from which to iterate. The point
 * must be within the shape.
 * @param δ3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 * @param bezierPiece3s
 * @param extreme
 */
function calcInitial3ProngCenter(δ3s, bezierPiece3s) {
    var twoProngCircleCenter = δ3s[0][0].cp.circle.center;
    /*
    let twoProngCircleCenter =
        mean([
            δ3s[0][0].cp.pointOnShape.p,
            δ3s[2][1].cp.pointOnShape.p
        ]);
        */
    //_debug_.fs.draw.dot(_debug_.generated.g, twoProngCircleCenter, 0.05, 'blue');
    var pos = get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPiece3s[1], twoProngCircleCenter, undefined, // curve
    undefined // t
    );
    var meanPoints = [δ3s[0][0].cp.pointOnShape.p, pos.p, δ3s[2][1].cp.pointOnShape.p];
    return flo_vector2d_1.circumCenter(meanPoints);
}
exports.calcInitial3ProngCenter = calcInitial3ProngCenter;

},{"../../get-closest-boundary-point":117,"flo-vector2d":50}],101:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var circle_1 = _dereq_("../../../circle");
var point_on_shape_1 = _dereq_("../../../point-on-shape");
var get_closest_boundary_point_1 = _dereq_("../../get-closest-boundary-point");
var calc_initial_3_prong_center_1 = _dereq_("./calc-initial-3-prong-center");
var get_closest_points_1 = _dereq_("./get-closest-points");
var calc_better_x_1 = _dereq_("./calc-better-x");
var curve_1 = _dereq_("../../../curve");
var calcVectorToZeroV_StraightToIt = flo_vector2d_1.fromTo;
/**
 * Finds a 3-prong using only the 3 given δs.
 * @param δs The boundary pieces
 * @param idx δ identifier
 * @param bezierPiecess
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function find3ProngForDelta3s(δs, idx, k, bezierPiecess, extreme) {
    var TOLERANCE = extreme * 1e-10;
    var MAX_ITERATIONS = 10;
    //k = 0;
    /*
    let δ3s = [
        δs[0],
        δs[idx],
        δs[δs.length-1]
    ];
    */
    var δs_ = [δs[0], δs[idx], δs[δs.length - 1]];
    /*
    let bezierPiece3s = [
        bezierPiecess[0],
        bezierPiecess[idx],
        bezierPiecess[δs.length-1]
    ];
    */
    var bezierPieces_ = [bezierPiecess[0], bezierPiecess[idx], bezierPiecess[δs.length - 1]];
    var δ3ss = [[δs_[0], δs_[1], δs_[2]], [δs_[1], δs_[2], δs_[0]], [δs_[2], δs_[0], δs_[1]]];
    var bezierPiecess_ = [[bezierPieces_[0], bezierPieces_[1], bezierPieces_[2]], [bezierPieces_[1], bezierPieces_[2], bezierPieces_[0]], [bezierPieces_[2], bezierPieces_[0], bezierPieces_[1]]];
    var δ3s = δ3ss[k];
    var bezierPiece3s = bezierPiecess_[k];
    if (δ3s[0][0].isSharp()) {
        return undefined;
    }
    var ps = void 0;
    var circumCenter_ = void 0;
    var j = 0; // Safeguard for slow convergence
    var x = calc_initial_3_prong_center_1.calcInitial3ProngCenter(δ3s, bezierPiece3s);
    if (typeof _debug_ !== 'undefined') {
        var threeProngs = _debug_.generated.elems.threeProng;
        var d = threeProngs[threeProngs.length - 1];
        var trace = d.traces[d.traces.length - 1];
        trace.push(x);
    }
    var tolerance = Number.POSITIVE_INFINITY;
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
        circumCenter_ = flo_vector2d_1.circumCenter(ps.map(function (x) {
            return x.p;
        }));
        var vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter_);
        //console.log('' + x[0] + ' ' + x[1])
        //console.log('' + vectorToZeroV[0] + ' ' + vectorToZeroV[1]);
        if (!Number.isFinite(vectorToZeroV[0]) || !Number.isFinite(vectorToZeroV[1])) {
            // TODO - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }
        var upds = calc_better_x_1.calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        ps = upds.newPs;
        if (typeof _debug_ !== 'undefined') {
            var _threeProngs = _debug_.generated.elems.threeProng;
            var _d = _threeProngs[_threeProngs.length - 1];
            var _trace = _d.traces[_d.traces.length - 1];
            _trace.push(x);
        }
        var V = flo_vector2d_1.len(vectorToZeroV); // The 'potential'
        tolerance = Math.abs(V - upds.newV);
    }
    //_debug_.fs.draw.dot(_debug_.generated.g, x, 0.05);
    var radius = (flo_vector2d_1.distanceBetween(x, ps[0].p) + flo_vector2d_1.distanceBetween(x, ps[1].p) + flo_vector2d_1.distanceBetween(x, ps[2].p)) / 3;
    var circle = new circle_1.Circle(x, radius);
    //-------------------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points - they should 
    // be very close to tangent to the boundary piece tangents at those points 
    // (up to sign). Sharp corners are a common special case.
    //-------------------------------------------------------------------------
    var totalAngleError = 0;
    for (var i = 0; i < 3; i++) {
        var p = ps[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        var v = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(p.p, x));
        var v1 = flo_vector2d_1.rotate90Degrees(v);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        if (point_on_shape_1.PointOnShape.isDullCorner(p)) {
            var corner = curve_1.Curve.getCornerAtEnd(p.curve);
            var tans = corner.tans;
            var perps = tans.map(flo_vector2d_1.rotate90Degrees);
            var angleError1 = Math.asin(flo_vector2d_1.cross(perps[0], v));
            var angleError2 = Math.asin(flo_vector2d_1.cross(v, perps[1]));
            var angleError = 0;
            if (angleError1 > 0) {
                angleError += angleError1;
            }
            if (angleError2 > 0) {
                angleError += angleError2;
            }
            totalAngleError += angleError;
        } else {
            //---------------------------
            // Tangent of curve at point
            //---------------------------
            var v2 = flo_vector2d_1.toUnitVector(flo_bezier3_1.tangent(p.curve.ps, p.t));
            // Cross is more numerically stable than Vector.dot at angles a
            // multiple of Math.PI **and** is close to the actual angle value
            // and can thus just be added to cone method of looking at 
            // tolerance.
            // Should be close to zero and is close to the actual angle.
            var cross_ = Math.abs(Math.asin(flo_vector2d_1.cross(v1, v2)));
            totalAngleError += cross_;
        }
    }
    //-------------------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and the closest
    // point to the 3-prong. It should be around 0. If not, this is not a good 
    // candidate for the 3-prong.
    //-------------------------------------------------------------------------
    var closestDs = [];
    for (var _i = 0; _i < bezierPiecess.length; _i++) {
        var _p = get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPiecess[_i], x, undefined, undefined);
        closestDs.push(flo_vector2d_1.distanceBetween(_p.p, x));
    }
    var closestD = Math.min.apply(Math, closestDs);
    var radiusDelta = Math.abs(radius - closestD);
    // Weights below still need to be optimized.
    var W1 = 1;
    var W2 = 1;
    var error = W1 * radiusDelta + W2 * totalAngleError;
    return { ps: ps, circle: circle, error: error, δ3s: δ3s };
}
exports.find3ProngForDelta3s = find3ProngForDelta3s;

},{"../../../circle":53,"../../../curve":56,"../../../point-on-shape":133,"../../get-closest-boundary-point":117,"./calc-better-x":99,"./calc-initial-3-prong-center":100,"./get-closest-points":103,"flo-bezier3":3,"flo-vector2d":50}],102:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var three_prong_for_debugging_1 = _dereq_("../../../debug/three-prong-for-debugging");
var find_3_prong_for_delta3s_1 = _dereq_("./find-3-prong-for-delta3s");
var get_boundary_piece_beziers_1 = _dereq_("../../get-boundary-piece-beziers");
/**
 * Find and return a 3-prong from the given boundary piece.
 * @param δs A boundary piece
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function find3Prong(δs, extreme) {
    var bezierPiecess = δs.map(get_boundary_piece_beziers_1.getBoundaryPieceBeziers);
    if (typeof _debug_ !== 'undefined') {
        var threeProngs = _debug_.generated.elems.threeProng;
        threeProngs.push(new three_prong_for_debugging_1.ThreeProngForDebugging());
        var d = threeProngs[threeProngs.length - 1];
        d.boundaries = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bezierPiecess[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var bezierPieces = _step.value;

                var boundary = [];
                d.boundaries.push(boundary);
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = bezierPieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var bezierPiece = _step2.value;

                        var bezier = flo_bezier3_1.fromTo(bezierPiece.curve.ps)(bezierPiece.ts[0], bezierPiece.ts[1]);
                        boundary.push(bezier);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        d.traces = [];
    }
    var candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    var threeProng = void 0;
    var bestIndx = undefined;
    var smallestError = Number.POSITIVE_INFINITY;
    for (var i = 1; i < δs.length - 1; i++) {
        for (var k = 0; k < 3; k++) {
            //let k = 0;
            if (typeof _debug_ !== 'undefined') {
                var _threeProngs = _debug_.generated.elems.threeProng;
                var _d = _threeProngs[_threeProngs.length - 1];
                var trace = [];
                _d.traces.push(trace);
            }
            var threeProngInfo = find_3_prong_for_delta3s_1.find3ProngForDelta3s(δs, i, k, bezierPiecess, extreme);
            if (!threeProngInfo) {
                continue;
            }
            var circle = threeProngInfo.circle,
                ps = threeProngInfo.ps,
                error = threeProngInfo.error,
                δ3s = threeProngInfo.δ3s;

            if (typeof _debug_ !== 'undefined') {
                candidateThreeProngs.push({ circle: circle, ps: ps });
            }
            if (error < smallestError) {
                smallestError = error;
                bestIndx = i - 1;
                threeProng = { circle: circle, ps: ps, δ3s: δ3s };
            }
        }
    }
    //threeProng.δ3s = [δs[0], δs[bestIndx+1], δs[δs.length-1]];
    if (typeof _debug_ !== 'undefined') {
        var _threeProngs2 = _debug_.generated.elems.threeProng;
        var _d2 = _threeProngs2[_threeProngs2.length - 1];
        _d2.generated = _debug_.generated;
        _d2.circle = threeProng.circle, _d2.poss = threeProng.ps;
        _d2.cp3ss = threeProng.δ3s;
        _d2.cpss = δs;
        _d2.bestIndx = bestIndx;
        _d2.candidateThreeProngs = candidateThreeProngs;
    }
    return threeProng;
}
exports.find3Prong = find3Prong;

},{"../../../debug/three-prong-for-debugging":82,"../../get-boundary-piece-beziers":116,"./find-3-prong-for-delta3s":101,"flo-bezier3":3}],103:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_closest_boundary_point_1 = _dereq_("../../get-closest-boundary-point");
/**
 *
 * @param x
 * @param bezierPiece3s
 * @param extreme
 */
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(function (bezierPieces) {
        return get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPieces, x, undefined, // curve
        undefined // t
        );
    });
}
exports.getClosestPoints = getClosestPoints;

},{"../../get-closest-boundary-point":117}],104:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var find_and_add_2_prongs_1 = _dereq_("./find-and-add-2-prongs");
/**
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2ProngsOnAllPaths(loops, cpGraphs, for2Prongss, extreme) {
    var cpNode = void 0;
    for (var k = 0; k < for2Prongss.length; k++) {
        var for2Prongs = for2Prongss[k];
        cpNode = find_and_add_2_prongs_1.findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme);
    }
    return cpNode;
}
exports.findAndAdd2ProngsOnAllPaths = findAndAdd2ProngsOnAllPaths;

},{"./find-and-add-2-prongs":105}],105:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var svg_1 = _dereq_("../../svg/svg");
var find_2_prong_1 = _dereq_("./find-2-prong/find-2-prong");
var add_2_prong_1 = _dereq_("./add-2-prong");
/**
 * Find and add two-prongs.
 * @param loops
 * @param cpGraphs
 * @param k
 * @param for2Prongs
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme) {
    var len = for2Prongs.length;
    var index = indexLinear(len); // Keep for possible future use.
    //let index = indexInterlaced(len);
    var cpNode_ = void 0;
    var bounds = svg_1.getShapeBounds(loops);
    var squaredDiagonalLength = Math.pow(bounds.maxX.p[0] - bounds.minX.p[0], 2) + Math.pow(bounds.maxY.p[1] - bounds.minY.p[1], 2);
    //console.log(Math.sqrt(squaredDiagonalLength));
    for (var i = 0; i < len; i++) {
        var pos = for2Prongs[index[i]];
        var twoProngInfo = void 0;
        twoProngInfo = find_2_prong_1.find2Prong(loops, extreme, squaredDiagonalLength, cpGraphs, pos, false, k);
        if (twoProngInfo) {
            var _twoProngInfo = twoProngInfo,
                circle = _twoProngInfo.circle,
                z = _twoProngInfo.z;

            var cpNode = add_2_prong_1.add2Prong(cpGraphs, circle, pos, z, false, extreme);
            if (!cpNode_ && cpNode) {
                cpNode_ = cpNode;
            }
        }
    }
    return cpNode_;
}
exports.findAndAdd2Prongs = findAndAdd2Prongs;
/**
 * Simple linear array indexing.
 * @param n
 */
function indexLinear(n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}
/**
 * Creates a kind of interlaced index vector.
 * @param n
*/
function indexInterlaced(n) {
    var source = {};
    var arr = [];
    // l is the lowest power of 2 so that 2^l > n
    var l = Math.pow(2, Math.floor(Math.log2(n)));
    while (l >= 1) {
        var k = 0;
        while (k < n) {
            if (!source[k]) {
                arr.push(k);
                source[k] = true;
            }
            k = k + l;
        }
        l = l / 2;
    }
    return arr;
}

},{"../../svg/svg":171,"./add-2-prong":89,"./find-2-prong/find-2-prong":96}],106:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../point-on-shape");
var find_3_prong_1 = _dereq_("./find-3-prong/find-3-prong");
var add_3_prong_1 = _dereq_("../find-mat/add-3-prong");
/**
 * Finds and adds all 3-prongs.
 * @param cpGraphs
 * @param cpStart The CpNode to start traversing from.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddAll3Prongs(cpGraphs, cpStart, extreme) {
    // Don't change this function to be recursive, the call stack may overflow 
    // if there are too many two-prongs.
    var visitedEdges = new Map();
    var edgesToCheck = [{ fromCpNode: undefined, cpStart: cpStart }];
    while (edgesToCheck.length) {
        var _edgesToCheck$shift = edgesToCheck.shift(),
            fromCpNode = _edgesToCheck$shift.fromCpNode,
            _cpStart = _edgesToCheck$shift.cpStart;

        markEdgeAsTaken(visitedEdges, fromCpNode, _cpStart);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _cpStart.getNodes()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var cpNode = _step.value;

                if (!point_on_shape_1.PointOnShape.isSharpCorner(cpNode.cp.pointOnShape)) {
                    findAndAdd3Prongs(cpGraphs, cpNode, extreme);
                }
                if (hasEdgeBeenTaken(visitedEdges, cpNode, cpNode.next)) {
                    continue; // We already visited this edge
                }
                edgesToCheck.push({ fromCpNode: _cpStart, cpStart: cpNode.next });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
exports.findAndAddAll3Prongs = findAndAddAll3Prongs;
/**
 * Marks the given edge as already taken.
 */
function markEdgeAsTaken(visitedEdges, cp1, cp2) {
    if (cp1 === undefined) {
        return;
    }
    f(cp1, cp2);
    f(cp2, cp1);
    function f(cp1, cp2) {
        var visited = visitedEdges.get(cp1);
        if (!visited) {
            visited = new Set();
            visitedEdges.set(cp1, visited);
        }
        visited.add(cp2);
    }
}
function hasEdgeBeenTaken(visitedEdges, cp1, cp2) {
    var cps = void 0;
    cps = visitedEdges.get(cp1);
    var takenForward = cps && cps.has(cp2);
    cps = visitedEdges.get(cp2);
    var takenBackwards = cps && cps.has(cp1);
    return takenForward || takenBackwards;
}
/**
 * Traverses the shape from the given ContactPoint going around contact circles
 * so that only a piece of the shape is traversed and returns the visited
 * CpNodes (starting from the given CpNode).
 * @param cpStart The ContactPoint from where to start the traversal.
 */
function traverseShape(cpStart) {
    var cpNode = cpStart;
    if (cpNode === cpNode.next.prevOnCircle) {
        return [cpNode];
    }
    var visitedCps = [];
    do {
        visitedCps.push(cpNode);
        var next = cpNode.next.prevOnCircle;
        cpNode = cpNode === next ? cpNode = cpNode.next.next // Terminal vertex
        : cpNode = next; // Take last exit
    } while (cpNode !== cpStart);
    return visitedCps;
}
/**
 * Starting from some ContactPoint, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively
 * adds 3-prongs until only one or two Vertices have been visited.
 *
 * This process further subdivides the shape.
 * @param cpGraphs
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prongs(cpGraphs, cpStart, extreme) {
    var visitedCps = void 0;
    do {
        visitedCps = traverseShape(cpStart);
        if (visitedCps.length > 2) {
            findAndAdd3Prong(cpGraphs, visitedCps, extreme);
        }
    } while (visitedCps.length > 2);
    return visitedCps;
}
/**
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpGraphs
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(cpGraphs, visitedCps, extreme) {
    var δs = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = visitedCps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var visitedCp = _step2.value;

            δs.push([visitedCp, visitedCp.next]);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var threeProng = find_3_prong_1.find3Prong(δs, extreme);
    var orders = [];
    for (var i = 0; i < 3; i++) {
        orders.push(point_on_shape_1.PointOnShape.calcOrder(threeProng.circle, threeProng.ps[i]));
    }
    var circle = add_3_prong_1.add3Prong(cpGraphs, orders, threeProng);
    if (typeof _debug_ !== 'undefined') {
        add3ProngDebugInfo(circle, visitedCps);
    }
}
function add3ProngDebugInfo(circle, visitedCps) {
    var threeProngs = _debug_.generated.elems.threeProng;
    var len = threeProngs.length;
    var data = threeProngs[len - 1];
    data.visitedCps = visitedCps;
    data.circle = circle;
}

},{"../../point-on-shape":133,"../find-mat/add-3-prong":90,"./find-3-prong/find-3-prong":102}],107:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var svg_1 = _dereq_("../../svg/svg");
var find_2_prong_1 = _dereq_("./find-2-prong/find-2-prong");
var add_2_prong_1 = _dereq_("./add-2-prong");
/**
 * Find and add two-prongs that remove any holes in the shape.
 * @param loops
 * @param cpTrees
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddHoleClosing2Prongs(loops, cpTrees, extreme) {
    var bounds = svg_1.getShapeBounds(loops);
    var squaredDiagonalLength = Math.pow(bounds.maxX.p[0] - bounds.minX.p[0], 2) + Math.pow(bounds.maxY.p[1] - bounds.minY.p[1], 2);
    // Find the topmost points on each loop.
    var minYs = loops.map(svg_1.getMinYPos);
    for (var k = 1; k < minYs.length; k++) {
        var posSource = minYs[k];
        //console.log(posSource.t);
        //console.log(posSource.p[1]);
        var holeClosingTwoProng = find_2_prong_1.find2Prong(loops, extreme, squaredDiagonalLength, cpTrees, posSource, true, k);
        if (!holeClosingTwoProng) {
            throw 'unable to find hole-closing 2-prong';
        }
        if (holeClosingTwoProng) {
            var circle = holeClosingTwoProng.circle,
                posAntipode = holeClosingTwoProng.z;

            add_2_prong_1.add2Prong(cpTrees, circle, posSource, posAntipode, true, extreme);
        }
    }
}
exports.findAndAddHoleClosing2Prongs = findAndAddHoleClosing2Prongs;

},{"../../svg/svg":171,"./add-2-prong":89,"./find-2-prong/find-2-prong":96}],108:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_memoize_1 = _dereq_("flo-memoize");
var mat_1 = _dereq_("../../mat");
var get_loop_bounds_1 = _dereq_("../../svg/fs/get-loop-bounds");
var simplify_paths_1 = _dereq_("../../svg/fs/simplify-paths/simplify-paths");
var find_and_add_3_prongs_1 = _dereq_("../find-mat/find-and-add-3-prongs");
var create_initial_cp_graph_1 = _dereq_("../find-mat/create-initial-cp-graph");
;
var add_debug_info_1 = _dereq_("../find-mat/add-debug-info");
var get_potential_2_prongs_1 = _dereq_("../find-mat/get-potential-2-prongs");
var create_get_interesting_points_on_loop_1 = _dereq_("./create-get-interesting-points-on-loop");
var get_sharp_corners_1 = _dereq_("../find-mat/get-sharp-corners");
var get_extreme_1 = _dereq_("../../svg/fs/get-extreme");
var smoothen_1 = _dereq_("../smoothen/smoothen");
var find_and_add_2_prongs_on_all_paths_1 = _dereq_("./find-and-add-2-prongs-on-all-paths");
var find_and_add_hole_closing_2_prongs_1 = _dereq_("./find-and-add-hole-closing-2-prongs");
var memoize = flo_memoize_1.default.m1;
/**
 * Find the MAT from the given Shape.
 * @param loops An array of (possibly intersecting) Loops representing one or
 * more closed curves (i.e. shapes)
 * @param additionalPointCount Additional points per bezier where a MAT circle
 * will be added. Defaults to 3.
 */

function findMats(loops) {
    var additionalPointCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

    if (typeof _debug_ !== 'undefined') {
        var timing = _debug_.generated.timing;
        timing.simplify[0] = performance.now();
    }
    //let loops_ = loops.map(loop => Loop.perturb(loop, 10))

    var _simplify_paths_1$sim = simplify_paths_1.simplifyPaths(loops),
        loopss = _simplify_paths_1$sim.loopss,
        xMap = _simplify_paths_1$sim.xMap;

    if (typeof _debug_ !== 'undefined') {
        var _timing = _debug_.generated.timing;
        _timing.simplify[1] += performance.now() - _timing.simplify[0];
    }
    var mats = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = loopss[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _loops = _step.value;

            _loops.sort(ascendingByTopmostPoint);
            //loops = orient(loops);
            var mat = findPartialMat(_loops, xMap, additionalPointCount);
            if (mat) {
                mats.push(mat);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return mats;
}
exports.findMats = findMats;
function findPartialMat(loops, xMap) {
    var additionalPointCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

    var extreme = get_extreme_1.getExtreme(loops);
    add_debug_info_1.addDebugInfo1(loops);
    // Gets interesting points on the shape, i.e. those that makes sense to use 
    // for the 2-prong procedure.
    var f = create_get_interesting_points_on_loop_1.createGetInterestingPointsOnLoop(additionalPointCount);
    var pointsPerLoop = loops.map(f);
    var for2ProngsPerLoop = get_potential_2_prongs_1.getPotential2Prongs(pointsPerLoop);
    var sharpCornersPerLoop = get_sharp_corners_1.getSharpCorners(pointsPerLoop);
    var cpTrees = new Map();
    var cpNode = create_initial_cp_graph_1.createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop, xMap);
    find_and_add_hole_closing_2_prongs_1.findAndAddHoleClosing2Prongs(loops, cpTrees, extreme);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterHoleClosers) {
            return undefined;
        }
    }
    add_debug_info_1.addDebugInfo2(pointsPerLoop);
    cpNode = find_and_add_2_prongs_on_all_paths_1.findAndAdd2ProngsOnAllPaths(loops, cpTrees, for2ProngsPerLoop, extreme);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterTwoProngs) {
            return undefined;
        }
    }
    add_debug_info_1.addDebugInfo3();
    if (cpNode === undefined) {
        return undefined;
    }
    find_and_add_3_prongs_1.findAndAddAll3Prongs(cpTrees, cpNode, extreme);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterThreeProngs) {
            return undefined;
        }
    }
    var mat = new mat_1.Mat(cpNode, cpTrees);
    smoothen_1.smoothen(mat.cpNode);
    add_debug_info_1.addDebugInfo4(mat);
    return mat;
}
/**
 *
 * @param loopA
 * @param loopB
 */
function ascendingByTopmostPoint(loopA, loopB) {
    var boundsA = get_loop_bounds_1.getLoopBounds(loopA);
    var boundsB = get_loop_bounds_1.getLoopBounds(loopB);
    var a = boundsA.minY.p[1];
    var b = boundsB.minY.p[1];
    return a - b;
}

},{"../../mat":85,"../../svg/fs/get-extreme":139,"../../svg/fs/get-loop-bounds":140,"../../svg/fs/simplify-paths/simplify-paths":157,"../find-mat/add-debug-info":91,"../find-mat/create-initial-cp-graph":93,"../find-mat/find-and-add-3-prongs":106,"../find-mat/get-potential-2-prongs":109,"../find-mat/get-sharp-corners":110,"../smoothen/smoothen":125,"./create-get-interesting-points-on-loop":92,"./find-and-add-2-prongs-on-all-paths":104,"./find-and-add-hole-closing-2-prongs":107,"flo-memoize":41}],109:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../point-on-shape");
function getPotential2Prongs(possPerLoop) {
    var for2ProngsArray = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = possPerLoop[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var poss = _step.value;

            var for2Prongs = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = poss[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var pos = _step2.value;

                    if (!point_on_shape_1.PointOnShape.isQuiteSharpCorner(pos)) {
                        for2Prongs.push(pos);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            for2ProngsArray.push(for2Prongs);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return for2ProngsArray;
}
exports.getPotential2Prongs = getPotential2Prongs;

},{"../../point-on-shape":133}],110:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../point-on-shape");
function getSharpCorners(possPerLoop) {
    var sharpCornersPerLoop = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = possPerLoop[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var poss = _step.value;

            var sharpCorners = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = poss[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var pos = _step2.value;

                    if (point_on_shape_1.PointOnShape.isQuiteSharpCorner(pos)) {
                        sharpCorners.push(pos);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            sharpCornersPerLoop.push(sharpCorners);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return sharpCornersPerLoop;
}
exports.getSharpCorners = getSharpCorners;

},{"../../point-on-shape":133}],111:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
/**
 *
 */
function getClosestSquareDistanceToRect(box, p) {
    var _box = _slicedToArray(box, 2),
        _box$ = _slicedToArray(_box[0], 2),
        x0 = _box$[0],
        y0 = _box$[1],
        _box$2 = _slicedToArray(_box[1], 2),
        x1 = _box$2[0],
        y1 = _box$2[1];

    var _p = _slicedToArray(p, 2),
        xp = _p[0],
        yp = _p[1];

    if (xp < x0) {
        if (yp < y0) {
            return flo_vector2d_1.squaredDistanceBetween(box[0], p);
        } else if (yp > y1) {
            return flo_vector2d_1.squaredDistanceBetween([x0, y1], p);
        } else {
            var d = x0 - xp;
            return d * d;
        }
    } else if (xp > x1) {
        if (yp < y0) {
            return flo_vector2d_1.squaredDistanceBetween([x1, y0], p);
        } else if (yp > y1) {
            return flo_vector2d_1.squaredDistanceBetween(box[1], p);
        } else {
            var _d = xp - x1;
            return _d * _d;
        }
    } else {
        if (yp < y0) {
            var _d2 = y0 - yp;
            return _d2 * _d2;
        } else if (yp > y1) {
            var _d3 = yp - y1;
            return _d3 * _d3;
        } else {
            return 0;
        }
    }
}
exports.getClosestSquareDistanceToRect = getClosestSquareDistanceToRect;

},{"flo-vector2d":50}],112:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
/**
 *
 */
function getClosestSquaredDistanceToRotatedRect(ps, p) {
    var ds = [0, 1, 2, 3].map(function (i) {
        return flo_vector2d_1.squaredDistanceBetweenPointAndLineSegment(p, [ps[i], ps[(i + 1) % 4]]);
    });
    var width = flo_vector2d_1.squaredDistanceBetween(ps[0], ps[1]);
    var height = flo_vector2d_1.squaredDistanceBetween(ps[0], ps[3]);
    if (ds[0] <= height && ds[2] <= height && ds[1] <= width && ds[3] <= width) {
        return 0; // Inside rotated rect
    }
    return Math.min.apply(Math, _toConsumableArray(ds));
}
exports.getClosestSquaredDistanceToRotatedRect = getClosestSquaredDistanceToRotatedRect;

},{"flo-vector2d":50}],113:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Find point where two lines intersect. Returns he point where the two lines
 * intersect or undefined if they don't intersect or are the same line.
 * @param l1 - A line
 * @param l2 - Another line
 */
function lineLineIntersection(l1, l2) {
    var _l = _slicedToArray(l1, 2),
        _l$ = _slicedToArray(_l[0], 2),
        p1x = _l$[0],
        p1y = _l$[1],
        _l$2 = _slicedToArray(_l[1], 2),
        p2x = _l$2[0],
        p2y = _l$2[1];

    var _l2 = _slicedToArray(l2, 2),
        _l2$ = _slicedToArray(_l2[0], 2),
        p3x = _l2$[0],
        p3y = _l2$[1],
        _l2$2 = _slicedToArray(_l2[1], 2),
        p4x = _l2$2[0],
        p4y = _l2$2[1];

    var v1x = p2x - p1x;
    var v1y = p2y - p1y;
    var v2x = p4x - p3x;
    var v2y = p4y - p3y;
    var cross = v2x * v1y - v2y * v1x;
    if (cross === 0) {
        // parallel
        return undefined;
    }
    var b = ((p3y - p1y) * v1x - (p3x - p1x) * v1y) / cross;
    return [p3x + b * v2x, p3y + b * v2y];
}
exports.lineLineIntersection = lineLineIntersection;

},{}],114:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var DELTA = 1e-6;
/**
 * Calculates the curvature extrema brackets of the given cubic bezier.
 * See the paper at http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
 * Note that naming conventions is roughly as in the paper above.
 * @param ps
 */
function calcBezierCurvatureExtremaBrackets(ps) {
    var _ps = _slicedToArray(ps, 4),
        _ps$ = _slicedToArray(_ps[0], 2),
        x0 = _ps$[0],
        y0 = _ps$[1],
        _ps$2 = _slicedToArray(_ps[1], 2),
        x1 = _ps$2[0],
        y1 = _ps$2[1],
        _ps$3 = _slicedToArray(_ps[2], 2),
        x2 = _ps$3[0],
        y2 = _ps$3[1],
        _ps$4 = _slicedToArray(_ps[3], 2),
        x3 = _ps$4[0],
        y3 = _ps$4[1];

    var brackets = [];
    // Bezier points translated to origin;
    var P_1x = x1 - x0;
    var P_1y = y1 - y0;
    var P_2x = x2 - x0;
    var P_2y = y2 - y0;
    var P_3x = x3 - x0;
    var P_3y = y3 - y0;
    // Distance to consecutive points
    var W_0x = P_1x;
    var W_1x = P_2x - P_1x;
    var W_2x = P_3x - P_2x;
    var W_0y = P_1y;
    var W_1y = P_2y - P_1y;
    var W_2y = P_3y - P_2y;
    // Check for degenerate case in which cubic curve becomes quadratic. 
    if (Math.abs(W_0x - 2 * W_1x + W_2x) < DELTA && Math.abs(W_0y - 2 * W_1y + W_2y) < DELTA) {}
    // TODO - This case is simpler due to being quadratic - still needs to
    // be implemented!. 

    // See http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
    // Rotate curve so that W0 - 2W1 + W2 = (0, (1/3)a), a != 0
    var atan_numer = P_3x - 3 * P_2x + 3 * P_1x;
    var atan_denom = P_3y - 3 * P_2y + 3 * P_1y;
    var atan_numer_squared = atan_numer * atan_numer;
    var atan_denom_squared = atan_denom * atan_denom;
    var rad = Math.sqrt(atan_numer_squared / atan_denom_squared + 1);
    var cos_theta = 1 / rad;
    var sin_theta = void 0;
    if (cos_theta === 0) {
        sin_theta = 1;
    } else {
        sin_theta = atan_numer / (atan_denom * rad);
    }
    // Here we skip expensive trig evaluations
    var R_1x = P_1x * cos_theta - P_1y * sin_theta;
    var R_1y = P_1x * sin_theta + P_1y * cos_theta;
    var R_2x = P_2x * cos_theta - P_2y * sin_theta;
    var R_2y = P_2x * sin_theta + P_2y * cos_theta;
    var R_3x = P_3x * cos_theta - P_3y * sin_theta;
    var R_3y = P_3x * sin_theta + P_3y * cos_theta;
    // Modify W_0x, etc. to be correct for new rotated curve 
    W_0x = R_1x;
    W_1x = R_2x - R_1x;
    W_2x = R_3x - R_2x;
    W_0y = R_1y;
    W_1y = R_2y - R_1y;
    W_2y = R_3y - R_2y;
    var a = 3 * (W_0y - 2 * W_1y + W_2y);
    var dif = R_2x - 2 * R_1x; // which = W_1x - W_0x;
    if (dif === 0) {
        // Case 1 (special) - W_1x - W_0x === 0
        // Degenerate to cubic function	
        if (W_0x !== 0) {
            // TODO - finish!
            // TODO - we also still need to check for degenerate cubic (see 
            // beginning of paper)
        } else {
            // We have a straight line x=0!
            return [];
        }
    } else {
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
        var μ = 6 * dif;
        var λ = 3 * a * W_0x / (μ * μ);
        var γ1 = 3 * a * W_0y / (μ * μ);
        var γ2 = 3 * (W_1y - W_0y) / μ;
        var d = λ * λ - 2 * γ2 * λ + γ1;
        var b = 2 * (γ2 - λ);
        var deParamBoundary = deParameterizeBoundary(λ, μ, a);
        if (d > 0) {
            var ssigd_ = Math.sqrt(d);
            // de-reparametize
            // Note: the sda and sdb here are the inflection points forcase iv! 
            // there are easier ways to calculate these
            var sda = -ssigd_;
            var sdb = ssigd_;
            brackets = [[Number.NEGATIVE_INFINITY, sda], [sda, sdb], [sdb, Number.POSITIVE_INFINITY]].map(deParamBoundary).map(clipBoundary);
        } else if (d < 0) {
            // It is a loop 
            // Note: The loop intersection may be outside t=[0,1] but curvature 
            // maxima may still occur inside t=[0,1] of course.
            // There can be 1 or 3 maxima of curvature.
            var ξ1_ = 2 * b * b - 8 * d - 3;
            if (ξ1_ < 0) {
                brackets = [[0, Math.sqrt(-3 * d)]].map(deParamBoundary).map(clipBoundary);
            } else {
                var ξ2_ = Math.sqrt(5 * ξ1_);
                var ξ1 = (-5 * b - ξ2_) / 10;
                var ξ2 = (-5 * b + ξ2_) / 10;
                brackets = [[Number.NEGATIVE_INFINITY, ξ1], [ξ1, Math.min(0, ξ2)], [Math.max(0, ξ2), Math.sqrt(-3 * d)]].map(deParamBoundary).map(clipBoundary);
            }
        } else if (d === 0) {
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
    var _range = _slicedToArray(range, 2),
        a = _range[0],
        b = _range[1];

    if (a < 0 && b < 0 || a > 1 && b > 1) {
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
    return function (σ) {
        return (σ - λ) * (μ / a);
    };
}
/**
 *
 * @param λ
 * @param μ
 * @param a
 */
function deParameterizeBoundary(λ, μ, a) {
    return function (boundary) {
        return boundary.map(deParameterize(λ, μ, a));
    };
}
;

},{}],115:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var point_on_shape_1 = _dereq_("../point-on-shape");
var get_bezier_curvature_extrema_brackets_1 = _dereq_("./get-bezier-curvature-extrema-brackets");
/**
 * Finds the osculating circles and inflection points for the given bezier.
 * @param curve
 */
function getBezierCurvatureExtrema(curve) {
    var maxCurvaturePoss = [];
    var maxNegativeCurvaturePoss = [];
    var ps = curve.ps;
    var brackets = get_bezier_curvature_extrema_brackets_1.calcBezierCurvatureExtremaBrackets(ps);
    var κPs = flo_bezier3_1.κ(ps); // The curvature function
    var lenb = brackets.length;
    for (var k = 0; k < lenb; k++) {
        var bracket = brackets[k];
        if (!bracket) {
            continue;
        }
        var root = lookForRoot(ps, bracket);
        if (!root) {
            continue;
        }
        var κ_ = -κPs(root);
        // Check if local extrema is a maximum or minimum.
        var κAtMinsd = -κPs(bracket[0]);
        var κAtMaxsd = -κPs(bracket[1]);
        if (κ_ > κAtMinsd && κ_ > κAtMaxsd) {
            // maximum
            if (κ_ > 0) {
                maxCurvaturePoss.push(new point_on_shape_1.PointOnShape(curve, root));
            }
            //_debug_.fs.draw.crossHair((new PointOnShape(curve, root).p), 'blue thin2 nofill')
        } else if (κ_ <= κAtMinsd && κ_ <= κAtMaxsd) {
            // minimum
            if (κ_ < 0) {
                maxNegativeCurvaturePoss.push(new point_on_shape_1.PointOnShape(curve, root));
                //_debug_.fs.draw.crossHair((new PointOnShape(curve, root).p), 'red thin2 nofill')
            }
        }
    }
    return { maxCurvaturePoss: maxCurvaturePoss, maxNegativeCurvaturePoss: maxNegativeCurvaturePoss };
}
exports.getBezierCurvatureExtrema = getBezierCurvatureExtrema;
function lookForRoot(ps, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        minsd = _ref2[0],
        maxsd = _ref2[1];

    // At this point there can be exactly 0 or 1 roots within 
    // [minsd, maxsd]
    var dκMod_ = flo_bezier3_1.dκMod(ps);
    var c0 = dκMod_(minsd);
    var c1 = dκMod_(maxsd);
    if (c0 * c1 >= 0) {
        return;
    }
    // There is exactly one root in the interval.
    var root = flo_poly_1.default.brent(dκMod_, minsd, maxsd);
    return root;
}

},{"../point-on-shape":133,"./get-bezier-curvature-extrema-brackets":114,"flo-bezier3":3,"flo-poly":42}],116:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bezier_piece_1 = _dereq_("../bezier-piece");
var point_on_shape_1 = _dereq_("../point-on-shape");
var contact_point_1 = _dereq_("../contact-point");
/**
* Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
* from the given boundary piece.
* @param cpNode - An ordered pair that represents the start and end points of
* the boundary piece
*/
function getBoundaryPieceBeziers(cpNode) {
    var cpThis = cpNode[0];
    var cpEnd = cpNode[1];
    var bezierPieces = [];
    // As opposed to going around the circle and taking the last exit
    var goStraight = true;
    do {
        if (!goStraight) {
            goStraight = true;
            cpThis = cpThis.prevOnCircle; // take last exit
            continue;
        }
        goStraight = false;
        var posThis = cpThis.cp.pointOnShape;
        var posNext = cpThis.next.cp.pointOnShape;
        if (posNext.curve === posThis.curve && point_on_shape_1.PointOnShape.isQuiteSharpCorner(posThis) && point_on_shape_1.PointOnShape.isQuiteSharpCorner(posNext)) {
            // Do nothing
        } else if (posNext.curve === posThis.curve && contact_point_1.ContactPoint.compare(cpThis.next.cp, cpThis.cp) > 0) {
            bezierPieces.push(new bezier_piece_1.BezierPiece(posThis.curve, [posThis.t, posNext.t]));
        } else {
            bezierPieces.push(new bezier_piece_1.BezierPiece(posThis.curve, [posThis.t, 1]));
            addSkippedBeziers(bezierPieces, posThis.curve, posNext.curve, posNext.t);
        }
        cpThis = cpThis.next;
    } while (cpThis !== cpEnd);
    return bezierPieces;
}
exports.getBoundaryPieceBeziers = getBoundaryPieceBeziers;
/**
 * Adds pieces of skipped beziers
 */
function addSkippedBeziers(bezierPieces, curveStart, curveEnd, t1) {
    var curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        var tEnd = curveThis === curveEnd ? t1 : 1;
        bezierPieces.push(new bezier_piece_1.BezierPiece(curveThis, [0, tEnd]));
    } while (curveThis !== curveEnd);
}

},{"../bezier-piece":51,"../contact-point":54,"../point-on-shape":133}],117:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var point_on_shape_1 = _dereq_("../point-on-shape");
var get_closest_squared_distance_to_rotated_rect_1 = _dereq_("./geometry/get-closest-squared-distance-to-rotated-rect");
var get_closest_square_distance_to_rect_1 = _dereq_("./geometry/get-closest-square-distance-to-rect");
/**
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
function getClosestBoundaryPoint(bezierPieces, point, touchedCurve, t) {
    bezierPieces = cullBezierPieces(bezierPieces, point);
    var bestDistance = Number.POSITIVE_INFINITY;
    var pos = void 0;
    for (var i = 0; i < bezierPieces.length; i++) {
        var bezierPiece = bezierPieces[i];
        var p = closestPointOnBezier(bezierPiece.curve, point, bezierPiece.ts, touchedCurve, t);
        if (p === undefined) {
            continue;
        }
        var d = flo_vector2d_1.distanceBetween(p.p, point);
        var curve = bezierPiece.curve;
        var t_ = p.t;
        if (d < bestDistance) {
            if (t_ === 0) {
                t_ = 1;
                curve = bezierPiece.curve.prev;
            }
            pos = new point_on_shape_1.PointOnShape(curve, t_);
            bestDistance = d;
        }
    }
    return pos;
}
exports.getClosestBoundaryPoint = getClosestBoundaryPoint;
/**
 *
 * @param bezierPieces
 * @param p
 * @param extreme
 */
function cullBezierPieces(bezierPieces, p) {
    var CULL_THRESHOLD = 0;
    if (bezierPieces.length > CULL_THRESHOLD) {
        var bestSquaredDistance = getBestDistanceSquared(bezierPieces, p);
        bezierPieces = cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance);
        bezierPieces = cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance);
    }
    return bezierPieces;
}
/**
 * Finds an initial distance such that the closest point can not be further than
 * this distance away.
 */
function getBestDistanceSquared(bezierPieces, p) {
    var bestSquaredDistance = Number.POSITIVE_INFINITY;
    for (var i = 0; i < bezierPieces.length; i++) {
        var bezierPiece = bezierPieces[i];
        var ps = bezierPiece.curve.ps;
        var evPs = flo_bezier3_1.evaluate(ps);
        var p1 = evPs(bezierPiece.ts[0]);
        var p2 = evPs(bezierPiece.ts[1]);
        var d = Math.min(flo_vector2d_1.squaredDistanceBetween(p, p1), flo_vector2d_1.squaredDistanceBetween(p, p2));
        if (d < bestSquaredDistance) {
            bestSquaredDistance = d;
        }
    }
    // The extra multiplier is to account for floating point precision.
    return bestSquaredDistance * 1.01;
}
/**
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces
 * @param p
 * @param dSquared
 */
function cullByLooseBoundingBox(bezierPieces, p, dSquared) {
    var candidateBezierPieces = [];
    for (var i = 0; i < bezierPieces.length; i++) {
        var bezierPiece = bezierPieces[i];
        var ps = bezierPiece.curve.ps;
        var boundingBox = flo_bezier3_1.getBoundingBox(ps);
        var d = get_closest_square_distance_to_rect_1.getClosestSquareDistanceToRect(boundingBox, p);
        if (d <= dSquared) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
/**
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces
 * @param p
 * @param bestSquaredDistance
 */
function cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance) {
    var candidateBezierPieces = [];
    for (var i = 0; i < bezierPieces.length; i++) {
        var bezierPiece = bezierPieces[i];
        var ps = bezierPiece.curve.ps;
        var tightBoundingBox = flo_bezier3_1.getBoundingBoxTight(ps);
        var d = get_closest_squared_distance_to_rotated_rect_1.getClosestSquaredDistanceToRotatedRect(tightBoundingBox, p);
        if (d <= bestSquaredDistance) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
/**
 *
 * @param curve The bezier
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointOnBezier(curve, p) {
    var tRange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 1];
    var touchedCurve = arguments[3];
    var t = arguments[4];

    // TODO The site at http://jazzros.blogspot.ca/2011/03/projecting-point-on-bezier-curve.html
    // may hint at requiring much fewer assignments?
    var _curve$ps = _slicedToArray(curve.ps, 4),
        _curve$ps$ = _slicedToArray(_curve$ps[0], 2),
        x0 = _curve$ps$[0],
        y0 = _curve$ps$[1],
        _curve$ps$2 = _slicedToArray(_curve$ps[1], 2),
        x1 = _curve$ps$2[0],
        y1 = _curve$ps$2[1],
        _curve$ps$3 = _slicedToArray(_curve$ps[2], 2),
        x2 = _curve$ps$3[0],
        y2 = _curve$ps$3[1],
        _curve$ps$4 = _slicedToArray(_curve$ps[3], 2),
        x3 = _curve$ps$4[0],
        y3 = _curve$ps$4[1];

    var _p = _slicedToArray(p, 2),
        xp = _p[0],
        yp = _p[1];

    var xx0 = x0 - xp;
    var xx1 = x1 - xp;
    var xx2 = x2 - xp;
    var xx3 = x3 - xp;
    var yy0 = y0 - yp;
    var yy1 = y1 - yp;
    var yy2 = y2 - yp;
    var yy3 = y3 - yp;
    var x00 = xx0 * xx0;
    var x01 = 6 * xx0 * xx1;
    var x02 = 6 * xx0 * xx2;
    var x03 = 2 * xx0 * xx3;
    var x11 = 9 * xx1 * xx1;
    var x12 = 18 * xx1 * xx2;
    var x13 = 6 * xx1 * xx3;
    var x22 = 9 * xx2 * xx2;
    var x23 = 6 * xx2 * xx3;
    var x33 = xx3 * xx3;
    var y00 = yy0 * yy0;
    var y01 = 6 * yy0 * yy1;
    var y02 = 6 * yy0 * yy2;
    var y03 = 2 * yy0 * yy3;
    var y11 = 9 * yy1 * yy1;
    var y12 = 18 * yy1 * yy2;
    var y13 = 6 * yy1 * yy3;
    var y22 = 9 * yy2 * yy2;
    var y23 = 6 * yy2 * yy3;
    var y33 = yy3 * yy3;
    var t5 = 6 * (x33 - x23 + x13 - x03 + x22 - x12 + x02 + x11 - x01 + x00 + (y33 - y23 + y13 - y03 + y22 - y12 + y02 + y11 - y01 + y00));
    var t4 = 5 * (x23 - 2 * x13 + 3 * x03 - 2 * x22 + 3 * x12 - 4 * x02 - 4 * x11 + 5 * x01 - 6 * x00 + (y23 - 2 * y13 + 3 * y03 - 2 * y22 + 3 * y12 - 4 * y02 - 4 * y11 + 5 * y01 - 6 * y00));
    var t3 = 4 * (x13 - 3 * x03 + x22 - 3 * x12 + 6 * x02 + 6 * x11 - 10 * x01 + 15 * x00 + (y13 - 3 * y03 + y22 - 3 * y12 + 6 * y02 + 6 * y11 - 10 * y01 + 15 * y00));
    var t2 = 3 * (x03 + x12 - 4 * x02 - 4 * x11 + 10 * x01 - 20 * x00 + (y03 + y12 - 4 * y02 - 4 * y11 + 10 * y01 - 20 * y00));
    var t1 = 2 * (x02 + x11 - 5 * x01 + 15 * x00 + (y02 + y11 - 5 * y01 + 15 * y00));
    var t0 = x01 - 6 * x00 + (y01 - 6 * y00);
    var poly = [t5, t4, t3, t2, t1, t0];
    if (curve === touchedCurve) {
        poly = flo_poly_1.default.deflate(poly, t);
    }
    var roots = flo_poly_1.default.allRoots(poly, tRange[0], tRange[1]);
    // Also test the endpoints
    var push0 = true;
    var push1 = true;
    if (t === 1 && curve === touchedCurve.next || curve === touchedCurve && t === 0) {
        push0 = false;
    }
    if (t === 0 && curve === touchedCurve.prev || curve === touchedCurve && t === 1) {
        push1 = false;
    }
    if (tRange[0] === 0) {
        if (push0) {
            roots.push(tRange[0]);
        }
    } else if (tRange[0] === 1) {
        if (push1) {
            roots.push(tRange[0]);
        }
    } else {
        roots.push(tRange[0]);
    }
    if (tRange[1] === 0) {
        if (push0) {
            roots.push(tRange[1]);
        }
    } else if (tRange[1] === 1) {
        if (push1) {
            roots.push(tRange[1]);
        }
    } else {
        roots.push(tRange[1]);
    }
    var ev = flo_bezier3_1.evaluate(curve.ps);
    var ps = roots.map(function (root) {
        return { p: ev(root), t: root };
    });
    return flo_vector2d_1.getObjClosestTo(p, ps, function (p) {
        return p.p;
    });
}
exports.closestPointOnBezier = closestPointOnBezier;

},{"../point-on-shape":133,"./geometry/get-closest-square-distance-to-rect":111,"./geometry/get-closest-squared-distance-to-rotated-rect":112,"flo-bezier3":3,"flo-poly":42,"flo-vector2d":50}],118:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var curve_1 = _dereq_("../curve");
var point_on_shape_1 = _dereq_("../point-on-shape");
function getContactCirclesAtInterface(curve) {
    var _curve_1$Curve$getCor = curve_1.Curve.getCornerAtEnd(curve),
        isQuiteSharp = _curve_1$Curve$getCor.isQuiteSharp,
        isDull = _curve_1$Curve$getCor.isDull,
        isQuiteDull = _curve_1$Curve$getCor.isQuiteDull;

    if (isQuiteSharp) {
        return [new point_on_shape_1.PointOnShape(curve, 1)];
    } else if (isQuiteDull) {
        return [new point_on_shape_1.PointOnShape(curve, 1), new point_on_shape_1.PointOnShape(curve.next, 0)];
    } else if (isDull) {}
    return [];
}
exports.getContactCirclesAtInterface = getContactCirclesAtInterface;

},{"../curve":56,"../point-on-shape":133}],119:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getLargestVertex(cpNodes) {
    return cpNodes.reduce(function (maxCpNode, cpNode) {
        return maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius ? maxCpNode : cpNode;
    }, cpNodes[0]);
}
exports.getLargestVertex = getLargestVertex;

},{}],120:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var traverse_edges_1 = _dereq_("./traverse-edges");
function getLeaves(cpNode) {
    var leaves = [];
    traverse_edges_1.traverseEdges(cpNode, f, true);
    function f(cp, isLeaf) {
        if (isLeaf) {
            leaves.push(cp);
        }
    }
    return leaves;
}
exports.getLeaves = getLeaves;

},{"./traverse-edges":130}],121:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cp_node_1 = _dereq_("../cp-node");
var contact_point_1 = _dereq_("../contact-point");
/**
 * Returns the boundary piece that starts at the immediate previous point on the
 * shape and ends at the immediate next point.
 * @param cpTree
 * @param pos
 * @param order
 * @param order2
 */
function getNeighbouringPoints(cpTree, pos, order, order2) {
    var cps = cpTree.findBounds(new cp_node_1.CpNode(new contact_point_1.ContactPoint(pos, undefined, order, order2), false, false));
    if (!cps[0] && !cps[1]) {
        // The tree is still empty
        return [undefined, undefined];
    }
    if (!cps[0] || !cps[1]) {
        // Smaller than all -> cptree.min() === cps[1].data OR
        // Larger  than all -> cptree.max() === cps[0].data
        return [cpTree.max(cpTree.root), cpTree.min(cpTree.root)];
    }
    return [cps[0].data, cps[1].data];
}
exports.getNeighbouringPoints = getNeighbouringPoints;

},{"../contact-point":54,"../cp-node":55}],122:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getTwoProngType(e) {
    if (e.failed) {
        return 'twoProng_failed';
    }
    if (e.notAdded) {
        return 'twoProng_notAdded';
    }
    if (e.deleted) {
        return 'twoProng_deleted';
    }
    if (e.holeClosing) {
        return 'twoProng_holeClosing';
    }
    return 'twoProng_regular';
}
exports.getTwoProngType = getTwoProngType;

},{}],123:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var get_neighboring_cps_1 = _dereq_("./get-neighboring-cps");
//const ANGLE_THRESHOLD = Math.cos(3 * (Math.PI / 180)); // 3 degrees
var ANGLE_THRESHOLD = 0.9986295347545738; // === Math.cos(3  degrees)
//const ANGLE_THRESHOLD = 0.9848077530122080; // === Math.cos(10 degrees)
//const ANGLE_THRESHOLD = 0.9998476951563913; // === Math.cos(1 degrees)
//const ANGLE_THRESHOLD = 0.9999984769132877; // === Math.cos(0.1 degrees)   
//const ANGLE_THRESHOLD = 0.9999999847691291  // === Math.cos(0.01 degrees)   
/**
 * Returns true if another CpNode is close to the given implied (via pos, order
 * and order2) CpNode.
 * @param cpTrees
 * @param pos
 * @param circle
 * @param order
 * @param order2
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * @param color Used for debugging only
 */
function isAnotherCpCloseby(cpTrees, pos, circle, order, order2, extreme, color) {
    var DISTANCE_THRESHOLD = extreme * 1e-4;
    //const DISTANCE_THRESHOLD = extreme * 1e-3; 
    //const DISTANCE_THRESHOLD = extreme * 1e-1; 
    var cpTree = cpTrees.get(pos.curve.loop);
    var cpNodes = get_neighboring_cps_1.getNeighbouringPoints(cpTree, pos, order, order2);
    if (!cpNodes[0]) {
        return false;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = cpNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cpNode = _step.value;

            var pos2 = cpNode.cp.pointOnShape;
            var p1 = pos.p;
            var p2 = pos2.p;
            if (flo_vector2d_1.distanceBetween(p1, p2) > DISTANCE_THRESHOLD) {
                continue;
            }
            var v1 = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(cpNode.cp.pointOnShape.p, cpNode.cp.circle.center));
            var v2 = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(p1, circle.center));
            var cosTheta = flo_vector2d_1.dot(v1, v2);
            if (cosTheta > ANGLE_THRESHOLD) {
                //console.log(`%c${cosTheta}`, `color: ${color}`);
                return true;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return false;
}
exports.isAnotherCpCloseby = isAnotherCpCloseby;

},{"./get-neighboring-cps":121,"flo-vector2d":50}],124:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var point_on_shape_1 = _dereq_("../../point-on-shape");
/**
 * Returns a line segment of unit length starting in the given Vertex center and
 * pointing in the direction of the medial axis (viewed as a rooted tree).
 * @param cpNode
 */
function getEdgeDirection(cpNode) {
    var circleCenter = cpNode.cp.circle.center;
    var cp1 = cpNode;
    var cp2 = cpNode.nextOnCircle;
    var pos1 = cp1.cp.pointOnShape;
    var pos2 = cp2.cp.pointOnShape;
    var p1 = pos1.p;
    var p2 = pos2.p;
    var vDir = void 0;
    if (!point_on_shape_1.PointOnShape.isSharpCorner(pos1)) {
        if (p1[0] === p2[0] && p1[1] === p2[1]) {
            vDir = flo_vector2d_1.fromTo(p1, circleCenter); // A 1-prong
        } else {
            vDir = flo_vector2d_1.rotate90Degrees(flo_vector2d_1.fromTo(p1, p2)); // not a 1-prong.
        }
    } else {
        var curve1 = void 0;
        var curve2 = void 0;
        // TODO - test if pos1.t can ever be 0 - it is terminating
        if (pos1.t === 0) {
            curve1 = pos1.curve;
            curve2 = pos1.curve.prev;
        } else if (pos1.t === 1) {
            curve1 = pos1.curve.next;
            curve2 = pos1.curve;
        }
        var tan1 = flo_bezier3_1.tangent(curve1.ps)(0);
        var tan2 = flo_vector2d_1.reverse(flo_bezier3_1.tangent(curve2.ps)(1));
        var x = flo_vector2d_1.dot(tan1, tan2);
        // Recall the identities sin(acos(x)) = sqrt(1-x^2), etc. Also 
        // recall the half angle formulas. Then the rotation matrix, R, can 
        // be calculated.
        var cosθ = Math.sqrt((1 + x) / 2);
        var sinθ = Math.sqrt((1 - x) / 2);
        vDir = flo_vector2d_1.rotate(sinθ, cosθ, tan2);
    }
    var v = flo_vector2d_1.translate(flo_vector2d_1.toUnitVector(vDir), circleCenter);
    return [circleCenter, v];
}
exports.getEdgeDirection = getEdgeDirection;

},{"../../point-on-shape":133,"flo-bezier3":3,"flo-vector2d":50}],125:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var line_line_intersection_1 = _dereq_("../geometry/line-line-intersection");
var traverse_edges_1 = _dereq_("../traverse-edges");
var get_edge_direction_1 = _dereq_("./get-edge-direction");
var TOLERANCE_ADD_2PRONG = 0.01;
var TOLERANCE_USE_LINE = 0.0001; // else cubic
/**
 * Smoothens the given MAT by fitting consecutive mat lines with either lines or
 * quadratic or cubic beziers.
 */
function smoothen(cpNode) {
    traverse_edges_1.traverseEdges(cpNode, f);
    function f(cpNode) {
        var fromCc = cpNode.cp.circle.center;
        var fromL = get_edge_direction_1.getEdgeDirection(cpNode);
        var toCc = cpNode.next.cp.circle.center;
        var toL = get_edge_direction_1.getEdgeDirection(cpNode.next.prevOnCircle);
        var mid = line_line_intersection_1.lineLineIntersection(fromL, toL);
        var c = flo_vector2d_1.fromTo(fromCc, toCc);
        var twisted = void 0;
        if (!mid) {
            twisted = true;
        } else {
            var a = flo_vector2d_1.fromTo(fromCc, mid);
            var b = flo_vector2d_1.fromTo(toCc, mid);
            twisted = flo_vector2d_1.dot(a, c) < 0 || flo_vector2d_1.dot(b, c) > 0;
        }
        if (!twisted) {
            cpNode.matCurve = [fromCc, mid, toCc];
            cpNode.next.prevOnCircle.matCurve = [toCc, mid, fromCc];
            return;
        }
        var r = flo_vector2d_1.rotate90Degrees(c);
        var w1 = flo_vector2d_1.fromTo(fromL[0], fromL[1]); // This is a unit vector
        var w2 = flo_vector2d_1.fromTo(toL[0], toL[1]); // This is a unit vector
        var d1 = Math.abs(flo_vector2d_1.cross(c, w1)) / (3 * 3);
        var d2 = Math.abs(flo_vector2d_1.cross(c, w2)) / (3 * 3);
        if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
            // TODO - not within tolerance - must add additional 2-prong
            cpNode.matCurve = [fromCc, toCc];
            cpNode.next.prevOnCircle.matCurve = [toCc, fromCc];
            return;
        }
        if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
            // approximate with cubic bezier
            var m1 = flo_vector2d_1.interpolate(fromCc, toCc, 1 / 3);
            var m2 = flo_vector2d_1.interpolate(fromCc, toCc, 2 / 3);
            var v1 = flo_vector2d_1.translate(r, m1);
            var v2 = flo_vector2d_1.translate(r, m2);
            var l1 = [m1, v1];
            var l2 = [m2, v2];
            var mid1 = line_line_intersection_1.lineLineIntersection(fromL, l1);
            var mid2 = line_line_intersection_1.lineLineIntersection(toL, l2);
            cpNode.matCurve = [fromCc, mid1, mid2, toCc];
            cpNode.next.prevOnCircle.matCurve = [toCc, mid2, mid1, fromCc];
            return;
        }
        // Within tolerance - approximate with a straight line.
        cpNode.matCurve = [fromCc, toCc];
        cpNode.next.prevOnCircle.matCurve = [toCc, fromCc];
    }
}
exports.smoothen = smoothen;

},{"../geometry/line-line-intersection":113,"../traverse-edges":130,"./get-edge-direction":124,"flo-vector2d":50}],126:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function addDebugInfo(sat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    var generated = _debug_.generated;
    generated.elems.sat.push(sat);
    var timing = generated.timing;
    timing.sats[1] += performance.now() - timing.sats[0];
}
exports.addDebugInfo = addDebugInfo;

},{}],127:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_leaves_1 = _dereq_("../get-leaves");
/**
 * Cull all edges not part of a cycle in the MAT planar graph.
 * @param cpStart The start CpNode which must reprsesent the maximal 3-prong
 * vertex.
 */
function cullNonCycles(cpStart) {
    var cpNodeKept = cpStart;
    var leaves = get_leaves_1.getLeaves(cpStart);
    while (leaves.length) {
        var leaf = leaves.pop();
        // Preserve topology - keep cycles.
        if (leaf.isHoleClosing || leaf.isIntersection) {
            continue;
        }
        var cpNode = leaf.next; // Turn around
        while (true) {
            cpNode = cpNode.next;
            var cut = false;
            var cp1 = cpNode.prevOnCircle;
            if (cpNode.isThreeProng()) {
                var cp2 = cp1.prevOnCircle;
                if (cpStart === cpNode || cpStart === cp1 || cpStart === cp2) {
                    cut = true; // We are at the max disk - cut whole edge
                } else if (cpNode.next === cp2) {
                    cpNode = cp2;
                } else if (cp2.next !== cp1) {
                    cut = true; // Cut whole edge
                }
            } else if (cpNode.isTerminating() && !cpNode.isIntersection) {
                cpNodeKept = cpNode;
                return undefined;
            }
            if (cut) {
                cp1.next = cpNode;
                cpNode.prev = cp1;
                cpNodeKept = cpNode;
                break;
            }
        }
    }
    return cpNodeKept;
}
exports.cullNonCycles = cullNonCycles;

},{"../get-leaves":120}],128:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_leaves_1 = _dereq_("../get-leaves");
/**
 * Returns the set of Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 * @param culls The CpNodes (referred to by circles) that should be culled.
 * @param cpStart The start CpNode which must reprsesent the maximal vertex.
 */
function cull(culls, cpStart) {
    var leaves = get_leaves_1.getLeaves(cpStart);
    while (leaves.length) {
        var leaf = leaves.pop();
        // Preserve topology.
        if (leaf.isHoleClosing || leaf.isIntersection) {
            continue;
        }
        if (!culls.has(leaf.cp.circle)) {
            continue;
        }
        var cpNode = leaf.next; // Turn around
        while (true) {
            cpNode = cpNode.next;
            var cut = false;
            var cp1 = cpNode.prevOnCircle;
            if (!culls.has(cpNode.cp.circle)) {
                cut = true;
            } else if (cpNode.isThreeProng()) {
                var cp2 = cp1.prevOnCircle;
                if (cpStart === cpNode || cpStart === cp1 || cpStart === cp2) {
                    cut = true; // We are at the max disk - cut whole edge
                } else if (cpNode.next === cp2) {
                    cpNode = cp2;
                } else if (cp2.next !== cp1) {
                    cut = true; // Cut whole edge
                }
            }
            if (cut) {
                cp1.next = cpNode;
                cpNode.prev = cp1;
                break;
            }
        }
    }
}
exports.cull = cull;

},{"../get-leaves":120}],129:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var mat_1 = _dereq_("../../mat");
var traverse_edges_1 = _dereq_("../traverse-edges");
var traverse_vertices_1 = _dereq_("../traverse-vertices");
var smoothen_1 = _dereq_("../smoothen/smoothen");
var get_largest_vertex_1 = _dereq_("../get-largest-vertex");
var cull_1 = _dereq_("./cull");
var create_new_cp_tree_1 = _dereq_("../create-new-cp-tree");
var add_debug_info_1 = _dereq_("./add-debug-info");
var get_leaves_1 = _dereq_("../get-leaves");
/**
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat, s) {
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.sats[0] = performance.now();
        var leaves = get_leaves_1.getLeaves(mat.cpNode);
        _debug_.generated.elems.leaves.push(leaves);
    }
    /** The largest vertex (as measured by its inscribed disk) */
    var cpNode = get_largest_vertex_1.getLargestVertex(traverse_vertices_1.traverseVertices(mat.cpNode.clone()));
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.maxVertex.push(cpNode);
    }
    /**
     * All vertices that are set to be culled initially. This may change to
     * preserve topology.
     */
    var culls = new Set();
    var rMap = new Map();
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
        /** The occulating radius stored with this vertex. */
        var R = rMap.get(cpNode) || s * cpNode.cp.circle.radius;
        var cpNode_ = cpNode.next;
        //let c  = cpNode .cp.circle.center;
        //let c_ = cpNode_.cp.circle.center;
        /** Distance between this vertex and the next. */
        //let l = distanceBetween(c, c_); // Almost always precise enough
        var l = flo_bezier3_1.len([0, 1], cpNode.matCurve);
        var r_ = s * cpNode_.cp.circle.radius;
        if (R - l > r_) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = cpNode_.getNodes()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _cpNode = _step.value;

                    rMap.set(_cpNode, R - l); // Update occulating radii
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            culls.add(cpNode_.cp.circle);
        }
    });
    cull_1.cull(culls, cpNode);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.culls.push(Array.from(culls));
    }
    smoothen_1.smoothen(cpNode);
    var sat = new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
    add_debug_info_1.addDebugInfo(sat);
    return sat;
}
exports.toScaleAxis = toScaleAxis;

},{"../../mat":85,"../create-new-cp-tree":87,"../get-largest-vertex":119,"../get-leaves":120,"../smoothen/smoothen":125,"../traverse-edges":130,"../traverse-vertices":131,"./add-debug-info":126,"./cull":128,"flo-bezier3":3}],130:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses all edges (depth first) of a MAT starting at the given vertex (
 * represented by a CpNode). The traversal always progresses towards the leave
 * nodes.
 * @param cpNode The CpNode representing the start vertex
 * @param f A callback function for each CpNode representing the vertex at the
 * start of an edge.
 * @param inclLeaves If truthy then include the leaves, otherwise don't.
 */
function traverseEdges(cpNode, f) {
    var inclLeaves = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var cps = cpNode.getNodes();
    while (cps.length) {
        var cp = cps.pop();
        while (!cp.isTerminating()) {
            f(cp, false);
            cp = cp.next;
            if (cp.isThreeProng()) {
                cps.push(cp.nextOnCircle);
            }
        }
        if (inclLeaves) {
            f(cp, true);
        }
    }
}
exports.traverseEdges = traverseEdges;

},{}],131:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and finds and returns the first CpNode (representing
 * a vertex) as an array with one element (or all) with a specified property
 * defined by the given predicate function. Returns [] if no CpNode with the
 * specified property has been found.
 * @param cpNode any CpNode of the MAT tree
 * @param f A function that should return true if the CpNode passes the criteria
 * necessary to be returned or falsy otherwise.
 * @param returnFirst If true, returns as soon as the first CpNode passing
 * f(cpNode) was found as [CpNode]. False by default.
 */
function traverseVertices(cpNode) {
    var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (cpNode) {
        return true;
    };
    var returnFirst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var cpNodes = [];
    if (f(cpNode)) {
        cpNodes.push(cpNode);
        if (returnFirst) {
            return cpNodes;
        }
    }
    ;
    var cps = cpNode.getNodes();
    while (cps.length) {
        var _cpNode = cps.pop();
        while (!_cpNode.isTerminating()) {
            _cpNode = _cpNode.next;
            if (f(_cpNode)) {
                cpNodes.push(_cpNode);
                if (returnFirst) {
                    return cpNodes;
                }
            }
            ;
            if (_cpNode.isThreeProng()) {
                cps.push(_cpNode.nextOnCircle);
            }
        }
    }
    return cpNodes;
}
exports.traverseVertices = traverseVertices;

},{}],132:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat_1 = _dereq_("../mat");
var smoothen_1 = _dereq_("./smoothen/smoothen");
var create_new_cp_tree_1 = _dereq_("./create-new-cp-tree");
var cull_non_cycles_1 = _dereq_("./to-scale-axis/cull-non-cycles");
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
function trimMat(mat) {
    var cpNode = cull_non_cycles_1.cullNonCycles(mat.cpNode.clone());
    if (!cpNode) {
        return undefined;
    }
    smoothen_1.smoothen(cpNode);
    var mat_ = new mat_1.Mat(cpNode, create_new_cp_tree_1.createNewCpTree(cpNode));
    /*
    if (typeof _debug_ !== 'undefined') {
        let generated = _debug_.generated;
        generated.elems.sat.push(mat_);
    }
    */
    return mat_;
}
exports.trimMat = trimMat;

},{"../mat":85,"./create-new-cp-tree":87,"./smoothen/smoothen":125,"./to-scale-axis/cull-non-cycles":127}],133:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var curve_1 = _dereq_("./curve");
var circle_1 = _dereq_("./circle");
var memoize = flo_memoize_1.default.m1;

var PointOnShape = function () {
    /**
     * @param curve
     * @param t - The bezier parameter value
     */
    function PointOnShape(curve, t) {
        _classCallCheck(this, PointOnShape);

        // Cache
        this.p_ = undefined;
        this.curve = curve;
        this.t = t;
    }

    _createClass(PointOnShape, [{
        key: "p",
        get: function get() {
            return this.p_ === undefined ? this.p_ = flo_bezier3_1.evaluate(this.curve.ps, this.t) : this.p_;
        }
    }], [{
        key: "getOsculatingCircle",
        value: function getOsculatingCircle(maxOsculatingCircleRadius, pos) {
            if (PointOnShape.isSharpCorner(pos)) {
                return new circle_1.Circle(pos.p, 0);
            }
            var radius = PointOnShape.calcOsculatingCircleRadius(pos);
            if (radius < 0) {
                radius = Number.POSITIVE_INFINITY;
            }
            radius = Math.min(radius, maxOsculatingCircleRadius);
            var ps = pos.curve.ps;
            var t = pos.t;
            var normal_ = flo_bezier3_1.normal(ps, t);
            var p = flo_bezier3_1.evaluate(ps, t);
            var circleCenter = [p[0] + normal_[0] * radius, p[1] + normal_[1] * radius];
            return new circle_1.Circle(circleCenter, radius);
        }
        /**
         * Calculates the order (to distinguish between points lying on top of each
         * other) of the contact point if it is a dull corner.
         * @param pos
         */

    }, {
        key: "calcOrder",
        value: function calcOrder(circle, pos) {
            if (!PointOnShape.isDullCorner(pos)) {
                return 0;
            }
            //let corner = Curve.getCornerAtEnd(pos.curve);
            var corner = PointOnShape.getCorner(pos);
            var n = flo_vector2d_1.rotateNeg90Degrees(corner.tans[0]);
            var v = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(pos.p, circle.center));
            /*
            console.log('------------------------------');
            console.log('circle.center: ', circle.center);
            console.log('pos.p: ', pos.p);
            console.log('corner: ', corner);
            console.log('tans[0]: ', corner.tans[0]);
            console.log('n: ', n);
            console.log('v: ', v);
            console.log('-dot(n, v): ', -dot(n, v));
            */
            return -flo_vector2d_1.dot(n, v);
        }
    }]);

    return PointOnShape;
}();
/**
 * Calculates the osculating circle of the bezier at a
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param ps
 * @param t
 */


PointOnShape.calcOsculatingCircleRadius = memoize(function (pos) {
    var ps = pos.curve.ps;
    var t = pos.t;
    var κ = -flo_bezier3_1.κ(ps, t);
    // κ > 0 => bending inwards
    return 1 / κ;
});
PointOnShape.compare = function (a, b) {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    var res = void 0;
    res = a.curve.idx - b.curve.idx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    return res;
};
/**
 * Ignores order2 (used in hole-closing two-prongs only)
 */
PointOnShape.compareInclOrder = function (a, b, aOrder, bOrder) {
    var res = PointOnShape.compare(a, b);
    if (res === undefined) {
        return undefined;
    }
    if (res !== 0) {
        return res;
    }
    res = aOrder - bOrder;
    //if (res !== 0) { return res; }
    //return a.order2 - b.order2;
    return res;
};
PointOnShape.getCorner = memoize(function (pos) {
    if (pos.t !== 0 && pos.t !== 1) {
        return undefined;
    }
    return curve_1.Curve.getCornerAtEnd(pos.t === 1 ? pos.curve : pos.curve.prev);
});
PointOnShape.isSharpCorner = memoize(function (pos) {
    var corner = PointOnShape.getCorner(pos);
    return corner && corner.isSharp;
});
PointOnShape.isDullCorner = memoize(function (pos) {
    var corner = PointOnShape.getCorner(pos);
    return corner && corner.isDull;
});
PointOnShape.isQuiteSharpCorner = memoize(function (pos) {
    var corner = PointOnShape.getCorner(pos);
    return corner && corner.isQuiteSharp;
});
PointOnShape.isQuiteDullCorner = memoize(function (pos) {
    var corner = PointOnShape.getCorner(pos);
    return corner && corner.isQuiteDull;
});
/**
 * Returns a human-readable string of the given PointOnShape.
 * For debugging only.
 */
PointOnShape.toHumanString = function (pos) {
    return '' + pos.p[0] + ', ' + pos.p[1] + ' | bz: ' + pos.curve.idx + ' | t: ' + pos.t;
};
exports.PointOnShape = PointOnShape;

},{"./circle":53,"./curve":56,"flo-bezier3":3,"flo-memoize":41,"flo-vector2d":50}],134:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns an SVG string representation of the given loop.
 * @param loop
 * @param decimalPlaces
 */
function beziersToSvgPathStr(beziers) {
    var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    var D = decimalPlaces;
    var str = '';
    for (var i = 0; i < beziers.length; i++) {
        var ps = beziers[i];
        if (i === 0) {
            str = 'M ' + ps[0][0].toFixed(D) + ' ' + ps[0][1].toFixed(D) + '\n';
        }
        str += 'C ' + ps[1][0].toFixed(D) + ' ' + ps[1][1].toFixed(D) + ' ' + ps[2][0].toFixed(D) + ' ' + ps[2][1].toFixed(D) + ' ' + ps[3][0].toFixed(D) + ' ' + ps[3][1].toFixed(D) + ' ' + '\n';
    }
    return str + ' z' + '\n';
}
exports.beziersToSvgPathStr = beziersToSvgPathStr;

},{}],135:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var C = 0.55191502449;
function circleToCubicBeziers() {
    var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];
    var radius = arguments[1];
    var clockwise = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var x = center[0];
    var y = center[1];
    var r = radius;
    var c = r * C;
    var pss = [[[x, y + r], [x + c, y + r], [x + r, y + c], [x + r, y]], [[x + r, y], [x + r, y - c], [x + c, y - r], [x, y - r]], [[x, y - r], [x - c, y - r], [x - r, y - c], [x - r, y]], [[x - r, y], [x - r, y + c], [x - c, y + r], [x, y + r]]];
    if (!clockwise) {
        return pss;
    }
    return pss.map(function (ps) {
        return ps.slice().reverse();
    }).slice().reverse();
}
exports.circleToCubicBeziers = circleToCubicBeziers;

},{}],136:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
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
    var delta = max / 1e4;
    var ds = [[0, flo_vector2d_1.manhattanDistanceBetween(ps_[0], ps_[1]), flo_vector2d_1.manhattanDistanceBetween(ps_[0], ps_[2]), flo_vector2d_1.manhattanDistanceBetween(ps_[0], ps_[3])], [flo_vector2d_1.manhattanDistanceBetween(ps_[1], ps_[0]), 0, flo_vector2d_1.manhattanDistanceBetween(ps_[1], ps_[2]), flo_vector2d_1.manhattanDistanceBetween(ps_[1], ps_[3])], [flo_vector2d_1.manhattanDistanceBetween(ps_[2], ps_[0]), flo_vector2d_1.manhattanDistanceBetween(ps_[2], ps_[1]), 0, flo_vector2d_1.manhattanDistanceBetween(ps_[2], ps_[3])], [flo_vector2d_1.manhattanDistanceBetween(ps_[3], ps_[0]), flo_vector2d_1.manhattanDistanceBetween(ps_[3], ps_[1]), flo_vector2d_1.manhattanDistanceBetween(ps_[3], ps_[2]), 0]];
    var ps = ps_;
    var SHIFT = 0.02;
    // Check if first or last 3 points are coincident
    if (ds[0][1] < delta && ds[1][2] < delta || ds[1][2] < delta && ds[2][3] < delta) {
        ps = [ps_[0], flo_vector2d_1.interpolate(ps_[0], ps_[3], 1 / 3), flo_vector2d_1.interpolate(ps_[0], ps_[3], 2 / 3), ps_[3]];
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

},{"flo-vector2d":50}],137:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var push_bezier_1 = _dereq_("../fs/push-bezier");
var path_state_1 = _dereq_("../path-state");
var z_1 = _dereq_("../path-segment/z");
var c_1 = _dereq_("../path-segment/c");
var s_1 = _dereq_("../path-segment/s");
var l_1 = _dereq_("../path-segment/l");
var h_1 = _dereq_("../path-segment/h");
var v_1 = _dereq_("../path-segment/v");
var q_1 = _dereq_("../path-segment/q");
var t_1 = _dereq_("../path-segment/t");
var a_1 = _dereq_("../path-segment/a");
var pathFs = { a: a_1.a, c: c_1.c, h: h_1.h, l: l_1.l, q: q_1.q, s: s_1.s, t: t_1.t, v: v_1.v, z: z_1.z };
/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
function getBeziersFromRawPaths(paths) {
    if (paths.length === 0) {
        return []; // A shape is not described   
    }
    if (paths[0].type.toLowerCase() !== 'm') {
        throw new Error('Invalid SVG - every new path must start with an M or m.');
    }
    var s = new path_state_1.PathState();
    var beziersArrays = [];
    var beziers = [];
    var max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        for (var j = 0; j < path.values.length; j++) {
            var v = path.values[j];
            if (max < v) {
                max = v;
            }
        }
    }
    var type = undefined;
    var prevType = void 0;
    for (var _i = 0; _i < paths.length; _i++) {
        prevType = type;
        var pathSeg = paths[_i];
        type = pathSeg.type.toLowerCase();
        s.vals = pathSeg.values;
        /*
        if (pathSeg.values[0] === 109.637) {
            console.log('109')
        }
        */
        if (pathSeg.type === pathSeg.type.toLowerCase()) {
            if (type === 'v') {
                s.vals[0] += s.p[1];
            } else if (type === 'a') {
                s.vals[5] += s.p[0];
                s.vals[6] += s.p[1];
            } else {
                for (var _i2 = 0; _i2 < s.vals.length; _i2++) {
                    s.vals[_i2] += s.p[_i2 % 2];
                }
            }
        }
        if (type === 'm') {
            if (beziers.length) {
                // This is a subpath, close as if the previous command was a 
                // Z or z.
                if (prevType !== 'z') {
                    push_bezier_1.pushBezier(beziers, z_1.z(s), s, max);
                }
                // Start new path
                beziersArrays.push(beziers);
                beziers = [];
            }
            s.initialPoint = s.p = s.vals;
            continue;
        }
        var f = pathFs[type];
        if (!f) {
            throw new Error('Invalid SVG - command not recognized.');
        }
        var ps = f(s);
        s.p = ps[3]; // Update current point
        push_bezier_1.pushBezier(beziers, ps, s, max);
    }
    if (beziers.length) {
        //beziersArrays.push(beziers);
        // This is a subpath, close as if the previous command was a 
        // Z or z.
        if (prevType !== 'z') {
            push_bezier_1.pushBezier(beziers, z_1.z(s), s, max);
        }
        // Start new path
        beziersArrays.push(beziers);
    }
    return beziersArrays;
}
exports.getBeziersFromRawPaths = getBeziersFromRawPaths;

},{"../fs/push-bezier":147,"../path-segment/a":161,"../path-segment/c":162,"../path-segment/h":163,"../path-segment/l":164,"../path-segment/q":165,"../path-segment/s":166,"../path-segment/t":167,"../path-segment/v":168,"../path-segment/z":169,"../path-state":170}],138:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Bezier3 = _dereq_("flo-bezier3");
var Vector = _dereq_("flo-vector2d");
/**
 * Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param curve
 */
function getCurvatureAtInterface(curve) {
    var ts = [1, 0];
    var pss = [curve.ps, curve.next.ps];
    var tans = [Bezier3.tangent(pss[0])(1), Bezier3.tangent(pss[0])(0)];
    // The integral of a kind of Dirac Delta function.
    var cosθ = Vector.dot(tans[0], tans[1]);
    var sinθ = Vector.cross(tans[0], tans[1]);
    var θ = acos(cosθ);
    var result = sinθ >= 0 ? θ : -θ;
    return result;
}
exports.getCurvatureAtInterface = getCurvatureAtInterface;
/**
 * Floating-point 'safer' version of acos. If x is larger than 1 (or smaller
 * than -1), still returns 0 (or Math.PI) instead of NAN.
 * @param x
 * @example
 * 		acos(1);  //=> 0
 *      acos(2);  //=> 0
 */
function acos(x) {
    if (x > 1) {
        return 0;
    } else if (x < -1) {
        return Math.PI;
    }
    return Math.acos(x);
}

},{"flo-bezier3":3,"flo-vector2d":50}],139:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_shape_bounds_1 = _dereq_("./get-shape-bounds");
/**
 * Returns the max extreme point coordinate value for the given shape. This is
 * used for floating point tolerance calculations.
 * @param loops
 */
function getExtreme(loops) {
  var bounds = get_shape_bounds_1.getShapeBounds(loops);
  return Math.max(Math.abs(bounds.minX.p[0]), Math.abs(bounds.minY.p[1]), Math.abs(bounds.maxX.p[0]), Math.abs(bounds.maxY.p[1]));
}
exports.getExtreme = getExtreme;

},{"./get-shape-bounds":144}],140:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var point_on_shape_1 = _dereq_("../../point-on-shape");
var memoize = flo_memoize_1.default.m1;

var INF = Number.POSITIVE_INFINITY;
var getLoopBounds = memoize(function (loop) {
    var extremes = [[{ bezier: undefined, t: undefined, val: INF }, { bezier: undefined, t: undefined, val: INF }], [{ bezier: undefined, t: undefined, val: -INF }, { bezier: undefined, t: undefined, val: -INF }]];
    loop.curves.forEach(function (curve) {
        var ps = curve.ps;
        var bounds = flo_bezier3_1.getBounds(ps);
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                var v = bounds.box[i][j];
                var m = i === 0 ? -1 : 1; // min or max?
                var x = extremes[i][j].val;
                if (m * v > m * x || v === x && bounds.ts[i][j] > extremes[i][j].t) {
                    extremes[i][j] = {
                        bezier: curve,
                        t: bounds.ts[i][j],
                        val: v
                    };
                }
            }
        }
    });
    return {
        minX: new point_on_shape_1.PointOnShape(extremes[0][0].bezier, extremes[0][0].t),
        minY: new point_on_shape_1.PointOnShape(extremes[0][1].bezier, extremes[0][1].t),
        maxX: new point_on_shape_1.PointOnShape(extremes[1][0].bezier, extremes[1][0].t),
        maxY: new point_on_shape_1.PointOnShape(extremes[1][1].bezier, extremes[1][1].t)
    };
});
exports.getLoopBounds = getLoopBounds;

},{"../../point-on-shape":133,"flo-bezier3":3,"flo-memoize":41}],141:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_loop_bounds_1 = _dereq_("./get-loop-bounds");
/**
 * Get topmost PointOnShape the given loop.
 */
function getMinYPos(loop) {
    var pos = get_loop_bounds_1.getLoopBounds(loop).minY;
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.minY.push(pos);
    }
    return pos;
}
exports.getMinYPos = getMinYPos;

},{"./get-loop-bounds":140}],142:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_beziers_from_raw_paths_1 = _dereq_("./get-beziers-from-raw-paths");
var loop_1 = _dereq_("../../loop");
var parse_path_data_string_1 = _dereq_("../path-data-polyfill/parse-path-data-string");
function getPathsFromStr(str) {
    var bezierLoops = get_beziers_from_raw_paths_1.getBeziersFromRawPaths(parse_path_data_string_1.parsePathDataString(str));
    //---- For debugging ----//
    // TODO
    //console.log(paths);
    /*
    let pathsStr = '';
    for (let i=0; i<bezierLoops.length; i++) {
        let bezierLoop = bezierLoops[i];
          pathsStr += beziersToSvgPathStr(bezierLoop) + '\n';
    }
    console.log(pathsStr);
    */
    //-----------------------//
    return bezierLoops.map(function (path) {
        return new loop_1.Loop(path);
    });
}
exports.getPathsFromStr = getPathsFromStr;

},{"../../loop":84,"../path-data-polyfill/parse-path-data-string":159,"./get-beziers-from-raw-paths":137}],143:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_paths_from_str_1 = _dereq_("./get-paths-from-str");
function getPathsFromSvgPathElem(elem) {
    return get_paths_from_str_1.getPathsFromStr(elem.getAttribute("d"));
}
exports.getPathsFromSvgPathElem = getPathsFromSvgPathElem;

},{"./get-paths-from-str":142}],144:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_memoize_1 = _dereq_("flo-memoize");
var get_loop_bounds_1 = _dereq_("./get-loop-bounds");
var memoize = flo_memoize_1.default.m1;

var getShapeBounds = memoize(function (loops) {
    var minX_ = Number.POSITIVE_INFINITY;
    var maxX_ = Number.NEGATIVE_INFINITY;
    var minY_ = Number.POSITIVE_INFINITY;
    var maxY_ = Number.NEGATIVE_INFINITY;
    var minX = void 0;
    var maxX = void 0;
    var minY = void 0;
    var maxY = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = loops[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var loop = _step.value;

            var bounds = get_loop_bounds_1.getLoopBounds(loop);
            if (bounds.minX.p[0] < minX_) {
                minX = bounds.minX;
                minX_ = bounds.minX.p[0];
            }
            if (bounds.maxX.p[0] > maxX_) {
                maxX = bounds.maxX;
                maxX_ = bounds.maxX.p[0];
            }
            if (bounds.minY.p[1] < minY_) {
                minY = bounds.minY;
                minY_ = bounds.minY.p[1];
            }
            if (bounds.maxY.p[1] > maxY_) {
                maxY = bounds.maxY;
                maxY_ = bounds.maxY.p[1];
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
});
exports.getShapeBounds = getShapeBounds;
var getShapesBounds = memoize(function (loopss) {
    var minX_ = Number.POSITIVE_INFINITY;
    var maxX_ = Number.NEGATIVE_INFINITY;
    var minY_ = Number.POSITIVE_INFINITY;
    var maxY_ = Number.NEGATIVE_INFINITY;
    var minX = void 0;
    var maxX = void 0;
    var minY = void 0;
    var maxY = void 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = loopss[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var loops = _step2.value;

            var bounds = getShapeBounds(loops);
            if (bounds.minX.p[0] < minX_) {
                minX = bounds.minX;
                minX_ = bounds.minX.p[0];
            }
            if (bounds.maxX.p[0] > maxX_) {
                maxX = bounds.maxX;
                maxX_ = bounds.maxX.p[0];
            }
            if (bounds.minY.p[1] < minY_) {
                minY = bounds.minY;
                minY_ = bounds.minY.p[1];
            }
            if (bounds.maxY.p[1] > maxY_) {
                maxY = bounds.maxY;
                maxY_ = bounds.maxY.p[1];
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
});
exports.getShapesBounds = getShapesBounds;

},{"./get-loop-bounds":140,"flo-memoize":41}],145:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var DELTA = 1e-6;
/**
 * Returns true if distance between consecutive points are all less than
 * some delta, false otherwise.
 * @private
 * @param ps - an array of points
 * @param delta - a tolerance - defaults to 1e-6;
 */
function isAlmostZeroLength(ps) {
    var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DELTA;

    for (var i = 1; i < ps.length; i++) {
        var p1 = ps[i - 1];
        var p2 = ps[i];
        if (flo_vector2d_1.manhattanDistanceBetween(p1, p2) > delta) {
            return false;
        }
    }
    return true;
}
exports.isAlmostZeroLength = isAlmostZeroLength;

},{"flo-vector2d":50}],146:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Bezier3 = _dereq_("flo-bezier3");
var flo_memoize_1 = _dereq_("flo-memoize");
var Vector = _dereq_("flo-vector2d");
var get_loop_bounds_1 = _dereq_("./get-loop-bounds");
var memoize = flo_memoize_1.default.m1;
/**
 * Returns true if the given beizer loop is positively orientated, false
 * otherwise. Careful! Checks leftmost part of loop so twisted complex paths
 * may give an ambiguous orientation.
 */

var isPathPositivelyOrientated = memoize(function (bezierLoop) {
    var extreme = get_loop_bounds_1.getLoopBounds(bezierLoop).minX;
    var t = extreme.t;
    var curve = void 0;
    if (t === 0) {
        curve = extreme.curve.prev;
        t = 1;
    } else {
        curve = extreme.curve;
    }
    var ps = curve.ps;
    var tan = Bezier3.tangent(ps)(t);
    if (t !== 1) {
        // Not a sharp corner
        return tan[1] < 0;
    }
    var psNext = curve.next.ps;
    var tanNext = Bezier3.tangent(psNext)(0);
    if (tan[1] * tanNext[1] > 0) {
        // Both tangents points up or both points down.
        return tan[1] < 0;
    }
    // One tangent points up and the other down.
    var c = Vector.cross(tan, tanNext);
    return c > 0;
    // We don't check for the very special case where the cross === 0. 
});
exports.isPathPositivelyOrientated = isPathPositivelyOrientated;

},{"./get-loop-bounds":140,"flo-bezier3":3,"flo-memoize":41,"flo-vector2d":50}],147:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var de_pathologify_1 = _dereq_("./de-pathologify");
var is_almost_zero_length_1 = _dereq_("./is-almost-zero-length");
// TODO - 1e4 is arbitrary
var RESOLUTION = 1e4;
/**
 *
 * @param beziers The array of path curves
 * @param ps_ The bezier
 * @param state The current path state
 */
function pushBezier(beziers, ps_, s, max) {
    /*
    if ( isAlmostZeroLength(ps_, max/RESOLUTION) ) {
    if ( isAlmostZeroLength(ps_, 0) ) {
    return;
    }
    //console.log(ps_);
    }
    beziers.push(ps_);
    */
    if (is_almost_zero_length_1.isAlmostZeroLength(ps_, max / RESOLUTION)) {
        var len = beziers.length;
        if (len === 0) {
            s.initialPoint = ps_[3];
        } else {
            var prevPs = beziers[len - 1];
            prevPs[3] = ps_[3];
        }
        return;
    }
    var ps = de_pathologify_1.dePathologify(ps_, max);
    beziers.push(ps);
}
exports.pushBezier = pushBezier;

},{"./de-pathologify":136,"./is-almost-zero-length":145}],148:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var get_next_x_1 = _dereq_("./get-next-x");
function completeLoop(intersections, takenXs, xStack, loopTree, x) {
    var beziers = [];
    var reversed = loopTree.windingNum === 0 && loopTree.orientation === -1 || loopTree.windingNum !== 0 && loopTree.orientation === +1;
    var pos = reversed ? x.pos : x.opposite.pos;
    var startBez = pos.curve;
    var startT = pos.t;
    var curBez = startBez;
    var curT = startT;
    var fromX = x.isDummy ? undefined : reversed ? x.opposite : x;
    var wasOnX = true;
    while (true) {
        var xs = intersections.get(curBez);
        var x_ = xs ? get_next_x_1.getNextX(xs, curT, !reversed, wasOnX) : undefined;
        // Add a bezier to the component loop.
        if (x_) {
            // We are at an intersection
            wasOnX = true;
            if (curT !== x_.pos.t) {
                var ps = reversed ? flo_bezier3_1.reverse(flo_bezier3_1.fromTo(curBez.ps)(x_.pos.t, curT)) : flo_bezier3_1.fromTo(curBez.ps)(curT, x_.pos.t);
                beziers.push(ps);
                addXOutPs(reversed, fromX, ps);
                fromX = x_;
            }
            // Move onto next bezier
            curBez = x_.opposite.pos.curve; // Switch to other path's bezier
            curT = x_.opposite.pos.t; // ...
            var _x_ = reversed ? x_.opposite : x_;
            _x_.loopTree = loopTree;
            if (!takenXs.has(_x_.opposite)) {
                xStack.push(_x_.opposite);
            }
            takenXs.add(_x_); // Mark this intersection as taken
        } else {
            wasOnX = false;
            var t = reversed ? 0 : 1;
            if (curT !== t) {
                var _ps = reversed ? flo_bezier3_1.reverse(flo_bezier3_1.fromTo(curBez.ps)(0, curT)) : flo_bezier3_1.fromTo(curBez.ps)(curT, 1);
                beziers.push(_ps);
                addXOutPs(reversed, fromX, _ps);
                fromX = undefined;
            }
            // Move onto next bezier on current path
            curBez = reversed ? curBez.prev : curBez.next;
            curT = reversed ? 1 : 0;
        }
        if (curBez === startBez && curT === startT) {
            break;
        }
    }
    return beziers;
}
exports.completeLoop = completeLoop;
function addXOutPs(reversed, fromX, ps) {
    if (fromX && !fromX.isDummy) {
        var x = reversed ? fromX : fromX.opposite;
        x.outPs = ps;
        fromX = undefined;
        //_debug_.fs.draw.bezier(_debug_.generated.g, ps, 'red thin10 nofill');
    }
}

},{"./get-next-x":153,"flo-bezier3":3}],149:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var loop_1 = _dereq_("../../../loop");
var complete_loop_1 = _dereq_("./complete-loop");
var get_initial_x_1 = _dereq_("./get-initial-x");
var get_loop_metrics_1 = _dereq_("./get-loop-metrics");
/**
 *
 * @param intersections
 * @param loopsTaken
 * @param loop
 * @param parent
 */
function completePath(intersections, loopsTaken, parent, loop) {
    // Each loop generated by xs in xStack will give rise to one componentLoop. 
    // The initial intersection in the stack is a dummy.
    /** Intersection stack */
    var initialX = get_initial_x_1.getInitialX(intersections, parent, loop);
    var curve = initialX.pos.curve;
    var xs = intersections.get(curve) || [];
    if (xs.length === 0) {
        intersections.set(curve, xs);
    }
    xs.push(initialX);
    var xStack = [initialX];
    var takenXs = new Set(); // Taken intersections
    while (xStack.length) {
        var x = xStack.pop();
        loopsTaken.add(x.pos.curve.loop);
        if (takenXs.has(x)) {
            continue;
        }
        var loopTree = get_loop_metrics_1.getLoopMetrics(x);
        loopTree.beziers = complete_loop_1.completeLoop(intersections, takenXs, xStack, loopTree, x);
        loopTree.loop = new loop_1.Loop(loopTree.beziers);
    }
}
exports.completePath = completePath;

},{"../../../loop":84,"./complete-loop":148,"./get-initial-x":150,"./get-loop-metrics":152}],150:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../../point-on-shape");
var is_path_positively_oriented_1 = _dereq_("../../fs/is-path-positively-oriented");
var get_loop_bounds_1 = _dereq_("../get-loop-bounds");
var x_1 = _dereq_("../../../x");
/**
 * Get initial intersection which is really a dummy intersection.
 * @param loop
 * @param parent
 */
function getInitialX(intersections, parent, loop) {
    var dummyLoop = {
        parent: parent,
        children: new Set(),
        beziers: [],
        loop: undefined,
        orientation: is_path_positively_oriented_1.isPathPositivelyOrientated(loop) ? -1 : +1,
        windingNum: parent.windingNum
    };
    var pos = get_loop_bounds_1.getLoopBounds(loop).minX;
    var xs = intersections.get(pos.curve);
    // If no intersections on this curve, just start at 0
    if (!xs) {
        pos = new point_on_shape_1.PointOnShape(pos.curve, 0);
    }
    var x = new x_1.X(pos, true, undefined, // will be set just below
    dummyLoop);
    x.opposite = x;
    return x;
}
exports.getInitialX = getInitialX;

},{"../../../point-on-shape":133,"../../../x":172,"../../fs/is-path-positively-oriented":146,"../get-loop-bounds":140}],151:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var x_1 = _dereq_("../../../x");
var point_on_shape_1 = _dereq_("../../../point-on-shape");
var pair_set_1 = _dereq_("./pair-set");
var find_bb_intersections_1 = _dereq_("../../../bounding-box/find-bb-intersections");
// TODO - DELTA is somewhat arbitrary
var DELTA = 1e-10;
/**
 * Find and return all intersections on all given loops.
 * @param loops
 */
function getIntersections(loops) {
    // intersection <=> X
    var _getBoxInfos = getBoxInfos(loops),
        boxes = _getBoxInfos.boxes,
        boxInfoMap = _getBoxInfos.boxInfoMap;

    var boxIntersections = find_bb_intersections_1.default(boxes);
    // Check curve intersection amongst possibilities
    /** A map from each curve to its intersectings */
    var xMap = new Map();
    var checkedPairs = new Map();
    for (var i = 0; i < boxIntersections.length; i++) {
        var _boxIntersections$i = boxIntersections[i],
            box1 = _boxIntersections$i.box1,
            box2 = _boxIntersections$i.box2;

        var curves = [boxInfoMap.get(box1).curve, boxInfoMap.get(box2).curve];
        if (pair_set_1.pairSet_has(checkedPairs, curves)) {
            continue;
        }
        pair_set_1.pairSet_add(checkedPairs, curves);
        var pss = curves.map(function (curve) {
            return curve.ps;
        });
        var tPairs = flo_bezier3_1.bezier3Intersection(pss[0], pss[1]);
        if (!tPairs.length) {
            continue;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = tPairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var tPair = _step.value;

                var curves_ = confirmIntersection(checkedPairs, curves, tPair);
                if (curves_ === undefined) {
                    continue;
                }
                var xs = [];
                var _arr = [0, 1];
                for (var _i = 0; _i < _arr.length; _i++) {
                    var j = _arr[_i];
                    var curve = curves_[j];
                    var x = new x_1.X(new point_on_shape_1.PointOnShape(curve, tPair[j]));
                    // Get intersections stored at this curve
                    var curveXs = xMap.get(curve) || [];
                    if (!curveXs.length) {
                        xMap.set(curve, curveXs);
                    }
                    // Add an intersection to this curve
                    curveXs.push(x);
                    xs.push(x);
                }
                xs[0].opposite = xs[1];
                xs[1].opposite = xs[0];
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return xMap;
}
exports.getIntersections = getIntersections;
/**
 *
 */
function confirmIntersection(checkedPairs, curves, tPair) {
    var curves_ = curves.slice();
    // TODO - the below check is temporary - there is a better way
    // TODO - eliminate the fact that intersections are found twice
    if ((Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1] - 1) < DELTA || Math.abs(tPair[0] - 1) < DELTA && Math.abs(tPair[1]) < DELTA || Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1]) < DELTA || Math.abs(tPair[0] - 1) < DELTA && Math.abs(tPair[1] - 1) < DELTA) && (curves_[0].next === curves_[1] || curves_[1].next === curves_[0])) {
        return undefined;
    }
    if (Math.abs(tPair[0] - 1) < DELTA) {
        // If the intersection occurs at the end, move it to the start
        // so we don't have a very small bezier piece left.
        curves_[0] = curves_[0].next;
        tPair[0] = 0;
        // Recheck
        if (pair_set_1.pairSet_has(checkedPairs, [curves_[0], curves_[1]])) {
            return undefined;
        }
    }
    if (Math.abs(tPair[1] - 1) < DELTA) {
        // If the intersection occurs at the end, move it to the start
        // so we don't have a very small bezier piece left.
        curves_[1] = curves_[1].next;
        tPair[1] = 0;
        // Recheck
        if (pair_set_1.pairSet_has(checkedPairs, [curves_[0], curves_[1]])) {
            return undefined;
        }
    }
    return curves_;
}
/**
 * Returns an array of lines of the bounding hulls of the Loop beziers' control
 * points including a map that maps each line to its hull, path and curve.
 * @param loops An array of Loops
 */
function getBoxInfos(loops) {
    /** Map that maps a line segment to some info. */
    var boxInfoMap = new Map();
    var boxes = [];
    // Get lines making up the hulls of the paths

    var _loop = function _loop(loop) {
        loop.curves.forEach(function (curve) {
            var box = flo_bezier3_1.getBoundingBox(curve.ps);
            boxes.push(box);
            boxInfoMap.set(box, { box: box, loop: loop, curve: curve });
        });
    };

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = loops[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var loop = _step2.value;

            _loop(loop);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return { boxes: boxes, boxInfoMap: boxInfoMap };
}

},{"../../../bounding-box/find-bb-intersections":52,"../../../point-on-shape":133,"../../../x":172,"./pair-set":156,"flo-bezier3":3}],152:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_bezier3_1 = _dereq_("flo-bezier3");
var flo_vector2d_1 = _dereq_("flo-vector2d");
/**
 *
 * @param x The intersection
 */
function getLoopMetrics(x) {
    var oppositeLoopTree = x.opposite.loopTree;
    var oppositeOrientation = oppositeLoopTree.orientation;
    var oppositeWindingNum = oppositeLoopTree.windingNum;
    // Left or right turning? - The current X
    var oldInBez = x.opposite.pos.curve.ps;
    var oldOutBez = x.pos.curve.ps;
    var orientation = void 0;
    var windingNum = void 0;
    var parent = void 0;
    if (oldInBez !== oldOutBez) {
        var tanIn = flo_bezier3_1.tangent(oldInBez, x.opposite.pos.t);
        var tanOut = flo_bezier3_1.tangent(oldOutBez, x.pos.t);
        // TODO - if cross product is close to 0 check second derivatives (the 
        // same can be done at cusps in the mat code). E.g. a figure eight with 
        // coinciding bezier stretches may cause floating point instability.
        var isLeft = flo_vector2d_1.cross(tanIn, tanOut) > 0;
        var isTwist = isLeft && oppositeOrientation === +1 || !isLeft && oppositeOrientation === -1;
        var windingNumberInc = isTwist ? -2 * oppositeOrientation : oppositeOrientation;
        orientation = isTwist ? -1 * oppositeOrientation : +1 * oppositeOrientation;
        windingNum = oppositeWindingNum + windingNumberInc;
        parent = isTwist ? oppositeLoopTree.parent : oppositeLoopTree;
    } else {
        // This is the first loop's start - it's a special case
        orientation = oppositeOrientation === +1 ? -1 : +1;
        windingNum = oppositeWindingNum + orientation;
        parent = oppositeLoopTree.parent;
    }
    var iLoopTree = {
        parent: parent,
        children: new Set(),
        beziers: undefined,
        loop: undefined,
        orientation: orientation,
        windingNum: windingNum
    };
    parent.children.add(iLoopTree);
    return iLoopTree;
}
exports.getLoopMetrics = getLoopMetrics;

},{"flo-bezier3":3,"flo-vector2d":50}],153:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param xs An array of intersections on the curve
 * @param curT The current t value
 * @param forwards If true go forwards else go backwards
 */
function getNextX(xs, curT, forwards, wasOnX) {
    var bestX = undefined;
    var bestT = Number.POSITIVE_INFINITY;
    for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        var t = x.pos.t;
        var deltaT = forwards ? t - curT : curT - t;
        if ((deltaT > 0 || deltaT === 0 && !wasOnX) && deltaT < bestT) {
            bestX = x;
            bestT = deltaT;
        }
    }
    return bestX;
}
exports.getNextX = getNextX;
/**
 *
 * @param xs An array of intersections on the curve
 * @param t The current t value
 */
function getThisX(xs, t) {
    for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (x.pos.t - t === 0) {
            return x;
        }
    }
}
exports.getThisX = getThisX;

},{}],154:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var is_loop_in_loop_1 = _dereq_("./is-loop-in-loop");
/**
 *
 * @param root
 * @param loop
 */
function getTightestContainingLoop(root, loop) {
    var containingLoop = undefined;
    var stack = [root];
    while (stack.length) {
        var loopTree = stack.pop();
        f(loopTree);
    }
    //console.log(containingLoop)
    return containingLoop;
    function f(parent) {
        if (parent === root || is_loop_in_loop_1.isLoopInLoop([loop, parent.loop])) {
            containingLoop = parent;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = parent.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    stack.push(child);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }
}
exports.getTightestContainingLoop = getTightestContainingLoop;

},{"./is-loop-in-loop":155}],155:[function(_dereq_,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var point_on_shape_1 = _dereq_("../../../point-on-shape");
var get_loop_bounds_1 = _dereq_("../get-loop-bounds");
var DELTA = 1e-6;
/**
 * Returns true if the first loop is contained wholly within the second. At this
 * stage we already know the loop is either wholly contained inside the loop
 * or is wholly outside.
 * @param loops
 */
function isLoopInLoop(loops) {
    var i = 0;
    var seed = 1231; // Just some value
    do {
        i++;
        // This gets us a predictable random number between 0 and 1;
        var rand1 = flo_poly_1.default.random.flatCoefficients(1, 0, 1, seed);
        var t = rand1.p[0];
        seed = rand1.seed; // Get next seed.
        // This gets us a predictable random number roughly between 0 and the 
        // number of curves in the loop.
        var curveCount = loops[0].curves.length;
        var rand2 = flo_poly_1.default.random.flatCoefficients(1, 0, curveCount, seed);
        var idx = Math.floor(rand2.p[0]);
        seed = rand2.seed; // Get next seed.
        var ps = loops[0].curves[idx].ps;
        var p = flo_bezier3_1.evaluate(ps, t);
        var res = f(loops, p);
        if (res !== undefined) {
            return res;
        }
    } while (i < 10);
    return undefined; // There's no chance we'll get up to this point.
    function f(loops, p) {
        if (isLoopNotInLoop(loops)) {
            return false;
        }
        //let g = _debug_.generated.g;
        //let bounds = getShapeBounds(loops);
        //_debug_.fs.draw.dot(g, p, (bounds.maxX.p[0] - bounds.minX.p[0]) * 0.002, 'blue');
        var intersections = getAxisAlignedRayLoopIntersections(loops[1], p, 'left');
        //console.log(intersections, intersections.length % 2 !== 0);
        if (intersections) {
            return intersections.length % 2 !== 0;
        }
    }
}
exports.isLoopInLoop = isLoopInLoop;
/**
 * Returns true if the first loop is not wholly within the second. The converse
 * is not necessarily true. It is assumed the loops don't intersect.
 * @param loops
 */
function isLoopNotInLoop(loops) {
    var loopBoundss = loops.map(get_loop_bounds_1.getLoopBounds);
    var boundss = loopBoundss.map(function (loopBound) {
        return {
            minX: loopBound.minX.p[0],
            maxX: loopBound.maxX.p[0],
            minY: loopBound.minY.p[1],
            maxY: loopBound.maxY.p[1]
        };
    });
    return boundss[0].minX < boundss[1].minX || boundss[0].maxX > boundss[1].maxX || boundss[0].minY < boundss[1].minY || boundss[0].maxY > boundss[1].maxY;
}
//enum Dir { LEFT, RIGHT, UP, DOWN }
/**
 *
 * @param p The point where the horizontal ray starts
 * @param toLeft The ray to the left of this point (else right)
 * @param loop A loop of curves
 */
function getAxisAlignedRayLoopIntersections(loop, p, dir) {
    var _p = _slicedToArray(p, 2),
        x = _p[0],
        y = _p[1];

    var curves = loop.curves;
    var possAll = [];

    var _loop = function _loop(i) {
        var curve = curves[i];
        var ps = curve.ps;
        //------------------------------------------------------/
        //---- Check if ray intersects bezier bounding box -----/
        //------------------------------------------------------/

        var _flo_bezier3_1$getBou = flo_bezier3_1.getBoundingBox(ps),
            _flo_bezier3_1$getBou2 = _slicedToArray(_flo_bezier3_1$getBou, 2),
            _flo_bezier3_1$getBou3 = _slicedToArray(_flo_bezier3_1$getBou2[0], 2),
            minX = _flo_bezier3_1$getBou3[0],
            minY = _flo_bezier3_1$getBou3[1],
            _flo_bezier3_1$getBou4 = _slicedToArray(_flo_bezier3_1$getBou2[1], 2),
            maxX = _flo_bezier3_1$getBou4[0],
            maxY = _flo_bezier3_1$getBou4[1];

        var notIntersecting = (dir === 'left' || dir === 'right') && (minY > y || maxY < y) || (dir === 'up' || dir === 'down') && (minX > x || maxX < x);
        notIntersecting = notIntersecting || dir === 'left' && minX > x || dir === 'right' && maxX < x || dir === 'down' && minY > y || dir === 'up' && maxY < y;
        if (notIntersecting) {
            return "continue";
        } // No intersection with bezier
        //------------------------------------------------------/
        //----------- Get intersection ts on bezier ------------/
        //------------------------------------------------------/
        // Get the bezier's x-coordinate power representation.
        var ts = [];
        var f = void 0;
        var offset = void 0;
        var axis = void 0;
        var dirIsDecreasing = dir === 'left' || dir === 'up';
        if (dir === 'left' || dir === 'right') {
            f = flo_bezier3_1.getY;
            offset = [0, -y];
            axis = 0;
        } else {
            f = flo_bezier3_1.getX;
            offset = [-x, 0];
            axis = 1;
        }
        var translatedPs = flo_bezier3_1.translate(offset, ps);
        var poly = f(translatedPs);
        var ev = flo_bezier3_1.evaluate(translatedPs);
        var ts_ = flo_poly_1.default.allRoots(poly, 0 - DELTA, 1 + DELTA);
        for (var _i = 0; _i < ts_.length; _i++) {
            var t = ts_[_i];
            if (Math.abs(t) < DELTA || Math.abs(t - 1) < DELTA) {
                // We don't know the exact number of intersections due to
                // floating point arithmetic. 
                return {
                    v: undefined
                };
            }
            var p_ = ev(t);
            if (dirIsDecreasing && p[axis] >= p_[axis] || !dirIsDecreasing && p[axis] <= p_[axis]) {
                ts.push(t);
            }
        }
        //------------------------------------------------------/
        //----- Check if line is tangent to intersections ------/
        //------------------------------------------------------/
        // We only care if there were 1 or 3 intersections.
        if (ts.length === 1 || ts.length === 3) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = ts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _t = _step.value;

                    var tan = flo_bezier3_1.tangent(ps, _t);
                    if ((dir === 'left' || dir === 'right') && Math.abs(tan[1]) < DELTA || (dir === 'down' || dir === 'up') && Math.abs(tan[0]) < DELTA) {
                        // We don't know the exact number of intersections due to
                        // floating point arithmetic
                        return {
                            v: undefined
                        };
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        possAll.push.apply(possAll, _toConsumableArray(ts.map(function (t) {
            return new point_on_shape_1.PointOnShape(curve, t);
        })));
    };

    for (var i = 0; i < curves.length; i++) {
        var _ret = _loop(i);

        switch (_ret) {
            case "continue":
                continue;

            default:
                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
    }
    return possAll;
}

},{"../../../point-on-shape":133,"../get-loop-bounds":140,"flo-bezier3":3,"flo-poly":42}],156:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adds an unordered pair of values to the set (given as a special map)
 * @param map The map representing the pairs.
 * @param vs The pair to add.
 */
function pairSet_add(map, vs) {
    if (pairSet_has(map, vs)) {
        return;
    }
    f(vs[0], vs[1]);
    f(vs[1], vs[0]);
    function f(v1, v2) {
        var set = map.get(v1);
        if (!set) {
            set = new Set();
            map.set(v1, set);
        }
        set.add(v2);
    }
}
exports.pairSet_add = pairSet_add;
/**
 * Returns true if the unordered pair is in the set of pairs (represented by a
 * map).
 * @param map The map representing the pairs.
 * @param vs The pair to check.
 */
function pairSet_has(map, vs) {
    var set = void 0;
    set = map.get(vs[0]);
    var has1 = set && set.has(vs[1]);
    set = map.get(vs[1]);
    var has2 = set && set.has(vs[0]);
    return has1 || has2;
}
exports.pairSet_has = pairSet_has;
/**
 * Returns the unordered pairs as an array.
 * @param map The map representing the pairs.
 */
function pairSet_asArray(map) {
    var items = [];
    var map_ = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var m = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = m[1][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var s = _step2.value;

                    var vs = [m[0], s];
                    if (!pairSet_has(map_, vs)) {
                        items.push(vs);
                        pairSet_add(map_, vs);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return items;
}
exports.pairSet_asArray = pairSet_asArray;

},{}],157:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var loop_1 = _dereq_("../../../loop");
var get_loop_bounds_1 = _dereq_("../get-loop-bounds");
var get_intersections_1 = _dereq_("./get-intersections");
var complete_path_1 = _dereq_("./complete-path");
var get_tightest_containing_loop_1 = _dereq_("./get-tightest-containing-loop");
/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param loops An array of possibly intersecting paths
 */
function simplifyPaths(loops) {
    /*
    let s = '';
    for (let loop of loops) {
        s = s + '\n\n' + beziersToSvgPathStr(loop.curves.map(c => c.ps), 5)
    }
    console.log(s);
    */
    /** A map from each curve to an array of intersections on that curve. */
    var intersections = get_intersections_1.getIntersections(loops);
    var loopsTaken = new Set();
    var root = {
        parent: undefined,
        children: new Set(),
        beziers: undefined,
        loop: undefined,
        orientation: undefined,
        windingNum: 0
    };
    loops.sort(ascendingByTopmostPoint);
    if (typeof _debug_ !== 'undefined') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = loops[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var loop = _step.value;

                _debug_.fs.nameObj(loop);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = loops[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _loop = _step2.value;

            // TODO - handle special case of 1 curve - mayve just delete lines below
            if (_loop.curves.length <= 1) {
                continue;
            }
            if (loopsTaken.has(_loop)) {
                continue;
            }
            loopsTaken.add(_loop);
            var parent = get_tightest_containing_loop_1.getTightestContainingLoop(root, _loop);
            complete_path_1.completePath(intersections, loopsTaken, parent, _loop);
        }
        // Take the forest of trees, create a new root making it a tree and snip
        // branches such that each branch determines a new set of loops each 
        // representing an individual independent shape that possess its own Medial
        // Axis Transform (still to be determined).
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var loopTrees = splitLoopTrees(root);
    var iLoopSets = loopTrees.map(getLoopsFromTree);
    var loopss = iLoopSets.map(function (loopSet) {
        return loopSet.map(ILoopToLoop);
    });
    /*
    let str = '';
    for (let simplePaths of loopss) {
        //console.log(str)
        for (let loop of simplePaths) {
            str = str + '\n\n' + beziersToSvgPathStr(
                loop.curves.map(c => c.ps),
                5
            )
        }
        //console.log(str)
        //console.log('-----------------');
    }
    console.log(str)
    */
    var xMap = new Map();
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = intersections[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var intersection = _step3.value;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = intersection[1][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var x = _step4.value;

                    if (x.isDummy) {
                        continue;
                    }
                    xMap.set(x.outPs, { ps: x.opposite.outPs });
                    if (typeof _debug_ !== 'undefined') {
                        _debug_.generated.elems.intersection.push(x);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return { loopss: loopss, xMap: xMap };
}
exports.simplifyPaths = simplifyPaths;
/**
 *
 * @param iLoop
 */
function ILoopToLoop(iLoop) {
    return new loop_1.Loop(iLoop.beziers);
}
function splitLoopTrees(root) {
    var iLoopTrees = [];
    var nodeStack = [root];
    while (nodeStack.length) {
        var parent = nodeStack.pop();
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = parent.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var child = _step5.value;

                if (parent.windingNum === 0) {
                    iLoopTrees.push(child);
                }
                nodeStack.push(child);
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        if (parent.windingNum === 0) {
            parent.children = new Set(); // Make it a leaf
        }
    }
    return iLoopTrees;
}
/**
 * Returns an array of LoopTrees from the given LoopTree where each returned
 * LoopTree is one of the nodes of the tree. Nodes with winding number > 1 are
 * not returned.
 * @param root
 */
function getLoopsFromTree(root) {
    var loopTrees = [];
    var stack = [root];
    while (stack.length) {
        var node = stack.pop();
        f(node);
    }
    return loopTrees;
    function f(parent) {
        if (Math.abs(parent.windingNum) <= 1) {
            loopTrees.push(parent);
        }
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = parent.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var child = _step6.value;

                stack.push(child);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }
    }
}
/**
 *
 * @param loopA
 * @param loopB
 */
function ascendingByTopmostPoint(loopA, loopB) {
    var boundsA = get_loop_bounds_1.getLoopBounds(loopA);
    var boundsB = get_loop_bounds_1.getLoopBounds(loopB);
    var a = boundsA.minY.p[1];
    var b = boundsB.minY.p[1];
    return a - b;
}

},{"../../../loop":84,"../get-loop-bounds":140,"./complete-path":149,"./get-intersections":151,"./get-tightest-containing-loop":154}],158:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
// Source/core/svg/SVGParserUtilities.cpp.
// Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
function parseNumber(source) {
    var exponent = 0;
    var integer = 0;
    var frac = 1;
    var decimal = 0;
    var sign = 1;
    var expsign = 1;
    var startIndex = source._currentIndex;
    source._skipOptionalSpaces();
    // Read the sign.
    if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === "+") {
        source._currentIndex += 1;
    } else if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === "-") {
        source._currentIndex += 1;
        sign = -1;
    }
    if (source._currentIndex === source._endIndex || (source._string[source._currentIndex] < "0" || source._string[source._currentIndex] > "9") && source._string[source._currentIndex] !== ".") {
        // The first character of a number must be one of [0-9+-.].
        return null;
    }
    // Read the integer part, build right-to-left.
    var startIntPartIndex = source._currentIndex;
    while (source._currentIndex < source._endIndex && source._string[source._currentIndex] >= "0" && source._string[source._currentIndex] <= "9") {
        source._currentIndex += 1; // Advance to first non-digit.
    }
    if (source._currentIndex !== startIntPartIndex) {
        var scanIntPartIndex = source._currentIndex - 1;
        var multiplier = 1;
        while (scanIntPartIndex >= startIntPartIndex) {
            integer += multiplier * (Number(source._string[scanIntPartIndex]) - 0);
            scanIntPartIndex -= 1;
            multiplier *= 10;
        }
    }
    // Read the decimals.
    if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === ".") {
        source._currentIndex += 1;
        // There must be a least one digit following the .
        if (source._currentIndex >= source._endIndex || source._string[source._currentIndex] < "0" || source._string[source._currentIndex] > "9") {
            return null;
        }
        while (source._currentIndex < source._endIndex && source._string[source._currentIndex] >= "0" && source._string[source._currentIndex] <= "9") {
            frac *= 10;
            decimal += Number(source._string.charAt(source._currentIndex)) / frac;
            source._currentIndex += 1;
        }
    }
    // Read the exponent part.
    if (source._currentIndex !== startIndex && source._currentIndex + 1 < source._endIndex && (source._string[source._currentIndex] === "e" || source._string[source._currentIndex] === "E") && source._string[source._currentIndex + 1] !== "x" && source._string[source._currentIndex + 1] !== "m") {
        source._currentIndex += 1;
        // Read the sign of the exponent.
        if (source._string[source._currentIndex] === "+") {
            source._currentIndex += 1;
        } else if (source._string[source._currentIndex] === "-") {
            source._currentIndex += 1;
            expsign = -1;
        }
        // There must be an exponent.
        if (source._currentIndex >= source._endIndex || source._string[source._currentIndex] < "0" || source._string[source._currentIndex] > "9") {
            return null;
        }
        while (source._currentIndex < source._endIndex && source._string[source._currentIndex] >= "0" && source._string[source._currentIndex] <= "9") {
            exponent *= 10;
            exponent += Number(source._string[source._currentIndex]);
            source._currentIndex += 1;
        }
    }
    var number = integer + decimal;
    number *= sign;
    if (exponent) {
        number *= Math.pow(10, expsign * exponent);
    }
    if (startIndex === source._currentIndex) {
        return null;
    }
    source._skipOptionalSpacesOrDelimiter();
    return number;
}
exports.parseNumber = parseNumber;

},{}],159:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var source_1 = _dereq_("./source");
function parsePathDataString(string) {
    if (!string.length) return [];
    var source = new source_1.Source(string);
    var pathData = [];
    if (!source.initialCommandIsMoveTo()) {
        return [];
    }
    while (source.hasMoreData()) {
        var pathSeg = source.parseSegment();
        if (pathSeg === null) {
            break;
        } else {
            pathData.push(pathSeg);
        }
    }
    return pathData;
}
exports.parsePathDataString = parsePathDataString;

},{"./source":160}],160:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var parse_number_1 = _dereq_("./parse-number");
var COMMAND_MAP = {
    "Z": "Z", "M": "M", "L": "L", "C": "C", "Q": "Q", "A": "A", "H": "H", "V": "V", "S": "S", "T": "T",
    "z": "Z", "m": "m", "l": "l", "c": "c", "q": "q", "a": "a", "h": "h", "v": "v", "s": "s", "t": "t"
};

var Source = function () {
    function Source(string) {
        _classCallCheck(this, Source);

        this._string = string;
        this._currentIndex = 0;
        this._endIndex = this._string.length;
        this._prevCommand = null;
        this._skipOptionalSpaces();
    }

    _createClass(Source, [{
        key: "parseSegment",
        value: function parseSegment() {
            var char = this._string[this._currentIndex];
            var command = COMMAND_MAP[char] ? COMMAND_MAP[char] : null;
            if (command === null) {
                // Possibly an implicit command. Not allowed if this is the first command.
                if (this._prevCommand === null) {
                    return null;
                }
                // Check for remaining coordinates in the current command.
                if ((char === "+" || char === "-" || char === "." || char >= "0" && char <= "9") && this._prevCommand !== "Z") {
                    if (this._prevCommand === "M") {
                        command = "L";
                    } else if (this._prevCommand === "m") {
                        command = "l";
                    } else {
                        command = this._prevCommand;
                    }
                } else {
                    command = null;
                }
                if (command === null) {
                    return null;
                }
            } else {
                this._currentIndex += 1;
            }
            this._prevCommand = command;
            var values = null;
            var cmd = command.toUpperCase();
            if (cmd === "H" || cmd === "V") {
                values = [parse_number_1.parseNumber(this)];
            } else if (cmd === "M" || cmd === "L" || cmd === "T") {
                values = [parse_number_1.parseNumber(this), parse_number_1.parseNumber(this)];
            } else if (cmd === "S" || cmd === "Q") {
                values = [parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this)];
            } else if (cmd === "C") {
                values = [parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this)];
            } else if (cmd === "A") {
                values = [parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), this._parseArcFlag(), this._parseArcFlag(), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this)];
            } else if (cmd === "Z") {
                this._skipOptionalSpaces();
                values = [];
            }
            if (values === null || values.indexOf(null) >= 0) {
                // Unknown command or known command with invalid values
                return null;
            } else {
                return { type: command, values: values };
            }
        }
    }, {
        key: "hasMoreData",
        value: function hasMoreData() {
            return this._currentIndex < this._endIndex;
        }
    }, {
        key: "peekSegmentType",
        value: function peekSegmentType() {
            var char = this._string[this._currentIndex];
            return COMMAND_MAP[char] ? COMMAND_MAP[char] : null;
        }
    }, {
        key: "initialCommandIsMoveTo",
        value: function initialCommandIsMoveTo() {
            // If the path is empty it is still valid, so return true.
            if (!this.hasMoreData()) {
                return true;
            }
            var command = this.peekSegmentType();
            // Path must start with moveTo.
            return command === "M" || command === "m";
        }
    }, {
        key: "_isCurrentSpace",
        value: function _isCurrentSpace() {
            var char = this._string[this._currentIndex];
            return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
        }
    }, {
        key: "_skipOptionalSpaces",
        value: function _skipOptionalSpaces() {
            while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
                this._currentIndex += 1;
            }
            return this._currentIndex < this._endIndex;
        }
    }, {
        key: "_skipOptionalSpacesOrDelimiter",
        value: function _skipOptionalSpacesOrDelimiter() {
            if (this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string[this._currentIndex] !== ",") {
                return false;
            }
            if (this._skipOptionalSpaces()) {
                if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ",") {
                    this._currentIndex += 1;
                    this._skipOptionalSpaces();
                }
            }
            return this._currentIndex < this._endIndex;
        }
    }, {
        key: "_parseArcFlag",
        value: function _parseArcFlag() {
            if (this._currentIndex >= this._endIndex) {
                return null;
            }
            var flag = null;
            var flagChar = this._string[this._currentIndex];
            this._currentIndex += 1;
            if (flagChar === "0") {
                flag = 0;
            } else if (flagChar === "1") {
                flag = 1;
            } else {
                return null;
            }
            this._skipOptionalSpacesOrDelimiter();
            return flag;
        }
    }]);

    return Source;
}();

exports.Source = Source;

},{"./parse-number":158}],161:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * A and a: (from www.w3.org)
 *
 * params: rx ry x-axis-rotation large-arc-flag sweep-flag x y
 *
 * Draws an elliptical arc from the current point to (x, y). The size and
 * orientation of the ellipse are defined by two radii (rx, ry) and an
 * x-axis-rotation, which indicates how the ellipse as a whole is rotated
 * relative to the current coordinate system. The center (cx, cy) of the ellipse
 * is calculated automatically to satisfy the constraints imposed by the other
 * parameters. large-arc-flag and sweep-flag contribute to the automatic
 * calculations and help determine how the arc is drawn.
 */
function a(s) {
  // TODO - not implemented yet (or not necessary)
  s.prev2ndCubicControlPoint = undefined;
  s.prev2ndQuadraticControlPoint = undefined;
  // Update current point
  //x0 = ? ps[3][0]; 
  //y0 = ? ps[3][1];
  return undefined;
}
exports.a = a;

},{}],162:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * C and c: (from www.w3.org)
 *
 * params: x1 y1 x2 y2 x y
 *
 * Draws a cubic Bézier curve from the current point to (x,y)
 * using (x1,y1) as the control point at the beginning of the
 * curve and (x2,y2) as the control point at the end of the
 * curve. C (uppercase) indicates that absolute coordinates
 * will follow; c (lowercase) indicates that relative
 * coordinates will follow. Multiple sets of coordinates may
 * be specified to draw a polybézier. At the end of the
 * command, the new current point becomes the final (x,y)
 * coordinate pair used in the polybézier.
 */
function c(s) {
    var ps = [s.p, [s.vals[0], s.vals[1]], [s.vals[2], s.vals[3]], [s.vals[4], s.vals[5]]];
    s.prev2ndCubicControlPoint = ps[2];
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.c = c;

},{}],163:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * H and h: (from www.w3.org)
 *
 * params: x
 *
 * Draws a horizontal line from the current point (cpx, cpy) to (x, cpy). H
 * (uppercase) indicates that absolute coordinates will follow; h (lowercase)
 * indicates that relative coordinates will follow. Multiple x values can be
 * provided (although usually this doesn't make sense). At the end of the
 * command, the new current point becomes (x, cpy) for the final value of x.
 */
function h(s) {
    var xInterval = (s.vals[0] - s.p[0]) / 3;
    var ps = [s.p, [s.p[0] + xInterval * 1, s.p[1]], [s.p[0] + xInterval * 2, s.p[1]], [s.p[0] + xInterval * 3, s.p[1]]];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.h = h;

},{}],164:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * L and l: (from www.w3.org)
 *
 * params: x y
 *
 * Draw a line from the current point to the given (x,y) coordinate which
 * becomes the new current point. L (uppercase) indicates that absolute
 * coordinates will follow; l (lowercase) indicates that relative coordinates
 * will follow. A number of coordinates pairs may be specified to draw a
 * polyline. At the end of the command, the new current point is set to the
 * final set of coordinates provided.
 */
function l(s) {
    var xInterval = (s.vals[0] - s.p[0]) / 3;
    var yInterval = (s.vals[1] - s.p[1]) / 3;
    var ps = [s.p, [s.p[0] + xInterval * 1, s.p[1] + yInterval * 1], [s.p[0] + xInterval * 2, s.p[1] + yInterval * 2], [s.p[0] + xInterval * 3, s.p[1] + yInterval * 3]];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.l = l;

},{}],165:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Q and q: (from www.w3.org)
 *
 * params: x1 y1 x y
 *
 * Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1)
 * as the control point. Q (uppercase) indicates that absolute coordinates will
 * follow; q (lowercase) indicates that relative coordinates will follow.
 * Multiple sets of coordinates may be specified to draw a polybézier. At the
 * end of the command, the new current point becomes the final (x,y) coordinate
 * pair used in the polybézier.
 */
function q(s) {
    //---------------------------------------------------
    // Convert quadratic to cubic
    // see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
    //---------------------------------------------------
    var QP0 = s.p;
    var QP1 = [s.vals[0], s.vals[1]];
    var QP2 = [s.vals[2], s.vals[3]];
    // Endpoints stay the same
    var CP0 = QP0;
    var CP3 = QP2;
    // CP1 = QP0 + 2/3 *(QP1-QP0)
    var CP1 = [QP0[0] + 2 / 3 * (QP1[0] - QP0[0]), QP0[1] + 2 / 3 * (QP1[1] - QP0[1])];
    // CP2 = QP2 + 2/3 *(QP1-QP2)
    var CP2 = [QP2[0] + 2 / 3 * (QP1[0] - QP2[0]), QP2[1] + 2 / 3 * (QP1[1] - QP2[1])];
    var ps = [CP0, CP1, CP2, CP3];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = QP1;
    return ps;
}
exports.q = q;

},{}],166:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * S and s: (from www.w3.org)
 *
 * params: x2 y2 x y
 *
 * Draws a cubic Bézier curve from the current point to (x,y). The first control
 * point is assumed to be the reflection of the second control point on the
 * previous command relative to the current point. (If there is no previous
 * command or if the previous command was not an C, c, S or s, assume the first
 * control point is coincident with the current point.) (x2,y2) is the second
 * control point (i.e., the control point at the end of the curve). S
 * (uppercase) indicates that absolute coordinates will follow; s (lowercase)
 * indicates that relative coordinates will follow. Multiple sets of coordinates
 * may be specified to draw a polybézier. At the end of the command, the new
 * current point becomes the final (x,y) coordinate pair used in the polybézier.
 */
function s(s) {
    var p = [undefined, undefined];
    if (s.prev2ndCubicControlPoint) {
        p[0] = s.p[0] - s.prev2ndCubicControlPoint[0] + s.p[0];
        p[1] = s.p[1] - s.prev2ndCubicControlPoint[1] + s.p[1];
    } else {
        p = s.p;
    }
    var ps = [s.p, p, [s.vals[0], s.vals[1]], [s.vals[2], s.vals[3]]];
    s.prev2ndCubicControlPoint = ps[2];
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.s = s;

},{}],167:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * T and t: (from www.w3.org)
 *
 * params: x y
 *
 * Draws a quadratic Bézier curve from the current point to (x,y). The control
 * point is assumed to be the reflection of the control point on the previous
 * command relative to the current point. (If there is no previous command or if
 * the previous command was not a Q, q, T or t, assume the control point is
 * coincident with the current point.) T (uppercase) indicates that absolute
 * coordinates will follow; t (lowercase) indicates that relative coordinates
 * will follow. At the end of the command, the new current point becomes the
 * final (x,y) coordinate pair used in the polybézier.
 */
function t(s) {
    var p = [undefined, undefined];
    if (s.prev2ndQuadraticControlPoint) {
        p[0] = s.p[0] - s.prev2ndQuadraticControlPoint[0] + s.p[0];
        p[1] = s.p[1] - s.prev2ndQuadraticControlPoint[1] + s.p[1];
    } else {
        p = s.p;
    }
    //---------------------------------------------------
    // Convert quadratic to cubic
    // see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
    //---------------------------------------------------
    var QP0 = s.p;
    var QP1 = p;
    var QP2 = [s.vals[0], s.vals[1]];
    // CP1 = QP0 + 2/3 *(QP1-QP0)
    var CP1 = [QP0[0] + 2 / 3 * (QP1[0] - QP0[0]), QP0[1] + 2 / 3 * (QP1[1] - QP0[1])];
    // CP2 = QP2 + 2/3 *(QP1-QP2)
    var CP2 = [QP2[0] + 2 / 3 * (QP1[0] - QP2[0]), QP2[1] + 2 / 3 * (QP1[1] - QP2[1])];
    var ps = [QP0, CP1, CP2, QP2];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = QP1;
    return ps;
}
exports.t = t;

},{}],168:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * V and v: (from www.w3.org)
 *
 * params: y
 *
 * Draws a vertical line from the current point (cpx, cpy) to (cpx, y). V
 * (uppercase) indicates that absolute coordinates will follow; v (lowercase)
 * indicates that relative coordinates will follow. Multiple y values can be
 * provided (although usually this doesn't make sense). At the end of the
 * command, the new current point becomes (cpx, y) for the final value of y.
 */
function v(s) {
    var yInterval = (s.vals[0] - s.p[1]) / 3;
    var ps = [s.p, [s.p[0], s.p[1] + yInterval * 1], [s.p[0], s.p[1] + yInterval * 2], [s.p[0], s.p[1] + yInterval * 3]];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.v = v;

},{}],169:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Z and z: (from www.w3.org)
 *
 * params: (none)
 *
 * Close the current subpath by drawing a straight line from the current point
 * to current subpath's initial point. Since the Z and z commands take no
 * parameters, they have an identical effect.
 */
function z(s) {
    var xInterval = (s.initialPoint[0] - s.p[0]) / 3;
    var yInterval = (s.initialPoint[1] - s.p[1]) / 3;
    var ps = [s.p, [s.p[0] + xInterval, s.p[1] + yInterval], [s.p[0] + xInterval * 2, s.p[1] + yInterval * 2], [s.p[0] + xInterval * 3, s.p[1] + yInterval * 3]];
    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;
    return ps;
}
exports.z = z;

},{}],170:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var PathState = function PathState() {
    _classCallCheck(this, PathState);

    this.initialPoint = undefined;
    // Used in conjunction with "S" and "s"
    this.prev2ndCubicControlPoint = undefined;
    this.prev2ndQuadraticControlPoint = undefined;
    this.p = [0, 0];
};

exports.PathState = PathState;

},{}],171:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var get_min_y_pos_1 = _dereq_("./fs/get-min-y-pos");
exports.getMinYPos = get_min_y_pos_1.getMinYPos;
var get_paths_from_svg_path_elem_1 = _dereq_("./fs/get-paths-from-svg-path-elem");
exports.getPathsFromSvgPathElem = get_paths_from_svg_path_elem_1.getPathsFromSvgPathElem;
var get_paths_from_str_1 = _dereq_("./fs/get-paths-from-str");
exports.getPathsFromStr = get_paths_from_str_1.getPathsFromStr;
var get_loop_bounds_1 = _dereq_("./fs/get-loop-bounds");
exports.getLoopBounds = get_loop_bounds_1.getLoopBounds;
var is_path_positively_oriented_1 = _dereq_("./fs/is-path-positively-oriented");
exports.isPathPositivelyOrientated = is_path_positively_oriented_1.isPathPositivelyOrientated;
var get_curvature_at_interface_1 = _dereq_("./fs/get-curvature-at-interface");
exports.getCurvatureAtInterface = get_curvature_at_interface_1.getCurvatureAtInterface;
var simplify_paths_1 = _dereq_("./fs/simplify-paths/simplify-paths");
exports.simplifyPaths = simplify_paths_1.simplifyPaths;
var circle_to_cubic_beziers_1 = _dereq_("./fs/circle-to-cubic-beziers");
exports.circleToCubicBeziers = circle_to_cubic_beziers_1.circleToCubicBeziers;
var beziers_to_svg_path_str_1 = _dereq_("./fs/beziers-to-svg-path-str");
exports.beziersToSvgPathStr = beziers_to_svg_path_str_1.beziersToSvgPathStr;
var get_shape_bounds_1 = _dereq_("./fs/get-shape-bounds");
exports.getShapeBounds = get_shape_bounds_1.getShapeBounds;
exports.getShapesBounds = get_shape_bounds_1.getShapesBounds;

},{"./fs/beziers-to-svg-path-str":134,"./fs/circle-to-cubic-beziers":135,"./fs/get-curvature-at-interface":138,"./fs/get-loop-bounds":140,"./fs/get-min-y-pos":141,"./fs/get-paths-from-str":142,"./fs/get-paths-from-svg-path-elem":143,"./fs/get-shape-bounds":144,"./fs/is-path-positively-oriented":146,"./fs/simplify-paths/simplify-paths":157}],172:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of one side of an intersection. The opposite side is at
 * X.opposite.
 */

var X = function X(
/**
 * The PointOnShape on the curve of the intersection. This side of the
 * intersection is represented by the incoming part of this curve.
 */
pos) {
  var isDummy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var
  /** The opposite side of the intersection */
  opposite = arguments[2];
  var loopTree = arguments[3];
  var
  //public inPs?     : number[][],
  outPs = arguments[4];

  _classCallCheck(this, X);

  this.pos = pos;
  this.isDummy = isDummy;
  this.opposite = opposite;
  this.loopTree = loopTree;
  this.outPs = outPs;
};

exports.X = X;

},{}]},{},[1])(1)
});