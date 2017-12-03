(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FloMat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_("./index").default;

},{"./index":2}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
//---- Functions 
var smoothen_1 = _dereq_("./lib/mat/functions/smoothen");
var find_mat_1 = _dereq_("./lib/mat/functions/find-mat");
var to_scale_axis_1 = _dereq_("./lib/mat/functions/to-scale-axis");
//---- Classes - can be instantiated
var mat_tree_1 = _dereq_("./lib/mat/classes/mat-tree");
var get_nodes_as_array_1 = _dereq_("./lib/mat/functions/get-nodes-as-array");
var point_on_shape_1 = _dereq_("./lib/geometry/classes/point-on-shape");
var linked_loop_1 = _dereq_("./lib/linked-list/linked-loop");
var shape_1 = _dereq_("./lib/geometry/classes/shape");
var circle_1 = _dereq_("./lib/geometry/classes/circle");
var svg_1 = _dereq_("./lib/svg/svg");
var FloMat = {
    findMat: find_mat_1.default,
    toScaleAxis: to_scale_axis_1.default,
    smoothen: smoothen_1.default,
    MatTree: mat_tree_1.default,
    PointOnShape: point_on_shape_1.default,
    LinkedLoop: linked_loop_1.default,
    Shape: shape_1.default,
    Circle: circle_1.default,
    Svg: svg_1.default,
    fs: {
        getNodesAsArray: get_nodes_as_array_1.default
    }
};
exports.default = FloMat;

},{"./lib/geometry/classes/circle":6,"./lib/geometry/classes/point-on-shape":9,"./lib/geometry/classes/shape":10,"./lib/linked-list/linked-loop":16,"./lib/mat/classes/mat-tree":25,"./lib/mat/functions/find-mat":32,"./lib/mat/functions/get-nodes-as-array":33,"./lib/mat/functions/smoothen":35,"./lib/mat/functions/to-scale-axis":36,"./lib/svg/svg":38}],3:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var circle_1 = _dereq_("./circle");
var memoize = flo_memoize_1.default.m1;
/**
 * @constructor
 *
 * @param bezierNode
 * @param t - The bezier parameter value
 * @param type {MAT_CONSTANTS.pointType}
 *  'standard' : 0, // Not special,
 *  'sharp'    : 1, // Sharp corner,
 *  'dull'     : 2, // dull corner,
 * @param order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.
 * @param order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately.
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */

var PointOnShape = function () {
    function PointOnShape(bezierNode, t, type, order, order2) {
        _classCallCheck(this, PointOnShape);

        this.bezierNode = bezierNode;
        this.t = t;
        this.type = type;
        this.order = order;
        this.order2 = order2;
        //---- Cache
        var p = flo_bezier3_1.default.evaluate(bezierNode.item.bezier3, t);
        this.p = p;
        // Removing this cache will help in that if {PointOnShape} is 
        // called as a parameter (where a point is required) it will more 
        // likely result in monomorphic behaviour as opposed to polymorphic 
        // or megamorphic.
        this[0] = p[0];
        this[1] = p[1];
    }
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param pathCurve
     * @param t
     */


    _createClass(PointOnShape, null, [{
        key: "calcOsculatingCircle",
        value: function calcOsculatingCircle(pathCurve, t) {
            var ps = pathCurve.bezier3;
            var κ = -flo_bezier3_1.default.κ(ps, t);
            // If (κ > 0) { Bending inwards. }
            var radius = void 0;
            if (κ <= 1 / mat_constants_1.default.maxOsculatingCircleRadius) {
                // Curving wrong way (or flat, or too big), but probably a 
                // significant point to put a 2-prong.
                radius = mat_constants_1.default.maxOsculatingCircleRadius;
            } else {
                radius = Math.min(1 / κ, mat_constants_1.default.maxOsculatingCircleRadius);
            }
            var normal = flo_bezier3_1.default.normal(ps, t);
            var p = flo_bezier3_1.default.evaluate(ps, t);
            var circleCenter = [p[0] + normal[0] * radius, p[1] + normal[1] * radius];
            return new circle_1.default(circleCenter, radius);
        }
    }, {
        key: "dullCornerAt",
        value: function dullCornerAt(shape, p) {
            var dullCornerHash = shape.dullCornerHash;
            var key = PointOnShape.makeSimpleKey(p);
            return dullCornerHash[key] || null;
        }
        /**
         * Clones the PointOnShape.
         */
        // TODO - rename to clone
        // TODO - deep clone?

    }, {
        key: "copy",
        value: function copy(pos) {
            return new PointOnShape(pos.bezierNode, pos.t, pos.type, pos.order, pos.order2);
        }
        /**
         * Returns the PointOnShape type as a human-readable
         * string.
         * @param {number} type
         * @returns {string}
         */
        // TODO - remove - use enum

    }, {
        key: "typeToStr",
        value: function typeToStr(type) {
            for (var key in mat_constants_1.default.pointType) {
                if (mat_constants_1.default.pointType[key] === type) {
                    return key;
                }
            }
        }
    }]);

    return PointOnShape;
}();

PointOnShape.getOsculatingCircle = memoize(function (pos) {
    if (pos.type === mat_constants_1.default.pointType.sharp) {
        return new circle_1.default(pos.p, 0);
    } else if (pos.type === mat_constants_1.default.pointType.extreme) {
        var r = mat_constants_1.default.maxOsculatingCircleRadius;
        var p = [pos.p[0], pos.p[1] - r];
        return new circle_1.default(p, r);
    }
    return PointOnShape.calcOsculatingCircle(pos.bezierNode.item, pos.t);
});
/**
* Compares two PointOnShapes according to their position on the bezier loop.
*/
PointOnShape.compare = function (a, b) {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    var res = void 0;
    res = a.bezierNode.item.indx - b.bezierNode.item.indx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    if (res !== 0) {
        return res;
    }
    res = a.order - b.order;
    if (res !== 0) {
        return res;
    }
    res = a.order2 - b.order2;
    return res;
};
/**
* Returns true if its osculation circle is pointing straight upwards.
*/
PointOnShape.isPointingStraightUp = function (pos) {
    var circle = PointOnShape.getOsculatingCircle(pos);
    if (!circle) {
        return false;
    }
    var circleDirection = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(pos.p, circle.center));
    // If not almost pointing straight up
    if (Math.abs(circleDirection[0]) > 1e-6 || circleDirection[1] > 0) {
        return false;
    }
    return true;
};
/**
 * Sets the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param {PointOnShape} pos
 * @note Modifies pos
 */
PointOnShape.setPointOrder = function (shape, circle, pos) {
    var dullCorner = PointOnShape.dullCornerAt(shape, pos.p);
    if (!dullCorner) {
        return;
    }
    var ps = dullCorner.beziers[0];
    var tan1pre = flo_bezier3_1.default.tangent(ps, 1);
    var tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
    var tan2 = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(pos.p, circle.center));
    pos.order = -flo_vector2d_1.default.dot(tan1, tan2);
    return pos.order;
};
/**
 * Creates a string key that only depends on the PointOnShape's coordinates.
 */
PointOnShape.makeSimpleKey = function (p) {
    return '' + p[0] + ', ' + p[1];
};
/**
 * @description Returns a human-readable string of the PointOnShape.
 * @note For debugging only.
 */
PointOnShape.toHumanString = function (pos) {
    return '' + pos[0] + ', ' + pos[1] + ' | bz: ' + pos.bezierNode.item.indx + ' | t: ' + pos.t + ' | ord: ' + pos.order + ' | ord2: ' + pos.order2 + ' | ' + PointOnShape.typeToStr(pos.type); // TODO - use enum
};
exports.default = PointOnShape;

},{"../../mat-constants":18,"./circle":6,"flo-bezier3":39,"flo-memoize":46,"flo-vector2d":55}],4:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var circle_1 = _dereq_("./circle");
var geometry_1 = _dereq_("../geometry");

var Arc = function () {
    /**
     * Arc class.
     * If circle === null then the arc degenerates into a line segment
     * given by sinAngle1 and cosAngle2 which now represent points.
     * The arc curve is always defined as the piece from angle1 -> angle2.
     * Note: startpoint and endpoint is redundant
     */
    function Arc(circle, sinAngle1, cosAngle1, sinAngle2, cosAngle2, startpoint, endpoint) {
        _classCallCheck(this, Arc);

        // Intrinsic
        this.circle = circle;
        this.sinAngle1 = sinAngle1;
        this.sinAngle2 = sinAngle2;
        this.cosAngle1 = cosAngle1;
        this.cosAngle2 = cosAngle2;
        // Cache
        this.startpoint = startpoint; // Redundant but useful
        this.endpoint = endpoint; // Redundant but useful
    }
    /**
     * Returns the closest point on the arc.
     * NOTE: Not currently used.
     * @private
     */


    _createClass(Arc, null, [{
        key: "closestPointOnArc",
        value: function closestPointOnArc(p, arc) {
            if (arc.circle !== null) {
                // First move arc circle onto origin
                var x = arc.circle.center[0];
                var y = arc.circle.center[1];
                var translate = flo_vector2d_1.default.translate([-x, -y]);
                var arco = new Arc(new circle_1.default([0, 0], arc.circle.radius), arc.sinAngle1, arc.cosAngle1, arc.sinAngle2, arc.cosAngle2, translate(arc.startpoint), translate(arc.endpoint));
                var pp = translate(p);
                var l = flo_vector2d_1.default.len(pp);
                var sin_pp = -pp[1] / l;
                var cos_pp = pp[0] / l;
                if (geometry_1.default.isAngleBetween(sin_pp, cos_pp, arco.sinAngle1, arco.cosAngle1, arco.sinAngle2, arco.cosAngle2)) {
                    var r_o_l = arco.circle.radius;
                    var _res = { p: flo_vector2d_1.default.translate([x, y], [r_o_l * cos_pp, r_o_l * -sin_pp]), position: 0 };
                    return _res;
                } else {
                    var _asp = arc.startpoint;
                    var _aep = arc.endpoint;
                    var _d = flo_vector2d_1.default.distanceBetween(_asp, p);
                    var _d2 = flo_vector2d_1.default.distanceBetween(_aep, p);
                    if (_d < _d2) {
                        return { p: _asp, position: 1 };
                    }
                    return { p: _aep, position: 2 };
                }
            }
            // Line degenerate case - this is exactly a routine for 
            // distance (and closest point) between point and line segment.
            var asp = arc.startpoint;
            var aep = arc.endpoint;
            var d1 = flo_vector2d_1.default.distanceBetween(asp, p);
            var d2 = flo_vector2d_1.default.distanceBetween(aep, p);
            var ds = Math.sqrt(flo_vector2d_1.default.squaredDistanceBetweenPointAndLineSegment(p, [asp, aep]));
            if (d1 <= d2 && d1 <= ds) {
                return { p: asp, position: 1 };
            } else if (d2 <= d1 && d2 <= ds) {
                return { p: aep, position: 2 };
            }
            // else ds is shortest
            var v = flo_vector2d_1.default.fromTo(asp, aep);
            var l1p2 = [p[0] + v[1], p[1] + -v[0]];
            var res = {
                p: geometry_1.default.lineLineIntersection([p, l1p2], [asp, aep]),
                position: 0
            };
            return res;
        }
    }]);

    return Arc;
}();

exports.default = Arc;

},{"../geometry":15,"./circle":6,"flo-vector2d":55}],5:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var BezierPiece =
/**
 * @param bezierNode
 * @param tRange
 */
function BezierPiece(bezierNode, tRange) {
    _classCallCheck(this, BezierPiece);

    this.bezierNode = bezierNode;
    this.tRange = tRange;
};

exports.default = BezierPiece;

},{}],6:[function(_dereq_,module,exports){
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
     * Returns a scaled version of the given circle without
     * changing its center position.
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
         */

    }, {
        key: "engulfsCircle",
        value: function engulfsCircle(c1, c2) {
            if (c1.radius <= c2.radius) {
                return false;
            }
            var d = flo_vector2d_1.default.squaredDistanceBetween(c1.center, c2.center);
            var dr = c1.radius - c2.radius;
            var δ = dr * dr;
            return δ > d;
        }
        /**
         * Returns a human-readable string description.
         */

    }, {
        key: "toString",
        value: function toString(circle) {
            return 'c: ' + circle.center + ' radius: ' + circle.radius;
        }
    }]);

    return Circle;
}();

exports.default = Circle;

},{"flo-vector2d":55}],7:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Corner = function Corner(beziers, tans) {
    _classCallCheck(this, Corner);

    this.beziers = beziers;
    this.tans = tans;
};

exports.default = Corner;

},{}],8:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var PathCurve =
/**
 * An indexed cubic bezier curve.
 * @param indx
 * @param bezier3
 */
function PathCurve(indx, bezier3) {
    _classCallCheck(this, PathCurve);

    this.indx = indx;
    this.bezier3 = bezier3;
};
/**
 * Returns the reverse of the given bezier and assign the new given idx.
 * @param {PathCurve} curve - a path curve
 * @param {number} idx
 * @returns {Bezier3}
 */


PathCurve.reverse = function (curve, newIndx) {
    var ps = curve.bezier3.slice().reverse();
    return new PathCurve(newIndx, ps);
};
exports.default = PathCurve;

},{}],9:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var circle_1 = _dereq_("./circle");
var memoize = flo_memoize_1.default.m1;
/**
 * @constructor
 *
 * @param bezierNode
 * @param t - The bezier parameter value
 * @param type {MAT_CONSTANTS.pointType}
 *  'standard' : 0, // Not special,
 *  'sharp'    : 1, // Sharp corner,
 *  'dull'     : 2, // dull corner,
 * @param order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.
 * @param order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately.
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */

var PointOnShape = function () {
    function PointOnShape(bezierNode, t, type, order, order2) {
        _classCallCheck(this, PointOnShape);

        this.bezierNode = bezierNode;
        this.t = t;
        this.type = type;
        this.order = order;
        this.order2 = order2;
        //---- Cache
        var p = flo_bezier3_1.default.evaluate(bezierNode.item.bezier3, t);
        this.p = p;
        // Removing this cache will help in that if {PointOnShape} is 
        // called as a parameter (where a point is required) it will more 
        // likely result in monomorphic behaviour as opposed to polymorphic 
        // or megamorphic.
        this[0] = p[0];
        this[1] = p[1];
    }
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param pathCurve
     * @param t
     */


    _createClass(PointOnShape, null, [{
        key: "calcOsculatingCircle",
        value: function calcOsculatingCircle(pathCurve, t) {
            var ps = pathCurve.bezier3;
            var κ = -flo_bezier3_1.default.κ(ps, t);
            // If (κ > 0) { Bending inwards. }
            var radius = void 0;
            if (κ <= 1 / mat_constants_1.default.maxOsculatingCircleRadius) {
                // Curving wrong way (or flat, or too big), but probably a 
                // significant point to put a 2-prong.
                radius = mat_constants_1.default.maxOsculatingCircleRadius;
            } else {
                radius = Math.min(1 / κ, mat_constants_1.default.maxOsculatingCircleRadius);
            }
            var normal = flo_bezier3_1.default.normal(ps, t);
            var p = flo_bezier3_1.default.evaluate(ps, t);
            var circleCenter = [p[0] + normal[0] * radius, p[1] + normal[1] * radius];
            return new circle_1.default(circleCenter, radius);
        }
    }, {
        key: "dullCornerAt",
        value: function dullCornerAt(shape, p) {
            var dullCornerHash = shape.dullCornerHash;
            var key = PointOnShape.makeSimpleKey(p);
            return dullCornerHash[key] || null;
        }
        /**
         * Clones the PointOnShape.
         */
        // TODO - rename to clone
        // TODO - deep clone?

    }, {
        key: "copy",
        value: function copy(pos) {
            return new PointOnShape(pos.bezierNode, pos.t, pos.type, pos.order, pos.order2);
        }
        /**
         * Returns the PointOnShape type as a human-readable
         * string.
         * @param {number} type
         * @returns {string}
         */
        // TODO - remove - use enum

    }, {
        key: "typeToStr",
        value: function typeToStr(type) {
            for (var key in mat_constants_1.default.pointType) {
                if (mat_constants_1.default.pointType[key] === type) {
                    return key;
                }
            }
        }
    }]);

    return PointOnShape;
}();

PointOnShape.getOsculatingCircle = memoize(function (pos) {
    if (pos.type === mat_constants_1.default.pointType.sharp) {
        return new circle_1.default(pos.p, 0);
    } else if (pos.type === mat_constants_1.default.pointType.extreme) {
        var r = mat_constants_1.default.maxOsculatingCircleRadius;
        var p = [pos.p[0], pos.p[1] - r];
        return new circle_1.default(p, r);
    }
    return PointOnShape.calcOsculatingCircle(pos.bezierNode.item, pos.t);
});
/**
* Compares two PointOnShapes according to their position on the bezier loop.
*/
PointOnShape.compare = function (a, b) {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    var res = void 0;
    res = a.bezierNode.item.indx - b.bezierNode.item.indx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    if (res !== 0) {
        return res;
    }
    res = a.order - b.order;
    if (res !== 0) {
        return res;
    }
    res = a.order2 - b.order2;
    return res;
};
/**
* Returns true if its osculation circle is pointing straight upwards.
*/
PointOnShape.isPointingStraightUp = function (pos) {
    var circle = PointOnShape.getOsculatingCircle(pos);
    if (!circle) {
        return false;
    }
    var circleDirection = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(pos.p, circle.center));
    // If not almost pointing straight up
    if (Math.abs(circleDirection[0]) > 1e-6 || circleDirection[1] > 0) {
        return false;
    }
    return true;
};
/**
 * Sets the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param {PointOnShape} pos
 * @note Modifies pos
 */
PointOnShape.setPointOrder = function (shape, circle, pos) {
    var dullCorner = PointOnShape.dullCornerAt(shape, pos.p);
    if (!dullCorner) {
        return;
    }
    var ps = dullCorner.beziers[0];
    var tan1pre = flo_bezier3_1.default.tangent(ps, 1);
    var tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
    var tan2 = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(pos.p, circle.center));
    pos.order = -flo_vector2d_1.default.dot(tan1, tan2);
    return pos.order;
};
/**
 * Creates a string key that only depends on the PointOnShape's coordinates.
 */
PointOnShape.makeSimpleKey = function (p) {
    return '' + p[0] + ', ' + p[1];
};
/**
 * @description Returns a human-readable string of the PointOnShape.
 * @note For debugging only.
 */
PointOnShape.toHumanString = function (pos) {
    return '' + pos[0] + ', ' + pos[1] + ' | bz: ' + pos.bezierNode.item.indx + ' | t: ' + pos.t + ' | ord: ' + pos.order + ' | ord2: ' + pos.order2 + ' | ' + PointOnShape.typeToStr(pos.type); // TODO - use enum
};
exports.default = PointOnShape;

},{"../../mat-constants":18,"./circle":6,"flo-bezier3":39,"flo-memoize":46,"flo-vector2d":55}],10:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var path_curve_1 = _dereq_("../../geometry/classes/path-curve");
var linked_loop_1 = _dereq_("../../linked-list/linked-loop");
var list_node_1 = _dereq_("../../linked-list/list-node");
var bezier_piece_1 = _dereq_("../../geometry/classes/bezier-piece");
var contact_point_1 = _dereq_("../../mat/classes/contact-point");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var mat_circle_1 = _dereq_("../../mat/classes/mat-circle");
var memoize = flo_memoize_1.default.m1;

var get_contact_circles_at_bezier_bezier_interface_1 = _dereq_("../functions/get-contact-circles-at-bezier-bezier-interface");
var get_bezier_osculating_circles_1 = _dereq_("../functions/get-bezier-osculating-circles");

var Shape = function () {
    /**
     * A Shape represents the loop of individual cubic bezier curves composing
     * an SVG element. When constructed, some initial analysis is done.
     * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop
     * represents a closed path of the shape.
     */
    function Shape(bezierArrays) {
        var _this = this;

        _classCallCheck(this, Shape);

        /** Hash of 2-prongs that need to be skipped in 2-prong procedure
        since we already have a hole-closing 2-prong there. */
        this.skip2ProngHash = {};
        /** Hash of PointOnShapes that has a normal pointing straight up. */
        this.straightUpHash = {};
        /** A hash of all the dull corners (i.e. those with angle > 180 deg) */
        this.dullCornerHash = {};
        /** Hole closing 2-prongs that will be populated during find-mat */
        this.holeClosers = [];
        // TODO - check if this will run in node (due to window object)
        if (typeof window !== 'undefined' && window._debug_) {
            window._debug_.generated.timing.start = performance.now();
        }
        // The shape paths and sub-paths, a.k.a bezier loops.
        var bezierLoops = bezierArrays.map(function (array, k) {
            return new linked_loop_1.default(array, undefined, k);
        });
        // Orient the loops so that the outer loop is oriented positively - 
        // defined as anti-clockwise.  
        this.bezierLoops = orient(bezierLoops);
        this.extremes = this.bezierLoops.map(getExtremes);
        // This is to find the topmost points on each loop.
        this.extremes.sort(function (a, b) {
            return a.p[1] - b.p[1];
        });
        this.bezierLoops.sort(function (a_, b_) {
            var a = getExtremes(a_);
            var b = getExtremes(b_);
            return a.p[1] - b.p[1];
        });
        // Re-index after ordering.
        for (var i = 0; i < this.bezierLoops.length; i++) {
            this.bezierLoops[i].indx = i;
        }
        // Get metrics of the outer loop. ??
        this.shapeBoundingBox = getLoopBounds(bezierLoops[0]).shapeBoundingBox;
        // Gets interesting points on the shape, i.e. those that makes 
        // sense to use for the 2-prong procedure.
        var pointOnShapeArrPerLoop = Shape.getInterestingPointsOnShape(this);
        this.pointsOnShapePerLoop = pointOnShapeArrPerLoop.map(function (array, i) {
            return createCoupledLoops(array, i);
        });
        // TODO Finish implementation. This is to space the points more
        // evenly. 
        //respacePoints(this.contactPointsPerLoop, 30);

        var _Shape$getPotential2P = Shape.getPotential2Prongs(this),
            sharpCornersArray = _Shape$getPotential2P.sharpCornersArray,
            for2ProngsArray = _Shape$getPotential2P.for2ProngsArray;

        this.for2ProngsArray = for2ProngsArray;
        // Take account of sharp and dull corners for debugging and update 
        // straightUpHash.
        Shape.forEachPointOnShape(this, function (pos) {
            if (pos.type === mat_constants_1.default.pointType.sharp) {
                if (typeof window !== 'undefined' && window._debug_) {
                    var _debug_ = window._debug_;
                    _debug_.generated.sharpCorners.push({ pos: pos });
                }
            } else {
                if (point_on_shape_1.default.isPointingStraightUp(pos)) {
                    var key = point_on_shape_1.default.makeSimpleKey(pos.p);
                    _this.straightUpHash[key] = pos;
                }
                if (typeof window !== 'undefined' && window._debug_) {
                    if (pos.type === mat_constants_1.default.pointType.dull) {
                        var _debug_2 = window._debug_;
                        _debug_2.generated.dullCorners.push({ pos: pos });
                    }
                }
            }
        });
        this.contactPointsPerLoop = createSharpCornerCpLoops(this, sharpCornersArray);
        if (typeof window !== 'undefined' && window._debug_) {
            var _debug_ = window._debug_;
            _debug_.generated.timing.after1Prongs = performance.now();
        }
    }
    /**
     * Applies f to each PointOnShape within the shape
     * @param shape - The shape
     * @param f - The function to call.
     */


    _createClass(Shape, null, [{
        key: "forEachPointOnShape",
        value: function forEachPointOnShape(shape, f) {
            var pointsOnShapePerLoop = shape.pointsOnShapePerLoop;
            for (var k = 0; k < pointsOnShapePerLoop.length; k++) {
                var pointsOnShape = pointsOnShapePerLoop[k];
                var posNode = pointsOnShape.head;
                do {
                    var pos = posNode.item;
                    f(pos);
                    posNode = posNode.next;
                } while (posNode !== pointsOnShape.head);
            }
        }
        /**
         * Get potential 2-prong points on shape.
         * @param shape
         */

    }, {
        key: "getPotential2Prongs",
        value: function getPotential2Prongs(shape) {
            var pointsOnShapePerLoop = shape.pointsOnShapePerLoop;
            var sharpCornersArray = [];
            var for2ProngsArray = [];
            for (var k = 0; k < pointsOnShapePerLoop.length; k++) {
                var pointsOnShape = pointsOnShapePerLoop[k];
                var sharpCorners = [];
                var for2Prongs = [];
                var posNode = pointsOnShape.head;
                do {
                    var pos = posNode.item;
                    if (pos.type === mat_constants_1.default.pointType.sharp) {
                        sharpCorners.push(pos);
                    } else {
                        for2Prongs.push(posNode);
                    }
                    posNode = posNode.next;
                } while (posNode !== pointsOnShape.head);
                sharpCornersArray.push(sharpCorners);
                for2ProngsArray.push(for2Prongs);
            }
            return { sharpCornersArray: sharpCornersArray, for2ProngsArray: for2ProngsArray };
        }
        /**
         * Get useful points on the shape - these incude osculating points and points at
         * the bezier-bezier interfaces.
         * @param shape
         */

    }, {
        key: "getInterestingPointsOnShape",
        value: function getInterestingPointsOnShape(shape) {
            var bezierLoops = shape.bezierLoops;
            var allPointsArray = [];
            for (var k = 0; k < bezierLoops.length; k++) {
                var bezierLoop = bezierLoops[k];
                allPointsArray.push(Shape.getInterestingPointsOnLoop(shape, bezierLoop));
            }
            return allPointsArray;
        }
        /**
         * TODO - uncomment and finish
         * Get all points where shape intersect itself.
         */
        /*
        function getSelfIntersections(shape: Shape) {
            //aaa
        }
        */
        /**
         * @param shape
         * @param bezierLoop
         */

    }, {
        key: "getInterestingPointsOnLoop",
        value: function getInterestingPointsOnLoop(shape, bezierLoop) {
            var dullCornerHash = shape.dullCornerHash;
            var points = [];
            var allPoints = [];
            var node = bezierLoop.head;
            do {
                //let bezier = node.item;
                var pointsOnShape1 = get_contact_circles_at_bezier_bezier_interface_1.default([node.prev, node], dullCornerHash);
                allPoints.push.apply(allPoints, _toConsumableArray(pointsOnShape1));
                var pointsOnShape2 = get_bezier_osculating_circles_1.default(node);
                allPoints.push.apply(allPoints, _toConsumableArray(pointsOnShape2));
                // TODO - remove; experimenting
                for (var i = 1; i < 2; i++) {
                    var pos = new point_on_shape_1.default(node, i / 2, mat_constants_1.default.pointType.standard, 0, 0);
                    allPoints.push(pos);
                }
                node = node.next;
            } while (node !== bezierLoop.head);
            // Ensure order - first point may be ordered last at this stage
            // (due to bezier-bezier interface checking)
            var firstPoint = allPoints[0];
            var lastPoint = allPoints[allPoints.length - 1];
            if (point_on_shape_1.default.compare(firstPoint, lastPoint) > 0) {
                allPoints.push(firstPoint); // Add the first point to the end
                allPoints.splice(0, 1); // ... and remove the front point.
            }
            allPoints.sort(point_on_shape_1.default.compare);
            // Check if at least one 2-prong has been added. If not, add one.
            var atLeast1 = false;
            for (var _i = 0; _i < allPoints.length; _i++) {
                if (allPoints[_i].type !== mat_constants_1.default.pointType.sharp) {
                    atLeast1 = true;
                    break;
                }
            }
            //if (bezierLoop.indx === 0 && !atLeast1) {
            if (!atLeast1) {
                // Not a single potential 2-prong found on envelope. Add one 
                // to make the algorithm simpler from here on.
                var _node = bezierLoop.head;
                var _pos = new point_on_shape_1.default(_node, 0.4999995, // Can really be anything in the range (0,1)
                mat_constants_1.default.pointType.standard, 0, 0);
                allPoints.push(_pos);
            }
            return allPoints;
        }
        /**
         * Returns the boundary piece that starts at the immediate previous point on
         * the shape and ends at the immediate next point.
         * Note: Uses a red-black tree to quickly find the required bounds
         */

    }, {
        key: "getNeighbouringPoints",
        value: function getNeighbouringPoints(shape, pos) {
            var k = pos.bezierNode.loop.indx;
            var cptree = shape.contactPointsPerLoop[k].cptree;
            //let cps = cptree.findBounds({ item: new ContactPoint(pos) });
            // TODO - ugly - improve code
            var cps = cptree.findBounds(new list_node_1.default(undefined, new contact_point_1.default(pos, undefined), undefined, undefined));
            if (!cps[0] && !cps[1]) {
                // The tree is still empty
                return [undefined, undefined];
            }
            if (!cps[0] || !cps[1]) {
                // Smaller than all -> cptree.min() === cps[1].data OR
                // Larger than all -> cptree.max() === cps[0].data
                return [
                //LlRbTree.max(cptree.root), 
                //LlRbTree.min(cptree.root)
                cptree.max(cptree.root), cptree.min(cptree.root)];
            }
            return [cps[0].data, cps[1].data];
        }
    }]);

    return Shape;
}();
/**
 * TODO - uncomment and finish implementation
 * Respace points so that the total absolute curvature between
 * consecutive points are very roughly equal.
 *
 * @param contactPointsPerLoop
 * @param maxAbsCurvatureInDegrees
 *
 * NOTES: Mutates contactPoints.
 */
/*
private static respacePoints(
        contactPointsPerLoop: LinkedLoop<ContactPoint>[],
        maxAbsCurvatureInDegrees: number) {
    
    for (let k=0; k<contactPointsPerLoop.length; k++) {
        let contactPoints = contactPointsPerLoop[k];
        
        let cpNode = contactPoints.head;
        let recheck;
        do {
            recheck = false;
            
            let totalCurvatures = [];
            let denseCpNode = cpNode.coupledNode;
            
            do {
                let c = getTotalAbsCurvatureBetweenCps(
                        [denseCpNode.item, denseCpNode.next.item]
                );
                
                totalCurvatures.push({cpNode: denseCpNode, c});
                
                denseCpNode = denseCpNode.next;
            } while (denseCpNode.coupledNode !== cpNode.next);

            let totalCurvature = sumCurvatures(totalCurvatures);
            
            cpNode.totalCurvatures = totalCurvatures;
            cpNode.totalCurvature  = totalCurvature;
            
            
            let totalInDegrees = totalCurvature * 180 / Math.PI;
            // if (totalInDegrees > 180 || totalInDegrees < 5) { console.log(totalInDegrees); }
            if (totalInDegrees > maxAbsCurvatureInDegrees) {
                // Add a point
                //console.log(totalCurvatures);
                
                let accumTot = 0;
                let tc = cpNode.totalCurvature; // cache
                let bestIndx = undefined;
                let leftDenseIndx = 0;
                let rightDenseIndx;
                let accumTotAtLeft  = 0;
                let accumTotAtRight = undefined;
                let bestDiff = Number.POSITIVE_INFINITY;
                for (let i=0; i<totalCurvatures.length; i++) {
                    
                    let c = totalCurvatures[i].c;
                    let cTot = c.totalCurvature + c.totalTurn;
                    accumTot += cTot;
                    
                    let cpn = totalCurvatures[i].cpNode;
                    if (accumTot <= tc/2) {
                        leftDenseIndx = i;
                        accumTotAtLeft = accumTot;
                    }

                    if (!rightDenseIndx && accumTot > tc/2) {
                        // This may be out of bounds but really means cpNode.next
                        rightDenseIndx = i;
                        accumTotAtRight = accumTot;
                    }
                
                    let absDiff = Math.abs(tc/2 - accumTot);
                    // TODO - We can also add a weight for point values here
                    // such that for instance inverse curvature points
                    // carry more weight than dull corners, etc.
                    // TODO Make the 1/4 or 1/3 below a constant that can
                    // be set.
                    //if (accumTot > tc/3 && accumTot < 2*tc/3 &&
                    if (accumTot > tc/4 && accumTot < 3*tc/4 &&
                        bestDiff > absDiff) {
                        // If within middle 1/3 and better
                        
                        bestIndx = i;
                        bestDiff = absDiff;
                    }
                }

                
                // aaa console.log(leftDenseIndx, bestIndx, rightDenseIndx);
                
                if (bestIndx !== undefined) {
                    // Reify the point
                    let tcInfo = totalCurvatures[bestIndx];
                    
                    // Note that after the below insert cpNode.next will
                    // equal the newly inserted cpNode.
                    let newCpNode = LinkedLoop.insert(
                            contactPoints,
                            tcInfo.cpNode.next.item,
                            cpNode,
                            tcInfo.cpNode.next
                    );
                    tcInfo.cpNode.next.coupledNode = newCpNode;
                    
                    cpNode.totalCurvatures = cpNode.totalCurvatures.slice(
                            0, bestIndx+1
                    );
                    cpNode.totalCurvature = sumCurvatures(
                            cpNode.totalCurvatures
                    );
                    
                    recheck = true; // Start again from same contact point.
                } else {
                    // We could not find an 'interesting' point to use, so
                    // find some center point between the two contact
                    // points.
                    

                    let leftTcInfo  = totalCurvatures[leftDenseIndx];
                    let rightTcInfo = totalCurvatures[rightDenseIndx];
                    
                    let leftCpNode  = leftTcInfo. cpNode;
                    let rightCpNode = rightTcInfo.cpNode;
                    
                    let leftC = leftTcInfo.c;
                    
                    let leftCp = leftTcInfo.cpNode.next;
                    let rightCp = rightTcInfo.cpNode.next;
                    
                    //aaa console.log(accumTotAtLeft,	accumTotAtRight, tc/2);
                    
                    
                    let pos = getCPointBetweenCps(
                            leftCpNode.item, rightCpNode.item,
                            accumTotAtLeft,	accumTotAtRight,
                            tc/2
                    );

                    
                    /*
                    let newCp = new ContactPoint(pos, undefined);
                    let newCpNode = LinkedLoop.insert(
                            contactPoints,
                            newCp,
                            leftCpNode,
                            undefined
                    );
                    
                    let newDenseCpNode = LinkedLoop.insert(
                            denseContactPoints,
                            newCp,
                            cpNode,
                            undefined
                    );
                    
                    newCpNode.coupledNode = newDenseCpNode;
                    newDenseCpNode.coupledNode = newCpNode;
                    
                    
                    aaa
                    cpNode.totalCurvatures = cpNode.totalCurvatures.slice(
                            0, bestIndx
                    );
                    cpNode.totalCurvature = sumCurvatures(
                            cpNode.totalCurvatures
                    );
                    
                    recheck = true; // Start again from same contact point.
                    */ /*
                       }
                       } else if (totalInDegrees < 15) {
                       // Remove a point
                       //console.log(totalCurvatures);
                       }
                       if (!recheck) {
                       cpNode = cpNode.next;
                       }
                       } while (cpNode !== contactPoints.head);
                       }
                       }*/
/**
 *
 */


Shape.getBoundaryBeziers = function (shape, k) {
    var bezierLoop = shape.bezierLoops[k];
    var bezierPieces = [];
    bezierLoop.forEach(function (bezierNode) {
        var bezierPiece = new bezier_piece_1.default(bezierNode, [0, 1]);
        bezierPieces.push(bezierPiece);
    });
    return bezierPieces;
};
/**
 *
 */
Shape.getTotalCurvature = getTotalBy(function (bezierNode) {
    var bezierCurvature = flo_bezier3_1.default.totalCurvature(bezierNode.item.bezier3, [0, 1]);
    var interfaceCurvature = getCurvatureAtInterface(bezierNode);
    return bezierCurvature + interfaceCurvature;
});
/**
 *
 */
Shape.getTotalAbsoluteCurvature = getTotalBy(function (bezierNode) {
    return flo_bezier3_1.default.totalAbsoluteCurvature(bezierNode.item.bezier3, [0, 1]) + Math.abs(getCurvatureAtInterface(bezierNode));
});
/**
 *
 */
Shape.forAllBeziers = function (f, shape) {
    var bezierLoops = shape.bezierLoops;
    for (var i = 0; i < bezierLoops.length; i++) {
        var bezierLoop = bezierLoops[i];
        var node = bezierLoop.head;
        do {
            var ps = node.item.bezier3;
            f(ps);
            node = node.next;
        } while (node !== bezierLoop.head);
    }
};
/**
 * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
 * from the given boundary piece.
 * @param δ - An ordered pair that represents the start and ending points of
 * the boundary piece
 * @param keepStraight - If true then don't go around any mat circles
 */
Shape.getBoundaryPieceBeziers = function (δ) {
    var keepStraight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var cp0 = δ[0];
    var cp1 = δ[1];
    var bezierPieces = [];
    // As opposed to going around the circle and taking the last exit
    var goStraight = true;
    do {
        if (!goStraight && !keepStraight) {
            goStraight = true;
            // Actually, next, next, ..., i.e. take last exit
            cp0 = cp0.prevOnCircle;
            continue;
        }
        goStraight = false;
        var posThis = cp0.item.pointOnShape;
        var posNext = cp0.next.item.pointOnShape;
        if (posNext.bezierNode === posThis.bezierNode && (posNext.t > posThis.t || posNext.t === posThis.t && posNext.order > posThis.order)) {
            var pos = cp0.item.pointOnShape;
            var bezierPiece = new bezier_piece_1.default(pos.bezierNode, [pos.t, posNext.t]);
            bezierPieces.push(bezierPiece);
        } else {
            var _pos2 = cp0.item.pointOnShape;
            var _bezierPiece = new bezier_piece_1.default(_pos2.bezierNode, [_pos2.t, 1]);
            bezierPieces.push(_bezierPiece);
            addSkippedBeziers(bezierPieces, posThis.bezierNode, posNext.bezierNode, posNext.t);
        }
        cp0 = cp0.next;
    } while (cp0 !== cp1);
    return bezierPieces;
    /**
     * Adds pieces of skipped beziers
     */
    function addSkippedBeziers(bezierPieces, bezierNode0, bezierNode1, t1) {
        var ii = 0;
        var bNode = bezierNode0;
        do {
            ii++;
            bNode = bNode.next;
            if (bNode === bezierNode1) {
                var _bezierPiece2 = new bezier_piece_1.default(bNode, [0, t1]);
                bezierPieces.push(_bezierPiece2);
            } else {
                var _bezierPiece3 = new bezier_piece_1.default(bNode, [0, 1]);
                bezierPieces.push(_bezierPiece3);
            }
        } while (bNode !== bezierNode1 && ii < 100);
        if (ii === 100) {
            console.log('maxed');
        }
    }
};
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornersArray
 */
function createSharpCornerCpLoops(shape, sharpCornersArray) {
    var contactPointsPerLoop = [];
    var comparator = function comparator(a, b) {
        return contact_point_1.default.compare(a.item, b.item);
    };
    for (var k = 0; k < sharpCornersArray.length; k++) {
        var sharpCorners = sharpCornersArray[k];
        var cpLoop = new linked_loop_1.default([], comparator, k);
        var prevNode = undefined;
        for (var i = 0; i < sharpCorners.length; i++) {
            var pos = sharpCorners[i];
            var cp = new contact_point_1.default(pos, undefined);
            prevNode = cpLoop.insert(cp, prevNode, undefined);
            var mCircle = mat_circle_1.default.create(point_on_shape_1.default.getOsculatingCircle(pos), [prevNode]);
            prevNode.prevOnCircle = prevNode; // Trivial loop
            prevNode.nextOnCircle = prevNode; // ...
        }
        contactPointsPerLoop.push(cpLoop);
    }
    return contactPointsPerLoop;
}
/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise).
 */
function orient(bezierLoops) {
    var orientations = bezierLoops.map(isPathPositivelyOrientated);
    //console.log(orientations)
    if (!orientations[0]) {
        return bezierLoops;
    } else {
        var loops = bezierLoops.map(function (loop, k) {
            return reverseBeziersOrientation(loop, k);
        });
        return loops;
    }
}
/**
 * Completely reverse the loop direction of the given bezier loop. Returns the
 * reversed loop.
 * @param bezierLoop
 * @param k
 */
function reverseBeziersOrientation(bezierLoop, k) {
    var beziers = [];
    var bezierArray = bezierLoop.getAsArray();
    var idx = 0;
    for (var i = bezierArray.length - 1; i >= 0; i--) {
        var curve = path_curve_1.default.reverse(bezierArray[i], idx);
        idx++;
        beziers.push(curve);
    }
    return new linked_loop_1.default(beziers, undefined, k);
}
/**
 * Returns the the top, left, bottom and right extreme points of the given
 * bezier loop, including the bezier nodes they belong to. If an extreme is at a
 * bezier-bezier interface the first bezier will always be used (at t=1).
 */
var getLoopBounds = memoize(function (bezierLoop) {
    var INF = Number.POSITIVE_INFINITY;
    var shapeBoundingBox = [[INF, INF], [-INF, -INF]];
    var extremeBeziers = [[undefined, undefined], [undefined, undefined]];
    bezierLoop.forEach(function (bezierNode) {
        var ps = bezierNode.item.bezier3;
        var boundingBox = flo_bezier3_1.default.getBoundingBox(ps);
        //console.log(boundingBox)
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                var v = boundingBox[i][j];
                var m = i === 0 ? 1 : -1;
                if (m * v < m * shapeBoundingBox[i][j]) {
                    shapeBoundingBox[i][j] = v;
                    extremeBeziers[i][j] = bezierNode;
                }
            }
        }
    });
    return { shapeBoundingBox: shapeBoundingBox, extremeBeziers: extremeBeziers };
});
/**
 * Returns true if the given beizer loop is positively orientated, false
 * otherwise.
 */
var isPathPositivelyOrientated = function isPathPositivelyOrientated(bezierLoop) {
    var _getLoopBounds = getLoopBounds(bezierLoop),
        extremeBeziers = _getLoopBounds.extremeBeziers;

    var maxXBezierNode = extremeBeziers[1][0];
    var ps = maxXBezierNode.item.bezier3;
    var ts = flo_bezier3_1.default.getBounds(ps).ts;
    var tAtMaxX = ts[1][0];
    var tan = flo_bezier3_1.default.tangent(ps)(tAtMaxX);
    if (tAtMaxX !== 1) {
        // Not a sharp corner
        return tan[1] > 0;
    }
    var psNext = maxXBezierNode.next.item.bezier3;
    var tanNext = flo_bezier3_1.default.tangent(psNext)(0);
    if (tan[1] * tanNext[1] > 0) {
        // Both tangents points up or both points down.
        return tan[1] > 0;
    }
    // One tangent points up and the other down.
    return flo_vector2d_1.default.cross(tan, tanNext) > 0;
    // We don't check for the very special case where the cross === 0. 
};
/*
class LoopExtreme {
    p: number[];
    bezierNode: ListNode<number[][]>;
    t: number;

    constructor(p: number[], bezierNode: ListNode<number[][]>, t: number) {
        this.p = p;
        this.bezierNode = bezierNode;
        this.t = t;
    }
}
*/
/**
 * Get topmost point, bezierNode and t-value of the given loop.
 */
var getExtremes = memoize(function (bezierLoop) {
    var _getLoopBounds2 = getLoopBounds(bezierLoop),
        extremeBeziers = _getLoopBounds2.extremeBeziers;

    var bezierNode = extremeBeziers[0][1]; // Bezier at minimum y
    var ts = flo_bezier3_1.default.getBounds(bezierNode.item.bezier3).ts;
    var t = ts[0][1];
    var p = flo_bezier3_1.default.evaluate(bezierNode.item.bezier3)(t);
    //return new LoopExtreme(p, bezierNode, t);
    return { p: p, bezierNode: bezierNode, t: t };
});
/**
 * Returns true if bezier box is entirely outside circle box, false otherwise.
 *
 * Given a circle, bound it tightly by an axes-aligned box (i.e. circle
 * box). And given a bezier, bound tightly by a rectangle (not
 * necessarily axes aligned) (i.e. bezier box).
 */
function isBezierBoxWhollyOutsideCircleBox(ps, circle) {
    //---- Cache
    var r = circle.radius;
    var ox = circle.center[0];
    var oy = circle.center[1];
    var radius_2 = r * r;
    //---- Translate bezier tight bounding box (4 point rectangle) so that circle center is at origin. 
    var boxTight = flo_vector2d_1.default.translatePs([-ox, -oy], flo_bezier3_1.default.getBoundingBoxTight(ps));
    //---- Rotate circle and rectangle together so that box rectangle is aligned with axes.
    var boxDiagonal = flo_vector2d_1.default.fromTo(boxTight[0], boxTight[1]);
    var l = flo_vector2d_1.default.len(boxDiagonal);
    var sinθ = boxDiagonal[1] / l;
    var cosθ = boxDiagonal[0] / l;
    var rotateByθ = flo_vector2d_1.default.rotate(sinθ, -cosθ);
    var b0 = rotateByθ(boxTight[0]);
    var b1 = rotateByθ(boxTight[2]);
    var anyBoxVerticalInside = b0[0] > -r && b0[0] < r || b1[0] > -r && b1[0] < r;
    var boxVerticalsCapture = b0[0] < -r && b1[0] > r || b1[0] < -r && b0[0] > r;
    var anyBoxHorizontalInside = b0[1] > -r && b0[1] < r || b1[1] > -r && b1[1] < r;
    var boxHorizontalsCapture = b0[1] < -r && b1[1] > r || b1[1] < -r && b0[1] > r;
    if (anyBoxVerticalInside && (anyBoxHorizontalInside || boxHorizontalsCapture) || anyBoxHorizontalInside && (anyBoxVerticalInside || boxVerticalsCapture) || boxVerticalsCapture && boxHorizontalsCapture) {
        return false;
    }
    return true;
}
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
/**
 * TODO - finish implementation - the function below with the same name
 * is temporary.
 * @param contactPointArr
 */ /*
    function createCoupledLoops(contactPointArr, k) {
     let comparator = (a,b) => ContactPoint.compare(a.item, b.item);
    let cpLoop = new LinkedLoop([], comparator, k);
    
    let denseContactPoints = new LinkedLoop([], undefined, k);
    
    let prevCpNode = undefined;
    let prevCoupledCpNode = undefined;
    for (let i=0; i<contactPointArr.length; i++) {
       let cp = contactPointArr[i];
       let pos = cp.pointOnShape;
       
       prevCoupledCpNode = LinkedLoop.insert(
               denseContactPoints, cp, prevCoupledCpNode
       );
       // TODO !!!!
       /*
       if (pos.type === MAT_CONSTANTS.pointType.dull) {
           if (acos(1-pos.sharpness) * 180 / Math.PI > 16) {
               prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
           }
       } else if (pos.type === MAT_CONSTANTS.pointType.sharp) {
           if (acos(1-pos.sharpness) * 180 / Math.PI > 16) {
               prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
           }
       } else {*/ /*
                  prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
                  //}
                  prevCoupledCpNode.coupledNode = prevCpNode;
                  }
                  return cpLoop;
                  }*/
function createCoupledLoops(pointOnShapeArr, k) {
    var posLoop = new linked_loop_1.default([], undefined, k);
    var prevNode = undefined;
    for (var i = 0; i < pointOnShapeArr.length; i++) {
        var pos = pointOnShapeArr[i];
        prevNode = posLoop.insert(pos, prevNode, undefined);
    }
    return posLoop;
}
/**
 * TODO - uncomment and finish
 * Finds a point on the shape between the given contact points which
 * is as close as possible to a point with accumalated abs curvature
 * (from accumAtLeft) equal to totAtMid.
 *
 * @param leftCp
 * @param rightCp
 * @param accumTotAtLeft
 * @param accumTotAtRight
 * @param totAtMid
 * @returns {PointOnShape}
 */
/*
function getCPointBetweenCps(
        leftCp: ContactPoint,
        rightCp: ContactPoint,
        accumTotAtLeft: number,
        accumTotAtRight: number,
        totAtMid: number) {
    
    let accumTo = totAtMid - accumTotAtLeft;
    
    let posStart = leftCp .pointOnShape;
    let posEnd   = rightCp.pointOnShape;
    
    let bezierNodeStart = posStart.bezierNode;
    let bezierNodeEnd   = posEnd.  bezierNode;
    
    let bezierNode = bezierNodeStart;
    
    let totalTurn = 0;
    let totalCurvature = 0;
    do {
        let turn;
        if (bezierNode !== bezierNodeEnd) {
            turn = Math.abs(getCurvatureAtInterface(bezierNode));
        } else {
            turn = 0;
        }
        
        
        let curvature;
        let interval = [0,1];
        if (bezierNode === bezierNodeStart) { interval[0] = posStart.t; }
        if (bezierNode === bezierNodeEnd)   { interval[1] = posEnd.t; }
        curvature = Bezier3.getTotalAbsoluteCurvature(bezierNode.item.bezier3)(interval);

        
        totalTurn += turn;
        totalCurvature += curvature;
        
        let totalBoth = totalTurn + totalCurvature;
        if (totalBoth >= accumTo) {
            // aaa console.log('accumTo: ' + accumTo, 'totalBoth: ' + totalBoth);
            break;
        }
        
        bezierNode = bezierNode.next;
    } while (bezierNode.prev !== bezierNodeEnd);

    
    //return { totalTurn, totalCurvature };
}
*/
/**
 * TODO - uncomment and finish
 */
/*
function sumCurvatures(curvatures: number[]): number {
    let total = 0;
    
    for (let i=0; i<curvatures.length; i++) {
        let c = curvatures[i].c;
        
        total += c.totalTurn + c.totalCurvature;
    }
    
    return total;
}
*/
/**
 * TODO - uncomment and finish
 * Calculates and returns total absolute curvature between
 * the given contact points.
 * @param {ContactPoint[]}
 * @returns {Object}
 */
/*
function getTotalAbsCurvatureBetweenCps([cpStart, cpEnd]) {
    let posStart = cpStart.pointOnShape;
    let posEnd   = cpEnd.  pointOnShape;
    
    let bezierNodeStart = posStart.bezierNode;
    let bezierNodeEnd   = posEnd.  bezierNode;
    
    let bezierNode = bezierNodeStart;
    
    let totalTurn = 0;
    let totalCurvature = 0;
    do {
        let turn;
        if (bezierNode !== bezierNodeEnd) {
            turn = Math.abs(getCurvatureAtInterface(bezierNode));
        } else {
            turn = 0;
        }
        
        
        let curvature;
        let interval = [0,1];
        if (bezierNode === bezierNodeStart) { interval[0] = posStart.t; }
        if (bezierNode === bezierNodeEnd)   { interval[1] = posEnd.t; }
        curvature = Bezier3.getTotalAbsoluteCurvature(bezierNode.item.bezier3)(interval);

        
        totalTurn += turn;
        totalCurvature += curvature;
        
        bezierNode = bezierNode.next;
    } while (bezierNode.prev !== bezierNodeEnd);

    
    return { totalTurn, totalCurvature };
}
*/
/**
 * Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param bezierNode
 */
function getCurvatureAtInterface(bezierNode) {
    var ts = [1, 0];
    var pss = [bezierNode.item.bezier3, bezierNode.next.item.bezier3];
    var tans = [flo_bezier3_1.default.tangent(pss[0])(1), flo_bezier3_1.default.tangent(pss[0])(0)];
    // The integral of a kind of Dirac Delta function.
    var cosθ = flo_vector2d_1.default.dot(tans[0], tans[1]);
    var sinθ = flo_vector2d_1.default.cross(tans[0], tans[1]);
    var θ = acos(cosθ);
    var result = sinθ >= 0 ? θ : -θ;
    return result;
}
/**
 * @description Helper function.
 * @param f
 * @returns {Funtion}
 */
function getTotalBy(f) {
    return function (bezierLoop) {
        var node = bezierLoop.head;
        var total = 0;
        do {
            total += f(node);
            node = node.next;
        } while (node !== bezierLoop.head);
        return total;
    };
}
exports.default = Shape;

},{"../../geometry/classes/bezier-piece":5,"../../geometry/classes/path-curve":8,"../../geometry/classes/point-on-shape":9,"../../linked-list/linked-loop":16,"../../linked-list/list-node":17,"../../mat-constants":18,"../../mat/classes/contact-point":19,"../../mat/classes/mat-circle":23,"../functions/get-bezier-osculating-circles":12,"../functions/get-contact-circles-at-bezier-bezier-interface":14,"flo-bezier3":39,"flo-memoize":46,"flo-vector2d":55}],11:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var DELTA = 1e-6;
/**
 * Calculates the curvature extrema brackets of the given
 * bezier.
 *
 * See the paper at: http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
 * Note that naming conventions is roughly as in the paper above.
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
    // TODO - This case is simpler due to being quadratic but we're 
    // lazy now and will skip it for the moment. 

    // See : http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
    // Rotate curve so that W0 - 2W1 + W2 = (0, (1/3)a), a != 0
    var atan_numer = P_3x - 3 * P_2x + 3 * P_1x;
    var atan_denom = P_3y - 3 * P_2y + 3 * P_1y;
    var atan_numer_squared = atan_numer * atan_numer;
    var atan_denom_squared = atan_denom * atan_denom;
    var radpre = atan_numer_squared / atan_denom_squared + 1;
    var rad = Math.sqrt(radpre);
    var cos_theta = 1 / rad;
    var sin_theta = void 0;
    if (cos_theta === 0) {
        sin_theta = 1;
    } else {
        sin_theta = atan_numer / (atan_denom * rad);
    }
    // For next rotated points see Maxima file bez5 - here we skip 
    // expensive trig evaluations
    var R_0x = 0;
    var R_0y = 0;
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
    var a_ = 3 * (W_0y - 2 * W_1y + W_2y);
    var dif = R_2x - 2 * R_1x; // which = W_1x - W_0x;
    if (dif === 0) {
        // Case 1 (special) - W_1x - W_0x === 0
        // Degenerate to cubic function	
        if (W_0x !== 0) {
            // TODO - FINISH!!!
            // TODO - we also still need to check for degenerate cubic 
            // (see start of paper)
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
        // 1. It has a single inflection point and exactly 2 curvature 
        //    maxima (symmetrically positioned about inflection point).
        //    This is the case if dif === 0 in above code.
        // 2. It has a single cusp - we ignore this case for now - but 
        //    we must still do it!
        // 3. It has a point of self-intersection - occurs if d < 0 in 
        //    paper (in code d is called sigd_). 
        // 4. It has 2 inflection points, no cusps, no self-
        //    intersections.
        //    It can have either 3 or 5 curvature extrema
        //    a. The case of 5 curvature extrema is ignored for now - 
        //       in the paper it is mentioned to even find such a curve 
        //       is difficult and it seems such curves have very sharp 
        //       curvature at one point which should not usually occur 
        //       in an SVG shape. 
        //       But this case should later be included or we'll miss 
        //       some points.
        //    b. There are 3 curvature extrema:
        //       Extrema occur in the range (-inf, -sqrt(d)), 
        //       (-sqrt(d), sqrt(d)), (sqrt(d), inf). 
        //       Since we dont know how to select -inf and inf we will 
        //       just choose them to be -10 and 11 (remember bezier runs 
        //       from t=0 to t=1). If Brent's method runs out of the 
        //       (0,1) interval we stop and use 0 or 1 as the extremum? 
        //       Remember extrema can also occur at t=0 and t=1!
        //
        // At the moment we only test for case 1 and 4b, but in future 
        // we can test and eliminate the other cases.
        var mu = 6 * dif;
        var lambda = 3 * a_ * W_0x / (mu * mu);
        var gamma1 = 3 * a_ * W_0y / (mu * mu);
        var gamma2 = 3 * (W_1y - W_0y) / mu;
        // This d in the paper
        var sigd_ = lambda * lambda - 2 * gamma2 * lambda + gamma1;
        var b_ = 2 * (gamma2 - lambda);
        var deReParamBoundary = deReParameterizeBoundary(lambda, mu, a_);
        if (sigd_ > 0) {
            var ssigd_ = Math.sqrt(sigd_);
            //console.log(ssigd_);
            // de-reparametize
            // Note: the sda and sdb here are the inflection points for 
            // a case iv!! there are easier ways to calculate these
            var sda = -ssigd_;
            var sdb = ssigd_;
            brackets = [[Number.NEGATIVE_INFINITY, sda], [sda, sdb], [sdb, Number.POSITIVE_INFINITY]].map(deReParamBoundary).map(clipBoundary);
        } else if (sigd_ < 0) {
            // Loop 
            // Note: The loop intersection may be outside t=[0,1]. 
            // In fact, for a well behaved shape this is always the 
            // case.
            // But, curvature maxima may still occur inside t=[0,1] 
            // of course.
            // There can be 1 or 3 maxima of curvature
            var ksi_pre1 = 2 * b_ * b_ - 8 * sigd_ - 3;
            if (ksi_pre1 < 0) {
                brackets = [[0, Math.sqrt(-3 * sigd_)]].map(deReParamBoundary).map(clipBoundary);
            } else {
                var ksi_pre2 = Math.sqrt(5 * ksi_pre1);
                var ksi1 = (-5 * b_ - ksi_pre2) / 10;
                var ksi2 = (-5 * b_ + ksi_pre2) / 10;
                brackets = [[Number.NEGATIVE_INFINITY, ksi1], [ksi1, Math.min(0, ksi2)], [Math.max(0, ksi2), Math.sqrt(-3 * sigd_)]].map(deReParamBoundary).map(clipBoundary);
            }
        } else if (sigd_ === 0) {
            // TODO Cusp - ignore for now - lazy
        }
    }
    return brackets;
}
/**
 * Clips to [0,1] or returns false if not within [0,1].
 * @private
 */
function clipBoundary(bound) {
    var b0 = bound[0];
    var b1 = bound[1];
    if (b0 < 0 && b1 < 0 || b0 > 1 && b1 > 1) {
        return undefined;
    }
    if (b0 < 0) {
        b0 = 0;
    }
    if (b0 > 1) {
        b0 = 1;
    }
    if (b1 < 0) {
        b1 = 0;
    }
    if (b1 > 1) {
        b1 = 1;
    }
    return [b0, b1];
}
/**
 * @private
 */
function deReParameterize(lambda, mu, a_) {
    return function (sigma) {
        return (sigma - lambda) * (mu / a_);
    };
}
/**
 * @private
 */
function deReParameterizeBoundary(lambda, mu, a_) {
    return function (boundary) {
        return boundary.map(deReParameterize(lambda, mu, a_));
    };
}
;
exports.default = calcBezierCurvatureExtremaBrackets;

},{}],12:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var flo_poly_1 = _dereq_("flo-poly");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var calc_bezier_curvature_extrema_1 = _dereq_("./calc-bezier-curvature-extrema");
/**
 * Finds the osculating circles for the given bezier.
 */
function getBezierOsculatingCircles(bezierNode) {
    var pointsOnShape = [];
    var root = void 0;
    var ps = bezierNode.item.bezier3;
    var brackets = calc_bezier_curvature_extrema_1.default(ps);
    var κPs = flo_bezier3_1.default.κ(ps);
    var lenb = brackets.length;
    for (var k = 0; k < lenb; k++) {
        var bracket = brackets[k];
        if (!bracket) {
            continue;
        }
        var _root = lookForRoot(ps, bracket);
        if (!_root) {
            continue;
        }
        var κ = -κPs(_root);
        // Check if local extrema is a maximum or minimum.
        var κAtMinsd = -κPs(bracket[0]);
        var κAtMaxsd = -κPs(bracket[1]);
        if (κ > κAtMinsd && κ > κAtMaxsd) {
            // maximum
        } else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
            // minimum
            continue;
        }
        var pos = new point_on_shape_1.default(bezierNode, _root, mat_constants_1.default.pointType.standard, 0, 0);
        pointsOnShape.push(pos);
    }
    pointsOnShape.sort(point_on_shape_1.default.compare);
    return pointsOnShape;
}
function lookForRoot(ps, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        minsd = _ref2[0],
        maxsd = _ref2[1];

    // At this point there can be exactly 0 or 1 roots within 
    // [minsd, maxsd]
    var c0 = flo_bezier3_1.default.dκMod(ps)(minsd);
    var c1 = flo_bezier3_1.default.dκMod(ps)(maxsd);
    if (c0 * c1 >= 0) {
        return;
    }
    // There is exactly one root in the interval.
    var root = flo_poly_1.default.brent(flo_bezier3_1.default.dκMod(ps), minsd, maxsd);
    return root;
}
exports.default = getBezierOsculatingCircles;

},{"../../geometry/classes/point-on-shape":9,"../../mat-constants":18,"./calc-bezier-curvature-extrema":11,"flo-bezier3":39,"flo-poly":47}],13:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_poly_1 = _dereq_("flo-poly");
var geometry_1 = _dereq_("../geometry");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var Point_on_shape_1 = _dereq_("../classes/Point-on-shape");
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
    var bezierPieces = cullBezierPieces(bezierPieces_, point);
    var bestDistance = Number.POSITIVE_INFINITY;
    var pos = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = bezierPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var bezierPiece = _step.value;

            //let bezier = bezierPiece.bezierNode.item;
            var p = closestPointOnBezier(bezierPiece.bezierNode, point, bezierPiece.tRange, touchedBezierNode, t);
            var d = p === undefined ? Number.POSITIVE_INFINITY : flo_vector2d_1.default.distanceBetween(p.p, point);
            if (d < bestDistance) {
                pos = new Point_on_shape_1.default(bezierPiece.bezierNode, p.t, mat_constants_1.default.pointType.standard, 0, 0);
                bestDistance = d;
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

    return pos;
}
function cullBezierPieces(bezierPieces, p) {
    var CULL_THRESHOLD = 5; // TODO Put somewhere better.
    var shortCircuit = bezierPieces.length > CULL_THRESHOLD;
    if (shortCircuit) {
        // First get an initial point such that the closest point can not be 
        // further than this point.
        var bestSquaredDistance = getClosePoint(bezierPieces, p);
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
    var bestSquaredDistance = Number.POSITIVE_INFINITY;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = bezierPieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var bezierPiece = _step2.value;

            var ps = bezierPiece.bezierNode.item.bezier3;
            var evPs = flo_bezier3_1.default.evaluate(ps);
            var p1 = evPs(bezierPiece.tRange[0]);
            var p2 = evPs(bezierPiece.tRange[1]);
            var d1 = flo_vector2d_1.default.squaredDistanceBetween(p, p1);
            var d2 = flo_vector2d_1.default.squaredDistanceBetween(p, p2);
            var d = Math.min(d1, d2);
            if (d < bestSquaredDistance) {
                bestSquaredDistance = d;
            }
        }
        // The extra bit is to account for floating point precision 
        // TODO change 0.01 below to more meaningfull value dependent on 
        // shape dimensions.
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

    return bestSquaredDistance + 0.01;
}
/**
 * When checking distances, ignore all those with closest
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance) {
    var candidateBezierPieces = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = bezierPieces[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var bezierPiece = _step3.value;

            var ps = bezierPiece.bezierNode.item.bezier3;
            var boundingBox = flo_bezier3_1.default.getBoundingBox(ps);
            var d = geometry_1.default.getClosestSquareDistanceToRect(boundingBox, p);
            if (d <= bestSquaredDistance) {
                candidateBezierPieces.push(bezierPiece);
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

    return candidateBezierPieces;
}
/**
 * When checking distances, ignore all those with closest
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance) {
    var candidateBezierPieces = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = bezierPieces[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var bezierPiece = _step4.value;

            var ps = bezierPiece.bezierNode.item.bezier3;
            var tightBoundingBox = flo_bezier3_1.default.getBoundingBoxTight(ps);
            var d = geometry_1.default.closestSquaredDistanceToRotatedRect(tightBoundingBox, p);
            if (d <= bestSquaredDistance) {
                candidateBezierPieces.push(bezierPiece);
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
    var ps = bezierNode.item.bezier3;
    // TODO The site at http://jazzros.blogspot.ca/2011/03/projecting-point-on-bezier-curve.html
    // may hint at requiring much fewer assignments?

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
    if (bezierNode === touchedBezierNode) {
        var deflatedPoly = flo_poly_1.default.deflate(poly, t);
        poly = deflatedPoly;
    }
    var roots = flo_poly_1.default.allRoots(poly, tRange[0], tRange[1]);
    var push0 = true;
    var push1 = true;
    if (t === 1 && bezierNode === touchedBezierNode.next || bezierNode === touchedBezierNode && t === 0) {
        push0 = false;
    }
    if (t === 0 && bezierNode === touchedBezierNode.prev || bezierNode === touchedBezierNode && t === 1) {
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
    /*
    let closestPs = roots.map(function(root) {
        return Bezier3.evaluate(ps)(root);
    });
    let closestPoint = Vector.getClosestTo(p, closestPs);
    */
    var closestPs = roots.map(function (root) {
        return { p: flo_bezier3_1.default.evaluate(ps)(root), t: root };
    });
    var closestPoint = getClosest(p, closestPs, function (p1, p2) {
        return flo_vector2d_1.default.squaredDistanceBetween(p1, p2.p);
    });
    return closestPoint;
}
function getClosest(p, ps, f) {
    var cp = undefined; // Closest Point
    var bestd = Number.POSITIVE_INFINITY;
    for (var i = 0; i < ps.length; i++) {
        var p_ = ps[i];
        var d = f(p, p_);
        if (d < bestd) {
            cp = p_;
            bestd = d;
        }
    }
    return cp;
}
exports.default = getClosestBoundaryPointToPoint;

},{"../../mat-constants":18,"../classes/Point-on-shape":3,"../geometry":15,"flo-bezier3":39,"flo-poly":47,"flo-vector2d":55}],14:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var mat_constants_1 = _dereq_("../../mat-constants");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var corner_1 = _dereq_("../classes/corner");
// Angle in degrees
var DEGREES = {
    '0': 0.0000,
    '0.25': 0.0050,
    '1': 0.0167,
    '4': 0.0698,
    '15': 0.2588,
    '16': 0.2756
};
var CROSS_TANGENT_LIMIT = DEGREES[0.25];
/**
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points.
 *
 * @param bezierNodes - The two bezier nodes.
 **/
// TODO dullCornerHash should not be modified inside the function
function getContactCirclesAtBezierBezierInterface(bezierNodes, dullCornerHash) {
    var ts = [1, 0];
    var beziers = [0, 1].map(function (i) {
        return bezierNodes[i].item.bezier3;
    });
    var tans = [0, 1].map(function (i) {
        return flo_bezier3_1.default.tangent(beziers[i], ts[i]);
    });
    var crossTangents = +flo_vector2d_1.default.cross(tans[0], tans[1]);
    var negDot = -flo_vector2d_1.default.dot(tans[0], tans[1]);
    // The if below is important. Due to floating point approximation
    // it sometimes happen that crossTangents !== 0 but
    // negDot === -1. Remove the if and see what happens. :)
    if (crossTangents === 0 || negDot === -1) {
        // Too close to call 
        return [];
    }
    var p = beziers[0][3];
    if (crossTangents < -CROSS_TANGENT_LIMIT) {
        // Sharp corner
        var pos = new point_on_shape_1.default(bezierNodes[0], 1, mat_constants_1.default.pointType.sharp, 0, 0);
        return [pos];
    }
    if (crossTangents > 0) {
        var key = point_on_shape_1.default.makeSimpleKey(p);
        dullCornerHash[key] = new corner_1.default(beziers, tans);
    }
    if (crossTangents <= CROSS_TANGENT_LIMIT) {
        // The interface is too straight, but put a point close-by.
        // TODO - this point may be order wrong in the end causing 
        // disaster. Fix.
        var _pos = new point_on_shape_1.default(bezierNodes[0], 0.9, mat_constants_1.default.pointType.standard, 0, 0);
        return [_pos];
    }
    //---- Dull corner
    var pointsOnShape = [];
    var orders = [-1, negDot];
    for (var i = 0; i < 2; i++) {
        var _pos2 = new point_on_shape_1.default(bezierNodes[i], ts[i], mat_constants_1.default.pointType.dull, orders[i], 0);
        pointsOnShape.push(_pos2);
    }
    return pointsOnShape;
}
exports.default = getContactCirclesAtBezierBezierInterface;

},{"../../geometry/classes/point-on-shape":9,"../../mat-constants":18,"../classes/corner":7,"flo-bezier3":39,"flo-vector2d":55}],15:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var circle_1 = _dereq_("./classes/circle");
var shape_1 = _dereq_("./classes/shape");
var arc_1 = _dereq_("./classes/arc");
var flo_bezier3_1 = _dereq_("flo-bezier3");
/**
 * Find point where two lines intersect. Returns he point where the two lines
 * intersect or null if they don't intersect or are the same line.
 * @param l1 - The first line
 * @param l2 - The second line
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
/**
 * Get line shape intersection points.
 *
 * @param line A line described by two points
 * @param δ A boundary piece described by start and end contact points
 *
 * Currently not used
 */
function getLineBoundaryIntersectionPoints(line, δ) {
    var points = [];
    var bezierPieces = shape_1.default.getBoundaryPieceBeziers(δ);
    for (var i = 0; i < bezierPieces.length; i++) {
        var bezierPiece = bezierPieces[i];
        var ps = bezierPiece.bezierNode.item.bezier3;
        var iPoints = getLineBezierIntersectionPoints(line, ps, bezierPiece.tRange);
        for (var j = 0; j < iPoints.length; j++) {
            points.push(iPoints[j].p);
        }
    }
    return points;
}
/**
 * @description .
 */
function closestSquaredDistanceToRotatedRect(ps, p) {
    var tightBoundingBox = ps;
    var ds = [0, 1, 2, 3].map(function (i) {
        return flo_vector2d_1.default.squaredDistanceBetweenPointAndLineSegment(p, [tightBoundingBox[i], tightBoundingBox[(i + 1) % 4]]);
    });
    return Math.min.apply(Math, _toConsumableArray(ds));
}
/**
 * .
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
            return flo_vector2d_1.default.squaredDistanceBetween(box[0], p);
        } else if (yp > y1) {
            return flo_vector2d_1.default.squaredDistanceBetween([x0, y1], p);
        } else {
            var d = x0 - xp;
            return d * d;
        }
    } else if (xp > x1) {
        if (yp < y0) {
            return flo_vector2d_1.default.squaredDistanceBetween([x1, y0], p);
        } else if (yp > y1) {
            return flo_vector2d_1.default.squaredDistanceBetween(box[1], p);
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
/**
 * Returns the angle (in degrees) given the sine and the cosine of an angle.
 * @private
 */
function degAngleFromSinCos(sinθ, cosθ) {
    var toDeg = function toDeg(θ) {
        return θ * (180 / Math.PI);
    };
    if (cosθ === 0) {
        if (sinθ > 0) {
            return 90;
        }
        return 270;
    }
    if (cosθ > 0) {
        return toDeg(Math.atan(sinθ / cosθ));
    }
    return 180 + toDeg(Math.atan(sinθ / cosθ));
}
/**
 * Returns a directional arc from 3 ordered points.
 */
function arcFrom3Points(ps) {
    var midPoint1 = flo_vector2d_1.default.mean([ps[0], ps[1]]);
    var midPoint2 = flo_vector2d_1.default.mean([ps[1], ps[2]]);
    var chord1 = flo_vector2d_1.default.fromTo(ps[0], ps[1]);
    var chord2 = flo_vector2d_1.default.fromTo(ps[1], ps[2]);
    var perpendicular1 = [chord1[1], -chord1[0]];
    var perpendicular2 = [chord2[1], -chord2[0]];
    var l1 = [midPoint1, flo_vector2d_1.default.translate(perpendicular1, midPoint1)];
    var l2 = [midPoint2, flo_vector2d_1.default.translate(perpendicular2, midPoint2)];
    var circleCenter = lineLineIntersection(l1, l2);
    var arc = void 0;
    if (!circleCenter) {
        // TODO - not right - fix
        /*
        // The circle is in effect a line segment.
        if (Vector.equal(ps[0], ps[2])) {
            return null;
        }
        arc = new Arc(null, ps[0], ps[2]);
        return arc;
        */
        return undefined;
    }
    var sideVector1 = flo_vector2d_1.default.fromTo(circleCenter, ps[0]);
    var midVector = flo_vector2d_1.default.fromTo(circleCenter, ps[1]);
    var sideVector2 = flo_vector2d_1.default.fromTo(circleCenter, ps[2]);
    var radius = flo_vector2d_1.default.len(sideVector1);
    var sinθ1 = -sideVector1[1] / radius;
    var cosθ1 = sideVector1[0] / radius;
    var sinθ2 = -sideVector2[1] / radius;
    var cosθ2 = sideVector2[0] / radius;
    var sin_midangle = -midVector[1] / radius;
    var cos_midangle = midVector[0] / radius;
    if (isAngleBetween(sin_midangle, cos_midangle, sinθ1, cosθ1, sinθ2, cosθ2)) {
        arc = new arc_1.default(new circle_1.default(circleCenter, radius), sinθ1, cosθ1, sinθ2, cosθ2, ps[0], ps[2]);
    } else {
        arc = new arc_1.default(new circle_1.default(circleCenter, radius), sinθ2, cosθ2, sinθ1, cosθ1, ps[2], ps[0]);
    }
    return arc;
}
/**
 * @description .
 */
function quadrant(sinθ, cosθ) {
    if (sinθ >= 0) {
        if (cosθ >= 0) {
            return 1;
        }
        return 2;
    }
    if (cosθ >= 0) {
        return 4;
    }
    return 3;
}
/**
 * @description .
 */
function isAngle1LargerOrEqual(sinθ1, cosθ1, sinθ2, cosθ2) {
    var q1 = quadrant(sinθ1, cosθ1);
    var q2 = quadrant(sinθ2, cosθ2);
    if (q1 > q2) {
        return true;
    }
    if (q1 < q2) {
        return false;
    }
    // Same quadrant
    if (q1 === 1 || q1 === 4) {
        return sinθ1 >= sinθ2;
    }
    return sinθ1 <= sinθ2;
}
/**
 * Returns true if angle1 < angle < angle2 in the non-trivial sense.
 */
function isAngleBetween(sinθ, cosθ, sinθ1, cosθ1, sinθ2, cosθ2) {
    var θ1_larger_θ2 = isAngle1LargerOrEqual(sinθ1, cosθ1, sinθ2, cosθ2);
    var θ_larger_θ2 = isAngle1LargerOrEqual(sinθ, cosθ, sinθ2, cosθ2);
    var θ_larger_θ1 = isAngle1LargerOrEqual(sinθ, cosθ, sinθ1, cosθ1);
    return θ1_larger_θ2 ? θ_larger_θ1 || !θ_larger_θ2 : θ_larger_θ1 && !θ_larger_θ2;
}
/**
 *
 */
function lineThroughPointAtRightAngleTo(p, v) {
    var u = [-v[1], v[0]];
    var p20 = p[0] + u[0];
    var p21 = p[1] + u[1];
    return [p, [p20, p21]];
}
/**
 * Get all intersection points between a line and a bezier within a certain t
 * range.
 */
function getLineBezierIntersectionPoints(line, ps, tRange) {
    var t = [-line[0][0], -line[0][1]];
    var p = [line[1][0] + t[0], line[1][1] + t[1]];
    // Cache
    var lineLength = flo_vector2d_1.default.len(p);
    var sinθ = -p[1] / lineLength;
    var cosθ = p[0] / lineLength;
    var newPs = flo_vector2d_1.default.translateThenRotatePs(t, sinθ, cosθ, ps);
    var roots = flo_poly_1.default.allRoots(flo_bezier3_1.default.getY(newPs), 0, 1);
    return roots.map(function (t) {
        return { p: flo_bezier3_1.default.evaluate(ps)(t), t: t };
    });
}
var Geometry = {
    lineLineIntersection: lineLineIntersection,
    getLineBoundaryIntersectionPoints: getLineBoundaryIntersectionPoints,
    closestSquaredDistanceToRotatedRect: closestSquaredDistanceToRotatedRect,
    getClosestSquareDistanceToRect: getClosestSquareDistanceToRect,
    degAngleFromSinCos: degAngleFromSinCos,
    arcFrom3Points: arcFrom3Points,
    quadrant: quadrant,
    isAngle1LargerOrEqual: isAngle1LargerOrEqual,
    isAngleBetween: isAngleBetween,
    lineThroughPointAtRightAngleTo: lineThroughPointAtRightAngleTo,
    getLineBezierIntersectionPoints: getLineBezierIntersectionPoints
};
exports.default = Geometry;

},{"./classes/arc":4,"./classes/circle":6,"./classes/shape":10,"flo-bezier3":39,"flo-poly":47,"flo-vector2d":55}],16:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_ll_rb_tree_1 = _dereq_("flo-ll-rb-tree");
var list_node_1 = _dereq_("./list-node");
/**
 * Represents a destructive (i.e. not functional) two-way linked loop.
 * @param items - A pre-ordered array of items to add initially; it is
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 * @param indx - Loop identifier.
 */

var LinkedLoop = function () {
    function LinkedLoop(items, comparator, indx) {
        _classCallCheck(this, LinkedLoop);

        if (comparator) {
            this.cptree = new flo_ll_rb_tree_1.default(comparator, [], true);
        }
        this.indx = indx;
        this.addAllFromScratch(items || []);
    }
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */


    _createClass(LinkedLoop, [{
        key: "addAllFromScratch",
        value: function addAllFromScratch(arr) {
            if (arr.length === 0) {
                return;
            }
            var head = void 0;
            var prevNode = null;
            var node = void 0;
            for (var i = 0; i < arr.length; i++) {
                node = new list_node_1.default(this, arr[i], prevNode, null);
                if (prevNode) {
                    prevNode.next = node;
                }
                prevNode = node;
                if (i === 0) {
                    head = node;
                }
                if (this.cptree) {
                    this.cptree.insert(node);
                }
                ;
            }
            // Close loop
            head.prev = node;
            node.next = head;
            this.head = head;
        }
        /**
         * Insert an item into the linked loop after the specified point.
         * @param item - Item to insert
         * @param prev - Inserts the new item right after this item
         * @param coupledNode - A node coupled to this one
         */

    }, {
        key: "insert",
        value: function insert(item, prev_) {
            var coupledNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

            var loop = this;
            var node = new list_node_1.default(loop, item, undefined, undefined);
            var prev = void 0;
            var next = void 0;
            if (!loop.head) {
                prev = node;
                next = node;
                loop.head = node;
            } else {
                prev = prev_;
                next = prev.next;
            }
            next.prev = node;
            prev.next = node;
            node.prev = prev;
            node.next = next;
            node.coupledNode = coupledNode;
            if (loop.cptree) {
                loop.cptree.insert(node);
            }
            ;
            return node;
        }
        /**
         * Removes a node from the linked loop.
         */

    }, {
        key: "remove",
        value: function remove(node) {
            var loop = this;
            var prev = node.prev;
            var next = node.next;
            if (node === loop.head) {
                loop.head = next;
            }
            prev.next = next;
            next.prev = prev;
            if (loop.cptree) {
                loop.cptree.remove(node, false); // TODO, make the second parameter default
            }
            ;
        }
        /**
         *
         */

    }, {
        key: "getAsArray",
        value: function getAsArray() {
            var loop = this;
            var nodes = [];
            var node = loop.head;
            do {
                nodes.push(node.item);
                node = node.next;
            } while (node !== loop.head);
            return nodes;
        }
        /**
         *
         */

    }, {
        key: "forEach",
        value: function forEach(f) {
            var loop = this;
            var node = loop.head;
            do {
                f(node);
                node = node.next;
            } while (node !== loop.head);
        }
        /**
         * Returns the item at the specified index position.
         * @note This is slow ( O(n) ); use in debugging code only.
         */

    }, {
        key: "getByIndx",
        value: function getByIndx(n) {
            var loop = this;
            return list_node_1.default.advanceNSteps(loop.head, n);
        }
    }]);

    return LinkedLoop;
}();

exports.default = LinkedLoop;

},{"./list-node":17,"flo-ll-rb-tree":42}],17:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of a linked loop vertex (i.e. node) having various edges, two
 * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
 * @param loop - The linked loop this node belongs to.
 * @param item - The actual item stored at a node.
 * @param prev - The previous item.
 * @param next - The next item.
 */

var ListNode = function () {
    function ListNode(loop, item, prev, next) {
        _classCallCheck(this, ListNode);

        // TODO - we should really subclass linked-loop and/or list-node as the 
        // below only applies to the segregated shape pieces
        this.prevOnCircle = undefined;
        this.nextOnCircle = undefined;
        this.loop = loop;
        this.item = item;
        this.prev = prev;
        this.next = next;
    }
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */


    _createClass(ListNode, null, [{
        key: "advanceNSteps",
        value: function advanceNSteps(node, n) {
            for (var i = 0; i < n; i++) {
                node = node.next;
            }
            return node;
        }
    }]);

    return ListNode;
}();

exports.default = ListNode;

},{}],18:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MAT_CONSTANTS = {
    // TODO - should be dynamic and of order of shape dimensions.
    maxOsculatingCircleRadius: 800,
    pointType: {
        'standard': 0,
        'sharp': 1,
        'dull': 2,
        'extreme': 3
    }
};
exports.default = MAT_CONSTANTS;

},{}],19:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
/**
 * Class representing a single contact point of a MatCircle.
 *
 * @param pointOnShape
 * @param {MatCircle} matCircle
 */

var ContactPoint = function () {
    function ContactPoint(pointOnShape, matCircle) {
        _classCallCheck(this, ContactPoint);

        this.pointOnShape = pointOnShape;
        this.matCircle = matCircle;
        this.key = point_on_shape_1.default.toHumanString(pointOnShape); // TODO - remove
        // TODO - remove from cache?
        this[0] = pointOnShape[0]; // Shortcut
        this[1] = pointOnShape[1]; // ...
    }

    _createClass(ContactPoint, null, [{
        key: "compare",
        value: function compare(a, b) {
            return point_on_shape_1.default.compare(a.pointOnShape, b.pointOnShape);
        }
    }, {
        key: "equal",
        value: function equal(a, b) {
            return flo_vector2d_1.default.equal(a.pointOnShape.p, b.pointOnShape.p);
        }
    }]);

    return ContactPoint;
}();

exports.default = ContactPoint;

},{"../../geometry/classes/point-on-shape":9,"flo-vector2d":55}],20:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../../geometry/classes/point-on-shape");

var ThreeProngForDebugging = function ThreeProngForDebugging(threeProng, deltas, bestIndx, candidateThreeProngs) {
    _classCallCheck(this, ThreeProngForDebugging);

    this.threeProng = threeProng;
    this.deltas = deltas;
    this.bestIndx = bestIndx;
    this.candidateThreeProngs = candidateThreeProngs;
    this.deltasSimple = deltas.map(function (delta) {
        return [point_on_shape_1.default.toHumanString(delta[0].item.pointOnShape), point_on_shape_1.default.toHumanString(delta[1].item.pointOnShape)];
    });
};

exports.default = ThreeProngForDebugging;

},{"../../../geometry/classes/point-on-shape":9}],21:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var TwoProngForDebugging = function TwoProngForDebugging(pos, δ, y, z, x, circle, xs, failed, holeClosing) {
    _classCallCheck(this, TwoProngForDebugging);

    this.pos = pos;
    this.δ = δ;
    this.y = y;
    this.z = z;
    this.x = x;
    this.circle = circle;
    this.xs = xs;
    this.failed = failed;
    this.holeClosing = holeClosing;
};

exports.default = TwoProngForDebugging;

},{}],22:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var HoleClosing2Prong = function HoleClosing2Prong(k1, k2, cpNodeA2, cpNodeA1, cpNodeB1, cpNodeB2) {
    _classCallCheck(this, HoleClosing2Prong);

    this.k1 = k1;
    this.k2 = k2;
    this.cpNodeA2 = cpNodeA2;
    this.cpNodeA1 = cpNodeA1;
    this.cpNodeB1 = cpNodeB1;
    this.cpNodeB2 = cpNodeB2;
};

exports.default = HoleClosing2Prong;

},{}],23:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
 * i.e. a representative data point of the MAT.
 *
 * @constructor
 * @param {Circle} circle
 * @param {ListNode[]} cpNodes - The contact points of this circle on the shape.
 * @note Do not do 'new MatCircle', rather use 'MatCircle.create'.
 */

var MatCircle = function () {
    function MatCircle(circle, cpNodes) {
        _classCallCheck(this, MatCircle);

        this.circle = circle;
        this.cpNodes = cpNodes;
        this.visited = 0; // TODO - does not belong inside the class
    }
    /**
     * MatCircle creator.
     * @param {Circle} circle
     * @param {ListNode[]} cpNodes An array of 'orphaned'
     *        (i.e. without belonging to a MatCircle) contact points.
     * Notes: Due to the mutual dependency between the matCircle and
     * contactPoints fields, a normal constructor can not instantiate a
     * MatCircle in one step - hence this creator.
     */


    _createClass(MatCircle, null, [{
        key: "create",
        value: function create(circle, cpNodes) {
            var matCircle = new MatCircle(circle, undefined);
            for (var i = 0; i < cpNodes.length; i++) {
                cpNodes[i].item.matCircle = matCircle;
            }
            matCircle.cpNodes = cpNodes;
            return matCircle;
        }
    }]);

    return MatCircle;
}();

exports.default = MatCircle;

},{}],24:[function(_dereq_,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of a node in the MAT structure.
 * @param matCircle
 * @param branches
 */

var MatNode = function () {
    function MatNode(matCircle, branches) {
        _classCallCheck(this, MatNode);

        this.matCircle = matCircle;
        this.branches = branches;
    }

    _createClass(MatNode, null, [{
        key: "copy",
        value: function copy(node) {
            return f(node);
            function f(matNode, priorNode, newPriorNode) {
                var branches = [];
                var newNode = new MatNode(matNode.matCircle, branches);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = matNode.branches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _node = _step.value;

                        if (_node === priorNode) {
                            // Don't go back in tracks.
                            branches.push(newPriorNode);
                            continue;
                        }
                        branches.push(f(_node, matNode, newNode));
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

                return newNode;
            }
        }
    }]);

    return MatNode;
}();

exports.default = MatNode;

},{}],25:[function(_dereq_,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var traverse_1 = _dereq_("../../mat/functions/traverse");
/**
 * The Medial Axis Transform. It is defined recursively as a rooted tree with
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * @param node - A handle on the MAT tree structure.
 */

var MatTree = function MatTree(node) {
    _classCallCheck(this, MatTree);

    this.startNode = node;
};

MatTree.traverse = traverse_1.default;
exports.default = MatTree;

},{"../../mat/functions/traverse":37}],26:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var contact_point_1 = _dereq_("../../mat/classes/contact-point");
var mat_circle_1 = _dereq_("../../mat/classes/mat-circle");
var shape_1 = _dereq_("../../geometry/classes/shape");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var hole_closing_2_prong_1 = _dereq_("../classes/hole-closing-2-prong");
/**
 * Adds a 2-prong contact circle to the shape.
 *
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param pos1 - First point on shape
 * @param pos2 - Second point on shape
 * @param delta The boundary piece within which the new contact point should be
 * placed
 */
function add2Prong(shape, circle, pos1, pos2, holeClosing) {
    if (holeClosing) {
        pos1.order2 = 1;
        pos2.order2 = -1;
    }
    var cp2 = new contact_point_1.default(pos2, undefined);
    var delta2 = shape_1.default.getNeighbouringPoints(shape, pos2);
    var cmp3 = delta2[0] === undefined ? undefined : contact_point_1.default.compare(delta2[0].item, cp2);
    var cmp4 = delta2[1] === undefined ? undefined : contact_point_1.default.compare(cp2, delta2[1].item);
    if (typeof window !== 'undefined' && window._debug_) {
        if (cmp3 > 0 || cmp4 > 0) {
            //console.log(`2-PRONG 2 Order is wrong 2: ${cmp3}, ${cmp4}`);
        }
    }
    if (cmp3 === 0 || cmp4 === 0) {
        // Should not really be possible with hole-closing 2-prongs.
        return undefined;
    }
    var k2 = pos2.bezierNode.loop.indx;
    var newCp2Node = shape.contactPointsPerLoop[k2].insert(cp2, delta2[0]);
    var cp1 = new contact_point_1.default(pos1, undefined);
    var delta1 = shape_1.default.getNeighbouringPoints(shape, pos1);
    var cmp1 = delta1[0] === undefined ? undefined : contact_point_1.default.compare(delta1[0].item, cp1);
    var cmp2 = delta1[1] === undefined ? undefined : contact_point_1.default.compare(cp1, delta1[1].item);
    if (typeof window !== 'undefined' && window._debug_) {
        if (cmp1 > 0 || cmp2 > 0) {
            //console.log(`2-PRONG 1 Order is wrong 2: ${cmp1}, ${cmp2}`);
        }
    }
    // If they are so close together, don't add it - there's already 1
    if (cmp1 === 0 || cmp2 === 0) {
        // Should not be possible with hole-closing 2-prongs.
        shape.contactPointsPerLoop[k2].remove(newCp2Node);
        return undefined;
    }
    var k1 = pos1.bezierNode.loop.indx;
    var newCp1Node = shape.contactPointsPerLoop[k1].insert(cp1, delta1[0]);
    var matCircle = mat_circle_1.default.create(circle, [newCp1Node, newCp2Node]);
    newCp1Node.prevOnCircle = newCp2Node;
    newCp1Node.nextOnCircle = newCp2Node;
    newCp2Node.prevOnCircle = newCp1Node;
    newCp2Node.nextOnCircle = newCp1Node;
    if (holeClosing) {
        // If hole-closing then we duplicate the 2 contact points
        // so that we can 'split the loop'.
        var posA1 = pos2;
        var posB2 = point_on_shape_1.default.copy(posA1);
        posB2.order2 = 1;
        var cpB2 = new contact_point_1.default(posB2, undefined);
        var newCpB2Node = shape.contactPointsPerLoop[k2].insert(cpB2, newCp2Node);
        var posA2 = pos1;
        var posB1 = point_on_shape_1.default.copy(posA2);
        posB1.order2 = -1;
        var cpB1 = new contact_point_1.default(posB1, undefined);
        var newCpB1Node = shape.contactPointsPerLoop[k1].insert(cpB1, newCp1Node.prev);
        mat_circle_1.default.create(circle, [newCpB1Node, newCpB2Node]);
        newCpB1Node.prevOnCircle = newCpB2Node;
        newCpB1Node.nextOnCircle = newCpB2Node;
        newCpB2Node.prevOnCircle = newCpB1Node;
        newCpB2Node.nextOnCircle = newCpB1Node;
        newCp2Node.next = newCp1Node;
        newCp1Node.prev = newCp2Node;
        newCpB1Node.next = newCpB2Node;
        newCpB2Node.prev = newCpB1Node;
        shape.holeClosers.push(new hole_closing_2_prong_1.default(k1, k2, newCp1Node, newCp2Node, newCpB1Node, newCpB2Node));
    }
    if (typeof window !== 'undefined' && window._debug_) {
        // Add points so when we alt-click shape point is logged.
        var _debug_ = window._debug_;
        prepForDebug(newCp1Node, _debug_);
        prepForDebug(newCp2Node, _debug_);
    }
    return;
}
function prepForDebug(contactPoint, _debug_) {
    //---- Prepare debug info for the ContactPoint
    var cpKey = point_on_shape_1.default.makeSimpleKey(contactPoint.item.pointOnShape.p);
    var cpHash = _debug_.generated.cpHash;
    var cpArr = _debug_.generated.cpArr;
    if (!cpHash[cpKey]) {
        cpHash[cpKey] = {
            cp: contactPoint,
            arrIndx: cpArr.length
        };
        cpArr.push(contactPoint);
    }
    var cpHashDebugObj = cpHash[cpKey];
    cpHashDebugObj.visitedPointsArr = cpHashDebugObj.visitedPointsArr || [];
}
exports.default = add2Prong;

},{"../../geometry/classes/point-on-shape":9,"../../geometry/classes/shape":10,"../../mat/classes/contact-point":19,"../../mat/classes/mat-circle":23,"../classes/hole-closing-2-prong":22}],27:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat_circle_1 = _dereq_("../../mat/classes/mat-circle");
var contact_point_1 = _dereq_("../../mat/classes/contact-point");
/**
 * Adds a 3-prong MAT circle according to the 3 given
 * (previously calculated) points on the shape.
 *
 * @param shape
 * @param circle
 * @param [p1,p2,p3]
 * @param deltas
 * @returns {MatCircle} matCircle
 */
function add3Prong(shape, threeProng) {
    var circle = threeProng.circle,
        ps = threeProng.ps,
        delta3s = threeProng.delta3s;

    var cps = [0, 1, 2].map(function (i) {
        return new contact_point_1.default(ps[i], undefined);
    });
    if (typeof window !== 'undefined' && window._debug_) {
        // Keep for possible future debugging.
        /*
        for (let i=0; i<3; i++) {
            let cmpBef = ContactPoint.compare(delta3s[i][0].item, cps[i]);
            let cmpAft = ContactPoint.compare(delta3s[i][1].item, cps[i]);
              let len = FloMat._debug_.generated.threeProngs.length-1; // Used by debug functions to reference a particular three-prong
            if (cmpBef > 0) {
                console.log(`3-PRONG Order is wrong (bef) : i: ${i} - cmp: ${cmpBef} - n: ${len}`);
                console.log(threeProng);
            }
            if (cmpAft < 0) {
                console.log(`3-PRONG Order is wrong (aft) : i: ${i} - cmp: ${cmpAft} - n: ${len}`);
                console.log(threeProng);
            }
        }
        */
    }
    var cpNodes = [];
    for (var i = 0; i < 3; i++) {
        var pos = ps[i];
        var k = pos.bezierNode.loop.indx;
        cpNodes.push(shape.contactPointsPerLoop[k].insert(cps[i], delta3s[i][0]));
    }
    var matCircle = mat_circle_1.default.create(circle, cpNodes);
    var idxsPrev = [2, 0, 1];
    var idxsNext = [1, 2, 0];
    for (var _i = 0; _i < 3; _i++) {
        cpNodes[_i].prevOnCircle = cpNodes[idxsPrev[_i]];
        cpNodes[_i].nextOnCircle = cpNodes[idxsNext[_i]];
    }
    return matCircle;
}
exports.default = add3Prong;

},{"../../mat/classes/contact-point":19,"../../mat/classes/mat-circle":23}],28:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var find_3_prong_1 = _dereq_("./find-3-prong");
var add_3_prong_1 = _dereq_("./add-3-prong");
var mat_node_1 = _dereq_("../../mat/classes/mat-node");
var contact_point_1 = _dereq_("../../mat/classes/contact-point");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
/**
 * Recursively builds the MAT tree.
 *
 * @param {ListNode} cpNodeStart
 * @returns {MatNode}
 */
function buildMat(shape, cpNodeStart, fromNode, fromCpNode, isRetry) {
    var visitedPoints = void 0;
    do {
        visitedPoints = traverseShape(cpNodeStart);
        if (typeof window !== 'undefined' && window._debug_) {
            // Oops - fix
            // cpHashDebugObj.visitedPointsArr.push(visitedPoints);
        }
        if (visitedPoints.length > 2) {
            findAndAdd3Prong(shape, visitedPoints);
        }
    } while (visitedPoints.length > 2);
    if (cpNodeStart.item.matCircle.cpNodes.length === 1) /*&&
                                                         (fromCpNode.nextOnCircle === cpNodeStart.next)*/{
            //console.log('terminal 1-prong');
            var matNode = createMatNode(cpNodeStart, fromNode ? [fromNode] : []);
            return matNode;
        }
    if (visitedPoints.length === 1) {
        // Terminating 2-prong - should mostly have been eliminated
        // by osculating circles and points, but can still occur
        // due to floating point incaccuracies.
        // console.log('terminal 2-prong');
        var _matNode = createMatNode(cpNodeStart, fromNode ? [fromNode] : []);
        return _matNode;
    } else if (visitedPoints.length === 2) {
        var branches = fromNode ? [fromNode] : [];
        var _matNode2 = createMatNode(cpNodeStart, branches);
        var cpBranches = cpNodeStart;
        var i = 0;
        while (cpBranches.nextOnCircle !== cpNodeStart && cpBranches.next !== cpBranches.nextOnCircle) {
            i++;
            var cpNext = void 0;
            if (i === 1) {
                cpNext = cpBranches.next;
                cpNodeStart.item.matCircle.visited++;
            } else if (i === 2) {
                // TODO - instead of the commented line below working
                // perfectly, we must call the few lines below it and
                // then later call fixMat. WHY!!!??? does the line
                // below not simply work?
                // cpNext = cpBranches.next;
                cpNext = cpBranches;
                if (cpBranches.item.matCircle.visited !== 1) {
                    break;
                }
            }
            var bm = buildMat(shape, cpNext, _matNode2, cpBranches, false);
            branches.push(bm);
            cpBranches = cpBranches.nextOnCircle;
        }
        return _matNode2;
    }
}
function createMatNode(cp, branches) {
    var matNode = new mat_node_1.default(cp.item.matCircle, branches);
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_ = window._debug_;
        prepDebugHashes(cp, matNode, _debug_);
    }
    return matNode;
}
function traverseShape(cpNodeStart) {
    var visitedPoints = void 0;
    var cpNode = cpNodeStart;
    visitedPoints = [];
    do {
        //if ()
        visitedPoints.push(cpNode);
        var next = cpNode.next;
        cpNode = next.prevOnCircle; // Take last exit
    } while (cpNode !== cpNodeStart);
    return visitedPoints;
}
/**
 * Finds and add a 3-prong MAT circle to the given shape. Modifies shape.
 *
 * @param shape
 * @param visitedPoints
 */
function findAndAdd3Prong(shape, visitedPoints) {
    /*
     * visitedPoints.sort(function(a,b) { return
     * PointOnShape.compare(a.item.pointOnShape,b.item.pointOnShape); });
     */
    var deltas = [];
    for (var i = 0; i < visitedPoints.length; i++) {
        var visitedPoint = visitedPoints[i];
        deltas.push([visitedPoint, visitedPoint.next]);
    }
    // Check if any deltas are continuous (they should rather be
    // disjoint). It should be quite safe to consider points 'equal'
    // if they are within a certain threshold of each other, but is it
    // necessary? Maybe not.
    var continuous = false;
    for (var _i = 0; _i < deltas.length; _i++) {
        var idxi = _i + 1;
        if (idxi === deltas.length) {
            idxi = 0;
        }
        var endP = deltas[_i][1].item;
        var startP = deltas[idxi][0].item;
        if (contact_point_1.default.equal(endP, startP)) {
            continuous = true;
            break;
        }
    }
    if (continuous) {
        // aaa
    }
    var threeProng = find_3_prong_1.default(shape, deltas);
    for (var _i2 = 0; _i2 < 3; _i2++) {
        point_on_shape_1.default.setPointOrder(shape, threeProng.circle, threeProng.ps[_i2]);
    }
    add_3_prong_1.default(shape, threeProng);
}
function prepDebugHashes(cpNodeStart, matNode, _debug_) {
    // ---- Prepare debug info for the MatCircle
    var circle = cpNodeStart.item.matCircle.circle;
    var key = point_on_shape_1.default.makeSimpleKey(circle.center);
    var nodeHash = _debug_.generated.nodeHash;
    nodeHash[key] = nodeHash[key] || {};
    nodeHash[key].matNode = matNode;
    // ---- Prepare debug info for the ContactPoint
    var cpKey = point_on_shape_1.default.makeSimpleKey(cpNodeStart.item.pointOnShape.p);
    var cpHash = _debug_.generated.cpHash;
    var cpArr = _debug_.generated.cpArr;
    if (!cpHash[cpKey]) {
        cpHash[cpKey] = {
            cp: cpNodeStart,
            arrIndx: cpArr.length
        };
        cpArr.push(cpNodeStart);
    }
    var cpHashDebugObj = cpHash[cpKey];
    cpHashDebugObj.visitedPointsArr = cpHashDebugObj.visitedPointsArr || [];
}
exports.default = buildMat;

},{"../../geometry/classes/point-on-shape":9,"../../mat/classes/contact-point":19,"../../mat/classes/mat-node":24,"./add-3-prong":27,"./find-3-prong":31}],29:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat_node_1 = _dereq_("../../mat/classes/mat-node");
var mat_tree_1 = _dereq_("../classes/mat-tree");
function copyMat(matTree) {
    return new mat_tree_1.default(mat_node_1.default.copy(matTree.startNode));
}
exports.default = copyMat;

},{"../../mat/classes/mat-node":24,"../classes/mat-tree":25}],30:[function(_dereq_,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var MAX_ITERATIONS = 50;
//TODO Change tolerances to take shape dimension into 
// account, e.g. shapeDim / 10000 for SEPERATION_TOLERANCE;
//CONST SEPERATION_TOLERANCE = 1e-3;
var SEPERATION_TOLERANCE = 1e-3;
var SQUARED_SEPERATION_TOLERANCE = SEPERATION_TOLERANCE * SEPERATION_TOLERANCE;
var _1PRONG_TOLERANCE = 1e-4;
var SQUARED_1PRONG_TOLERANCE = _1PRONG_TOLERANCE * _1PRONG_TOLERANCE;
//const ERROR_TOLERANCE = 1e-3;
var ERROR_TOLERANCE = SEPERATION_TOLERANCE / 10;
var SQUARED_ERROR_TOLERANCE = ERROR_TOLERANCE * ERROR_TOLERANCE;
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var circle_1 = _dereq_("../../geometry/classes/circle");
var geometry_1 = _dereq_("../../geometry/geometry");
var shape_1 = _dereq_("../../geometry/classes/shape");
var Point_on_shape_1 = _dereq_("../../geometry/classes/Point-on-shape");
var contact_point_1 = _dereq_("../../mat/classes/contact-point");
var mat_circle_1 = _dereq_("../../mat/classes/mat-circle");
var get_closest_boundary_point_to_point_1 = _dereq_("../../geometry/functions/get-closest-boundary-point-to-point");
var two_prong_for_debugging_1 = _dereq_("../classes/debug/two-prong-for-debugging");
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
    var failed = false;
    // The first point on the shape of the 2-prong.
    //let y = pos;
    var bezierNode = y.bezierNode;
    var t = y.t;
    var oCircle = Point_on_shape_1.default.getOsculatingCircle(y);
    var x = oCircle.center;
    /*
     * The shortest distance so far between the first contact point and
     * the circle center - we require this to get shorter on each
     * iteration as convergence occurs. If it does not, oscillation
     * of the algorithm has occured due to floating point inaccuracy
     * and the algorithm must terminate.
     */
    var radius = oCircle.radius;
    var shortestSquaredDistance = radius * radius;
    /* The boundary piece that should contain the other point of
     * the 2-prong circle. (Defined by start and end points).
     */
    var δ = void 0;
    var bezierPieces = void 0;
    var k = y.bezierNode.loop.indx;
    if (holeClosing) {
        bezierPieces = [];
        for (var k2 = 0; k2 < k; k2++) {
            var _bezierPieces;

            var pieces = shape_1.default.getBoundaryBeziers(shape, k2);
            (_bezierPieces = bezierPieces).push.apply(_bezierPieces, _toConsumableArray(pieces));
        }
    } else {
        // TODO - getNeighbouringPoints *can* be eliminated (as with 3-prongs)
        // by keeping track of boundary piece in which it is being searched 
        // - not sure if same can be done with hole-closing 2-prongs.
        var ps = shape_1.default.getNeighbouringPoints(shape, y);
        δ = [ps[0], ps[0]];
        if (!ps[0]) {
            bezierPieces = shape_1.default.getBoundaryBeziers(shape, k);
        } else {
            bezierPieces = shape_1.default.getBoundaryPieceBeziers(δ);
        }
    }
    var xs = []; // Trace the convergence.
    var z = void 0;
    var squaredError = void 0;
    var i = 0;
    do {
        i++;
        var r = flo_vector2d_1.default.squaredDistanceBetween(x, y.p);
        bezierPieces = cullBezierPieces(bezierPieces, x, r);
        z = get_closest_boundary_point_to_point_1.default(bezierPieces, x, bezierNode, t);
        if (typeof window !== 'undefined' && window._debug_) {
            xs.push({ x: x, y: y, z: z, t: t });
        }
        var d = flo_vector2d_1.default.squaredDistanceBetween(x, z.p);
        if (i === 1 && d + SQUARED_1PRONG_TOLERANCE >= r) {
            // It is a 1-prong.
            add1Prong(shape, y);
            return undefined;
        }
        var squaredChordDistance = flo_vector2d_1.default.squaredDistanceBetween(y.p, z.p);
        if (squaredChordDistance <= SQUARED_SEPERATION_TOLERANCE) {
            failed = true;
            break;
        }
        /*
         * Find the point on the line connecting y with x that is
         * equidistant from y and z. This will be our next x.
         */
        var nextX = findEquidistantPointOnLine(x, y.p, z.p);
        squaredError = flo_vector2d_1.default.squaredDistanceBetween(x, nextX);
        /*
         * Prevent oscillation of calculated x (due to floating point
         * inaccuracies). See comment above decleration of
         * shortestSquaredDistance.
         */
        var squaredDistance = flo_vector2d_1.default.squaredDistanceBetween(y.p, nextX);
        if (squaredDistance < shortestSquaredDistance) {
            shortestSquaredDistance = squaredDistance;
        } else {
            //failed = true;
            //break;
        }
        x = nextX;
    } while (squaredError > SQUARED_ERROR_TOLERANCE && i < MAX_ITERATIONS);
    if (typeof window !== 'undefined' && window._debug_) {
        xs.push({ x: x, y: y, z: z, t: t });
    }
    if (i === MAX_ITERATIONS) {
        // This is simply a case of convergence being too slow. The
        // gecko, for example, takes a max of 21 iterations.
        //console.log('max')
        failed = true;
    }
    var circle = new circle_1.default(x, flo_vector2d_1.default.distanceBetween(x, z.p));
    Point_on_shape_1.default.setPointOrder(shape, circle, y);
    Point_on_shape_1.default.setPointOrder(shape, circle, z);
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_ = window._debug_;
        recordForDebugging(failed, y, circle, y.p, z.p, δ, xs, holeClosing, _debug_);
    }
    if (failed) {
        //console.log('failed');
        return undefined;
    }
    return { circle: circle, z: z };
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
            var _debug_ = window._debug_;
            // TODO - why would it be NaN in some cases?
            var oCircle = Point_on_shape_1.default.getOsculatingCircle(pos);
            if (!Number.isNaN(oCircle.center[0])) {
                _debug_.generated.oneProngsAtDullCorner.push({ pos: pos });
            }
        }
        return;
    }
    var cp = new contact_point_1.default(pos, undefined);
    var delta = shape_1.default.getNeighbouringPoints(shape, pos);
    //let cmp1 = ContactPoint.compare(delta[0].item, cp);
    //let cmp2 = ContactPoint.compare(cp, delta[1].item);
    var cmp1 = delta[0] === undefined ? undefined : contact_point_1.default.compare(delta[0].item, cp);
    var cmp2 = delta[1] === undefined ? undefined : contact_point_1.default.compare(cp, delta[1].item);
    if (typeof window !== 'undefined' && window._debug_) {
        if (cmp1 > 0 || cmp2 > 0) {
            //console.log(`1-PRONG Order is wrong: ${cmp1}, ${cmp2}`);
        }
    }
    // If they are so close together, don't add it - there's already 1
    if (cmp1 === 0 || cmp2 === 0) {
        return;
    }
    var k = pos.bezierNode.loop.indx;
    var newCpNode = shape.contactPointsPerLoop[k].insert(cp, delta[0]);
    var matCircle = mat_circle_1.default.create(
    //pos.osculatingCircle,
    Point_on_shape_1.default.getOsculatingCircle(pos), [newCpNode]);
    newCpNode.prevOnCircle = newCpNode; // Trivial loop
    newCpNode.nextOnCircle = newCpNode; // ...
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_2 = window._debug_;
        _debug_2.generated.oneProngs.push({ pos: pos });
    }
    return;
}
function recordForDebugging(failed, pos, circle, y, z, δ, xs, holeClosing, _debug_) {
    var twoProngForDebugging = new two_prong_for_debugging_1.default(pos, δ, y, z, circle.center, circle, xs, failed, holeClosing);
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
    var CULL_THRESHOLD = 5;
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

            var ps = bezierPiece.bezierNode.item.bezier3;
            var rect = flo_bezier3_1.default.getBoundingBox(ps);
            var bd = geometry_1.default.getClosestSquareDistanceToRect(rect, p);
            if (bd <= rSquared + 0.1 /* Make this in relation to shape extents! <- No! Do proper error analysis */) {
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
exports.default = find2Prong;

},{"../../geometry/classes/Point-on-shape":3,"../../geometry/classes/circle":6,"../../geometry/classes/shape":10,"../../geometry/functions/get-closest-boundary-point-to-point":13,"../../geometry/geometry":15,"../../mat-constants":18,"../../mat/classes/contact-point":19,"../../mat/classes/mat-circle":23,"../classes/debug/two-prong-for-debugging":21,"flo-bezier3":39,"flo-vector2d":55}],31:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var circle_1 = _dereq_("../../geometry/classes/circle");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var shape_1 = _dereq_("../../geometry/classes/shape");
var get_closest_boundary_point_to_point_1 = _dereq_("../../geometry/functions/get-closest-boundary-point-to-point");
var three_prong_for_debugging_1 = _dereq_("../classes/debug/three-prong-for-debugging");
/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param shape
 * @param δs
 *
 */
function find3Prong(shape, δs) {
    var bezierPiecess = δs.map(function (δ) {
        return shape_1.default.getBoundaryPieceBeziers(δ);
    });
    var candidateThreeProngs = [];
    // The best candidate amongst the different 'permutations' of the given δs.
    var threeProng = void 0;
    var bestIndx = undefined;
    var smallestError = Number.POSITIVE_INFINITY;
    for (var i = 1; i < δs.length - 1; i++) {
        var _find3ProngForDelta3s = find3ProngForDelta3s(shape, δs, i, bezierPiecess),
            circle = _find3ProngForDelta3s.circle,
            ps = _find3ProngForDelta3s.ps,
            error = _find3ProngForDelta3s.error;

        if (typeof window !== 'undefined' && window._debug_) {
            var _debug_ = window._debug_;
            candidateThreeProngs.push({ circle: circle, ps: ps });
        }
        if (error < smallestError) {
            smallestError = error;
            bestIndx = i - 1;
            threeProng = { circle: circle, ps: ps, delta3s: undefined };
        }
    }
    //-------------------------------------
    //---- Add some additional properties
    //-------------------------------------
    var delta3s = [δs[0], δs[bestIndx + 1], δs[δs.length - 1]];
    threeProng.delta3s = delta3s;
    //-------------------------------------
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_2 = window._debug_;
        var threeProngForDebugging = new three_prong_for_debugging_1.default(threeProng, δs, bestIndx, candidateThreeProngs);
        _debug_2.generated.threeProngs.push(threeProngForDebugging);
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
    var TOLERANCE = 1e-7;
    var delta3s = [deltas[0], deltas[idx], deltas[deltas.length - 1]];
    var bezierPiece3s = [bezierPiecess[0], bezierPiecess[idx], bezierPiecess[deltas.length - 1]];
    var ps = void 0;
    var circumCenter = void 0;
    var ii = 0; // Safeguard
    var x = calcInitial3ProngPoint(shape, delta3s, bezierPiece3s);
    var tolerance = Number.POSITIVE_INFINITY;
    // TODO 10 below is magic, fix or add somewhere as a constant
    while (tolerance > TOLERANCE && ii < 10) {
        ii++;
        ps = getClosestPoints(x, bezierPiece3s);
        circumCenter = flo_vector2d_1.default.circumCenter(ps.map(function (x) {
            return x.p;
        }));
        var vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter);
        var upds = calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        var V = flo_vector2d_1.default.len(vectorToZeroV);
        ps = upds.newPs;
        tolerance = Math.abs(V - upds.newV);
    }
    var radius = (flo_vector2d_1.default.distanceBetween(x, ps[0].p) + flo_vector2d_1.default.distanceBetween(x, ps[1].p) + flo_vector2d_1.default.distanceBetween(x, ps[2].p)) / 3;
    var circle = new circle_1.default(x, radius);
    //-----------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points -
    // they should be very close to tangent to the boundary piece 
    // tangents at those points (up to sign). Sharp corners are a
    // common special case.
    //-----------------------------------------------------------------
    var totalAngleError = 0;
    for (var i = 0; i < 3; i++) {
        var p = ps[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        var vv = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(p.p, x));
        var v1 = flo_vector2d_1.default.rotate90Degrees(vv);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        var key = point_on_shape_1.default.makeSimpleKey(p.p);
        var dullCorner = shape.dullCornerHash[key];
        if (dullCorner) {
            //if (FloMat._debug_ && FloMat._debug_.log) { console.log(dullCorner); }
            var tans = dullCorner.tans;
            var perps = tans.map(flo_vector2d_1.default.rotate90Degrees);
            if (typeof window !== 'undefined' && window._debug_) {
                var _debug_ = window._debug_;
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
            var angleError1Pre = flo_vector2d_1.default.cross(perps[0], vv);
            var angleError2Pre = flo_vector2d_1.default.cross(vv, perps[1]);
            var angleError1 = Math.asin(angleError1Pre);
            var angleError2 = Math.asin(angleError2Pre);
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
            var _ps = p.bezierNode.item.bezier3;
            var v2 = flo_vector2d_1.default.toUnitVector(flo_bezier3_1.default.tangent(_ps)(p.t));
            // Cross is more numerically stable than Vector.dot at angles
            // a multiple of Math.PI **and** is close to the actual angle
            // value and can thus just be added to cone method of looking
            // at tolerance.
            // Should be close to zero and is close to the actual angle.
            var cross = Math.abs(Math.asin(flo_vector2d_1.default.cross(v1, v2)));
            totalAngleError += cross;
        }
    }
    //if (FloMat._debug_ && FloMat._debug_.log) { console.log(totalAngleError); }
    //-----------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and 
    // the closest point to the 3-prong. It should be around 0. If not,
    // this is not a good candidate for the 3-prong.
    //-----------------------------------------------------------------
    var closestDs = [];
    for (var _i = 0; _i < bezierPiecess.length; _i++) {
        var _p = get_closest_boundary_point_to_point_1.default(bezierPiecess[_i], x, undefined, undefined // TODO - bug: we must provide a t value and the
        // parameter order of the last 2 parameters of this function
        // should be swapped. Consider the consequences of leaving this
        // bug unchecked.
        );
        closestDs.push(flo_vector2d_1.default.distanceBetween(_p.p, x));
    }
    var closestD = Math.min.apply(Math, closestDs);
    var radiusDelta = Math.abs(radius - closestD);
    //if (FloMat._debug_ && FloMat._debug_.log) { console.log(radiusDelta); }
    //if (FloMat._debug_ && FloMat._debug_.log) { console.log('---------------------'); }
    //-----------------------------------------------------------------
    // TODO Weights still need to be determined
    var W1 = 1;
    var W2 = 1;
    var error = W1 * radiusDelta + W2 * totalAngleError;
    return { ps: ps, circle: circle, error: error };
}
var calcVectorToZeroV_StraightToIt = flo_vector2d_1.default.fromTo;
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
    var V = flo_vector2d_1.default.len(vectorToZeroV);
    var nu = 1;
    var better = void 0;
    var newX = void 0;
    var newPs = void 0;
    var newV = void 0;
    var i = 0; // Safeguard
    do {
        var shift = flo_vector2d_1.default.scale(vectorToZeroV, nu);
        newX = flo_vector2d_1.default.translate(shift, x);
        newPs = getClosestPoints(newX, bezierPiece3s);
        // Point of zero V
        var newCircleCenter = flo_vector2d_1.default.circumCenter(newPs.map(function (x) {
            return x.p;
        }));
        var newVectorToZeroV = flo_vector2d_1.default.fromTo(newX, newCircleCenter);
        newV = flo_vector2d_1.default.len(newVectorToZeroV);
        better = newV < V;
        nu = nu / 2;
        i++;
    } while (!better && i < 3);
    return { newX: newX, newV: newV, newPs: newPs };
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
    var twoProngCircleCenter = flo_vector2d_1.default.mean([delta3s[0][0].item.pointOnShape.p, delta3s[2][1].item.pointOnShape.p]);
    var point1 = get_closest_boundary_point_to_point_1.default(bezierPiece3s[1], twoProngCircleCenter, undefined, // bezierNode
    undefined // t
    );
    var meanPoints = [delta3s[0][0].item.pointOnShape.p,
    //Vector.mean([delta3s[1][0].item, delta3s[1][1].item]),
    point1.p, delta3s[2][1].item.pointOnShape.p];
    var p = void 0;
    if (delta3s[0][0].item.pointOnShape.type === mat_constants_1.default.pointType.sharp) {
        // delta3s start and end at sharp corner. If delta3s start at a sharp 
        // corner it will end there also so no need to check for end point as 
        // well.
        p = flo_vector2d_1.default.mean([meanPoints[0], meanPoints[1]]);
    } else {
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
        var sames = whichNotSame(meanPoints);
        return flo_vector2d_1.default.mean([meanPoints[sames[0]], meanPoints[sames[1]]]);
    }
    return p;
}
function whichNotSame(ps) {
    if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
        return [0, 2];
    } else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
        return [0, 2];
    } else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
        return [1, 2];
    }
    ;
    return [];
}
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(function (bezierPieces) {
        var p = get_closest_boundary_point_to_point_1.default(bezierPieces, x, undefined, // bezierNode
        undefined // t
        );
        return p;
    });
}
exports.default = find3Prong;

},{"../../geometry/classes/circle":6,"../../geometry/classes/point-on-shape":9,"../../geometry/classes/shape":10,"../../geometry/functions/get-closest-boundary-point-to-point":13,"../../mat-constants":18,"../classes/debug/three-prong-for-debugging":20,"flo-bezier3":39,"flo-vector2d":55}],32:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var mat_tree_1 = _dereq_("../classes/mat-tree");
var circle_1 = _dereq_("../../geometry/classes/circle");
var Point_on_shape_1 = _dereq_("../../geometry/classes/Point-on-shape");
var add_2_prong_1 = _dereq_("./add-2-prong");
var find_2_prong_1 = _dereq_("./find-2-prong");
var build_mat_1 = _dereq_("./build-mat");
/**
 * Find the MAT from the given Shape.
 * @param shape
 */
function findMat(shape) {
    findAndAddHoleClosing2Prongs(shape);
    findAndAdd2ProngsOnAllPaths(shape);
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_ = window._debug_;
        _debug_.generated.timing.after2Prongs = performance.now();
    }
    //---- Connect the n-prong centers and add the 3-prongs.
    var contactPoints = shape.contactPointsPerLoop[0];
    var cpNode = contactPoints.head;
    do {
        if (cpNode.item.matCircle.cpNodes.length === 2 && !(cpNode.next.prevOnCircle === cpNode)) {
            break;
        }
        cpNode = cpNode.next;
    } while (cpNode !== contactPoints.head);
    var cptest = cpNode.prevOnCircle;
    var branchForth = build_mat_1.default(shape, cptest, undefined, undefined, false);
    var branchBack = build_mat_1.default(shape, cptest.prevOnCircle, undefined, undefined, false);
    branchForth.branches.push(branchBack.branches[0]);
    branchBack.branches[0].branches[0] = branchForth;
    var mat = new mat_tree_1.default(branchForth);
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_2 = window._debug_;
        _debug_2.generated.timing.after3Prongs = performance.now();
    }
    return fixMat(mat);
}
/**
 * Finds and adds two-prongs that removes any holes in the shape.
 * @param {Shape} shape
 * @returns {undefined}
 */
function findAndAddHoleClosing2Prongs(shape) {
    var extremes = shape.extremes;
    for (var k = 1; k < extremes.length; k++) {
        var extreme = extremes[k];
        var r = mat_constants_1.default.maxOsculatingCircleRadius;
        var p = [extreme.p[0], extreme.p[1] - r];
        var osculatingCircle = new circle_1.default(p, r);
        var posA2 = new Point_on_shape_1.default(extreme.bezierNode, extreme.t, mat_constants_1.default.pointType.extreme, 0, //order 
        0);
        // A normal traversal should give (cyclically) A1->A2->B1->B2
        var twoProngInfo = find_2_prong_1.default(shape, posA2, true);
        var circle = twoProngInfo.circle,
            z = twoProngInfo.z;

        var posA1 = z;
        var key = Point_on_shape_1.default.makeSimpleKey(posA2.p);
        if (shape.straightUpHash[key]) {
            // Skip these when doing normal 2-prong procedure.
            shape.skip2ProngHash[key] = posA2;
        }
        add_2_prong_1.default(shape, circle, posA2, posA1, true);
    }
}
/**
 * Add 2 prongs.
 *
 * See comments on the add2Prong function.
 */
function findAndAdd2ProngsOnAllPaths(shape) {
    var for2ProngsArray = shape.for2ProngsArray;
    for (var k = 0; k < for2ProngsArray.length; k++) {
        var for2Prongs = for2ProngsArray[k];
        findAndAdd2Prongs(shape, k, for2Prongs);
    }
}
function findAndAdd2Prongs(shape, k, for2Prongs) {
    var len = for2Prongs.length;
    //let index = indexInterlaced(len); // Keep for debuggin.
    var index = indexLinear(len);
    for (var i = 0; i < len; i++) {
        var posNode = for2Prongs[index[i]];
        var pos = posNode.item;
        var key = Point_on_shape_1.default.makeSimpleKey(pos.p);
        if (shape.skip2ProngHash[key]) {
            continue;
        }
        var twoProngInfo = find_2_prong_1.default(shape, pos, false);
        if (twoProngInfo) {
            var circle = twoProngInfo.circle,
                z = twoProngInfo.z;

            add_2_prong_1.default(shape, circle, pos, z, false);
        } else {
            // failed
        }
    }
    /*
     * Don't delete - keep for future debugging.
     * Check if point orders follow each other - they absolutely must.
     */
    /*
    if (typeof FloMat !== 'undefined' && FloMat._debug_) {
        let contactPoints = shape.contactPointsPerLoop[k];
        let cpNode = contactPoints.head;
        let first = true;
        let prev = undefined;
        do {
            if (first) {
                first = false;
                prev = cpNode.item;
                cpNode = cpNode.next;
                continue;
            }
        
            let cmp = ContactPoint.compare(prev, cpNode.item);
            if (cmp >= 0) {
                console.log(cmp);
            }
            
            prev = cpNode.item;
            cpNode = cpNode.next;
        } while (cpNode !== contactPoints.head);
    }
    */
}
/**
 * This is unfortunately currently required since I can't get the buildMat
 * recursive algorithm right on the first pass.
 * @param mat
 */
function fixMat(mat) {
    f(mat.startNode, undefined);
    function f(matNode, priorNode) {
        if (matNode.branches.length === 3 && matNode.branches[2].matCircle === matNode.matCircle) {
            var firstRight = matNode.branches[2];
            var secondRight = firstRight.branches[1];
            matNode.branches[2] = secondRight;
            secondRight.branches[0] = matNode;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = matNode.branches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var node = _step.value;

                if (node === priorNode) {
                    // Don't go back in tracks.
                    continue;
                }
                f(node, matNode);
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
    return mat;
}
/**
 * Creates a kind of interlaced index vector, e.g. TODO
 *
 * @param n
 * @returns {number[]}
 */
/*
function indexInterlaced(n) {
    
    let arr = [];
    helper(0, n, arr);
    
    return arr;
    
    function helper(start, end) {
        
        if (end === start) {
            return;
        }
        
        if ((end - start) === 1) {
            arr.push(start);
            return;
        }
        
        
        let halfway = start + Math.floor((end-start) / 2);
        
        arr.push(halfway);
        helper(start, halfway);
        helper(halfway+1, end);
    }
}
*/
function indexInterlaced(n) {
    var source = {};
    var arr = [];
    // l <=> the lowest power of 2 so that 2^l > n
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
/**
 * Simple linear array indexing.
 * @param n
 * @returns {number[]}
 */
function indexLinear(n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}
exports.default = findMat;

},{"../../geometry/classes/Point-on-shape":3,"../../geometry/classes/circle":6,"../../mat-constants":18,"../classes/mat-tree":25,"./add-2-prong":26,"./build-mat":28,"./find-2-prong":30}],33:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var traverse_1 = _dereq_("./traverse");
/**
 * Returns all the calculated MAT nodes as an array.
 */
function getNodesAsArray(mat) {
    var nodes = [];
    traverse_1.default(mat, function (node) {
        nodes.push(node);
    });
    return nodes;
}
exports.default = getNodesAsArray;

},{"./traverse":37}],34:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var traverse_1 = _dereq_("./traverse");
function getNodesAsHash(mat) {
    var nodes = {};
    traverse_1.default(mat, function (node) {
        var key = point_on_shape_1.default.makeSimpleKey(node.matCircle.circle.center);
        nodes[key] = node;
    });
    return nodes;
}
exports.default = getNodesAsHash;

},{"../../geometry/classes/point-on-shape":9,"./traverse":37}],35:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
var mat_constants_1 = _dereq_("../../mat-constants");
var geometry_1 = _dereq_("../../geometry/geometry");
var flo_bezier3_1 = _dereq_("flo-bezier3");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var mat_tree_1 = _dereq_("../classes/mat-tree");
/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers.
 */
function smoothen(mat) {
    /**
     * Get the linked contact points. TODO This information to be
     * stored in the MatCircle in the future then there is no need
     * to actually search for it!
     */
    function getLinkedCps(prevCpNodes, currCpNodes) {
        for (var i = 0; i < prevCpNodes.length; i++) {
            var prevCpNode = prevCpNodes[i];
            for (var j = 0; j < currCpNodes.length; j++) {
                var currCpNode = currCpNodes[j];
                if (prevCpNode.next === currCpNode) {
                    return [prevCpNode, currCpNode];
                }
            }
        }
    }
    var lines = [];
    var quads = [];
    var cubes = [];
    mat_tree_1.default.traverse(mat, function (currNode, prevNode) {
        if (!prevNode) {
            return;
        }
        var prevMatCircle = prevNode.matCircle;
        var prevCc = prevMatCircle.circle.center;
        var prevCpNodes = prevMatCircle.cpNodes;
        var currMatCircle = currNode.matCircle;
        var currCc = currMatCircle.circle.center;
        var currCpNodes = currMatCircle.cpNodes;

        var _getLinkedCps = getLinkedCps(prevCpNodes, currCpNodes),
            _getLinkedCps2 = _slicedToArray(_getLinkedCps, 2),
            prevCpNode = _getLinkedCps2[0],
            currCpNode = _getLinkedCps2[1];

        var prevL = getDirectionToNextMatCircle(prevCpNode, prevCc, true);
        var currL = getDirectionToNextMatCircle(currCpNode, currCc, false);
        function getDirectionToNextMatCircle(cpNode, circleCenter, isPrev) {
            var cp1 = cpNode.item;
            var cp2 = isPrev ? cpNode.nextOnCircle.item : cpNode.prevOnCircle.item;
            var vDir = void 0;
            if (cp1 !== cp2) {
                // Not a 1-prong.
                var spanner = flo_vector2d_1.default.fromTo(cp1.pointOnShape.p, cp2.pointOnShape.p);
                vDir = flo_vector2d_1.default.rotate90Degrees(spanner);
            } else {
                if (cp1.pointOnShape.type === mat_constants_1.default.pointType.sharp) {
                    var bezierNode1 = void 0;
                    var bezierNode2 = void 0;
                    if (cp1.pointOnShape.t === 0) {
                        bezierNode1 = cp1.pointOnShape.bezierNode;
                        bezierNode2 = cp1.pointOnShape.bezierNode.prev;
                    } else if (cp1.pointOnShape.t === 1) {
                        bezierNode1 = cp1.pointOnShape.bezierNode.next;
                        bezierNode2 = cp1.pointOnShape.bezierNode;
                    }
                    var tan1 = flo_bezier3_1.default.tangent(bezierNode1.item.bezier3)(0);
                    var tan2 = flo_vector2d_1.default.reverse(flo_bezier3_1.default.tangent(bezierNode2.item.bezier3)(1));
                    var x = flo_vector2d_1.default.dot(tan1, tan2);
                    // Recall the identities sin(acos(x)) = sqrt(1-x^2),
                    // etc. Also recall the half angle formulas. Then 
                    // the rotation matrix, R, can be calculated.
                    var cosθ = Math.sqrt((1 + x) / 2);
                    var sinθ = Math.sqrt((1 - x) / 2);
                    vDir = flo_vector2d_1.default.rotate(sinθ, cosθ, tan2);
                } else {
                    vDir = flo_vector2d_1.default.fromTo(cp1.pointOnShape.p, circleCenter);
                }
            }
            var v = flo_vector2d_1.default.translate(flo_vector2d_1.default.toLength(vDir, 1), circleCenter);
            var l = [circleCenter, v];
            return l;
        }
        var mid = geometry_1.default.lineLineIntersection(prevL, currL);
        var twisted = void 0;
        if (mid) {
            var a = flo_vector2d_1.default.fromTo(prevCc, mid);
            var b = flo_vector2d_1.default.fromTo(currCc, mid);
            var c = flo_vector2d_1.default.fromTo(prevCc, currCc);
            var dot1 = flo_vector2d_1.default.dot(a, c);
            var dot2 = flo_vector2d_1.default.dot(b, c);
            twisted = dot1 < 0 || dot2 > 0;
        }
        if (!mid) {
            lines.push([prevCc, currCc]);
        } else if (twisted) {
            var lp1 = flo_vector2d_1.default.mean([prevCc, currCc]);
            var vv1 = flo_vector2d_1.default.fromTo(prevCc, currCc);
            var vvv1 = flo_vector2d_1.default.rotate90Degrees(vv1);
            var lpp1 = flo_vector2d_1.default.translate(vvv1, lp1);
            var l = [lp1, lpp1];
            var mid1 = geometry_1.default.lineLineIntersection(prevL, l);
            var mid2 = geometry_1.default.lineLineIntersection(currL, l);
            cubes.push([prevCc, mid1, mid2, currCc]);
        } else {
            //console.log(prevCc, mid, currCc);
            quads.push([prevCc, mid, currCc]);
        }
    });
    return {
        lines: lines,
        quads: quads,
        cubes: cubes
    };
}
exports.default = smoothen;

},{"../../geometry/geometry":15,"../../mat-constants":18,"../classes/mat-tree":25,"flo-bezier3":39,"flo-vector2d":55}],36:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = _dereq_("../../geometry/classes/circle");
var copy_mat_1 = _dereq_("./copy-mat");
var get_nodes_as_hash_1 = _dereq_("./get-nodes-as-hash");
var point_on_shape_1 = _dereq_("../../geometry/classes/point-on-shape");
var mat_tree_1 = _dereq_("../classes/mat-tree");
// TODO - fix highly convoluted typescript typings by modifiying code so that 
// a tree node (i.e. TTree type) does not use type union
var width = 1620; // TODO change to actual shape coordinates
var height = 1560; // ...
/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 *
 * @param mat_ - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 * @returns {MatTree}
 */
function toScaleAxis(mat_, s) {
    // TODO
    // This algorithm might be made somewhat faster by building tree to a depth 
    // where there is say less than 4 other circles and then only split the 
    // branch once this threshold has been exceeded.
    // 
    // Also, when searching, search only in relevant branches even when circle 
    // overlaps more than one group.
    var mat = copy_mat_1.default(mat_);
    // Start with the biggest circle (since it is the most likely to eclipse 
    // other circles), multiply its radius by s and see which circles are fully 
    // contained in it and trim it away in the MAT tree.
    var nodeHash = get_nodes_as_hash_1.default(mat);
    var biggest = -Number.POSITIVE_INFINITY;
    var biggestNode = void 0;
    for (var key in nodeHash) {
        var node = nodeHash[key];
        var r = node.matCircle.circle.radius;
        if (r > biggest) {
            biggestNode = node;
            biggest = r;
        }
    }
    var tree = createSpacialTree(s, nodeHash);
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_ = window._debug_;
        /*
        if (FloMat._debug_.shouldDrawSATTree) {
            FloMat._debug_.drawSATTree(tree);
        }
        */
        _debug_.generated.sat.tree = tree;
    }
    // Grab the MAT tree at its biggest node.
    var sat = new mat_tree_1.default(biggestNode);
    var cullHash = {};
    // Look at circles in roughly order of size for each tree branch,
    // e.g. circles in branch 5 are always larger than in branches 0
    // to 4.
    traverseSpacialTree(tree, cullem, { s: s, tree: tree, cullHash: cullHash });
    // We now walk the MAT tree and keep all non-culled nodes and any
    // nodes that have a non-culled node further down the line toward
    // the tree leaves.
    var cullNodes = [];
    cullIt(cullHash, cullNodes, sat.startNode);
    cullTheNodes(cullNodes);
    if (typeof window !== 'undefined' && window._debug_) {
        var _debug_2 = window._debug_;
        _debug_2.generated.timing.afterSat = performance.now();
    }
    return sat;
}
function addToTree(s, tree, coordinate, limits, node, key, depth) {
    // DEPTH_LIMIT can be anything from 1 to 16, but from 2 to 6 seem 
    // to be the fastest.
    var DEPTH_LIMIT = 6;
    var circle = node.matCircle.circle;

    var _calcGroups = calcGroups(s, coordinate, limits, circle),
        groups = _calcGroups.groups,
        newLimits = _calcGroups.newLimits;
    // Create new branch if it does not exist yet.


    if (groups.length === 1 && depth !== DEPTH_LIMIT) {
        var group = groups[0];
        if (!tree[group]) {
            tree[group] = {};
        }
        var _branch = tree[group];
        // Flip coordinates
        var newCoordinate = coordinate ? 0 : 1;
        addToTree(s, _branch, newCoordinate, newLimits, node, key, depth + 1);
        return;
    }
    if (!tree[5]) {
        tree[5] = new Map();
    }
    var branch = tree[5];
    branch.set(key, node);
}
function createSpacialTree(s, nodeHash) {
    var coordinate = 0;
    var limits = [[0, width], [0, height]];
    var tree = {};
    for (var key in nodeHash) {
        var node = nodeHash[key];
        addToTree(s, tree, coordinate, limits, node, key, 0);
    }
    return tree;
}
function cullem(node, key, extraParams) {
    var s = extraParams.s,
        tree = extraParams.tree,
        cullHash = extraParams.cullHash;

    if (node.matCircle.circle.radius === 0) {
        return;
    }
    if (cullHash[key]) {
        return;
    }
    var cullNodes = getCullNodes(s, tree, node);
    for (var _key in cullNodes) {
        if (!cullHash[_key]) {
            cullHash[_key] = node;
        }
    }
}
function traverseSpacialTree(tree, f, extraParams) {
    function helper(tree) {
        if (!tree) {
            return;
        }
        if (tree.size) {
            tree.forEach(function (node, key) {
                f(node, key, extraParams);
            });
            return; // Leaf reached 
        }
        if (tree[5]) {
            helper(tree[5]);
        }
        if (tree[0]) {
            helper(tree[0]);
        }
        if (tree[2]) {
            helper(tree[2]);
        }
        if (tree[4]) {
            helper(tree[4]);
        }
        if (tree[1]) {
            helper(tree[1]);
        }
        if (tree[3]) {
            helper(tree[3]);
        }
    }
    helper(tree);
}
function getCullNodes(s, tree, testNode) {
    var c1 = circle_1.default.scale(testNode.matCircle.circle, s);
    var cullNodes = {};
    var limits = [[0, width], [0, height]];
    var circle = testNode.matCircle.circle;
    helper(tree, 0, limits, 0);
    return cullNodes;
    function cullBranch5(tree) {
        var branch = tree[5];
        if (!branch) {
            return;
        }
        branch.forEach(function (node, key) {
            var c2 = circle_1.default.scale(node.matCircle.circle, s);
            if (circle_1.default.engulfsCircle(c1, c2)) {
                cullNodes[key] = node;
                branch.delete(key);
            }
        });
    }
    function helper(tree, coordinate, limits, depth) {
        if (limits === null) {
            // If we already reached a circle which spans multiple groups 
            // previously, then check all circles in the tree.
            cullBranch5(tree);
            for (var i = 0; i <= 4; i++) {
                var branch = tree[i];
                if (branch) {
                    helper(branch, 0, null, depth + 1);
                }
            }
            return;
        }

        var _calcGroups2 = calcGroups(s, coordinate, limits, circle),
            groups = _calcGroups2.groups,
            newLimits = _calcGroups2.newLimits;

        if (groups.length === 1) {
            cullBranch5(tree);
            var group = groups[0];
            var newCoordinate = coordinate ? 0 : 1;
            if (group === 1 || group === 3) {
                // One of the higher priority left/top or 
                // right/bottom half groups.
                var _branch2 = tree[group];
                if (_branch2) {
                    helper(_branch2, newCoordinate, newLimits, depth + 1);
                }
            } else {
                // One of the lower priority even 
                // groups (0,2 or 4).
                var branches = [];
                branches.push(tree[group]);
                if (group > 0) {
                    branches.push(tree[group - 1]);
                }
                if (group < 4) {
                    branches.push(tree[group + 1]);
                }
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = branches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _branch3 = _step.value;

                        if (_branch3) {
                            helper(_branch3, newCoordinate, newLimits, depth + 1);
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
            return;
        }
        cullBranch5(tree);
        // Circle spans multiple groups at this level of the 
        // tree. Check all circles in all branches.
        for (var _i = 0; _i <= 4; _i++) {
            var _branch4 = tree[_i];
            if (_branch4) {
                helper(_branch4, 0, null, depth + 1);
            }
        }
    }
}
/**
 * Modifies cullNodes by adding nodes that potentially need to be called.
 * Returns true if a node should NOT be culled, false otherwise.
 */
function cullIt(cullHash, cullNodes, satNode, priorNode) {
    var key = point_on_shape_1.default.makeSimpleKey(satNode.matCircle.circle.center);
    var anyNotCull = !cullHash[key];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = satNode.branches[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var node = _step2.value;

            if (node === priorNode) {
                continue;
            }
            if (cullIt(cullHash, cullNodes, node, satNode)) {
                anyNotCull = true;
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

    if (anyNotCull) {
        return true; // Don't cull me
    }
    cullNodes.push({ satNode: satNode, priorNode: priorNode });
    return false;
}
function cullTheNode(cullNode) {
    var satNode = cullNode.satNode,
        priorNode = cullNode.priorNode;

    var idx = priorNode.branches.indexOf(satNode);
    if (idx >= 0) {
        priorNode.branches.splice(idx, 1);
    }
}
function cullTheNodes(cullNodes) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = cullNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var node = _step3.value;

            cullTheNode(node);
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
/**
 * Spacially divide into 5 special groups as follows:
 *
 *   *******||*******|*******|*******|*******||*******
 * 0 <--------------->
 * 1         <--------------->
 * 2                 <--------------->
 * 3                         <--------------->
 * 4                                 <--------------->
 * 5 - If the circle does not fall in any of above 5 groups.
 *
 * Note: In the above, the double pipes denote the limits for
 *       a coordinate, so as can be seen groups 0 and 4 go outside
 *       the limits. Also, groups 1 and 3 are preferred and checked
 *       first.
 *
 * @param s Scale parameter, e.g. 1.1
 * @param coordinate - 0 -> horizontal or 1 -> vertical.
 * @param limits - The limits within which the circle bounds can fall.
 * @param circle - The circle to categorize into a group.
 */
function calcGroups(s, coordinate, limits, circle) {
    var limit = limits[coordinate];
    var l1 = limit[0];
    var l2 = limit[1];
    // Relevant cut-off lines.
    var q = (l2 - l1) / 4;
    var w = q + q;
    // Shift origin
    var r = circle.radius;
    var x = circle.center[coordinate] - l1;
    var x0 = x - r * s;
    var x1 = x + r * s;
    var newLimit = [,];
    var groups = []; // Group to which circle belongs;
    /* This was the old method to get groups and newLimit, but it
     * seems to be only slightly slower so could also be used
    let is = [1,3,0,2,4]; // Groups 1 and 3 takes priority.
    for (let i=0; i<=4; i++) {
        let q0 = q*(is[i]-1);
        let q1 = q0 + w;
        if (x0 > q0 && x1 <= q1) {
            groups.push(is[i]);
            newLimit = [l1 + q0, l1 + q1];
            break;
        }
    }*/
    var qStart = Math.floor(x0 / q);
    var qEnd = Math.floor(x1 / q) + 1;
    var qDiff = qEnd - qStart;
    var group = void 0;
    if (qDiff === 1) {
        // If contained in sliver.
        group = 2 * Math.floor(qStart / 2) + 1;
        groups.push(group);
        var lowerLimit = l1 + q * (group - 1);
        newLimit = [lowerLimit, lowerLimit + w];
    } else if (qDiff === 2) {
        group = qStart + 1;
        groups.push(group);
        var _lowerLimit = l1 + q * (group - 1);
        newLimit = [_lowerLimit, _lowerLimit + w];
    }
    var newLimits = [,];
    if (groups.length === 1) {
        var otherCoordinate = coordinate ? 0 : 1;
        newLimits[otherCoordinate] = limits[otherCoordinate];
        newLimits[coordinate] = newLimit;
    }
    return { groups: groups, newLimits: newLimits };
}
exports.default = toScaleAxis;

},{"../../geometry/classes/circle":6,"../../geometry/classes/point-on-shape":9,"../classes/mat-tree":25,"./copy-mat":29,"./get-nodes-as-hash":34}],37:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 *
 * @param mat
 */
function traverse(mat, f) {
    g(mat.startNode);
    function g(matNode, priorNode) {
        f(matNode, priorNode);
        //for (let node of matNode.branches) {
        for (var i = 0; i < matNode.branches.length; i++) {
            var node = matNode.branches[i];
            if (node === priorNode) {
                // Don't go back in tracks.
                continue;
            }
            g(node, matNode);
        }
    }
}
exports.default = traverse;

},{}],38:[function(_dereq_,module,exports){
"use strict";
// TODO - move later out of mat module

Object.defineProperty(exports, "__esModule", { value: true });
var flo_vector2d_1 = _dereq_("flo-vector2d");
var path_curve_1 = _dereq_("../geometry/classes/path-curve");
//import pathDataPolyFill from './path-data-polyfill/path-data-polyfill.js';
//		'./path-data-polyfill/path-data-polyfill.js';
var DELTA = 1e-6; // TODO - must be replaced with value relative to image size.
/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
function getBeziersFromSvgElem(elem) {
    /**
     * Returns true if the given point is close to the origin (by Manhattan
     * distance), fale otherwise.
     * @private
     * @param p - a point
     * @param delta - a tolerance - defaults to 1e-6;
     */
    function isCloseToOrigin(p) {
        var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DELTA;

        return flo_vector2d_1.default.manhattanLength(p) < delta;
    }
    /**
     * Returns true if distance between consecutive points are all less than
     * some delta, false otherwise.
     * @private
     * @param ps - an array of points
     * @param {number} [delta] - a tolerance - defaults to 1e-6;
     * @returns {boolean}
     */
    function isAlmostZeroLength(ps) {
        var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DELTA;

        for (var i = 1; i < ps.length; i++) {
            var p1 = ps[i - 1];
            var p2 = ps[i];
            if (flo_vector2d_1.default.manhattanDistanceBetween(p1, p2) > DELTA) {
                return false;
            }
        }
        return true;
    }
    function pushBezier(arr, ps_, j) {
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
        //console.log(Vector)
        var ds = [[0, flo_vector2d_1.default.manhattanDistanceBetween(ps_[0], ps_[1]), flo_vector2d_1.default.manhattanDistanceBetween(ps_[0], ps_[2]), flo_vector2d_1.default.manhattanDistanceBetween(ps_[0], ps_[3])], [flo_vector2d_1.default.manhattanDistanceBetween(ps_[1], ps_[0]), 0, flo_vector2d_1.default.manhattanDistanceBetween(ps_[1], ps_[2]), flo_vector2d_1.default.manhattanDistanceBetween(ps_[1], ps_[3])], [flo_vector2d_1.default.manhattanDistanceBetween(ps_[2], ps_[0]), flo_vector2d_1.default.manhattanDistanceBetween(ps_[2], ps_[1]), 0, flo_vector2d_1.default.manhattanDistanceBetween(ps_[2], ps_[3])], [flo_vector2d_1.default.manhattanDistanceBetween(ps_[3], ps_[0]), flo_vector2d_1.default.manhattanDistanceBetween(ps_[3], ps_[1]), flo_vector2d_1.default.manhattanDistanceBetween(ps_[3], ps_[2]), 0]];
        var ps = ps_;
        var SHIFT = 0.1;
        // Check if first or last 3 points are coincident
        if (ds[0][1] < DELTA && ds[1][2] < DELTA || ds[1][2] < DELTA && ds[2][3] < DELTA) {
            ps = [ps_[0], flo_vector2d_1.default.interpolate(ps_[0], ps_[3], 1 / 3), flo_vector2d_1.default.interpolate(ps_[0], ps_[3], 2 / 3), ps_[3]];
        }
        // Check if first 2 points are coincident
        if (ds[0][1] < DELTA) {
            ps[1] = flo_vector2d_1.default.interpolate(ps_[0], ps_[2], SHIFT);
        }
        // Check if last 2 points are coincident
        if (ds[2][3] < DELTA) {
            ps[2] = flo_vector2d_1.default.interpolate(ps_[1], ps_[3], 1 - SHIFT);
        }
        // Check if middle 2 points are coincident
        if (ds[1][2] < DELTA) {
            ps[1] = flo_vector2d_1.default.interpolate(ps_[0], ps_[1], 1 - SHIFT);
            ps[2] = flo_vector2d_1.default.interpolate(ps_[2], ps_[3], SHIFT);
        }
        arr.push(new path_curve_1.default(j, ps));
    }
    var MUST_START_WITH_M = 'Invalid SVG - every new path must start with an M or m.';
    var INVALID_COMMAND = 'Invalid SVG - command not recognized.';
    //pathDataPolyFill(); // Ensure polyfill is applied.
    //let paths = (elem as any).getPathData();  
    // TODO - must still implement handling of multiple <path>s
    var paths = elem.getElementsByTagName('path');
    var path = paths[0];
    var pathSegs = path.pathSegList;
    if (pathSegs.numberOfItems < 2) {
        // A shape is not described   
        return [];
    }
    var pathStarted = false;
    // Used in conjunction with "S" and "s"
    var prev2ndCubicControlPoint = undefined;
    var prev2ndQuadraticControlPoint = undefined;
    var bezierArrays = [];
    var bezierArray = [];
    var j = void 0;
    var type = undefined;
    var initialPoint = undefined;
    var x0 = void 0;
    var y0 = void 0;
    /*
    let pathSeg: {
        type: string/*,
        values: number[]*/ /*
                           };*/
    for (var i = 0; i < pathSegs.numberOfItems; i++) {
        var pathSeg = pathSegs.getItem(i);
        //let vals = pathSeg.values;
        //pathSeg.type = pathSeg_.pathSegTypeAsLetter;
        var _type = pathSeg.pathSegTypeAsLetter;
        var addX = 0;
        var addY = 0;
        if (_type == _type.toLowerCase()) {
            addX = x0;
            addY = y0;
        }
        var prevType = _type;
        _type = _type.toUpperCase();
        // TODO - massively simplify this code by using SVGPathSegCurvetoCubicAbs ??????
        var ps = void 0;
        switch (_type) {
            /*
             * M and m: (from www.w3.org)
             * --------------------------
             * Start a new sub-path at the given (x,y) coordinate.
             * M (uppercase) indicates that absolute coordinates will
             * follow; m (lowercase) indicates that relative coordinates
             * will follow. If a moveto is followed by multiple pairs of
             * coordinates, the subsequent pairs are treated as implicit
             * lineto commands. Hence, implicit lineto commands will be
             * relative if the moveto is relative, and absolute if the
             * moveto is absolute. If a relative moveto (m) appears as the
             * first element of the path, then it is treated as a pair of
             * absolute coordinates. In this case, subsequent pairs of
             * coordinates are treated as relative even though the initial
             * moveto is interpreted as an absolute moveto.
             */
            case 'M':
                {
                    // Note: A valid SVG path must start with "M" or "m".
                    var _path = pathSeg;
                    var vals = [_path.x, _path.y];
                    if (pathStarted) {
                        // This is a subpath, close as if a Z or z was the
                        // previous command.
                        if (prevType !== 'Z') {
                            var _xInterval = (vals[0] + addX - x0) / 3;
                            var _yInterval = (vals[1] + addY - y0) / 3;
                            ps = [[x0, y0], [x0 + _xInterval * 1, y0 + _yInterval * 1], [x0 + _xInterval * 2, y0 + _yInterval * 2], [x0 + _xInterval * 3, y0 + _yInterval * 3]];
                            prev2ndCubicControlPoint = undefined;
                            prev2ndQuadraticControlPoint = undefined;
                            if (!isCloseToOrigin([_xInterval, _yInterval])) {
                                pushBezier(bezierArray, ps, j++);
                            }
                        }
                    }
                    if (bezierArray.length) {
                        bezierArrays.push(bezierArray);
                        bezierArray = [];
                    }
                    pathStarted = true;
                    // Update current point
                    x0 = vals[0];
                    y0 = vals[1];
                    // Update initial point of current path/sub-path.
                    initialPoint = [x0, y0];
                    j = 0;
                    break;
                }
            /*
             * C and c: (from www.w3.org)
             * params: x1 y1 x2 y2 x y
             * --------------------------
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
            case 'C':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path2 = pathSeg;
                    var _vals = [_path2.x, _path2.y, _path2.x1, _path2.y1, _path2.x2, _path2.y2];
                    ps = [[x0, y0], [addX + _vals[0], addY + _vals[1]], [addX + _vals[2], addY + _vals[3]], [addX + _vals[4], addY + _vals[5]]];
                    prev2ndCubicControlPoint = ps[2];
                    prev2ndQuadraticControlPoint = undefined;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (!isAlmostZeroLength(ps)) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * S and s: (from www.w3.org)
             * params: x2 y2 x y
             * --------------------------
             * Draws a cubic Bézier curve from the current point to
             * (x,y). The first control point is assumed to be the
             * reflection of the second control point on the previous
             * command relative to the current point. (If there is no
             * previous command or if the previous command was not an
             * C, c, S or s, assume the first control point is
             * coincident with the current point.) (x2,y2) is the
             * second control point (i.e., the control point at the end
             * of the curve). S (uppercase) indicates that absolute
             * coordinates will follow; s (lowercase) indicates that
             * relative coordinates will follow. Multiple sets of
             * coordinates may be specified to draw a polybézier.
             * At the end of the command, the new current point becomes
             * the final (x,y) coordinate pair used in the polybézier.
             */
            case 'S':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path3 = pathSeg;
                    var _vals2 = [_path3.x, _path3.y, _path3.x2, _path3.y2];
                    var x1 = void 0;
                    var y1 = void 0;
                    if (prev2ndCubicControlPoint) {
                        x1 = x0 - prev2ndCubicControlPoint[0] + x0;
                        y1 = y0 - prev2ndCubicControlPoint[1] + y0;
                    } else {
                        x1 = x0;
                        y1 = y0;
                    }
                    ps = [[x0, y0], [x1, y1], [addX + _vals2[0], addY + _vals2[1]], [addX + _vals2[2], addY + _vals2[3]]];
                    prev2ndCubicControlPoint = ps[2];
                    prev2ndQuadraticControlPoint = undefined;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (!isAlmostZeroLength(ps)) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * L and l: (from www.w3.org)
             * params: x y
             * --------------------------
             * Draw a line from the current point to the given (x,y)
             * coordinate which becomes the new current point. L
             * (uppercase) indicates that absolute coordinates will
             * follow; l (lowercase) indicates that relative
             * coordinates will follow. A number of coordinates pairs
             * may be specified to draw a polyline. At the end of the
             * command, the new current point is set to the final set
             * of coordinates provided.
             */
            case 'L':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path4 = pathSeg;
                    var _vals3 = [_path4.x, _path4.y];
                    var _xInterval2 = (_vals3[0] + addX - x0) / 3;
                    var _yInterval2 = (_vals3[1] + addY - y0) / 3;
                    ps = [[x0, y0], [x0 + _xInterval2 * 1, y0 + _yInterval2 * 1], [x0 + _xInterval2 * 2, y0 + _yInterval2 * 2], [x0 + _xInterval2 * 3, y0 + _yInterval2 * 3]];
                    prev2ndCubicControlPoint = undefined;
                    prev2ndQuadraticControlPoint = undefined;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (!isCloseToOrigin([_xInterval2, _yInterval2])) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * H and h: (from www.w3.org)
             * params: x
             * --------------------------
             * Draws a horizontal line from the current point (cpx, cpy)
             * to (x, cpy). H (uppercase) indicates that absolute
             * coordinates will follow; h (lowercase) indicates that
             * relative coordinates will follow. Multiple x values can
             * be provided (although usually this doesn't make sense).
             * At the end of the command, the new current point becomes
             * (x, cpy) for the final value of x.
             */
            case 'H':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path5 = pathSeg;
                    var _vals4 = [_path5.x];
                    var _xInterval3 = (_vals4[0] + addX - x0) / 3;
                    ps = [[x0, y0], [x0 + _xInterval3 * 1, y0], [x0 + _xInterval3 * 2, y0], [x0 + _xInterval3 * 3, y0]];
                    prev2ndCubicControlPoint = undefined;
                    prev2ndQuadraticControlPoint = undefined;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (Math.abs(_xInterval3) > DELTA) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * V and v: (from www.w3.org)
             * params: y
             * --------------------------
             * Draws a vertical line from the current point (cpx, cpy)
             * to (cpx, y). V (uppercase) indicates that absolute
             * coordinates will follow; v (lowercase) indicates that
             * relative coordinates will follow. Multiple y values can
             * be provided (although usually this doesn't make sense).
             * At the end of the command, the new current point becomes
             * (cpx, y) for the final value of y.
             */
            case 'V':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path6 = pathSeg;
                    var _vals5 = [_path6.y];
                    //let yInterval = (vals[1] + addY - y0)/3;
                    var _yInterval3 = (_vals5[0] + addY - y0) / 3;
                    ps = [[x0, y0], [x0, y0 + _yInterval3 * 1], [x0, y0 + _yInterval3 * 2], [x0, y0 + _yInterval3 * 3]];
                    prev2ndCubicControlPoint = undefined;
                    prev2ndQuadraticControlPoint = undefined;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (Math.abs(_yInterval3) > DELTA) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * Q and q: (from www.w3.org)
             * params: x1 y1 x y
             * --------------------------
             * Draws a quadratic Bézier curve from the current point to
             * (x,y) using (x1,y1) as the control point. Q (uppercase)
             * indicates that absolute coordinates will follow; q
             * (lowercase) indicates that relative coordinates will
             * follow. Multiple sets of coordinates may be specified
             * to draw a polybézier. At the end of the command, the new
             * current point becomes the final (x,y) coordinate pair
             * used in the polybézier.
             */
            case 'Q':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path7 = pathSeg;
                    var _vals6 = [_path7.x, _path7.y, _path7.x1, _path7.y1];
                    //---------------------------------------------------
                    // Convert quadratic to cubic
                    // see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
                    //---------------------------------------------------
                    var QP0 = [x0, y0];
                    var QP1 = [addX + _vals6[0], addY + _vals6[1]];
                    var QP2 = [addX + _vals6[2], addY + _vals6[3]];
                    // Endpoints stay the same
                    var CP0 = QP0;
                    var CP3 = QP2;
                    // CP1 = QP0 + 2/3 *(QP1-QP0)
                    var CP1 = [QP0[0] + 2 / 3 * (QP1[0] - QP0[0]), QP0[1] + 2 / 3 * (QP1[1] - QP0[1])];
                    // CP2 = QP2 + 2/3 *(QP1-QP2)
                    var CP2 = [QP2[0] + 2 / 3 * (QP1[0] - QP2[0]), QP2[1] + 2 / 3 * (QP1[1] - QP2[1])];
                    ps = [CP0, CP1, CP2, CP3];
                    prev2ndCubicControlPoint = undefined;
                    prev2ndQuadraticControlPoint = QP1;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (!isAlmostZeroLength(ps)) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * T and t: (from www.w3.org)
             * params: x y
             * --------------------------
             * Draws a quadratic Bézier curve from the current point to
             * (x,y). The control point is assumed to be the reflection
             * of the control point on the previous command relative to
             * the current point. (If there is no previous command or if
             * the previous command was not a Q, q, T or t, assume the
             * control point is coincident with the current point.) T
             * (uppercase) indicates that absolute coordinates will
             * follow; t (lowercase) indicates that relative coordinates
             * will follow. At the end of the command, the new current
             * point becomes the final (x,y) coordinate pair used in the
             * polybézier.
             */
            case 'T':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    var _path8 = pathSeg;
                    var _vals7 = [_path8.x, _path8.y];
                    var _x3 = void 0;
                    var _y = void 0;
                    if (prev2ndQuadraticControlPoint) {
                        _x3 = x0 - prev2ndQuadraticControlPoint[0] + x0;
                        _y = y0 - prev2ndQuadraticControlPoint[1] + y0;
                    } else {
                        _x3 = x0;
                        _y = y0;
                    }
                    //---------------------------------------------------
                    // Convert quadratic to cubic
                    // see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
                    //---------------------------------------------------
                    var _QP = [x0, y0];
                    var _QP2 = [_x3, _y];
                    var _QP3 = [addX + _vals7[0], addY + _vals7[1]];
                    // Endpoints stay the same
                    var _CP = _QP;
                    var _CP2 = _QP3;
                    // CP1 = QP0 + 2/3 *(QP1-QP0)
                    var _CP3 = [_QP[0] + 2 / 3 * (_QP2[0] - _QP[0]), _QP[1] + 2 / 3 * (_QP2[1] - _QP[1])];
                    // CP2 = QP2 + 2/3 *(QP1-QP2)
                    var _CP4 = [_QP3[0] + 2 / 3 * (_QP2[0] - _QP3[0]), _QP3[1] + 2 / 3 * (_QP2[1] - _QP3[1])];
                    ps = [_CP, _CP3, _CP4, _CP2];
                    prev2ndCubicControlPoint = undefined;
                    prev2ndQuadraticControlPoint = _QP2;
                    // Update current point
                    x0 = ps[3][0];
                    y0 = ps[3][1];
                    if (!isAlmostZeroLength(ps)) {
                        pushBezier(bezierArray, ps, j++);
                    }
                    break;
                }
            /*
             * A and a: (from www.w3.org)
             * params: rx ry x-axis-rotation large-arc-flag
             *         sweep-flag x y
             * --------------------------------------------
             * Draws an elliptical arc from the current point to (x, y).
             * The size and orientation of the ellipse are defined by
             * two radii (rx, ry) and an x-axis-rotation, which
             * indicates how the ellipse as a whole is rotated relative
             * to the current coordinate system. The center (cx, cy) of
             * the ellipse is calculated automatically to satisfy the
             * constraints imposed by the other parameters.
             * large-arc-flag and sweep-flag contribute to the automatic
             * calculations and help determine how the arc is drawn.
             */
            case 'A':
                {
                    if (!pathStarted) {
                        throw new Error(MUST_START_WITH_M);
                    }
                    prev2ndCubicControlPoint = undefined;
                    prev2ndQuadraticControlPoint = undefined;
                    // Update current point
                    //x0 = ? ps[3][0]; 
                    //y0 = ? ps[3][1];
                    pushBezier(bezierArray, ps, j++);
                    break;
                }
            /*
             * Z and z: (from www.w3.org)
             * params: (none)
             * --------------------------
             * Close the current subpath by drawing a straight line
             * from the current point to current subpath's initial
             * point. Since the Z and z commands take no parameters,
             * they have an identical effect.
             */
            case 'Z':
                if (!pathStarted) {
                    throw new Error(MUST_START_WITH_M);
                }
                var xInterval = (initialPoint[0] + addX - x0) / 3;
                var yInterval = (initialPoint[1] + addY - y0) / 3;
                ps = [[x0, y0], [x0 + xInterval * 1, y0 + yInterval * 1], [x0 + xInterval * 2, y0 + yInterval * 2], [x0 + xInterval * 3, y0 + yInterval * 3]];
                prev2ndCubicControlPoint = undefined;
                prev2ndQuadraticControlPoint = undefined;
                // Update current point
                x0 = ps[3][0];
                y0 = ps[3][1];
                if (!isCloseToOrigin([xInterval, yInterval])) {
                    pushBezier(bezierArray, ps, j++);
                }
                break;
            default:
                throw new Error(INVALID_COMMAND);
        }
    }
    if (bezierArray.length) {
        bezierArrays.push(bezierArray);
        bezierArray = [];
    }
    return bezierArrays;
}
/**
 * Returns a string representation of the given beziers linked loop.
 * @param beziers - A linked loop of cubic beziers.
 */
function getPathStrFromBezierLoop(bezierLoop) {
    var beziers = bezierLoop.getAsArray().map(function (x) {
        return x.item;
    });
    return Svg.getPathStrFromBeziers(beziers);
}
/**
 * Returns a string representation of the given array of beziers.
 * @param {number[][][]} beziers - An array of cubic beziers.
 * @returns {string}
 */
function getPathStrFromBeziers(beziers) {
    var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    var D = decimalPlaces;
    var str = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = beziers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var ps = _step.value;

            if (ps === beziers[0]) {
                str = 'M ' + ps[0][0].toFixed(D) + ' ' + ps[0][1].toFixed(D) + '\n';
            }
            str += 'C ' + ps[1][0].toFixed(D) + ' ' + ps[1][1].toFixed(D) + ' ' + ps[2][0].toFixed(D) + ' ' + ps[2][1].toFixed(D) + ' ' + ps[3][0].toFixed(D) + ' ' + ps[3][1].toFixed(D) + ' ' + '\n';
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

    return str;
}
var Svg = {
    getBeziersFromSvgElem: getBeziersFromSvgElem,
    getPathStrFromBezierLoop: getPathStrFromBezierLoop,
    getPathStrFromBeziers: getPathStrFromBeziers
};
exports.default = Svg;

},{"../geometry/classes/path-curve":8,"flo-vector2d":55}],39:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
var flo_poly_1 = _dereq_("flo-poly");
var flo_vector2d_1 = _dereq_("flo-vector2d");
var flo_memoize_1 = _dereq_("flo-memoize");
var flo_gauss_quadrature_1 = _dereq_("flo-gauss-quadrature");
var flo_graham_scan_1 = _dereq_("flo-graham-scan");
var DELTA = 1e-10;
var _flo_vector2d_1$defau = flo_vector2d_1.default,
    rotate = _flo_vector2d_1$defau.rotatePs,
    translate = _flo_vector2d_1$defau.translatePs;

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
/**
 * Returns the power basis representation of the bezier's y-coordinates.
 * This function is memoized on its points parameter by object reference.
 * @param ps - A bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
var getY = memoize(function (ps) {
    var _ps2 = _slicedToArray(ps, 4),
        _ps2$ = _slicedToArray(_ps2[0], 2),
        y0 = _ps2$[1],
        _ps2$2 = _slicedToArray(_ps2[1], 2),
        y1 = _ps2$2[1],
        _ps2$3 = _slicedToArray(_ps2[2], 2),
        y2 = _ps2$3[1],
        _ps2$4 = _slicedToArray(_ps2[3], 2),
        y3 = _ps2$4[1];

    return [y3 - 3 * y2 + 3 * y1 - y0, 3 * y2 - 6 * y1 + 3 * y0, 3 * y1 - 3 * y0, y0];
});
/**
 * Returns the derivative of the power basis representation of the bezier's
 * x-coordinates. This function is memoized on its points parameter by object
 * reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
var getDx = memoize(function (ps) {
    return flo_poly_1.default.differentiate(getX(ps));
});
/**
 * Returns the derivative of the power basis representation of the bezier's
 * y-coordinates. This function is memoized on its points parameter by object
 * reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The differentiated power basis polynomial from highest
 * power to lowest, e.g. at^2 + bt + c is returned as [a,b,c]
 */
var getDy = memoize(function (ps) {
    return flo_poly_1.default.differentiate(getY(ps));
});
/**
 * Returns the second derivative of the power basis representation of the
 * bezier's x-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The twice differentiated power basis polynomial from
 * highest power to lowest, e.g. at + b is returned as [a,b]
 */
var getDdx = memoize(function (ps) {
    return flo_poly_1.default.differentiate(getDx(ps));
});
/**
 * Returns the second derivative of the power basis representation of the
 * bezier's y-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The twice differentiated power basis polynomial from
 * highest power to lowest, e.g. at + b is returned as [a,b]
 */
var getDdy = memoize(function (ps) {
    return flo_poly_1.default.differentiate(getDy(ps));
});
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
function evaluate(ps, t) {
    var _ps3 = _slicedToArray(ps, 4),
        _ps3$ = _slicedToArray(_ps3[0], 2),
        x0 = _ps3$[0],
        y0 = _ps3$[1],
        _ps3$2 = _slicedToArray(_ps3[3], 2),
        x3 = _ps3$2[0],
        y3 = _ps3$2[1];

    var evX = evaluateX(ps);
    var evY = evaluateY(ps);
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
/**
 * Returns the given bezier's inflection points.
 **/
function findBezierInflectionPoints(ps) {
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
    var inflectionTimes = flo_poly_1.default.allRoots([a, b, c], 0, 1);
    var evPs = evaluate(ps);
    return inflectionTimes.map(evPs);
}
function κ(ps, t) {
    var evDx = evaluateDx(ps);
    var evDy = evaluateDy(ps);
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
/**
 * Alias of κ.
 */
var curvature = κ;
function κds(ps, t) {
    var evDx = evaluateDx(ps);
    var evDy = evaluateDy(ps);
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
        return 4 * (f * (y3 - 3 * y2 + 3 * y1 - y0) - g * (x3 - 3 * x2 + 3 * x1 - x0)) * Math.pow(j, 3) - (f * h - b * g) * (2 * h * g + 2 * b * f) * j;
    }
    return t === undefined ? f : f(t);
}
function tangent(ps, t) {
    var evDx = evaluateDx(ps);
    var evDy = evaluateDy(ps);
    function f(t) {
        var dx = evDx(t);
        var dy = evDy(t);
        var d = Math.sqrt(dx * dx + dy * dy);
        return [dx / d, dy / d];
    }
    // Curry
    return t === undefined ? f : f(t);
}
function normal(ps, t) {
    var tanPs = tangent(ps);
    function f(t) {
        var v = tanPs(t);
        return [v[1], -v[0]];
    }
    // Curry
    return t === undefined ? f : f(t);
}
/**
 * <p>
 * Categorizes the given cubic bezier curve according to whether it has a loop,
 * a cusp, or zero, one or two inflection points all of which are mutually
 * exclusive.
 * </p>
 * <p>
 * See <a href="http://graphics.pixar.com/people/derose/publications/CubicClassification/paper.pdf">
 * this</a> paper.
 * </p>
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns {string} A value of 'L', 'C', '0', '1', or '2' depending on whether
 * the curve has a loop, a cusp, or zero, one or two inflection points.
 */
function categorize(ps) {
    // TODO - finish
}
function totalCurvature(ps, interval) {
    var tanPs = tangent(ps);
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
function len(interval, ps) {
    function f(ps) {
        if (interval[0] === interval[1]) {
            return 0;
        }

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
function ds(ps, t) {
    var evDx = evaluateDx(ps);
    var evDy = evaluateDy(ps);
    function f(t) {
        var dx = evDx(t);
        var dy = evDy(t);
        return Math.sqrt(dx * dx + dy * dy);
    }
    // Curry
    return t === undefined ? f : f(t);
}
function evaluateX(ps, t) {
    var xPs = getX(ps); // Speed optimizing cache
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
function evaluateY(ps, t) {
    var yPs = getY(ps); // Speed optimizing cache
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
function evaluateDx(ps, t) {
    var dPs = getDx(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dPs);
    return t === undefined ? f : f(t); // Curry
}
function evaluateDy(ps, t) {
    var dPs = getDy(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dPs);
    return t === undefined ? f : f(t); // Curry
}
function evaluateDdx(ps, t) {
    var ddPs = getDdx(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(ddPs);
    return t === undefined ? f : f(t); // Curry
}
function evaluateDdy(ps, t) {
    var ddPs = getDdy(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(ddPs);
    return t === undefined ? f : f(t); // Curry
}
function evaluateDddx(ps, t) {
    var dddPs = getDddx(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dddPs);
    return t === undefined ? f : f(t); // Curry
}
function evaluateDddy(ps, t) {
    var dddPs = getDddy(ps); // Speed optimizing cache
    var f = flo_poly_1.default.evaluate(dddPs);
    return t === undefined ? f : f(t); // Curry
}
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
    var vectorToOrigin = flo_vector2d_1.default.transform(ps[0], function (x) {
        return -x;
    });
    var boundingPs = flo_vector2d_1.default.translateThenRotatePs(vectorToOrigin, -sinθ, cosθ, ps);
    return getBoundingBox(boundingPs);
}
/**
 * Returns the tight bounding box of the given cubic bezier.
 * @returns The tight bounding box of the bezier as four ordered
 * points of a rotated rectangle.
 * TODO - test case of baseLength === 0
 */
var getBoundingBoxTight = memoize(function (ps) {
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
    return flo_vector2d_1.default.rotateThenTranslatePs(sinθ, cosθ, ps[0], axisAlignedBox);
});
/**
 * Returns the axis-aligned bounding box of a given bezier.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns the axis-aligned bounding box in the form
 * [[minx, miny], [maxx,maxy]
 */
var getBoundingBox = memoize(function (ps) {
    return getBounds(ps).box;
});
/**
 * Calculates and returns general bezier bounds.
 * @returns {object} The axis-aligned bounding box together with the t values
 * where the bounds on the bezier are reached.
 */
var getBounds = memoize(function (ps) {
    // Roots of derivative
    var roots = [getDx(ps), getDy(ps)].map(function (poly) {
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
        var x = evaluateX(ps, t);
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
        var y = evaluateY(ps, _t);
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
/**
 * <p>
 * Returns a cubic bezier curve that starts at the given curve and ends at the
 * given t parameter. Uses de Casteljau's algorithm.
 * </p>
 * <p>
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2*2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * </p>
 * @param ps - A cubic bezier curve
 * @param t1 - The t parameter where the resultant bezier should start
 * @param t2 - The t parameter where the resultant bezier should end
 * @returns {number[][]}
 */
function fromTo(ps) {
    return function (t1, t2) {
        if (t1 === t2) {
            // Degenerate case
            var p = evaluate(ps, t1);
            return [p, p, p, p];
        }
        var t = fromTTo1(ps, t1);
        return from0ToT(t, (t2 - t1) / (1 - t1));
    };
}
;
/**
 * <p>
 * Returns a cubic bezier curve that starts at the given curve's t=0 and ends
 * at the given t parameter. Uses de Casteljau's algorithm.
 * </p>
 * <p>
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * </p>
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the resultant bezier should end
 */
function from0ToT(ps, t) {
    var _ps8 = _slicedToArray(ps, 4),
        _ps8$ = _slicedToArray(_ps8[0], 2),
        x0 = _ps8$[0],
        y0 = _ps8$[1],
        _ps8$2 = _slicedToArray(_ps8[1], 2),
        x1 = _ps8$2[0],
        y1 = _ps8$2[1],
        _ps8$3 = _slicedToArray(_ps8[2], 2),
        x2 = _ps8$3[0],
        y2 = _ps8$3[1],
        _ps8$4 = _slicedToArray(_ps8[3], 2),
        x3 = _ps8$4[0],
        y3 = _ps8$4[1];

    var s = 1 - t;
    var t2 = t * t;
    var t3 = t2 * t;
    var s2 = s * s;
    var s3 = s2 * s;
    return [[x0, y0], [t * x1 + s * x0, t * y1 + s * y0], [t2 * x2 + 2 * s * t * x1 + s2 * x0, t2 * y2 + 2 * s * t * y1 + s2 * y0], [t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0, t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0]];
}
/**
 * <p>
 * Returns a cubic bezier curve that starts at the given t parameter and
 * ends at t=1. Uses de Casteljau's algorithm.
 * </p>
 * <p>
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * </p>
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the resultant bezier should start
 */
function fromTTo1(ps, t) {
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

    var s = 1 - t;
    var t2 = t * t;
    var t3 = t2 * t;
    var s2 = s * s;
    var s3 = s2 * s;
    return [[t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0, t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0], [t2 * x3 + 2 * t * s * x2 + s2 * x1, t2 * y3 + 2 * t * s * y2 + s2 * y1], [t * x3 + s * x2, t * y3 + s * y2], [x3, y3]];
}
/**
 * <p>
 * Returns 2 new beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1]. Uses de Casteljau's algorithm.
 * </p>
 * <p>
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * </p>
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the curve should be split
 * @returns {number[][]}
 */
function splitAt(ps, t) {
    var _ps10 = _slicedToArray(ps, 4),
        _ps10$ = _slicedToArray(_ps10[0], 2),
        x0 = _ps10$[0],
        y0 = _ps10$[1],
        _ps10$2 = _slicedToArray(_ps10[1], 2),
        x1 = _ps10$2[0],
        y1 = _ps10$2[1],
        _ps10$3 = _slicedToArray(_ps10[2], 2),
        x2 = _ps10$3[0],
        y2 = _ps10$3[1],
        _ps10$4 = _slicedToArray(_ps10[3], 2),
        x3 = _ps10$4[0],
        y3 = _ps10$4[1];

    var s = 1 - t;
    var t2 = t * t;
    var t3 = t2 * t;
    var s2 = s * s;
    var s3 = s2 * s;
    var ps1 = [[x0, y0], [t * x1 + s * x0, t * y1 + s * y0], [t2 * x2 + 2 * s * t * x1 + s2 * x0, t2 * y2 + 2 * s * t * y1 + s2 * y0], [t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0, t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0]];
    var ps2 = [ps1[3], [t2 * x3 + 2 * t * s * x2 + s2 * x1, t2 * y3 + 2 * t * s * y2 + s2 * y1], [t * x3 + s * x2, t * y3 + s * y2], [x3, y3]];
    return [ps1, ps2];
}
/**
 * Returns a human readable string representation of the given bezier.
 * @param ps - A bezier curve
 * @returns {string}
 */
function toString(ps) {
    var _ps11 = _slicedToArray(ps, 4),
        _ps11$ = _slicedToArray(_ps11[0], 2),
        x0 = _ps11$[0],
        y0 = _ps11$[1],
        _ps11$2 = _slicedToArray(_ps11[1], 2),
        x1 = _ps11$2[0],
        y1 = _ps11$2[1],
        _ps11$3 = _slicedToArray(_ps11[2], 2),
        x2 = _ps11$3[0],
        y2 = _ps11$3[1],
        _ps11$4 = _slicedToArray(_ps11[3], 2),
        x3 = _ps11$4[0],
        y3 = _ps11$4[1];

    return "[[" + x0 + "," + y0 + "],[" + x1 + "," + y1 + "],[" + x2 + "," + y2 + "],[" + x3 + "," + y3 + "]]";
}
/**
 * Scales all control points of the given bezier by the given factor.
 * @param ps - A bezier curve
 * @param factor - The scale factor
 * @returns {number[][]}
 */
function scale(ps, factor) {
    return ps.map(function (x) {
        return [x[0] * factor, x[1] * factor];
    });
}
/**
 * Returns the bezier t values of the intersection between the given cubic
 * bezier and the given line.
 * @param ps - The bezier curve
 * @param l - The line given as a start and end point
 * @returns {number[]}
 */
function lineIntersection(ps, l) {
    var _l2 = _slicedToArray(l, 2),
        _l2$ = _slicedToArray(_l2[0], 2),
        x0 = _l2$[0],
        y0 = _l2$[1],
        _l2$2 = _slicedToArray(_l2[1], 2),
        x1 = _l2$2[0],
        y1 = _l2$2[1];

    var x = x1 - x0,
        y = y1 - y0;

    if (x === 0 && y === 0) {
        return [];
    }
    // Move the line and the bezier together so the line's first point is on the
    // origin.
    ps = translate([-x0, -y0], ps);
    // Rotate the bezier and line together so the line is y=0.
    var len = Math.sqrt(x * x + y * y);
    var sinθ = y / len;
    var cosθ = x / len;
    ps = rotate(-sinθ, cosθ, ps);
    // Find the intersection t values
    return flo_poly_1.default.allRoots(getY(ps), 0, 1);
}
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
    return flo_poly_1.default.allRoots(getY(ps), 0, 1);
}
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
    return flo_poly_1.default.allRoots(getX(ps), 0, 1);
}
/**
 * Returns the best least squares quadratic bezier approximation to the given
 * cubic bezier. Note that the two bezier endpoints differ in general.
 * @param ps - A cubic bezier curve.
 * @returns {number[][]}
 */
function toQuadratic(ps) {
    var _ps12 = _slicedToArray(ps, 4),
        _ps12$ = _slicedToArray(_ps12[0], 2),
        x0 = _ps12$[0],
        y0 = _ps12$[1],
        _ps12$2 = _slicedToArray(_ps12[1], 2),
        x1 = _ps12$2[0],
        y1 = _ps12$2[1],
        _ps12$3 = _slicedToArray(_ps12[2], 2),
        x2 = _ps12$3[0],
        y2 = _ps12$3[1],
        _ps12$4 = _slicedToArray(_ps12[3], 2),
        x3 = _ps12$4[0],
        y3 = _ps12$4[1];

    return [[19 / 20 * x0 + 3 / 20 * x1 + -3 / 20 * x2 + 1 / 20 * x3, 19 / 20 * y0 + 3 / 20 * y1 + -3 / 20 * y2 + 1 / 20 * y3], [-1 / 4 * x0 + 3 / 4 * x1 + 3 / 4 * x2 + -1 / 4 * x3, -1 / 4 * y0 + 3 / 4 * y1 + 3 / 4 * y2 + -1 / 4 * y3], [1 / 20 * x0 + -3 / 20 * x1 + 3 / 20 * x2 + 19 / 20 * x3, 1 / 20 * y0 + -3 / 20 * y1 + 3 / 20 * y2 + 19 / 20 * y3]];
}
/**
 * Returns the hybrid quadratic version of the given cubic bezier. For a
 * definition of hybrid quadratic bezier curves see <a href="http://scholarsarchive.byu.edu/cgi/viewcontent.cgi?article=2206&context=etd">
 * this paper</a>.
 * @param ps - A cubic bezier curve.
 * @returns {object[]} An array of three quadratic bezier points where the
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
    var _ps13 = _slicedToArray(ps, 4),
        _ps13$ = _slicedToArray(_ps13[0], 2),
        x0 = _ps13$[0],
        y0 = _ps13$[1],
        _ps13$2 = _slicedToArray(_ps13[1], 2),
        x1 = _ps13$2[0],
        y1 = _ps13$2[1],
        _ps13$3 = _slicedToArray(_ps13[2], 2),
        x2 = _ps13$3[0],
        y2 = _ps13$3[1],
        _ps13$4 = _slicedToArray(_ps13[3], 2),
        x3 = _ps13$4[0],
        y3 = _ps13$4[1];

    return [[x0, y0], [[(3 * x1 - x0) / 2, (3 * y1 - y0) / 2], [(3 * x2 - x3) / 2, (3 * y2 - y3) / 2]], [x3, y3] // evaluated at t
    ];
}
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
/**
 * Evaluates the given linear bezier (line) at a specific t value.
 * @param ps - A linear bezier curve.
 * @param t - The value where the bezier should be evaluated
 */
function evaluateLinear(ps, t) {
    var _ps14 = _slicedToArray(ps, 2),
        _ps14$ = _slicedToArray(_ps14[0], 2),
        x0 = _ps14$[0],
        y0 = _ps14$[1],
        _ps14$2 = _slicedToArray(_ps14[1], 2),
        x1 = _ps14$2[0],
        y1 = _ps14$2[1];

    var x = x0 * (1 - t) + x1 * t;
    var y = y0 * (1 - t) + y1 * t;
    return [x, y];
}
/**
 * Returns a clone of the given cubic bezier. Use sparingly; this is not in the
 * spirit of functional programming.
 * @param ps - A cubic bezier given by its array of control points
 */
function clone(ps) {
    var _ps15 = _slicedToArray(ps, 4),
        _ps15$ = _slicedToArray(_ps15[0], 2),
        x0 = _ps15$[0],
        y0 = _ps15$[1],
        _ps15$2 = _slicedToArray(_ps15[1], 2),
        x1 = _ps15$2[0],
        y1 = _ps15$2[1],
        _ps15$3 = _slicedToArray(_ps15[2], 2),
        x2 = _ps15$3[0],
        y2 = _ps15$3[1],
        _ps15$4 = _slicedToArray(_ps15[3], 2),
        x3 = _ps15$4[0],
        y3 = _ps15$4[1];

    return [[x0, y0], [x1, y1], [x2, y2], [x3, y3]];
}
/**
 * Evaluates the given quadratic bezier at a specific t value.
 * @param ps - A quadratic bezier curve.
 * @param t - The value where the bezier should be evaluated
 * @returns {number[]}
 */
function evaluateQuadratic(ps, t) {
    var _ps16 = _slicedToArray(ps, 3),
        _ps16$ = _slicedToArray(_ps16[0], 2),
        x0 = _ps16$[0],
        y0 = _ps16$[1],
        _ps16$2 = _slicedToArray(_ps16[1], 2),
        x1 = _ps16$2[0],
        y1 = _ps16$2[1],
        _ps16$3 = _slicedToArray(_ps16[2], 2),
        x2 = _ps16$3[0],
        y2 = _ps16$3[1];

    var x = x0 * Math.pow(1 - t, 2) + x1 * 2 * (1 - t) * t + x2 * Math.pow(t, 2);
    var y = y0 * Math.pow(1 - t, 2) + y1 * 2 * (1 - t) * t + y2 * Math.pow(t, 2);
    return [x, y];
}
/**
 * Returns the cubic version of the given quadratic bezier curve. Quadratic
 * bezier curves can always be represented by cubics - the converse is false.
 * @param ps - A quadratic bezier curve.
 * @returns {number[][]}
 */
function toCubic(ps) {
    var _ps17 = _slicedToArray(ps, 3),
        _ps17$ = _slicedToArray(_ps17[0], 2),
        x0 = _ps17$[0],
        y0 = _ps17$[1],
        _ps17$2 = _slicedToArray(_ps17[1], 2),
        x1 = _ps17$2[0],
        y1 = _ps17$2[1],
        _ps17$3 = _slicedToArray(_ps17[2], 2),
        x2 = _ps17$3[0],
        y2 = _ps17$3[1];

    return [[x0, y0], [1 / 3 * x0 + 2 / 3 * x1, 1 / 3 * y0 + 2 / 3 * y1], [2 / 3 * x1 + 1 / 3 * x2, 2 / 3 * y1 + 1 / 3 * y2], [x2, y2]];
}
/**
 * Check if the two given cubic beziers are nearly coincident everywhere and
 * returns the coincident stretch (if any), otherwise returns undefined.
 * @param P - A cubic bezier curve.
 * @param Q - Another cubic bezier curve.
 * @param δ - An indication of how closely the curves should stay to
 * each other before considered coincident.
 * @returns
 */
function coincident(P, Q) {
    var δ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;

    var _P = _slicedToArray(P, 4),
        P0 = _P[0],
        P1 = _P[1],
        P2 = _P[2],
        P3 = _P[3];

    var _Q = _slicedToArray(Q, 4),
        Q0 = _Q[0],
        Q1 = _Q[1],
        Q2 = _Q[2],
        Q3 = _Q[3];

    var _calcPointAndNeighbor = calcPointAndNeighbor(P, Q, 0),
        pP0 = _calcPointAndNeighbor.pp,
        tPQ0 = _calcPointAndNeighbor.t,
        pPQ0 = _calcPointAndNeighbor.p,
        dPQ0 = _calcPointAndNeighbor.d;

    var _calcPointAndNeighbor2 = calcPointAndNeighbor(P, Q, 1),
        pP1 = _calcPointAndNeighbor2.pp,
        tPQ1 = _calcPointAndNeighbor2.t,
        pPQ1 = _calcPointAndNeighbor2.p,
        dPQ1 = _calcPointAndNeighbor2.d;

    var _calcPointAndNeighbor3 = calcPointAndNeighbor(Q, P, 0),
        pQ0 = _calcPointAndNeighbor3.pp,
        tQP0 = _calcPointAndNeighbor3.t,
        pQP0 = _calcPointAndNeighbor3.p,
        dQP0 = _calcPointAndNeighbor3.d;

    var _calcPointAndNeighbor4 = calcPointAndNeighbor(Q, P, 1),
        pQ1 = _calcPointAndNeighbor4.pp,
        tQP1 = _calcPointAndNeighbor4.t,
        pQP1 = _calcPointAndNeighbor4.p,
        dQP1 = _calcPointAndNeighbor4.d;
    // Check for start and end points coincident.


    var tStartQ = 0;
    var tEndQ = 1;
    var tStartP = 0;
    var tEndP = 1;
    var count = 0;
    if (dPQ0 <= δ) {
        tStartQ = tPQ0;
        count++;
    }
    if (dPQ1 <= δ) {
        tEndQ = tPQ1;
        count++;
    }
    if (dQP0 <= δ) {
        tStartP = tQP0;
        count++;
    }
    if (dQP1 <= δ) {
        tEndP = tQP1;
        count++;
    }
    // At least 2 endpoints must be coincident.
    if (count < 2) {
        return undefined;
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
    // We must check at least 8 additional points to ensure entire curve
    // is coincident, otherwise we may simply have found intersection 
    // points.
    // TODO - Change so that we cut the curves to be about equal and check the
    // other two control points for closeness.
    var res = true;
    for (var i = 1; i < 10; i++) {
        var t = tStartP + tSpanP * (i / 10);

        var _calcPointAndNeighbor5 = calcPointAndNeighbor(P, Q, t),
            pp = _calcPointAndNeighbor5.pp,
            tt = _calcPointAndNeighbor5.t,
            pq = _calcPointAndNeighbor5.p,
            d = _calcPointAndNeighbor5.d;

        if (d > δ) {
            return undefined;
        }
    }
    return { p: [tStartP, tEndP], q: [tStartQ, tEndQ] };
    function calcPointAndNeighbor(P, Q, t) {
        // TODO - must also check crossing of normals - for if two curves open
        // at endpoints and stop essentially at same point.
        var pp1 = evaluate(P)(t);
        var normalVector = normal(P)(0);
        var pp2 = flo_vector2d_1.default.translate(pp1, normalVector);
        var ts = lineIntersection(Q, [pp1, pp2]);
        var bestT = undefined;
        var bestP = undefined;
        var bestD = Number.POSITIVE_INFINITY;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = ts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _t2 = _step.value;

                var p = evaluate(Q)(_t2);
                var _d = flo_vector2d_1.default.distanceBetween(p, pp1);
                if (_d < bestD) {
                    bestT = _t2;
                    bestP = p;
                    bestD = _d;
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

        return { pp: pp1, t: bestT, p: bestP, d: bestD };
    }
}
/**
 * Robust, extremely accurate and extremely fast (cubically convergent in
 * general with fast iteration steps) algorithm that returns the intersections
 * between two cubic beziers.
 *
 * At stretches where the two curves run extremely close to (or on top of) each
 * other and curve the same direction an interval is returned instead of a
 * point.
 *
 * The algorithm is based on a <a href="http://scholarsarchive.byu.edu/cgi/viewcontent.cgi?article=2206&context=etd">paper</a>
 * that finds the intersection of a fat line and a so-called geometric interval
 * making it faster and more accurate than the standard fat-line intersection
 * algorithm. The algorithm has been modified to prevent run-away recursion
 * by checking for coincident pieces at subdivision steps.
 *
 * @param ps1 - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param ps2 - Another cubic bezier
 * @param [δ] - An optional tolerance to within which the t parameter
 * should be calculated - defaults to the minimum value of 24*Number.EPSILON or
 * approximately 5e-15. Note that it might not make sense to set this to as
 * large as say 1e-5 since only a single iteration later the maximum accuracy
 * will be attained and not much speed will be gained anyway. Similarly if δ is
 * set to 1e-2 only two iterations will be saved. This is due to the algorithm
 * being cubically convergent (usually converging in about 4 to 8 iterations for
 * typical intersections).
 * @param [Δ] - A tolerance that indicates how closely a stretch of the
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
    var dst = flo_vector2d_1.default.distanceBetween;
    var sdst = flo_vector2d_1.default.squaredDistanceBetween;
    // The minimum value Δ can be. If it is too small the algorithm may take too
    // long in cases where the two curves run extremely close to each other for
    // their entire length and curve the same direction.
    var ΔMin = 1e-6;
    // This is an estimate of the relative floating point error during clipping.
    // A bound is given by |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k
    // are the control points indexed by k=0,1,2,3 and η is machine epsilon, 
    // i.e. Number.EPSILON. We quadruple the bound to be sure.
    var δMin = 24 * Number.EPSILON;
    // Maximum error - limited to take rounding error into account.
    if (δ === undefined) {
        δ = 0;
    }
    δ = Math.max(δ, δMin);
    if (Δ === undefined) {
        Δ = ΔMin;
    }
    Δ = Math.max(Δ, ΔMin);
    // Intersection t values for both beziers
    var tss = [];
    //let iterations = 0;
    intersection(ps1, ps2, [0, 1], [0, 1], 1);
    //console.log(iterations);
    return tss;
    // Helper function
    function intersection(Q_, P_, qRange, pRange, idx) {
        //iterations++;
        var cidx = idx === 0 ? 1 : 0; // Counter flip-flop index
        // Move intersection toward the origin to prevent serious floating point 
        // issues that are introduced specifically by the getLineEquation 
        // function. This allows us to get a relative error in the final 
        // result usually in the 10 ULPS or less range.

        var _center = center(P_, Q_);

        var _center2 = _slicedToArray(_center, 2);

        P_ = _center2[0];
        Q_ = _center2[1];

        var _Q_ = Q_,
            _Q_2 = _slicedToArray(_Q_, 4),
            Q0 = _Q_2[0],
            Q1 = _Q_2[1],
            Q2 = _Q_2[2],
            Q3 = _Q_2[3];

        var _P_ = P_,
            _P_2 = _slicedToArray(_P_, 4),
            P0 = _P_2[0],
            P1 = _P_2[1],
            P2 = _P_2[2],
            P3 = _P_2[3];
        // Get the implict line equation for the line from the first to the last
        // control point of Q. This equation gives the distance between any 
        // point and the line.


        var dQ = getDistanceToLineFunction([Q0, Q3]);
        // Calculate the distance from the control points of Q to the line 
        // [Q0,Q3].
        var dQi = function dQi(i) {
            return dQ(Q_[i]);
        };
        var dQs = [1, 2].map(dQi);

        var _dQs = _slicedToArray(dQs, 2),
            dQ1 = _dQs[0],
            dQ2 = _dQs[1];
        // Calculate the fat line of Q.


        var C = dQ1 * dQ2 > 0 ? 3 / 4 : 4 / 9;
        var dMin = C * Math.min(0, dQ1, dQ2);
        var dMax = C * Math.max(0, dQ1, dQ2);

        var _geoClip = geoClip(P_, dQ, dMin, dMax),
            tMin = _geoClip.tMin,
            tMax = _geoClip.tMax;

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
            if (coincident(P_, Q_) !== undefined) {
                return;
            }
            // Split the curve in half
            if (pSpan <= qSpan) {
                cidx = idx;
                var _ref3 = [Q_, P_];
                P_ = _ref3[0];
                Q_ = _ref3[1];
                var _ref4 = [qRange, pRange];
                pRange = _ref4[0];
                qRange = _ref4[1];
            }
            // Update t range.
            var _span = pRange[1] - pRange[0];
            // 1st half
            var tMinA = pRange[0];
            var tMaxA = tMinA + _span / 2;
            // 2nd half
            var tMinB = tMaxA;
            var tMaxB = pRange[1];
            var A = fromTo(P_)(0, 0.5);
            var B = fromTo(P_)(0.5, 1);
            intersection(A, Q_, [tMinA, tMaxA], qRange, cidx);
            intersection(B, Q_, [tMinB, tMaxB], qRange, cidx);
            return;
        }
        // Update t range.
        var span = pRange[1] - pRange[0];
        var tMin_ = tMin * span + pRange[0];
        var tMax_ = tMax * span + pRange[0];
        // Clip
        P_ = fromTo(P_)(tMin, tMax);
        if (Math.abs(tMax_ - tMin_) < δ) {
            var t1 = (tMax_ + tMin_) / 2;
            var pq = idx === 0 ? [ps1, ps2] : [ps2, ps1];
            var t2 = calcOtherT(t1, pq[0], pq[1]);
            if (t2 === undefined) {
                return undefined;
            }
            var ts = idx === 0 ? [t2, t1] : [t1, t2];
            tss.push(ts);
            return;
        }
        // Swap Q and P and iterate.
        intersection(P_, Q_, [tMin_, tMax_], qRange, cidx);
    }
    function geoClip(P, dQ, dMin, dMax) {
        var dPi = function dPi(i) {
            return dQ(P[i]);
        };
        var dPs = [0, 1, 2, 3].map(dPi);

        var _dPs = _slicedToArray(dPs, 4),
            dP0 = _dPs[0],
            dP1 = _dPs[1],
            dP2 = _dPs[2],
            dP3 = _dPs[3];

        var hq = toHybridQuadratic(P);
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
    /**
     * Return the given two beziers but translated such that the shorter (by
     * some length measure) is closer to the origin.
     * @private
     * @param P
     * @param Q
     */
    function center(P, Q) {
        var _P2 = P,
            _P3 = _slicedToArray(_P2, 4),
            P0 = _P3[0],
            P1 = _P3[1],
            P2 = _P3[2],
            P3 = _P3[3];

        var _Q2 = Q,
            _Q3 = _slicedToArray(_Q2, 4),
            Q0 = _Q3[0],
            Q1 = _Q3[1],
            Q2 = _Q3[2],
            Q3 = _Q3[3];

        var lengthP = sdst(P0, P1) + sdst(P1, P2) + sdst(P2, P3);
        var lengthQ = sdst(Q0, Q1) + sdst(Q1, Q2) + sdst(Q2, Q3);
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
    /**
     * Calculates the t-value of the closest point on Q to P(t).
     * @ignore
     * @param {number}
     * @param Q
     * @param P
     */
    function calcOtherT(t, P, Q) {
        var pp = evaluate(P)(t);

        var _pp = _slicedToArray(pp, 2),
            x = _pp[0],
            y = _pp[1];

        var tqsh = tsAtY(Q, y);
        var tqsv = tsAtX(Q, x);
        if (!tqsh.length && !tqsv.length) {
            return undefined;
        }
        var tqs = [].concat(_toConsumableArray(tqsh), _toConsumableArray(tqsv));
        var bestT = undefined;
        var bestD = Number.POSITIVE_INFINITY;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = tqs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var tq = _step2.value;

                var pq = evaluate(Q)(tq);
                var d = sdst(pp, pq);
                if (d < bestD) {
                    bestD = d;
                    bestT = tq;
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

        return bestT;
    }
}
/**
 * Get the implicit line equation from two 2d points in the form f(x,y) ax + by + c = 0
 * returned as the array [a,b,c].
 * @ignore
 * @param l - A line given by two points, e.g. [[2,0],[3,3]]
 * @returns {number[]}
 */
function getLineEquation(l) {
    var _l3 = _slicedToArray(l, 2),
        _l3$ = _slicedToArray(_l3[0], 2),
        x1 = _l3$[0],
        y1 = _l3$[1],
        _l3$2 = _slicedToArray(_l3[1], 2),
        x2 = _l3$2[0],
        y2 = _l3$2[1];

    var a = y1 - y2;
    var b = x2 - x1;
    var c = x1 * y2 - x2 * y1;
    return [a, b, c];
}
/**
 * @private
 * @param l
 */
function getDistanceToLineFunction(l) {
    var _getLineEquation = getLineEquation(l),
        _getLineEquation2 = _slicedToArray(_getLineEquation, 3),
        a = _getLineEquation2[0],
        b = _getLineEquation2[1],
        c = _getLineEquation2[2];

    return function (p) {
        return a * p[0] + b * p[1] + c;
    };
}
/**
 * Get the implicit line equation from two 2d points in the form f(x,y) ax + by + c = 0
 * where a^2 + b^2 = 1 returned as the array [a,b,c].
 * @param l - A line given by two points, e.g. [[2,0],[3,3]]
 * @example
 * getNormalizedLineEquation([[1,0],[5,3]]); //=> [-0.6, 0.8, 0.6]
 */
function getNormalizedLineEquation(l) {
    var _l4 = _slicedToArray(l, 2),
        _l4$ = _slicedToArray(_l4[0], 2),
        x1 = _l4$[0],
        y1 = _l4$[1],
        _l4$2 = _slicedToArray(_l4[1], 2),
        x2 = _l4$2[0],
        y2 = _l4$2[1];

    var a = y1 - y2;
    var b = x2 - x1;
    var c = x1 * y2 - x2 * y1;
    var norm = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    // Normalize it
    a = a / norm;
    b = b / norm;
    c = c / norm;
    return [a, b, c];
}
/**
 * Returns the given points (e.g. bezier) in reverse order.
 * @param ps
 * @returns {number[][]}
 */
function reverse(ps) {
    return ps.slice().reverse();
}
/**
 * <p>
 * Purely functional cubic bezier library, including robust
 * cubic-cubic bezier intersection.
 * </p>
 * <p>
 * A cubic bezier is represented as an array of points, i.e.
 * [p0, p1, p2, p3] where each point is an ordered pair, e.g.
 * [[0,0],[1,1],[2,1],[3,0]].
 * </p>
 */
var Bezier3 = {
    rotate: rotate,
    getX: getX,
    getY: getY,
    getDx: getDx,
    getDy: getDy,
    getDdx: getDdx,
    getDdy: getDdy,
    getDddx: getDddx,
    getDddy: getDddy,
    getBounds: getBounds,
    bezier3Intersection: bezier3Intersection,
    lineIntersection: lineIntersection,
    tsAtX: tsAtX,
    tsAtY: tsAtY,
    getBoundingHull: getBoundingHull,
    fromLine: fromLine,
    translate: translate,
    evaluate: evaluate,
    κ: κ,
    dκMod: dκMod,
    curvature: curvature,
    tangent: tangent,
    normal: normal,
    totalCurvature: totalCurvature,
    totalAbsoluteCurvature: totalAbsoluteCurvature,
    len: len,
    getTAtLength: getTAtLength,
    evaluateX: evaluateX,
    evaluateY: evaluateY,
    evaluateDx: evaluateDx,
    evaluateDy: evaluateDy,
    evaluateDdx: evaluateDdx,
    evaluateDdy: evaluateDdy,
    evaluateDddx: evaluateDddx,
    evaluateDddy: evaluateDddy,
    getBoundingBoxTight: getBoundingBoxTight,
    getBoundingBox: getBoundingBox,
    fromTo: fromTo,
    splitAt: splitAt,
    scale: scale,
    toCubic: toCubic,
    toQuadratic: toQuadratic,
    toHybridQuadratic: toHybridQuadratic,
    evaluateHybridQuadratic: evaluateHybridQuadratic,
    evaluateQuadratic: evaluateQuadratic,
    evaluateLinear: evaluateLinear,
    coincident: coincident,
    from0ToT: from0ToT,
    fromTTo1: fromTTo1,
    clone: clone,
    reverse: reverse
};
exports.default = Bezier3;

},{"flo-gauss-quadrature":40,"flo-graham-scan":41,"flo-memoize":46,"flo-poly":47,"flo-vector2d":55}],40:[function(_dereq_,module,exports){
'use strict';

// TODO A future improvement can be to use the Gauss–Kronrod rules
// to estimate the error and thus choose a number of constants based
// on the error.
// TODO In future, the constants can be calculated and cached so we can
// chooce any value for the order.


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
 * 
 * @param {function} f - The univariate function to be integrated
 * @param {number[]} interval - The integration interval
 * @param {number} order - Can be 2, 4, 8, or 16. Higher values give 
 * more accurate results but is slower - defaults to 16.
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function gaussQuadrature(f, interval, order) {
	order = order === undefined ? 16 : order;

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

module.exports = gaussQuadrature;

},{}],41:[function(_dereq_,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Vector = _dereq_('flo-vector2d');

var DELTA = 1e-10;

/**
 * Performs a functional stable sort on the given array and 
 * returns the newly sorted array.
 * @ignore
 */
function stableSort(arr, f) {
	var indxArray = [];
	for (var i = 0; i < arr.length; i++) {
		indxArray.push(i);
	}

	indxArray.sort(function (a, b) {
		var res = f(arr[a], arr[b]);

		if (res !== 0) {
			return res;
		}

		return a - b;
	});

	var sorted = [];
	for (var _i = 0; _i < arr.length; _i++) {
		sorted.push(arr[indxArray[_i]]);
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

	var temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
}

/**
 * @ignore
 */
function getSmallestIndxYThenX(ps) {
	var smallest = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
	var smallestI = void 0;
	for (var i = 0; i < ps.length; i++) {
		var y = ps[i][1];
		if (y < smallest[1] || y === smallest[1] && ps[i][0] < smallest[0]) {
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
 * @param {number[][]} ps_ - A set of points
 * @param {boolean} includeAllBoundaryPoints - Set this to true to if all boundary points
 * should be returned, even redundant ones - defaults to false
 * @param {number} delta - Tolerance at which three points are considered collinear -
 * defaults to 1e-10
 * @returns {number[][]}
 */
function grahamScan(ps_, includeAllBoundaryPoints, delta) {
	includeAllBoundaryPoints = !!includeAllBoundaryPoints;
	delta = delta === undefined ? DELTA : delta;

	function fail(p1, p2, p3) {
		var res = Vector.ccw(p1, p2, p3, delta);
		if (includeAllBoundaryPoints) {
			return res < 0;
		}
		return res <= 0;
	}

	var ps = ps_.slice();
	var n = ps.length;

	var idx = getSmallestIndxYThenX(ps);

	var _ps$splice = ps.splice(idx, 1),
	    _ps$splice2 = _slicedToArray(_ps$splice, 1),
	    p = _ps$splice2[0];

	ps = stableSort(ps, function (a, b) {
		var res = Vector.cross(Vector.fromTo(p, b), Vector.fromTo(p, a));
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

	var m = 1;
	for (var i = 2; i < n; i++) {
		while (fail(ps[m - 1], ps[m], ps[i])) {
			if (m > 1) {
				m -= 1;
				continue;
			} else if (i === n - 1) {
				m -= 1;
				break;
			} else {
				i += 1;
			}
		}

		m += 1;
		swap(ps, m, i);
	}

	return ps.slice(0, m + 1);
}

module.exports = grahamScan;

},{"flo-vector2d":55}],42:[function(_dereq_,module,exports){
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

},{"./src/tree-node":45,"./src/tree-node-color":43,"./src/tree-node-direction":44}],43:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeNodeColor;
(function (TreeNodeColor) {
    TreeNodeColor[TreeNodeColor["BLACK"] = 0] = "BLACK";
    TreeNodeColor[TreeNodeColor["RED"] = 1] = "RED";
})(TreeNodeColor || (TreeNodeColor = {}));
exports.default = TreeNodeColor;

},{}],44:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeNodeDirection;
(function (TreeNodeDirection) {
    TreeNodeDirection[TreeNodeDirection["LEFT"] = 0] = "LEFT";
    TreeNodeDirection[TreeNodeDirection["RIGHT"] = 1] = "RIGHT";
})(TreeNodeDirection || (TreeNodeDirection = {}));
exports.default = TreeNodeDirection;

},{}],45:[function(_dereq_,module,exports){
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

},{"./tree-node-color":43}],46:[function(_dereq_,module,exports){
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

},{}],47:[function(_dereq_,module,exports){
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
* <p>
* Simple & fast practical library functions for functional univariate
* polynomials over the reals (actually ECMAScript numbers, i.e. double
* floats).
* </p>
* <p>
* All polinomials are represented as a simple array starting with the
* highest non-zero power, e.g.
*   3x^3 + 5x^2 + 7x + 2 -> [3,5,7,2]
* </p>
* @ignore
*/
var FloPoly = Object.assign({}, core_operators_1.default, root_operators_1.default, root_bounds_1.default, error_analysis_1.default, { random: random_1.default,
    fromRoots: from_roots_1.default,
    allRoots: all_roots_recursive_1.default });
exports.default = FloPoly;

},{"./src/all-roots-recursive":48,"./src/core-operators":49,"./src/error-analysis":50,"./src/from-roots":51,"./src/random":52,"./src/root-bounds":53,"./src/root-operators":54}],48:[function(_dereq_,module,exports){
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

},{"./core-operators":49,"./root-bounds":53,"./root-operators":54}],49:[function(_dereq_,module,exports){
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

},{}],50:[function(_dereq_,module,exports){
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

},{"./core-operators":49}],51:[function(_dereq_,module,exports){
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

},{"./core-operators":49}],52:[function(_dereq_,module,exports){
'use strict';

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

},{"./from-roots":51}],53:[function(_dereq_,module,exports){
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

},{"./core-operators":49}],54:[function(_dereq_,module,exports){
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

},{"./core-operators":49}],55:[function(_dereq_,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Vector2d = function () {
    function Vector2d() {
        _classCallCheck(this, Vector2d);
    }

    _createClass(Vector2d, null, [{
        key: "dot",

        /**
         * Returns the dot (inner) product between two 2-vectors.
         * @param a - The first vector
         * @param b - The second vector
         */
        value: function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        }
        /**
         * Returns the cross product signed magnitude between two 2-vectors.
         * @param a - The first vector
         * @param b - The second vector
         */

    }, {
        key: "cross",
        value: function cross(a, b) {
            return a[0] * b[1] - a[1] * b[0];
        }
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

    }, {
        key: "ccw",
        value: function ccw(p1, p2, p3) {
            var delta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DELTA;

            var res = (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
            return Math.abs(res) <= delta ? 0 : res;
        }
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

    }, {
        key: "segSegIntersection",
        value: function segSegIntersection(ab, cd) {
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
        /**
        * Returns true if the two given 2d line segments intersect, false otherwise.
        * @param a - A line segment
        * @param b - Another line segment
        */

    }, {
        key: "doesSegSegIntersect",
        value: function doesSegSegIntersect(a, b) {
            var ccw = Vector2d.ccw;
            if (ccw(a[0], a[1], b[0]) * ccw(a[0], a[1], b[1]) > 0) {
                return false;
            } else if (ccw(b[0], b[1], a[0]) * ccw(b[0], b[1], a[1]) > 0) {
                return false;
            }
            return true;
        }
        /**
        * Returns the squared distance between two 2d points.
        * @param p1 - A point
        * @param p2 - Another point
        */

    }, {
        key: "squaredDistanceBetween",
        value: function squaredDistanceBetween(p1, p2) {
            var x = p2[0] - p1[0];
            var y = p2[1] - p1[1];
            return x * x + y * y;
        }
        /**
        * Returns a scaled version of the given 2-vector.
        * @param p - A vector
        * @param factor - A scale factor
        */

    }, {
        key: "scale",
        value: function scale(p, factor) {
            return [p[0] * factor, p[1] * factor];
        }
        /**
        * Returns the given 2-vector reversed.
        * @param p - A vector
        */

    }, {
        key: "reverse",
        value: function reverse(p) {
            return [-p[0], -p[1]];
        }
        /**
        * Returns the given 2-vector scaled to a length of one.
        * @param p - A vector
        */

    }, {
        key: "toUnitVector",
        value: function toUnitVector(p) {
            var scaleFactor = 1 / Vector2d.len(p);
            return [p[0] * scaleFactor, p[1] * scaleFactor];
        }
        /**
        * Returns the given 2-vector scaled to the given length.
        * @param p - A vector
        * @param length - The length to scale to
        */

    }, {
        key: "toLength",
        value: function toLength(p, len) {
            var scaleFactor = len / Vector2d.len(p);
            return [p[0] * scaleFactor, p[1] * scaleFactor];
        }
        /**
        * Returns the second 2-vector minus the first.
        * @param p1 - The first vector
        * @param p2 - The second vector
        */

    }, {
        key: "fromTo",
        value: function fromTo(p1, p2) {
            return [p2[0] - p1[0], p2[1] - p1[1]];
        }
        /**
        * Performs linear interpolation between two 2d points and returns the resultant point.
        * @param p1 - The first point.
        * @param p2 - The second point.
        * @param t - The interpolation fraction (often in [0,1]).
        */

    }, {
        key: "interpolate",
        value: function interpolate(p1, p2, t) {
            return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
        }
        /**
        * Returns the mean of two 2d points.
        * @param ps - The two points
        */

    }, {
        key: "mean",
        value: function mean(ps) {
            var p1 = ps[0];
            var p2 = ps[1];
            return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        }
        /**
        * Returns the distance between two 2d points.
        * @param p1 - A point.
        * @param p2 - Another point.
        */

    }, {
        key: "distanceBetween",
        value: function distanceBetween(p1, p2) {
            return Math.sqrt(Vector2d.squaredDistanceBetween(p1, p2));
        }
        /**
        * Returns the length of the given 2-vector.
        * @param p - A vector
        */

    }, {
        key: "len",
        value: function len(p) {
            return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
        }
        /**
        * Returns the squared length of the given 2-vector.
        * @param p - A vector
        */

    }, {
        key: "lengthSquared",
        value: function lengthSquared(v) {
            return v[0] * v[0] + v[1] * v[1];
        }
        /**
        * Returns the Manhattan distance between two 2d points.
        * @param p1 - A point.
        * @param p2 - Another point.
        */

    }, {
        key: "manhattanDistanceBetween",
        value: function manhattanDistanceBetween(p1, p2) {
            return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
        }
        /**
        * Returns the Manhattan length of the given 2-vector.
        * @param p - A vector
        */

    }, {
        key: "manhattanLength",
        value: function manhattanLength(p) {
            return Math.abs(p[0]) + Math.abs(p[1]);
        }
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

    }, {
        key: "distanceBetweenPointAndLine",
        value: function distanceBetweenPointAndLine(p, l) {
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
        /**
        * Returns the squared distance between the given point and line segment.
        * @param p - A point
        * @param l - A line
        */

    }, {
        key: "squaredDistanceBetweenPointAndLineSegment",
        value: function squaredDistanceBetweenPointAndLineSegment(p, l) {
            var sqDst = Vector2d.squaredDistanceBetween;
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
        /**
        * Returns the circumcenter of the given 2d triangle.
        * @param triangle
        */

    }, {
        key: "circumCenter",
        value: function circumCenter(triangle) {
            // See wikipedia
            var p1 = triangle[0];
            var p2 = triangle[1];
            var p3 = triangle[2];
            var sqLen = Vector2d.lengthSquared;
            var Sx = 0.5 * Vector2d.det3([sqLen(p1), p1[1], 1], [sqLen(p2), p2[1], 1], [sqLen(p3), p3[1], 1]);
            var Sy = 0.5 * Vector2d.det3([p1[0], sqLen(p1), 1], [p2[0], sqLen(p2), 1], [p3[0], sqLen(p3), 1]);
            var a = Vector2d.det3([p1[0], p1[1], 1], [p2[0], p2[1], 1], [p3[0], p3[1], 1]);
            var b = Vector2d.det3([p1[0], p1[1], sqLen(p1)], [p2[0], p2[1], sqLen(p2)], [p3[0], p3[1], sqLen(p3)]);
            return [Sx / a, Sy / a];
        }
        /**
        * <p>
        * Returns the incenter of the given triangle.
        * </p>
        * <p>
        * See Wikipedia - https://en.wikipedia.org/wiki/Incenter
        * </p>
        * @param triangle
        */

    }, {
        key: "inCenter",
        value: function inCenter(triangle) {
            var dst = Vector2d.distanceBetween;
            var p1 = triangle[0];
            var p2 = triangle[1];
            var p3 = triangle[2];
            var l1 = dst(p2, p3);
            var l2 = dst(p1, p3);
            var l3 = dst(p1, p2);
            var lengthSum = l1 + l2 + l3;
            return [(l1 * p1[0] + l2 * p2[0] + l3 * p3[0]) / lengthSum, (l1 * p1[1] + l2 * p2[1] + l3 * p3[1]) / lengthSum];
        }
        /**
        * Returns the centroid of the given polygon, e.g. triangle. The polygon
        * must be simple, i.e. not self-intersecting.
        * @param polygon
        */

    }, {
        key: "centroid",
        value: function centroid(polygon) {
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
        /**
        * Calculate the determinant of three 3d vectors, i.e. 3x3 matrix
        * @ignore
        * @param x - A 2d vector
        * @param y - Another 2d vector
        * @param z - Another 2d vector
        */

    }, {
        key: "det3",
        value: function det3(x, y, z) {
            return x[0] * (y[1] * z[2] - y[2] * z[1]) - x[1] * (y[0] * z[2] - y[2] * z[0]) + x[2] * (y[0] * z[1] - y[1] * z[0]);
        }
    }, {
        key: "translate",
        value: function translate(a, b) {
            function f(b) {
                return [a[0] + b[0], a[1] + b[1]];
            }
            // Curry the function
            return b === undefined ? f : f(b);
        }
    }, {
        key: "rotate",
        value: function rotate(sinθ, cosθ, p) {
            var a = Vector2d.translatePs([1, 2]);
            function rotateByθ(p) {
                return [p[0] * cosθ - p[1] * sinθ, p[0] * sinθ + p[1] * cosθ];
            }
            // Curry the function
            return p === undefined ? rotateByθ : rotateByθ(p);
        }
        /**
        * Returns true if two 2-vectors are identical (by value), false otherwise.
        * @param a - A 2d vector
        * @param b - Another 2d vector
        */

    }, {
        key: "equal",
        value: function equal(a, b) {
            return a[0] === b[0] && a[1] === b[1];
        }
        /**
        * Returns a anti-clockwise rotated version of the given 2-vector given the
        * sine and cosine of the angle.
        * @param p - A 2d vector
        * @param sinθ
        * @param cosθ
        */

    }, {
        key: "reverseRotate",
        value: function reverseRotate(sinθ, cosθ, p) {
            return [+p[0] * cosθ + p[1] * sinθ, -p[0] * sinθ + p[1] * cosθ];
        }
        /**
        * Returns a 90 degrees rotated version of the given 2-vector.
        * @param p - A 2d vector
        */

    }, {
        key: "rotate90Degrees",
        value: function rotate90Degrees(p) {
            return [-p[1], p[0]];
        }
        /**
        * Returns a negative 90 degrees rotated version of the given 2-vector.
        * @param p - A 2d vector
        */

    }, {
        key: "rotateNeg90Degrees",
        value: function rotateNeg90Degrees(p) {
            return [p[1], -p[0]];
        }
        /**
        * Transforms the given 2-vector by applying the given function to each
        * coordinate.
        * @param p - A 2d vector
        * @param f - A transformation function
        */

    }, {
        key: "transform",
        value: function transform(p, f) {
            return [f(p[0]), f(p[1])];
        }
        /**
        * Returns the closest point to the array of 2d points, optionally providing
        * a distance function.
        * @param p
        * @param ps
        * @param f - Optional distance function - defaults to
        * Vector2d.squaredDistanceBetween
        */

    }, {
        key: "getClosestTo",
        value: function getClosestTo(p, ps) {
            var cp = undefined; // Closest Point
            var bestd = Number.POSITIVE_INFINITY;
            for (var i = 0; i < ps.length; i++) {
                var p_ = ps[i];
                var d = Vector2d.squaredDistanceBetween(p, p_);
                if (d < bestd) {
                    cp = p_;
                    bestd = d;
                }
            }
            return cp;
        }
        /**
        * Returns an array of points by applying a translation and then rotation to
        * the given points.
        * @param v - The translation vector
        * @param sinθ
        * @param cosθ
        * @param ps - The input points
        **/

    }, {
        key: "translateThenRotatePs",
        value: function translateThenRotatePs(v, sinθ, cosθ, ps) {
            var translate = Vector2d.translate(v);
            return ps.map(function (p) {
                return Vector2d.rotate(sinθ, cosθ, translate(p));
            });
        }
        /**
        * Returns an array of points by applying a rotation and then translation to
        * the given points.
        * @param sinθ
        * @param cosθ
        * @param v - The translation vector
        * @param ps - The input points
        **/

    }, {
        key: "rotateThenTranslatePs",
        value: function rotateThenTranslatePs(sinθ, cosθ, v, ps) {
            return ps.map(function (p) {
                return Vector2d.translate(v, Vector2d.rotate(sinθ, cosθ, p));
            });
        }
    }]);

    return Vector2d;
}();
/**
* Return the given 2d points translated by the given 2d vector. This
* function is curried.
* @param v
* @param ps
*/


Vector2d.translatePs = mapCurry2(Vector2d.translate);
/**
* Return the given 2d points translated by the given 2d vector. This function
* is curried.
* @param sinθ
* @param cosθ
* @param ps
*/
Vector2d.rotatePs = specialMapCurry(Vector2d.rotate);
exports.default = Vector2d;

},{}]},{},[1])(1)
});