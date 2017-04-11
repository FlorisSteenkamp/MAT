(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Circle = require('./geometry/classes/circle.js');
var getNodesAsArray = require('./mat/functions/get-nodes-as-array.js');
var ListNode = require('./linked-loop/list-node.js');
var LinkedLoop = require('./linked-loop/linked-loop.js');
var Vector = require('./vector/vector.js');
var PointOnShape = require('./geometry/classes/point-on-shape.js');

/**
 * General debugging and demoing for the Medial Axis Transform (MAT)
 * library.
 * 
 * This file is not to be bundled with the library file to reduce the
 * library file size. Include it seperately in a <script> tag in your
 * html file if needed. This also means MatDebug will be on the global
 * scope. 
 */

/**
 * @param draw
 * @param drawStuff
 * @param run
 * @param shape
 * @param setViewBox
 * @param Vector class
 */
function MatDebug(draw, drawStuff, run, setViewBox, Vector, beziersToDraw, shouldDrawSATTree) {

	this.draw = draw;
	this.drawStuff = drawStuff;
	this.run = run;
	this.setViewBox = setViewBox;
	this.Vector = Vector;
	this.beziersToDraw = beziersToDraw;
	this.shouldDrawSATTree = shouldDrawSATTree;
	//this.Treant = Treant;

	this.elems = [];
	this.elemCount = 0;
	this.twoProngs = [];
	this.threeProngs = [];
	this.nProngs = [];
	this.cpCalcs = 0;
	this.rootsSkipped = 0;
	this.rootsNotSkipped = 0;
	this.skipped = {
		stage0: 0,
		stage1: 0,
		stage2: 0,
		stage3: 0
	};
	this.notSkipped = {
		stage0: 0,
		stage1: 0,
		stage2: 0,
		stage3: 0
	};

	this.generated = {
		nodeHash: {},
		cpHash: {},
		cpArr: []
	};

	this.mat;
	this.sat;

	this.state = {
		selectedCp: undefined
	};

	//---- Namespaced functions
	this.fs = {
		threeProng: {
			drawSpokes: function drawSpokes(n) {
				return _drawSpokes(this, n);
			}
		},
		cp: {
			log: cp.log(this),
			draw: cp.draw(this),
			selectNext: cp.next(this),
			selectPrevOnCircle: cp.prevOnCircle(this)

		}
	};

	this.deltasToNiceStr = deltasToNiceStr;
	this.pointsToNiceStr = pointsToNiceStr;
}

function deltaToNiceString(delta) {
	return delta.map(function (cpNode) {
		return cpNode.item.key;
	});
}

function pToStr5(p) {
	return p[0].toFixed(5) + ', ' + p[1].toFixed(5);
}

function pointsToNiceStr(ps) {
	return ps.map(pToStr5);
}

function deltasToNiceStr(deltas) {
	return deltas.map(deltaToNiceString);
}

var cp = {
	log: function log(_debug_) {
		return function () {
			var cpNode = _debug_.state.selectedCp;
			var cp = cpNode.item;
			console.log(cpNode);
			console.log(PointOnShape.toString(cp.pointOnShape));
		};
	},
	next: function next(_debug_) {
		return function () {
			_debug_.state.selectedCp = _debug_.state.selectedCp.next;
		};
	},
	prevOnCircle: function prevOnCircle(_debug_) {
		return function () {
			_debug_.state.selectedCp = _debug_.state.selectedCp.prevOnCircle;
		};
	},
	draw: function draw(_debug_) {
		return function () {
			_debug_.draw.crossHair(_debug_.state.selectedCp.item, 'blue thin5 nofill', 1);
		};
	}
};

function getHashCount(hash) {
	var c = 0;

	for (key in hash) {
		c++;
	}

	return c;
}

MatDebug.prototype.drawSATTree = function (tree) {

	var bucketSizes = [];

	function getNodeStructure(key, t) {

		var type = key === '5' ? 'M' : key;

		if (type === 'M') {
			type = 'M-' + t.size;

			bucketSizes.push(t.size);
		}

		var node = {
			text: { name: type },
			children: []
		};

		for (var _key in t) {
			var n = t[_key];

			node.children.push(getNodeStructure(_key, n));
		}

		return node;
	}

	var cfg = {
		chart: { container: "#mat-tree" },
		nodeStructure: getNodeStructure('root', tree)
	};

	// Treant tree drawer removed so we can use d3 in the future.
	//new Treant( cfg ); // Draw the tree

	bucketSizes.sort(function (a, b) {
		return a - b;
	});
};

MatDebug.prototype.getDistanceBetween = function () {
	for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return Vector.distanceBetween(args);
};

MatDebug.prototype.drawDot = function (p, r, color) {
	return this.draw.dot(p, r, color);
};

MatDebug.prototype.testNProng_1 = function () {
	this.setViewBox([65, 287, 85, 72]);
	//d.highlightBeziers('36,37,430,431')	
};

MatDebug.prototype.test2Prong_2 = function () {
	this.traceNProng(13);
	this.drawDot([118.83, 333.59], 0.3, 'green');
	this.drawDot([122.26, 332.36], 0.3, 'green');
	this.drawDot([103.9345546632512, 292.8475727546303], 0.3, 'green');
	this.drawDot([102.28082651515273, 293.73728721662496], 0.3, 'green');

	this.drawDot([102.28082651515273, 293.73728721662496], 0.1, 'yellow');
	this.drawDot([118.83, 333.59], 0.1, 'yellow');
};

MatDebug.prototype.test2Prong_1 = function () {
	this.setViewBox([126, 201, 179, 146]);
	d.trace2ProngConvergence(46);

	var p1 = [198.71, 308.17];
	var p2 = [186.1136043817149, 278.1427194133067];
	var p3 = [156.89, 263.78];

	$timeout();
};

/**
 * @param n The bezier indx.
 * Only logs the bezier at this stage, if working at all.
 */
MatDebug.prototype.drawBezierArcs = function (n) {
	var shape = this.shape;

	var bezArr = beziers.nodeArr;
	var bezier = bezArr[n];

	console.log(bezier);
};

MatDebug.prototype.logBezierInterfaceAngles = function () {
	// TODO Incomplete
	var tan1 = bezier.tangent(1);
	var tan2 = node.next.item.tangent(0);
	var crossTangents = Vector.cross(tan1, tan2);

	var str = "tangents (degrees): " + Util.radToDeg(Math.asin(crossTangents)).toFixed(8);
};

MatDebug.prototype.remove = function (n) {
	this.elems[n].remove();
};

MatDebug.prototype.log2ProngDelta = function (n) {
	var delta = this.twoProngs[n].delta;

	console.log(delta);
};

MatDebug.prototype.log2Prong = function (n) {
	var twoProng = this.twoProngs[n];

	console.log(twoProng);
};

MatDebug.prototype.draw2ProngNormal = function (n) {
	// If not specified which, draw all
	if (n === undefined) {
		for (var i = 0; i < this.twoProngs.length; i++) {
			this.draw2ProngNormal(i);
		}
	}

	var twoProng = this.twoProngs[n];

	if (!twoProng) {
		return;
	}

	this.draw.line([twoProng.y, twoProng.x], 'thin10 blue');
};

MatDebug.prototype.log2ProngDeltaBasic = function (n) {
	var delta = this.twoProngs[n].delta;

	var f = function f(x) {
		return {
			bez: x.item.pointOnShape.bezierNode.item.indx,
			t: x.item.pointOnShape.t,
			order: x.item.pointOnShape.order
		};
	};

	console.log(f(delta[0]));
	console.log(f(delta[1]));
};

MatDebug.prototype.traceNProng = function (n) {
	//console.log(this.nProngs[n])
	//console.log(this.threeProngs[n])
	//let nProng = this.nProngs[n];
	var threeProng = this.nProngs[n];
	//let threeProng = nProng;
	var dbgInfo = threeProng.dbgInfo;
	var cs = dbgInfo.cs;

	console.log(threeProng);
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = cs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var c = _step.value;

			this.draw.dot(c.x, 0.2, 'cyan');
			c.radius = c.ccr;
			c.center = c.x;
			this.draw.circle(c, 'cyan thin20 nofill');
			//bps.map(function(p) { draw.dot(p, 0.03, 'blue'); });	
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
};

MatDebug.prototype.logNProngDelta = function (n) {
	var nProng = this.nProngs[n];

	console.log(nProng.deltas);
};

MatDebug.prototype.logNProngDeltaBasic = function (n) {
	var nProng = this.nProngs[n];

	var f = function f(x) {
		return {
			bez: x.item.pointOnShape.bezierNode.item.indx,
			t: x.item.pointOnShape.t,
			order: x.item.pointOnShape.order
		};
	};

	for (var i = 0; i < nProng.deltas.length; i++) {
		var delta = nProng.deltas[i];

		console.log(f(delta[0]), f(delta[1]));
		//console.log();	
	}
};

MatDebug.prototype.testNProng_2 = function () {
	this.setViewBox([68, 290, 85, 56]);

	d.draw2ProngNormal(41);
	d.draw2ProngNormal(42);
	d.logNProngDeltaBasic(0);

	$timeout();
};

MatDebug.prototype.testNProng_3 = function () {
	this.run();
	this.setViewBox([10, 286, 84, 90]);
	//d.draw2Prong(34, 'thin10')
	//d.highlightBeziers('36,37,430,431')
	//d.draw2ProngNormal(34);
	//d.draw2ProngNormal(42);
	d.logNProngDeltaBasic(1);

	$timeout();
};

function _drawSpokes(debug, n) {
	var nProng = debug.nProngs[n];
	var threeProng = nProng.threeProng;

	console.log(threeProng);
	var cc = threeProng.circle.center;
	var ps = threeProng.ps;
	debug.draw.line([ps[0], cc], 'thin5 red');
	debug.draw.line([ps[1], cc], 'thin5 red');
	debug.draw.line([ps[2], cc], 'thin5 red');
};

MatDebug.prototype.highlightBeziers = function (rangeStr) {
	var COLORS = ['red', 'green', 'blue'];

	var indxs = Util.rangeStrToIndxArray(rangeStr);

	var i = 0;
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = indxs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var indx = _step2.value;

			i++;

			var _bezier = LinkedLoop.getByIndx(shape.beziers, indx);

			var color = COLORS[i % COLORS.length];
			draw.bezier(_bezier, 'nofill thin20 ' + color);
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
};

MatDebug.prototype.drawSomeStuff = function (shape) {
	//this.draw.bezierArcs(shape);

	this.draw.looseBoundingBoxes(shape, 'thin2 brown nofill');
	this.draw.tightBoundingBoxes(shape, 'thin2 black nofill');

	var beziersToDraw = this.beziersToDraw;

	var nodeStart = LinkedLoop.getByIndx(shape.beziers, beziersToDraw[0]);
	var nodeEnd = LinkedLoop.getByIndx(shape.beziers, beziersToDraw[1] + 1);

	this.draw.beziers(shape, nodeStart, nodeEnd);
};

MatDebug.prototype.trace2ProngConvergence = function (n_, failedOnly) {

	var n = void 0;
	if (failedOnly) {
		var j = 0;
		for (var i = 0; i < this.twoProngs.length; i++) {
			var _twoProngInfo = this.twoProngs[i];
			if (_twoProngInfo.failed) {
				if (n_ === j) {
					n = i;
					console.log(n);
					break;
				}

				j++;
			}
		}
	} else {
		n = n_;
	}

	if (!n) {
		return;
	}

	var twoProngInfo = this.twoProngs[n];
	var twoProng = twoProngInfo.twoProng;

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = twoProngInfo.xs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var x = _step3.value;

			this.draw.crossHair(x.x, 'blue thin10 nofill');
			var circle = new Circle(x.x, Vector.distanceBetween(x.x, x.y));
			this.draw.circle(circle, 'blue thin10 nofill');
			this.draw.crossHair(x.z, 'yellow thin10 nofill', 2);
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

	console.log(twoProngInfo.xs.map(function (x) {
		return {
			x: x.x,
			y: x.y,
			z: x.z,
			d: Vector.squaredDistanceBetween(x.y, x.z),
			t: x.t
		};
	}));

	this.draw2ProngNormal(n);

	return 'Failed: ' + twoProngInfo.failed;
};

MatDebug.prototype.logNearestNProng = function (p, twoProngsOnly) {
	var _this = this;

	var matNodes = getNodesAsArray(this.mat);

	var ps = matNodes.filter(function (node) {
		if (twoProngsOnly) {
			return node.matCircle.cpNodes.length === 2;
		} else {
			return node.matCircle.cpNodes.length !== 2;
		}
	}).map(function (node) {
		return node.matCircle.circle.center;
	});
	var q = getClosestPointToPoints(ps, p);

	var key = PointOnShape.makeSimpleKey(q);
	var nodeHashDebugObj = this.generated.nodeHash[key];
	var matNode = nodeHashDebugObj.matNode;
	var matCircle = matNode.matCircle;

	var cpHashDebugObjs = matCircle.cpNodes.map(function (cpNode) {
		return _this.generated.cpHash[cpNode.item.simpleKey];
	});

	console.log(nodeHashDebugObj);
	console.log(cpHashDebugObjs);
	console.log(cpHashDebugObjs.map(function (x) {
		if (!x) {
			return;
		}
		return x.visitedPointsArr.map(function (x) {
			return x.map(function (x) {
				return {
					cpNode: x,
					cp: x.item,
					pos: x.item.pointOnShape,
					0: x.item.pointOnShape[0],
					1: x.item.pointOnShape[1]
				};
			});
		});
	}));

	console.log(cpHashDebugObjs.map(function (x) {
		if (!x) {
			return;
		}
		return x.visitedPointsArr.map(function (x) {
			return x.map(function (x) {
				return MatLib.PointOnShape.toString(x.item.pointOnShape);
			});
		});
	}));

	var circle = new Circle(matCircle.circle.center, matCircle.circle.radius || 1);

	//this.draw.circle(circle, 'green thin10 nofill');


	if (twoProngsOnly) {
		var n = void 0;
		for (var i = 0; i < this.twoProngs.length; i++) {
			var twoProngInfo = this.twoProngs[i];
			var twoProng = twoProngInfo.twoProng;
			var cc = twoProng.item.matCircle.circle.center;
			//console.log(twoProngInfo);
			if (q[0] === cc[0] && q[1] === cc[1]) {
				n = i;
				break;
			}
		}

		if (n) {
			this.trace2ProngConvergence(n);
		}
	}
};

/**
 * Simple O(n^2) implementation.
 */
function getClosestPointToPoints(ps, p) {
	var minD = Number.POSITIVE_INFINITY;
	var closestPoint = void 0;

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = ps[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var q = _step4.value;

			var _d = Vector.distanceBetween(q, p);

			if (_d < minD) {
				minD = _d;

				closestPoint = q;
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

	return closestPoint;
}

module.exports = MatDebug;

},{"./geometry/classes/circle.js":5,"./geometry/classes/point-on-shape.js":6,"./linked-loop/linked-loop.js":14,"./linked-loop/list-node.js":15,"./mat/functions/get-nodes-as-array.js":30,"./vector/vector.js":43}],2:[function(require,module,exports){
'use strict';

var MAT_CONSTANTS = require('../../mat-constants.js');
var Vector = require('../../vector/vector.js');

/** 
 * @constructor 	
 * 	
 * @param p {number[]} - The point coordinates.
 * @param {ListNode<Bezier>} bezierNode	
 * @param t
 * @param type {MAT_CONSTANTS.pointType} 	
 *  'osculating'        : 0, // Osculating - Max curvatre inward,   	
 *  'sharp'             : 1, // Sharp corner, 	
 *  'dull'              : 2, // dull corner, 	
 *  'reverseOsculating' : 3, // Osculating - Max curvature outward, 	
 *  'standard'          : 4, // just another point
 * @param {Number} order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates or t values.   
 * @param {Circle} circle - The osculating circle at this point.
 * @param {Number} sharpness - Measure of corner sharpness.
 *   	
 */
// TODO - The order property should be a property of ContactPoint instead.
var PointOnShape = function PointOnShape(p, bezierNode, t, type, order, osculatingCircle, sharpness) {

	this.bezierNode = bezierNode;
	this.t = t;
	this.type = type;
	this.order = order; // z-order order arbitration decider to make all points on the shape well-ordered
	this.osculatingCircle = osculatingCircle;
	this.sharpness = sharpness;
	//if (sharpness) { console.log(sharpness); }

	this.simpleKey = PointOnShape.makeSimpleKey(p);
	//this.p = p; // TODO - see below

	//---- Cache
	// Removed 2 lines below - if {PointOnShape} is called as parameter 
	// it will more likely result in monomorphic behaviour as opposed 
	// to polymorphic or megamorphic
	this[0] = p[0];
	this[1] = p[1];
	this.key = PointOnShape.toString(this);
};

function dullCornerAt(shape, p) {

	var dullCornerHash = shape.dullCornerHash;
	var key = PointOnShape.makeSimpleKey(p); // First point

	var result = dullCornerHash[key] || null;

	//console.log(result);

	return result;
}

/**
 * Sets the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 *
 * Notes: Modifies p
 * 
 * @param {PointOnShape} p 
 * 
 */
PointOnShape.setPointOrder = function (shape, circle, p, _debug_) {

	var dullCorner = dullCornerAt(shape, p);

	if (!dullCorner) {
		return; /* or use different scheme */
	}

	//let bez = dullCorner.pointOnShape.bezierNode.item;
	var bez = dullCorner.bezier;
	var tan1pre = bez.tangent(1);

	var tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
	var tan2 = Vector.toUnitVector(Vector.fromTo(p, circle.center));

	var crossTangents = -Vector.dot(tan1, tan2);

	p.order = crossTangents;
	p.key = PointOnShape.toString(p);

	if (_debug_) {
		// TODO Add a _debug_ flag to switch this on or off.
		if (_debug_.drawStuff) {
			if (dullCorner) {
				//_debug_.draw.line([p, circle.center], 'red thin5');
			}
		}
	}

	return p.order;
};

/**	
 * Return a new point on the shape from given point shifted by a given t distance	
 * 	
 * Δt The distance to shift the point	
 * 	
 * @return {PointOnShape} Shifted point  	
 */
PointOnShape.shift = function (p, Δt) {

	if (Δt <= -1 || Δt >= 1) {
		// TODO: relatively easy to support the case where Δt can by any {Number}	
		throw 'Δt not in range (-1, 1); Δt was ' + Δt;
	}

	var newBezierNode = p.bezierNode;

	var t = p.t + Δt;
	if (t < 0) {
		t = t + 1;
		newBezierNode = newBezierNode.prev;
	} else if (t > 1) {
		t = t - 1;
		newBezierNode = newBezierNode.next;
	}

	//console.log(p.t, Δt, t, newBezierNode.item.evaluate(t));	

	return new PointOnShape(newBezierNode.item.evaluate(t), newBezierNode, t, MAT_CONSTANTS.pointType.standard, 0 /* order */
	);
};

PointOnShape.cloneAndAdv = function (p) {
	return new PointOnShape(p.bezierNode.item.evaluate(p.t), p.bezierNode, p.t, p.type, p.order + p.order / 111111111111 // hack  	
	);
};

/**	
 * Takes a single point and splits it and moves it apart along shape boundary.	
 * 	
 * @param p {PointOnShape} pointOnShape 
 * @param Δt {Number} The distance (in t) to move the points apart. Ideally we would	
 *        much prefer a pixel distance, but the implementation would be more complex. 	
 * 	
 * @return Splitted points as array, i.e. [p1,p2]	
 */
PointOnShape.split = function (p, Δt) {
	return [PointOnShape.shift(p, -Δt), PointOnShape.shift(p, +Δt)];
};

PointOnShape.splitForward = function (p, Δt) {
	return [p, PointOnShape.shift(p, +2 * Δt)];
};

PointOnShape.splitBack = function (p, Δt) {
	return [PointOnShape.shift(p, -2 * Δt), p];
};

function typeToStr(type) {
	for (var key in MAT_CONSTANTS.pointType) {
		if (MAT_CONSTANTS.pointType[key] === type) {
			return key;
		}
	}

	return undefined;
}

PointOnShape.toString = function (p) {
	return '' + p[0] + ', ' + p[1] + '|' + p.order + '|' + p.type;
};

PointOnShape.toHumanString = function (p) {
	var str = '' + p[0] + ', ' + p[1] + ' | bz: ' + p.bezierNode.item.indx + ' | t: ' + p.t + ' | ord: ' + p.order + ' | ';
	return str + typeToStr(p.type);
};

PointOnShape.makeSimpleKey = function (p) {
	return '' + p[0] + ', ' + p[1];
};

PointOnShape.compare = function (a, b) {
	var res = a.bezierNode.item.indx - b.bezierNode.item.indx;

	if (res !== 0) {
		return res;
	}

	res = a.t - b.t;
	if (res !== 0) {
		return res;
	}

	return a.order - b.order;
};

module.exports = PointOnShape;

},{"../../mat-constants.js":17,"../../vector/vector.js":43}],3:[function(require,module,exports){
"use strict";

/** 
 * Standard arc class.
 * 
 * If circle === null then the arc degenerates into a line segment 
 * given by sin_angle1 and cos_angle2 which now represent points.
 * 
 * The arc curve is always defined as the piece from angle1 -> angle2.
 * 
 * Note: startpoint and endpoint is redundant 
 */

var Arc = function Arc(circle, startpoint, endpoint, sin_angle1, cos_angle1, sin_angle2, cos_angle2) {

	this.circle = circle;
	this.startpoint = startpoint; // Redundant but useful
	this.endpoint = endpoint; // Redundant but useful	
	this.sin_angle1 = sin_angle1;
	this.sin_angle2 = sin_angle2;
	this.cos_angle1 = cos_angle1;
	this.cos_angle2 = cos_angle2;
};

module.exports = Arc;

},{}],4:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Util = require('../../utils.js');
var Poly = require('../../polynomial/polynomial.js');
var gaussQuadrature = require('../../numerical/functions/gaussian-quadrature.js');
var Vector = require('../../vector/vector.js');

/**
 * The Bezier class represents a bezier, possibly in the context of a 
 * shape.
 * 
 * @param bezierPoints
 * @param indx
 * @returns
 */
function Bezier(bezierPoints, indx) {

	this.indx = indx;

	//---- Bernstein basis representation

	var _bezierPoints = _slicedToArray(bezierPoints, 4),
	    _bezierPoints$ = _slicedToArray(_bezierPoints[0], 2),
	    x0 = _bezierPoints$[0],
	    y0 = _bezierPoints$[1],
	    _bezierPoints$2 = _slicedToArray(_bezierPoints[1], 2),
	    x1 = _bezierPoints$2[0],
	    y1 = _bezierPoints$2[1],
	    _bezierPoints$3 = _slicedToArray(_bezierPoints[2], 2),
	    x2 = _bezierPoints$3[0],
	    y2 = _bezierPoints$3[1],
	    _bezierPoints$4 = _slicedToArray(_bezierPoints[3], 2),
	    x3 = _bezierPoints$4[0],
	    y3 = _bezierPoints$4[1];

	//---- Power basis representation


	var x = [x3 - 3 * x2 + 3 * x1 - x0, // t^3
	3 * x2 - 6 * x1 + 3 * x0, // t^2
	3 * x1 - 3 * x0, // t^1
	x0];
	var y = [y3 - 3 * y2 + 3 * y1 - y0, // t^3
	3 * y2 - 6 * y1 + 3 * y0, // t^2
	3 * y1 - 3 * y0, // t^1
	y0];

	var evaluateX = Poly.evaluate(x); // Function of t
	var evaluateY = Poly.evaluate(y); // Function of t

	var dx = Poly.differentiate(x); // Polynomial in t
	var dy = Poly.differentiate(y); // Polynomial in t

	var evaluateDx = Poly.evaluate(dx); // Function of t
	var evaluateDy = Poly.evaluate(dy); // Function of t

	var ddx = Poly.differentiate(dx); // Polynomial in t
	var ddy = Poly.differentiate(dy); // Polynomial in t

	var evaluateDdx = Poly.evaluate(ddx); // Function of t
	var evaluateDdy = Poly.evaluate(ddy); // Function of t


	var straightLength = Math.sqrt((x3 - x0) * (x3 - x0) + (y3 - y0) * (y3 - y0));
	var sinAngle = (y3 - y0) / straightLength;
	var cosAngle = (x3 - x0) / straightLength;

	/**
  * Returns the differential of length at t.
  */
	function ds(t) {
		var dx_ = evaluateDx(t);
		var dy_ = evaluateDy(t);

		return Math.sqrt(dx_ * dx_ + dy_ * dy_);
	}

	var curveLength = undefined;
	function getCurveLength() {
		if (curveLength) {
			return curveLength;
		}

		// Numerically integrate the curve length
		var result = gaussQuadrature(ds, [0, 1]);
		curveLength = result;

		return result;
	}

	function κ(t) {
		var dx_ = evaluateDx(t);
		var dy_ = evaluateDy(t);
		var ddx_ = evaluateDdx(t);
		var ddy_ = evaluateDdy(t);
		var denom = dx_ * dx_ + dy_ * dy_;

		return (dx_ * ddy_ - dy_ * ddx_) / Math.sqrt(denom * denom * denom);
	}

	function κTimesSDiff(t) {
		var dx_ = evaluateDx(t);
		var dy_ = evaluateDy(t);
		var ddx_ = evaluateDdx(t);
		var ddy_ = evaluateDdy(t);
		var denom = dx_ * dx_ + dy_ * dy_;

		return (dx_ * ddy_ - dy_ * ddx_) / denom;
	}

	var totalAbsoluteCurvature = {};
	function getTotalAbsoluteCurvature(interval_) {
		var interval = interval_ || [0, 1];
		var key = '' + interval[0] + ', ' + interval[1];
		if (totalAbsoluteCurvature[key]) {
			return totalAbsoluteCurvature[key];
		}

		// Numerically integrate the absolute curvature
		var result = gaussQuadrature(function (t) {
			return Math.abs(κTimesSDiff(t));
		}, interval);
		totalAbsoluteCurvature[key] = result;

		return result;
	}

	var totalCurvature = undefined;
	function getTotalCurvature() {
		if (totalCurvature) {
			return totalCurvature;
		}

		// Numerically integrate the curvature.
		var result = gaussQuadrature(κTimesSDiff, [0, 1]);
		totalCurvature = result;

		return result;
	}

	// Math is from http://math.info/Calculus/Curvature_Parametric/
	// See the maxima file for details
	/** 
  * A modified version of differential of κ (use quotient rule,
  * ignore denominator and multiply by 2/3). We need to find the 
  * zeros of this function to get the min/max curvature.
 **/
	function dκ(t) {
		var ts = t * t;
		var omt = 1 - t;

		var a = ts * x3;
		var i = ts * y3;
		var b = 2 * t - 3 * ts;
		var c = (3 * t - 1) * omt;
		var d = omt * omt;
		var e = 3 * (a + b * x2 - c * x1 - d * x0);
		var f = 3 * (i + b * y2 - c * y1 - d * y0);
		var g = 6 * (t * y3 - (3 * t - 1) * y2 + (3 * t - 2) * y1 + omt * y0);
		var h = 6 * (t * x3 - (3 * t - 1) * x2 + (3 * t - 2) * x1 + omt * x0);

		return 4 * (e * (y3 - 3 * y2 + 3 * y1 - y0) - f * (x3 - 3 * x2 + 3 * x1 - x0)) * Math.pow(f * f + e * e, 3 / 2) - (e * g - h * f) * (2 * g * f + 2 * h * e) * Math.sqrt(f * f + e * e);
	}

	/** Evaluate the bezier parametric equation at some value 
  * @param t {Number [0,1]} The point where the evaluation should take place 
  * 
  * @returns { [Number, Number] }
  **/
	function evaluate(t) {
		if (t === 0) {
			return [x0, y0];
		} else if (t === 1) {
			return [x3, y3];
		}

		return [evaluateX(t), evaluateY(t)];
	}

	function tangent(t) {
		var dx_ = evaluateDx(t);
		var dy_ = evaluateDy(t);
		var d = Math.sqrt(dx_ * dx_ + dy_ * dy_);

		return [dx_ / d, dy_ / d];
	}

	function normal(t) {
		var tangent_ = tangent(t);
		return [tangent_[1], -tangent_[0]];
	}

	var boundingBoxTight = null; // Cache (Memoization)
	function getBoundingBoxTight() {
		if (boundingBoxTight) {
			return boundingBoxTight;
		}

		var box = getNormalizedBoundingBox();

		var p0x = box[0][0];
		var p0y = box[0][1];
		var p1x = box[1][0];
		var p1y = box[1][1];

		var axisAlignedBox = [box[0], [p1x, p0y], box[1], [p0x, p1y]];

		boundingBoxTight = Vector.rotateThenTranslatePoints(axisAlignedBox, bezierPoints[0], sinAngle, cosAngle);

		return boundingBoxTight;
	}

	var normalizedBoundingBox = null;
	/** Get normalized bounding box - memoized */
	function getNormalizedBoundingBox() {
		if (normalizedBoundingBox) {
			return normalizedBoundingBox;
		}

		// Cache
		var vectorToOrigin = Vector.transform(bezierPoints[0], function (x) {
			return -x;
		});
		var normalizedBezier = new Bezier(Vector.translateThenRotatePoints(bezierPoints, vectorToOrigin, -sinAngle, cosAngle), undefined);

		normalizedBoundingBox = normalizedBezier.getBoundingBox();

		return normalizedBoundingBox;
	}

	var boundingBox = undefined;
	this.tAtMaxX = undefined;
	function getBoundingBox() {
		if (boundingBox) {
			return boundingBox;
		}

		// The a,b and c in the quadratic equation of the derivative of 
		// x(t) and y(t) set equal to 0.

		var ds = [dx, dy];

		var roots = ds.map(Poly.findQuadraticRoots01);

		// Endpoints
		roots[0].push(0);roots[0].push(1);
		roots[1].push(0);roots[1].push(1);

		// Test points
		var testPointsX = roots[0].map(evaluateX);
		var testPointsY = roots[1].map(evaluateY);

		var minX = Number.POSITIVE_INFINITY;
		var maxX = Number.NEGATIVE_INFINITY;
		for (var i = 0; i < roots[0].length; i++) {
			var xx = evaluateX(roots[0][i]);
			if (xx > maxX) {
				maxX = xx;
				this.tAtMaxX = roots[0][i];
			}
			if (xx < minX) {
				minX = xx;
			}
		}

		boundingBox = [[minX, Util.min(testPointsY)], [maxX, Util.max(testPointsY)]];

		return boundingBox;
	}

	// Public members
	this.bezierPoints = bezierPoints;

	this.tangent = tangent;
	this.normal = normal;

	this.getBoundingBox = getBoundingBox;
	this.getBoundingBoxTight = getBoundingBoxTight;
	this.getTotalAbsoluteCurvature = getTotalAbsoluteCurvature;
	this.getTotalCurvature = getTotalCurvature;
	this.getCurveLength = getCurveLength;
	this.κ = κ;
	this.dκ = dκ;

	this.evaluate = evaluate;
}

/**
 * Reterns 2 new beziers split at t, i.e. for the ranges 
 * [0,t] and [t,1]. Uses de Casteljau's algorithm. 
 */
Bezier.splitAt = function (bezier, t) {
	var bezierPoints = bezier.bezierPoints;

	var _bezierPoints2 = _slicedToArray(bezierPoints, 4),
	    _bezierPoints2$ = _slicedToArray(_bezierPoints2[0], 2),
	    x0 = _bezierPoints2$[0],
	    y0 = _bezierPoints2$[1],
	    _bezierPoints2$2 = _slicedToArray(_bezierPoints2[1], 2),
	    x1 = _bezierPoints2$2[0],
	    y1 = _bezierPoints2$2[1],
	    _bezierPoints2$3 = _slicedToArray(_bezierPoints2[2], 2),
	    x2 = _bezierPoints2$3[0],
	    y2 = _bezierPoints2$3[1],
	    _bezierPoints2$4 = _slicedToArray(_bezierPoints2[3], 2),
	    x3 = _bezierPoints2$4[0],
	    y3 = _bezierPoints2$4[1];

	var s = 1 - t;
	var t2 = t * t;
	var t3 = t2 * t;
	var s2 = s * s;
	var s3 = s2 * s;

	var part1 = [[x0, y0], [t * x1 + s * x0, t * y1 + s * y0], [t2 * x2 + 2 * s * t * x1 + s2 * x0, t2 * y2 + 2 * s * t * y1 + s2 * y0], [t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0, t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0]];

	var part2 = [part1[3], [t2 * x3 + 2 * t * s * x2 + s2 * x1, t2 * y3 + 2 * t * s * y2 + s2 * y1], [t * x3 + s * x2, t * y3 + s * y2], [x3, y3]];

	return [new Bezier(part1), new Bezier(part2)];
};

module.exports = Bezier;

},{"../../numerical/functions/gaussian-quadrature.js":36,"../../polynomial/polynomial.js":39,"../../utils.js":42,"../../vector/vector.js":43}],5:[function(require,module,exports){
"use strict";

/** 
 * Basic circle class. 
 */
function Circle(center, radius) {
	this.center = center;
	this.radius = radius;
}

Circle.scale = function (circle, s) {
	return new Circle(circle.center, circle.radius * s);
};

module.exports = Circle;

},{}],6:[function(require,module,exports){
'use strict';

var MAT_CONSTANTS = require('../../mat-constants.js');
var Vector = require('../../vector/vector.js');

/** 
 * @constructor 	
 * 	
 * @param p {number[]} - The point coordinates.
 * @param {ListNode<Bezier>} bezierNode	
 * @param t
 * @param type {MAT_CONSTANTS.pointType} 	
 *  'osculating'        : 0, // Osculating - Max curvatre inward,   	
 *  'sharp'             : 1, // Sharp corner, 	
 *  'dull'              : 2, // dull corner, 	
 *  'reverseOsculating' : 3, // Osculating - Max curvature outward, 	
 *  'standard'          : 4, // just another point
 * @param {Number} order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates or t values.   
 * @param {Circle} circle - The osculating circle at this point.
 * @param {Number} sharpness - Measure of corner sharpness.
 *   	
 */
// TODO - The order property should be a property of ContactPoint instead.
var PointOnShape = function PointOnShape(p, bezierNode, t, type, order, osculatingCircle, sharpness) {

	this.bezierNode = bezierNode;
	this.t = t;
	this.type = type;
	this.order = order; // z-order order arbitration decider to make all points on the shape well-ordered
	this.osculatingCircle = osculatingCircle;
	this.sharpness = sharpness;
	//if (sharpness) { console.log(sharpness); }

	this.simpleKey = PointOnShape.makeSimpleKey(p);
	//this.p = p; // TODO - see below

	//---- Cache
	// Removed 2 lines below - if {PointOnShape} is called as parameter 
	// it will more likely result in monomorphic behaviour as opposed 
	// to polymorphic or megamorphic
	this[0] = p[0];
	this[1] = p[1];
	this.key = PointOnShape.toString(this);
};

function dullCornerAt(shape, p) {

	var dullCornerHash = shape.dullCornerHash;
	var key = PointOnShape.makeSimpleKey(p); // First point

	var result = dullCornerHash[key] || null;

	//console.log(result);

	return result;
}

/**
 * Sets the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 *
 * Notes: Modifies p
 * 
 * @param {PointOnShape} p 
 * 
 */
PointOnShape.setPointOrder = function (shape, circle, p, _debug_) {

	var dullCorner = dullCornerAt(shape, p);

	if (!dullCorner) {
		return; /* or use different scheme */
	}

	//let bez = dullCorner.pointOnShape.bezierNode.item;
	var bez = dullCorner.bezier;
	var tan1pre = bez.tangent(1);

	var tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
	var tan2 = Vector.toUnitVector(Vector.fromTo(p, circle.center));

	var crossTangents = -Vector.dot(tan1, tan2);

	p.order = crossTangents;
	p.key = PointOnShape.toString(p);

	if (_debug_) {
		// TODO Add a _debug_ flag to switch this on or off.
		if (_debug_.drawStuff) {
			if (dullCorner) {
				//_debug_.draw.line([p, circle.center], 'red thin5');
			}
		}
	}

	return p.order;
};

/**	
 * Return a new point on the shape from given point shifted by a given t distance	
 * 	
 * Δt The distance to shift the point	
 * 	
 * @return {PointOnShape} Shifted point  	
 */
PointOnShape.shift = function (p, Δt) {

	if (Δt <= -1 || Δt >= 1) {
		// TODO: relatively easy to support the case where Δt can by any {Number}	
		throw 'Δt not in range (-1, 1); Δt was ' + Δt;
	}

	var newBezierNode = p.bezierNode;

	var t = p.t + Δt;
	if (t < 0) {
		t = t + 1;
		newBezierNode = newBezierNode.prev;
	} else if (t > 1) {
		t = t - 1;
		newBezierNode = newBezierNode.next;
	}

	//console.log(p.t, Δt, t, newBezierNode.item.evaluate(t));	

	return new PointOnShape(newBezierNode.item.evaluate(t), newBezierNode, t, MAT_CONSTANTS.pointType.standard, 0 /* order */
	);
};

PointOnShape.cloneAndAdv = function (p) {
	return new PointOnShape(p.bezierNode.item.evaluate(p.t), p.bezierNode, p.t, p.type, p.order + p.order / 111111111111 // hack  	
	);
};

/**	
 * Takes a single point and splits it and moves it apart along shape boundary.	
 * 	
 * @param p {PointOnShape} pointOnShape 
 * @param Δt {Number} The distance (in t) to move the points apart. Ideally we would	
 *        much prefer a pixel distance, but the implementation would be more complex. 	
 * 	
 * @return Splitted points as array, i.e. [p1,p2]	
 */
PointOnShape.split = function (p, Δt) {
	return [PointOnShape.shift(p, -Δt), PointOnShape.shift(p, +Δt)];
};

PointOnShape.splitForward = function (p, Δt) {
	return [p, PointOnShape.shift(p, +2 * Δt)];
};

PointOnShape.splitBack = function (p, Δt) {
	return [PointOnShape.shift(p, -2 * Δt), p];
};

function typeToStr(type) {
	for (var key in MAT_CONSTANTS.pointType) {
		if (MAT_CONSTANTS.pointType[key] === type) {
			return key;
		}
	}

	return undefined;
}

PointOnShape.toString = function (p) {
	return '' + p[0] + ', ' + p[1] + '|' + p.order + '|' + p.type;
};

PointOnShape.toHumanString = function (p) {
	var str = '' + p[0] + ', ' + p[1] + ' | bz: ' + p.bezierNode.item.indx + ' | t: ' + p.t + ' | ord: ' + p.order + ' | ';
	return str + typeToStr(p.type);
};

PointOnShape.makeSimpleKey = function (p) {
	return '' + p[0] + ', ' + p[1];
};

PointOnShape.compare = function (a, b) {
	var res = a.bezierNode.item.indx - b.bezierNode.item.indx;

	if (res !== 0) {
		return res;
	}

	res = a.t - b.t;
	if (res !== 0) {
		return res;
	}

	return a.order - b.order;
};

module.exports = PointOnShape;

},{"../../mat-constants.js":17,"../../vector/vector.js":43}],7:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getContactCirclesAtBezierBezierInterface = require('../functions/get-contact-circles-at-bezier-bezier-interface.js');
var getBezierOsculatingCircles = require('../functions/get-bezier-osculating-circles.js');
var Util = require('../../utils.js');
var Geometry = require('../../geometry/geometry.js');
var LlRbTree = require('../../ll-rb-tree//ll-rb-tree.js');
var LinkedLoop = require('../../linked-loop/linked-loop.js');
var Bezier = require('../../geometry/classes/bezier.js');
var ContactPoint = require('../../mat/classes/contact-point.js');
var PointOnShape = require('../../geometry/classes/point-on-shape.js');
var Svg = require('../../svg/svg.js');
var MatCircle = require('../../mat/classes/mat-circle.js');
var Vector = require('../../vector/vector.js');
var MAT_CONSTANTS = require('../../mat-constants.js');

/** 
 * A Shape represents the loop of individual bezier curves composing 
 * an SVG element.
 * 
 * @constructor  
 */
var Shape = function Shape(beziers, _debug_) {

	this.beziers = beziers;
	this.dullCornerHash = {};

	var pointsOnShape = getInterestingPointsOnShape(this);
	var usedPointsOnShape = determineUsedPoints(this, pointsOnShape);
	var contactPointArr = usedPointsOnShape.map(createContactPoint);

	this.contactPoints = createCoupledCpLoops(contactPointArr);

	//respacePoints(this.contactPoints, 30); 
	respacePoints(this.contactPoints, 45);

	this.for2Prongs = addPrelimMatCircles_CullPoints_AndGetPotential2Prongs(this.contactPoints, _debug_);

	if (_debug_) {
		debugActionsOnShapeCreate(this, contactPointArr, _debug_);
	}

	function createContactPoint(pos) {
		return new ContactPoint(pos, undefined);
	}
};

function determineUsedPoints(shape, pointsOnShape) {
	var usedPointsOnShape = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = pointsOnShape[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var pos = _step.value;

			var intersects = Geometry.doesCircleIntersectShape(shape, pos.osculatingCircle, pos);

			pos.intersects = intersects;

			if (pos.type !== MAT_CONSTANTS.pointType.dull) {
				if (intersects) {
					usedPointsOnShape.push(pos);
				} else {
					usedPointsOnShape.push(pos);
				}
			} else if (intersects) {
				// Will later become a 2-prong point.
				usedPointsOnShape.push(pos);
			} else if (pos.type === MAT_CONSTANTS.pointType.dull) {
				if (!intersects) {
					usedPointsOnShape.push(pos);
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

	return usedPointsOnShape;
}

function createCoupledCpLoops(contactPointArr) {

	var cpLoop = new LinkedLoop([], function (a, b) {
		return ContactPoint.compare(a.item, b.item);
	});

	var denseContactPoints = new LinkedLoop([], undefined);

	var prevCpNode = undefined;
	var prevCoupledCpNode = undefined;
	for (var i = 0; i < contactPointArr.length; i++) {
		var cp = contactPointArr[i];
		var pos = cp.pointOnShape;

		prevCoupledCpNode = LinkedLoop.insert(denseContactPoints, cp, prevCoupledCpNode);

		if (pos.type === MAT_CONSTANTS.pointType.dull) {
			if (Math.acos(1 - pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else if (pos.type === MAT_CONSTANTS.pointType.sharp) {
			if (Math.acos(1 - pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else {
			prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
		}

		prevCoupledCpNode.coupledNode = prevCpNode;
	}

	return cpLoop;
}

/**
 * 
 * @param contactPoints
 * @returns
 */
function addPrelimMatCircles_CullPoints_AndGetPotential2Prongs(contactPoints, _debug_) {

	var cpNode = contactPoints.head;
	var for2Prongs = []; // The points that will be used for the initial 2-prong procedure
	var toRemove = []; // Don't remove items inside loop.
	do {
		var cp = cpNode.item;
		var pos = cp.pointOnShape;
		var mCircle = MatCircle.create(pos.osculatingCircle, [cpNode]);

		if (pos.intersects) {
			for2Prongs.push(cpNode);
		} else if (pos.type === MAT_CONSTANTS.pointType.dull) {
			/* TODO IMPORTANT remove this line, uncomment piece below 
    * it and implement the following strategy to find the 
    * 3-prongs: if deltas are conjoined due to dull corner, 
    * split the conjoinment by inserting successively closer 
    * (binary division) 2-prongs. If a 2-prong actually fails, 
    * simply remove the 1-prong at the dull corner.
    */
			//console.log(cpNode);
			toRemove.push(cpNode);
			/*
   var oCircle = cp.matCircle;
   		if (_debug_) {
   	_debug_.draw.circle(oCircle.circle, 'orange thin10 nofill');
   	_debug_.draw.dot(oCircle.circle.center, 0.5, 'orange');	
   }
   */
		} else if (pos.type === MAT_CONSTANTS.pointType.osculating) {
			if (_debug_) {
				_debug_.draw.dot(cp, 0.2, 'gray');
				_debug_.draw.dot(cp.matCircle.circle.center, 0.5, 'gray');
				_debug_.draw.circle(cp.matCircle.circle, 'gray thin10 nofill');
			}
		}

		cpNode.prevOnCircle = cpNode; // Trivial loop
		cpNode.nextOnCircle = cpNode; // ...

		cpNode = cpNode.next;
	} while (cpNode !== contactPoints.head);

	for (var i = 0; i < toRemove.length; i++) {
		var _cpNode = toRemove[i];
		LinkedLoop.remove(contactPoints, _cpNode);
	}

	return for2Prongs;
}

/**
 * Respace points so that the total absolute curvature between
 * consecutive points are very roughly equal. 
 * 
 * @param {LinkedLoop<ContactPoint>} contactPoints
 * @returns undefined
 * 
 * NOTES: Mutates contactPoints.
 */
function respacePoints(contactPoints, maxAbsCurvatureInDegrees) {

	//let iii = 0;

	var cpNode = contactPoints.head;
	var recheck = void 0;
	do {
		recheck = false;

		var totalCurvatures = [];
		var denseCpNode = cpNode.coupledNode;

		do {
			var c = getTotalAbsCurvatureBetweenCps([denseCpNode.item, denseCpNode.next.item]);

			totalCurvatures.push({ cpNode: denseCpNode, c: c });

			denseCpNode = denseCpNode.next;
		} while (denseCpNode.coupledNode !== cpNode.next);

		var totalCurvature = sumCurvatures(totalCurvatures);

		cpNode.totalCurvatures = totalCurvatures;
		cpNode.totalCurvature = totalCurvature;

		var totalInDegrees = totalCurvature * 180 / Math.PI;
		// if (totalInDegrees > 180 || totalInDegrees < 5) { console.log(totalInDegrees); }
		if (totalInDegrees > maxAbsCurvatureInDegrees) {
			// Add a point
			//console.log(totalCurvatures);

			var accumTot = 0;
			var tc = cpNode.totalCurvature; // cache
			var bestIndx = undefined;
			var leftDenseIndx = 0;
			var rightDenseIndx = void 0;
			var accumTotAtLeft = 0;
			var accumTotAtRight = undefined;
			var bestDiff = Number.POSITIVE_INFINITY;
			for (var i = 0; i < totalCurvatures.length; i++) {

				var _c = totalCurvatures[i].c;
				var cTot = _c.totalCurvature + _c.totalTurn;
				accumTot += cTot;

				var cpn = totalCurvatures[i].cpNode;
				if (accumTot <= tc / 2) {
					leftDenseIndx = i;
					accumTotAtLeft = accumTot;
				}

				if (!rightDenseIndx && accumTot > tc / 2) {
					// This may be out of bounds but really means cpNode.next
					rightDenseIndx = i;
					accumTotAtRight = accumTot;
				}

				var absDiff = Math.abs(tc / 2 - accumTot);
				// TODO - We can also add a weight for point values here
				// such that for instance inverse curvature points 
				// carry more weight than dull corners, etc.
				// TODO Make the 1/4 or 1/3 below a constant that can
				// be set.
				//if (accumTot > tc/3 && accumTot < 2*tc/3 &&
				if (accumTot > tc / 4 && accumTot < 3 * tc / 4 && bestDiff > absDiff) {
					// If within middle 1/3 and better

					bestIndx = i;
					bestDiff = absDiff;
				}
			}

			// aaa console.log(leftDenseIndx, bestIndx, rightDenseIndx);

			if (bestIndx !== undefined) {
				// Reify the point
				var tcInfo = totalCurvatures[bestIndx];

				// Note that after the below insert cpNode.next will
				// equal the newly inserted cpNode.
				var newCpNode = LinkedLoop.insert(contactPoints, tcInfo.cpNode.next.item, cpNode, tcInfo.cpNode.next);
				tcInfo.cpNode.next.coupledNode = newCpNode;

				cpNode.totalCurvatures = cpNode.totalCurvatures.slice(0, bestIndx + 1);
				cpNode.totalCurvature = sumCurvatures(cpNode.totalCurvatures);

				recheck = true; // Start again from same contact point.

				//iii++;

				//console.log(cpNode, newCpNode);
			} else {
				// We could not find an 'interesting' point to use, so
				// find some center point between the two contact 
				// points.


				var leftTcInfo = totalCurvatures[leftDenseIndx];
				var rightTcInfo = totalCurvatures[rightDenseIndx];

				var leftCpNode = leftTcInfo.cpNode;
				var rightCpNode = rightTcInfo.cpNode;

				var leftC = leftTcInfo.c;

				var leftCp = leftTcInfo.cpNode.next;
				var rightCp = rightTcInfo.cpNode.next;

				//aaa console.log(accumTotAtLeft,	accumTotAtRight, tc/2);


				var pos = getCPointBetweenCps(leftCpNode.item, rightCpNode.item, accumTotAtLeft, accumTotAtRight, tc / 2);

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
    */
			}
		} else if (totalInDegrees < 15) {
			// Remove a point
			//console.log(totalCurvatures);

		}

		if (!recheck) {
			cpNode = cpNode.next;
		}
	} while (cpNode !== contactPoints.head /* && iii < 100*/);

	//console.log(iii);
}

/**
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
function getCPointBetweenCps(leftCp, rightCp, accumTotAtLeft, accumTotAtRight, totAtMid) {

	var accumTo = totAtMid - accumTotAtLeft;

	var posStart = leftCp.pointOnShape;
	var posEnd = rightCp.pointOnShape;

	var bezierNodeStart = posStart.bezierNode;
	var bezierNodeEnd = posEnd.bezierNode;

	var bezierNode = bezierNodeStart;

	var totalTurn = 0;
	var totalCurvature = 0;
	do {
		var turn = void 0;
		if (bezierNode !== bezierNodeEnd) {
			turn = Math.abs(getCurvatureAtInterface(bezierNode));
		} else {
			turn = 0;
		}

		var curvature = void 0;
		var interval = [0, 1];
		if (bezierNode === bezierNodeStart) {
			interval[0] = posStart.t;
		}
		if (bezierNode === bezierNodeEnd) {
			interval[1] = posEnd.t;
		}
		curvature = bezierNode.item.getTotalAbsoluteCurvature(interval);

		totalTurn += turn;
		totalCurvature += curvature;

		var totalBoth = totalTurn + totalCurvature;
		if (totalBoth >= accumTo) {
			// aaa console.log('accumTo: ' + accumTo, 'totalBoth: ' + totalBoth);
			break;
		}

		bezierNode = bezierNode.next;
	} while (bezierNode.prev !== bezierNodeEnd);

	//return { totalTurn, totalCurvature };
}

function sumCurvatures(curvatures) {
	var total = 0;

	for (var i = 0; i < curvatures.length; i++) {
		var c = curvatures[i].c;

		total += c.totalTurn + c.totalCurvature;
	}

	return total;
}

/**
 * 
 * @param cps
 * @returns
 */
function getTotalAbsCurvatureBetweenCps(_ref) {
	var _ref2 = _slicedToArray(_ref, 2),
	    cpStart = _ref2[0],
	    cpEnd = _ref2[1];

	var posStart = cpStart.pointOnShape;
	var posEnd = cpEnd.pointOnShape;

	var bezierNodeStart = posStart.bezierNode;
	var bezierNodeEnd = posEnd.bezierNode;

	var bezierNode = bezierNodeStart;

	var totalTurn = 0;
	var totalCurvature = 0;
	do {
		var turn = void 0;
		if (bezierNode !== bezierNodeEnd) {
			turn = Math.abs(getCurvatureAtInterface(bezierNode));
		} else {
			turn = 0;
		}

		var curvature = void 0;
		var interval = [0, 1];
		if (bezierNode === bezierNodeStart) {
			interval[0] = posStart.t;
		}
		if (bezierNode === bezierNodeEnd) {
			interval[1] = posEnd.t;
		}
		curvature = bezierNode.item.getTotalAbsoluteCurvature(interval);

		totalTurn += turn;
		totalCurvature += curvature;

		bezierNode = bezierNode.next;
	} while (bezierNode.prev !== bezierNodeEnd);

	return { totalTurn: totalTurn, totalCurvature: totalCurvature };
}

function debugActionsOnShapeCreate(shape, contactPointArr, _debug_) {
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = contactPointArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var contactPoint = _step2.value;

			if (contactPoint.pointOnShape.type === MAT_CONSTANTS.pointType.sharp) {
				_debug_.draw.dot(contactPoint.pointOnShape, 0.2, 'green');
			}
			if (contactPoint.pointOnShape.type === MAT_CONSTANTS.pointType.dull) {
				_debug_.draw.dot(contactPoint.pointOnShape, 0.4, 'orange');
				//_debug_.draw.dot(contactPoint.pointOnShape, 1.5, 'orange');
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

	_debug_.shape = shape;
	if (_debug_.drawStuff) {
		_debug_.drawSomeStuff(shape);
	}
}

/**
 * 
 * @param {Shape} shape
 * @returns {[{pointOnShape}]} - A list of interesting points on the 
 * 			shape.
 */
function getInterestingPointsOnShape(shape) {
	var beziers = shape.beziers;
	var dullCornerHash = shape.dullCornerHash;

	var points = [];
	var allPoints = [];

	var node = beziers.head;
	do {
		var bezier = node.item;

		var pointsOnShape = void 0;
		pointsOnShape = getContactCirclesAtBezierBezierInterface([node.prev, node], dullCornerHash);
		Array.prototype.push.apply(allPoints, pointsOnShape);
		pointsOnShape = getBezierOsculatingCircles(node);
		Array.prototype.push.apply(allPoints, pointsOnShape);

		node = node.next;
	} while (node !== beziers.head);

	// Ensure order - first point may be ordered last at this stage.
	var firstPoint = allPoints[0];
	var lastPoint = allPoints[allPoints.length - 1];
	if (PointOnShape.compare(firstPoint, lastPoint) > 0) {
		allPoints.push(firstPoint); // Add the first point to the end
		allPoints.splice(0, 1); // ... and remove the front point.
	}

	return allPoints;
}

/**
 * Returns the boundary piece that starts at the 
 * immediate previous point on the shape and ends at 
 * the immediate next point.  
 * 
 * Notes:
 *   - Uses a red-black tree to quickly find the required bounds
 */
Shape.getNeighbouringPoints = function (shape, pointOnShape) {

	var cptree = shape.contactPoints.cptree;

	var cps = LlRbTree.findBounds(cptree, { item: new ContactPoint(pointOnShape) });

	if (!cps[0]) {
		// Smaller than all -> cptree.min() === cps[1].data
		return [LlRbTree.max(cptree.root), LlRbTree.min(cptree.root)];
	}
	if (!cps[1]) {
		// Larger than all -> cptree.max() === cps[0].data
		return [LlRbTree.max(cptree.root), LlRbTree.min(cptree.root)];
	}

	return [cps[0].data, cps[1].data];
};

function getTotalBy(f, shape) {

	return function (shape) {
		var beziers = shape.beziers;

		var node = beziers.head;
		var total = 0;
		do {
			total += f(node);

			node = node.next;
		} while (node !== beziers.head);

		return total;
	};
}

/**
 * 
 * 
 * @param bezierNode
 * @returns
 */
function getCurvatureAtInterface(bezierNode) {
	var ts = [1, 0];

	var beziers = [];

	beziers.push(bezierNode.item);
	beziers.push(bezierNode.next.item);
	var tans = [beziers[0].tangent(1), beziers[1].tangent(0)];

	// The integral of a kind of Dirac Delta function.
	var cosθ = Vector.dot(tans[0], tans[1]);
	var sinθ = Vector.cross(tans[0], tans[1]);
	var θ = Math.acos(cosθ);

	return sinθ >= 0 ? θ : -θ;
}

Shape.getTotalCurvature = getTotalBy(function (bezierNode) {
	return +bezierNode.item.getTotalCurvature() + getCurvatureAtInterface(bezierNode);
});

Shape.getTotalAbsoluteCurvature = getTotalBy(function (bezierNode) {
	return bezierNode.item.getTotalAbsoluteCurvature() + Math.abs(getCurvatureAtInterface(bezierNode));
});

Shape.forAllBeziers = function (shape, f) {
	var node = shape.beziers.head;
	do {
		var bezier = node.item;

		f(bezier);

		node = node.next;
	} while (node !== shape.beziers.head);
};

module.exports = Shape;

//218

},{"../../geometry/classes/bezier.js":4,"../../geometry/classes/point-on-shape.js":6,"../../geometry/geometry.js":13,"../../linked-loop/linked-loop.js":14,"../../ll-rb-tree//ll-rb-tree.js":16,"../../mat-constants.js":17,"../../mat/classes/contact-point.js":19,"../../mat/classes/mat-circle.js":20,"../../svg/svg.js":41,"../../utils.js":42,"../../vector/vector.js":43,"../functions/get-bezier-osculating-circles.js":9,"../functions/get-contact-circles-at-bezier-bezier-interface.js":12}],8:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Bezier = require('../classes/bezier.js');

/** 
 * NOTE: Finding osculating circles requires finding local maxima of parametric cubic curves
 *    which involves extensive tedious algebra. 
 *    
 * See the paper at: http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
 * Lets get cracking (in finding these extrema).
 * We will use variable naming conventions as in the paper above
 */
function calcCurvatureExtremaBrackets(bezier) {
	var _bezier$bezierPoints = _slicedToArray(bezier.bezierPoints, 4),
	    _bezier$bezierPoints$ = _slicedToArray(_bezier$bezierPoints[0], 2),
	    x0 = _bezier$bezierPoints$[0],
	    y0 = _bezier$bezierPoints$[1],
	    _bezier$bezierPoints$2 = _slicedToArray(_bezier$bezierPoints[1], 2),
	    x1 = _bezier$bezierPoints$2[0],
	    y1 = _bezier$bezierPoints$2[1],
	    _bezier$bezierPoints$3 = _slicedToArray(_bezier$bezierPoints[2], 2),
	    x2 = _bezier$bezierPoints$3[0],
	    y2 = _bezier$bezierPoints$3[1],
	    _bezier$bezierPoints$4 = _slicedToArray(_bezier$bezierPoints[3], 2),
	    x3 = _bezier$bezierPoints$4[0],
	    y3 = _bezier$bezierPoints$4[1];

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

	//******** Check for degenerate case in which cubic parametric curve becomes quadratic
	if (W_0x - 2 * W_1x + W_2x === 0 && W_0y - 2 * W_1y + W_2y === 0) {}
	// TODO - This case is simpler due to being quadratic but we're lazy now and will skip it for the moment
	// and just make the curvature extremum search between -10 and 10 - FIX!!!!!! 
	//extrema_intervals = [-10,10]; 


	// See : http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
	//******** Rotate curve so that W0 - 2W1 + W2 = (0, (1/3)a), a != 0
	var atan_numer = P_3x - 3 * P_2x + 3 * P_1x;
	var atan_denom = P_3y - 3 * P_2y + 3 * P_1y;
	var atan_numer_squared = atan_numer * atan_numer;
	var atan_denom_squared = atan_denom * atan_denom;
	var radpre = atan_numer_squared / atan_denom_squared + 1;
	var rad = Math.sqrt(radpre);
	var cos_theta = 1 / rad;
	var sin_theta;
	if (cos_theta === 0) {
		// edge case
		sin_theta = 1;
	} else {
		sin_theta = atan_numer / (atan_denom * rad);
	}

	// For next rotated points see Maxima file bez5 - here we skip expensive trig evaluations
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

		if (W_0x !== 0) {// Otherwise we have a straight line x=0 ! 
			// TODO - FINISH!!!
			// TODO - we also still need to check for degenerate cubic (see start of paper)
		}
	} else {
		var mu;
		var lambda;
		var gamma1;
		var gamma2;
		var sigd_;
		var b_;
		var ssigd_;
		var sda;
		var sdb;
		var ksi_pre1;
		var ksi_pre2;
		var ksi1;
		var ksi2;

		(function () {
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

			//console.log(W_0x, W_1x, W_2x);

			// From the paper:
			// All curves has exactly one of 4 cases
			// 1. It has a single inflection point and exactly 2 curvature maxima (symmetrically positioned about inflection point)
			//    This is the case if dif === 0 in above code
			// 2. It has a single cusp - we ignore this case for now - but we must still do it!
			// 3. It has a point of self-intersection - occurs if d < 0 in paper (in code d is called sigd_) 
			// 4. It has 2 inflection points, no cusps, no self-intersections
			//    It can have either 3 or 5 curvature extrema
			//    a. The case of 5 curvature extrema is ignored for now - in the paper it is mentioned to even find such a curve is difficult 
			//       and it seems such curves have very sharp curvature at one point which should not usually occur in an SVG shape. 
			//       But this case should later be included or we'll miss some points.
			//    b. There are 3 curvature extrema:
			//       Extrema occur in the range (-inf, -sqrt(d)), (-sqrt(d), sqrt(d)), (sqrt(d), inf)
			//       Since we dont know how to select -inf and inf we will just choose them to be -10 and 11 
			//       (remember bezier runs from t=0 to t=1). If Brent's method runs out of the (0,1) interval we stop and use
			//       0 or 1 as the extremum? Remember extrema can also occur at t=0 and t=1!
			//
			// At the moment we only test for case 1 and 4b, but in future we can test and eliminate the other cases


			mu = 6 * dif;
			lambda = 3 * a_ * W_0x / (mu * mu);
			gamma1 = 3 * a_ * W_0y / (mu * mu);
			gamma2 = 3 * (W_1y - W_0y) / mu;
			sigd_ = lambda * lambda - 2 * gamma2 * lambda + gamma1; // This d in the paper

			b_ = 2 * (gamma2 - lambda);

			/** Returns t **/

			var deReParameterize = function deReParameterize(sigma) {
				return (sigma - lambda) * (mu / a_);
			};

			var deReParameterizeBoundary = function deReParameterizeBoundary(boundary) {
				return [deReParameterize(boundary[0]), deReParameterize(boundary[1])];
			};

			/**  and clips to [0,1] or returns false if not within [0,1] **/
			var fixBoundary = function fixBoundary(bound) {
				var b0 = bound[0];
				var b1 = bound[1];

				if (b0 < 0 && b1 < 0 || b0 > 1 && b1 > 1) {
					return false;
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
			};

			if (sigd_ > 0) {
				ssigd_ = Math.sqrt(sigd_);

				//console.log(ssigd_);
				// de-reparametize
				// Note: the sda and sdb here are the inflection points for a case iv !!!!!
				//       there are easier ways to calculate these

				sda = -ssigd_;
				sdb = ssigd_;
				//var sd = order(sda,sdb);

				brackets = [[Number.NEGATIVE_INFINITY, sda], [sda, sdb], [sdb, Number.POSITIVE_INFINITY]].map(deReParameterizeBoundary).map(fixBoundary);
			} else if (sigd_ < 0) {
				// Loop 
				// Note: The loop intersection may be outside t=[0,1]. In fact, for a well behaved shape this is always the case.
				//       But, curvature maxima may still occur inside t=[0,1] of course
				//
				// There can be 1 or 3 maxima of curvature

				ksi_pre1 = 2 * b_ * b_ - 8 * sigd_ - 3;


				if (ksi_pre1 < 0) {
					brackets = [[0, Math.sqrt(-3 * sigd_)]].map(deReParameterizeBoundary).map(fixBoundary);
				} else {
					ksi_pre2 = Math.sqrt(5 * ksi_pre1);
					ksi1 = (-5 * b_ - ksi_pre2) / 10;
					ksi2 = (-5 * b_ + ksi_pre2) / 10;


					brackets = [[Number.NEGATIVE_INFINITY, ksi1], [ksi1, Math.min(0, ksi2)], [Math.max(0, ksi2), Math.sqrt(-3 * sigd_)]].map(deReParameterizeBoundary).map(fixBoundary);
				}
			} else if (sigd_ === 0) {
				// TODO Cusp - ignore for now - lazy
			}
		})();
	}

	return brackets;
}

module.exports = calcCurvatureExtremaBrackets;

},{"../classes/bezier.js":4}],9:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Bezier = require('../classes/bezier.js');
var calcBezierCurvatureExtremaBrackets = require('./calc-bezier-curvature-extrema.js');
var MAT_CONSTANTS = require('../../mat-constants.js');
var Circle = require('../../geometry/classes/circle.js');
var PointOnShape = require('../../geometry/classes/point-on-shape.js');
var Poly = require('../../polynomial/polynomial.js');

var BRENT_TOLERANCE = 1e-12;

/** 
 * Finds the osculating circles for the given bezier. 
 **/
function getBezierOsculatingCircles(bezierNode) {

	var pointsOnShape = [];

	var root;
	var bezier = bezierNode.item;
	var brackets = calcBezierCurvatureExtremaBrackets(bezier);

	var lenb = brackets.length;
	for (var k = 0; k < lenb; k++) {
		var bracket = brackets[k];
		if (!bracket) {
			continue;
		}

		var _root = lookForRoot(bezier, bracket);
		if (!_root) {
			continue;
		}

		var pointDetails = getCircleAtRoot(bezier, _root, bracket);
		if (!pointDetails) {
			continue;
		}

		var p = pointDetails.p,
		    circle = pointDetails.circle,
		    type = pointDetails.type;

		var pos = new PointOnShape(p, bezierNode, _root, type, 0, circle);

		//oCircles.push(oCircle);
		pointsOnShape.push(pos);
	}

	// TODO - maybe just add them in the correct order to start with
	/*
 oCircles.sort(function(a,b) {
 	return PointOnShape.compare(a.pointOnShape, b.pointOnShape);
 });
 */
	pointsOnShape.sort(PointOnShape.compare);

	//return oCircles;
	return pointsOnShape;
}

function lookForRoot(bezier, _ref) {
	var _ref2 = _slicedToArray(_ref, 2),
	    minsd = _ref2[0],
	    maxsd = _ref2[1];

	// At this point there can be exactly 0 or 1 roots within [minsd, maxsd]
	var c0 = bezier.dκ(minsd);
	var c1 = bezier.dκ(maxsd);

	if (c0 * c1 >= 0) {
		return;
	}

	// There is exactly one root in the interval.
	var root = Poly.brent(bezier.dκ, minsd, maxsd /*, 
                                               BRENT_TOLERANCE*/
	);

	return root;
}

function getCircleAtRoot(bezier, root, _ref3) {
	var _ref4 = _slicedToArray(_ref3, 2),
	    minsd = _ref4[0],
	    maxsd = _ref4[1];

	// TODO - still need to determine curve orientation
	var κ = -bezier.κ(root);

	if (κ > 0) {
		// Bending inwards.

		// Check if local extrema is a maximum or minimum.
		var κAtMinsd = -bezier.κ(minsd);
		var κAtMaxsd = -bezier.κ(maxsd);

		if (κ > κAtMinsd && κ > κAtMaxsd) {
			// maximum
		} else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
			// minimum
			// TODO Good point for 2-prong?
			return;
		}
	}

	var radius = void 0;
	var type = void 0;
	if (κ < 0) {
		// Curving wrong way, but probably a significant point to 
		// put a 2-prong.
		radius = MAT_CONSTANTS.maxOsculatingCircleRadius;
		type = MAT_CONSTANTS.pointType.reverseOsculating; // 3
	} else {
		radius = Math.min(1 / κ, MAT_CONSTANTS.maxOsculatingCircleRadius);
		type = MAT_CONSTANTS.pointType.osculating;
	}

	var normal = bezier.normal(root);
	var p = bezier.evaluate(root);
	var cc = [p[0] + normal[0] * radius, p[1] + normal[1] * radius];

	var circle = new Circle(cc, radius);

	return { p: p, circle: circle, type: type };
}

module.exports = getBezierOsculatingCircles;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../mat-constants.js":17,"../../polynomial/polynomial.js":39,"../classes/bezier.js":4,"./calc-bezier-curvature-extrema.js":8}],10:[function(require,module,exports){
'use strict';

var getClosestPointOnBezierPiece = require('./get-closest-point-on-bezier-piece.js');
var Geometry = require('../geometry.js');
var Vector = require('../../vector/vector.js');
var PointOnShape = require('../classes/Point-on-shape.js');
var MAT_CONSTANTS = require('../../mat-constants.js');

/**
 * Gets the closest boundary point to the given point, limited to the
 * given bezier pieces.
 * 
 * @param {Shape} shape
 * @param {[PointOnShape]} δ - Start and end points for boundary
 *        traversal.
 * @param {Point} point
 * @param {Point} exclPoint Exclude this point and a small 
 *        neighbourhood around it in search. 
 * 
 * @returns {PointOnShape} The closest point.
 */
function getClosestBoundaryPointToPoint(bezierPieces_, point, exclPoint, touchedBezierNode, t, _debug_, slog_) {

	if (slog_) {
		//console.log('tes')
	}
	var tGap = 0.001; // TODO Make const and put somewhere
	//const tGap = 0.0000001; // TODO Make const and put somewhere

	var bezierPieces = cullBezierPieces(bezierPieces_, point);

	var bestDistance = Number.POSITIVE_INFINITY;
	var pos = void 0;
	//
	var ii = 0;
	//
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = bezierPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var bezierPiece = _step.value;

			//
			ii++;
			//
			var slog = slog_ && ii === 1;
			var bezier = bezierPiece.bezierNode.item;

			var closestPointAndDistance = getClosestPointOnBezierPiece(bezierPiece, point, exclPoint, tGap, touchedBezierNode, t, _debug_, slog);

			var d = closestPointAndDistance.d,
			    p = closestPointAndDistance.p;


			if (d < bestDistance) {
				//if (slog_) { console.log(ii, d); }
				pos = new PointOnShape(p.p, bezierPiece.bezierNode, p.t, MAT_CONSTANTS.pointType.standard, 0, undefined // TODO!! aaa
				);
				bestDistance = d;
			}
		}

		//if (bestDistance > 10000) { console.log('aaaaaaaaaaaaaaa'); }
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
		// First get an initial point such that the closest point 
		// can not be further than this point.
		var bestSquaredDistance = getClosePoint(bezierPieces, p);
		bezierPieces = cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance);
		bezierPieces = cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance);
	}

	return bezierPieces;
}

/**
 * Finds an initial point such that the closest point
 * can not be further than this point.
 */
function getClosePoint(bezierPieces, p) {
	var bestSquaredDistance = Number.POSITIVE_INFINITY;
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = bezierPieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var bezierPiece = _step2.value;

			var bezier = bezierPiece.bezierNode.item;

			var p1 = bezier.evaluate(bezierPiece.tRange[0]);
			var p2 = bezier.evaluate(bezierPiece.tRange[1]);

			var d1 = Vector.squaredDistanceBetween(p, p1);
			var d2 = Vector.squaredDistanceBetween(p, p2);
			var d = Math.min(d1, d2);

			if (d < bestSquaredDistance) {
				bestSquaredDistance = d;
			}
		}

		// The extra bit is to account for floating point precision 
		// TODO change 0.01 below to more meaningfull value dependent on 
		// shape dimensions, etc.
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

			var bezier = bezierPiece.bezierNode.item;

			var looseBoundingBox = bezier.getBoundingBox();
			var d = Geometry.getClosestSquareDistanceToRect(looseBoundingBox, p);
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

			var bezier = bezierPiece.bezierNode.item;

			var tightBoundingBox = bezier.getBoundingBoxTight();
			var d = Geometry.closestSquaredDistanceToRotatedRect(bezier, p);
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

module.exports = getClosestBoundaryPointToPoint;

},{"../../mat-constants.js":17,"../../vector/vector.js":43,"../classes/Point-on-shape.js":2,"../geometry.js":13,"./get-closest-point-on-bezier-piece.js":11}],11:[function(require,module,exports){
'use strict';

var Geometry = require('../geometry.js');
var Vector = require('../../vector/vector.js');

/**
 * 
 */
function getClosestPointOnBezierPiece(bezierPiece, point, exclPoint, tGap, touchedBezierNode, t, _debug_, slog) {

	if (_debug_) {
		_debug_.cpCalcs++;
	}

	var bezierNode = bezierPiece.bezierNode;

	var tRanges = [bezierPiece.tRange];

	var p = Geometry.closestPointBetween_PointAndBezier(bezierNode, point, bezierPiece.tRange, touchedBezierNode, t, _debug_, slog);

	if (!p) {
		return { d: Number.POSITIVE_INFINITY, p: undefined };
	}

	var d = Vector.distanceBetween(p.p, point);

	return { d: d, p: p };
}

module.exports = getClosestPointOnBezierPiece;

},{"../../vector/vector.js":43,"../geometry.js":13}],12:[function(require,module,exports){
'use strict';

var MAT_CONSTANTS = require('../../mat-constants.js');
var Circle = require('../../geometry/classes/circle.js');
var PointOnShape = require('../../geometry/classes/point-on-shape.js');
var Vector = require('../../vector/vector.js');

//const CROSS_TANGENT_LIMIT = 0.2756 // 16 degrees
//const CROSS_TANGENT_LIMIT = 0.2588 // 15 degrees
//const CROSS_TANGENT_LIMIT = 0.0698 // 4 degrees
//const CROSS_TANGENT_LIMIT = 0.0167 // 1 degree
//const CROSS_TANGENT_LIMIT = 0.0050 // 1/4 degree roughly
var CROSS_TANGENT_LIMIT = 0.0000; // 0 degrees


/** 
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points. 
 * 
 * @param {[ListNode<Bezier>]} bezierNodes - The two bezier nodes.
 **/
function getContactCirclesAtBezierBezierInterface(bezierNodes, dullCornerHash) {

	var ts = [1, 0];

	var beziers = [0, 1].map(function (i) {
		return bezierNodes[i].item;
	});
	var tans = [0, 1].map(function (i) {
		return beziers[i].tangent(ts[i]);
	});

	var crossTangents = +Vector.cross(tans[0], tans[1]);
	var negDot = -Vector.dot(tans[0], tans[1]);
	// The if below is important. Due to floating point approximation
	// it sometimes happen that crossTangents !== 0 but
	// negDot === -1. Remove the if and see what happens. :)
	if (crossTangents === 0 || negDot === -1) {
		// Too close to call 
		// Careful, dullCornerHash might not be set.
		return [];
	}

	var p = beziers[0].bezierPoints[3];

	if (crossTangents < -CROSS_TANGENT_LIMIT) {
		// Sharp corner?

		var pos = new PointOnShape(p, bezierNodes[0], 1, MAT_CONSTANTS.pointType.sharp, 0, new Circle(p, 0), 1 + negDot // The higher, the sharper
		);

		return [pos];
	}

	if (crossTangents > 0) {
		var key = PointOnShape.makeSimpleKey(p);
		dullCornerHash[key] = { bezier: beziers[0] };
		//console.log('a');
	}

	if (crossTangents <= CROSS_TANGENT_LIMIT) {
		return [];
	}

	//---- Dull corner
	//let oCircles = [];
	var pointsOnShape = [];

	var orders = [-1, negDot];
	for (var i = 0; i < 2; i++) {

		var κ = -beziers[i].κ(ts[i]);

		var radius = Math.min(1 / κ, MAT_CONSTANTS.maxOsculatingCircleRadius);
		if (radius < 0) {
			// Negative curvature
			radius = MAT_CONSTANTS.maxOsculatingCircleRadius;
		}

		var normal = beziers[i].normal(ts[i]);

		var cc = [p[0] + normal[0] * radius, p[1] + normal[1] * radius];

		var _pos = new PointOnShape(p, bezierNodes[i], ts[i], MAT_CONSTANTS.pointType.dull, orders[i], new Circle(cc, radius), 1 + negDot);

		pointsOnShape.push(_pos);
	}

	return pointsOnShape;
}

module.exports = getContactCirclesAtBezierBezierInterface;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../mat-constants.js":17,"../../vector/vector.js":43}],13:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Util = require('../utils.js');
var Poly = require('../polynomial/polynomial.js');
var Circle = require('./classes/circle.js');
var Arc = require('./classes/arc.js');
var PointOnShape = require('./classes/point-on-shape.js');
var Bezier = require('./classes/bezier.js');
var allRootsVAS = require('../polynomial/functions/all-roots-vas.js');
var Vector = require('../vector/vector.js');

var Geometry = {};

/** 
 * @return {Boolean} true if first circle engulfs the second.
 */
Geometry.doesCircleEngulfCircle = function (c1, c2) {
	if (c1.radius <= c2.radius) {
		return false;
	}

	var d = Vector.squaredDistanceBetween(c1.center, c2.center);
	var dr = c1.radius - c2.radius;
	var δ = dr * dr;

	return δ > d;
};

/**
 * From http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
 * This function is currently unused. 
 */
Geometry.doesLineIntersectCircle = function (circle, p0, p1) {
	var x0 = p0[0];
	var y0 = p0[1];
	var x1 = p1[0];
	var y1 = p1[1];
	var radius = circle.radius;
	var cx = circle.center[0];
	var cy = circle.center[1];

	var dx = x1 - x0;
	var dy = y1 - y0;
	var fx = x0 - cx;
	var fy = y0 - cy;

	var a = dx * dx + dy * dy;
	var b = 2 * (fx * dx + fy * dy);
	var c = fx * fx + fy * fy - radius * radius;

	var discriminant = b * b - 4 * a * c;
	if (discriminant < 0) {
		// no intersection
		return false;
	} else {
		// ray didn't totally miss sphere,
		// so there is a solution to
		// the equation.

		discriminant = Math.sqrt(discriminant);

		// either solution may be on or off the ray so need to test both
		// t1 is always the smaller value, because BOTH discriminant and
		// a are nonnegative.
		var t1 = (-b - discriminant) / (2 * a);
		var t2 = (-b + discriminant) / (2 * a);

		// 3x HIT cases:
		//          -o->             --|-->  |            |  --|->
		// Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

		// 3x MISS cases:
		//       ->  o                     o ->              | -> |
		// FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

		if (t1 >= 0 && t1 <= 1) {
			// t1 is the intersection, and it's closer than t2
			// (since t1 uses -b - discriminant)
			// Impale, Poke
			return true;
		}

		// here t1 didn't intersect so we are either started
		// inside the sphere or completely past it
		if (t2 >= 0 && t2 <= 1) {
			// ExitWound
			return true;
		}

		// no intn: FallShort, Past, CompletelyInside
		return false;
	}
};

/**
 * 
 * @param shape
 * @param δ
 * @returns
 */
Geometry.getBoundaryPieceBeziers = function (shape, δ) {

	var goStraight = true; // As opposed to go first around circle and take last exit

	var cp0 = δ[0];
	var cp1 = δ[1];

	var bezierPieces = [];

	var pos_start = cp0.item.pointOnShape;
	var bezierPiece = new BezierPiece(pos_start.bezierNode, [pos_start.t, pos_start.t]);

	var ii = 0; // Safeguard
	do {
		if (goStraight) {
			// This is either a) a 1-prong or ...
			// ... b) a contact point who's matCircle has not yet been resolved
			// TODO change this so that there is no b) anymore

			goStraight = false;

			var pThis = cp0.item.pointOnShape;
			var pNext = cp0.next.item.pointOnShape;

			if (pNext.bezierNode === pThis.bezierNode) {
				bezierPiece.tRange[1] = pNext.t;
				bezierPieces.push(bezierPiece);
			} else {
				bezierPiece.tRange[1] = 1;
				bezierPieces.push(bezierPiece);

				addSkippedBeziers(bezierPieces, pThis, pNext);
			}

			cp0 = cp0.next;
		} else {
			goStraight = true;

			cp0 = cp0.prevOnCircle; // Actually, next, next, ..., i.e. take last exit

			var newPos = cp0.item.pointOnShape;
			bezierPiece = new BezierPiece(newPos.bezierNode, [newPos.t, newPos.t]);
		}

		ii++;
	} while (cp0 !== cp1);

	bezierPieces.push(bezierPiece);

	return bezierPieces;

	/**
  * Adds pieces of skipped beziers
  */
	function addSkippedBeziers(bezierPieces, pThis, pNext) {

		var bNode = pThis.bezierNode;
		while (bNode !== pNext.bezierNode) {

			bNode = bNode.next;

			if (bNode !== pNext.bezierNode) {
				bezierPieces.push(new BezierPiece(bNode, [0, 1]));
			} else {
				bezierPieces.push(new BezierPiece(bNode, [0, pNext.t]));
			}
		}
	}
};

function BezierPiece(bezierNode, tRange) {
	this.bezierNode = bezierNode;
	this.tRange = tRange;
}

/**
 * Get line shape intersection points.
 * 
 * @param line A simple line described by two points, e.g. [[p0x,p0y],[p1x,p1y]]
 * @param shape {Shape} 
 * @param δ Curve segment described by start and end contact points
 *
 * Currently not used
 */
Geometry.getLineShapeIntersectionPoints = function (line, shape, δ) {

	var points = [];
	var bezierPieces = Geometry.getBoundaryPieceBeziers(shape, δ, false);

	for (var i = 0; i < bezierPieces.length; i++) {
		bezierPiece = bezierPieces[i];

		var bezier = bezierPiece.bezierNode.item;
		var iPoints = Geometry.getLineBezierIntersectionPoints(line, bezier, bezierPiece.tRange);

		for (var j = 0; j < iPoints.length; j++) {
			points.push(iPoints[j].p);
		}
	}

	return points;
};

function getTRanges(ps, bezier) {
	var tRange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 1];


	var tRanges = [];

	var isP0OnBezier = ps[0].bezierNode.item === bezier;
	var isP1OnBezier = ps[1].bezierNode.item === bezier;

	if (!isP0OnBezier && !isP1OnBezier) {
		return [tRange];
	}

	//---- Cache
	// At this point either or both of isP0OnBezier and isP1OnBezier is true
	var crossT1 = isP0OnBezier && !isP1OnBezier;
	var crossT0 = isP1OnBezier && !isP0OnBezier;

	var a = isP0OnBezier ? ps[0].t : 0;
	var b = isP1OnBezier ? ps[1].t : 1;
	var c = tRange[0];
	var d = tRange[1];

	if (b <= c) {
		//  |---a---b-------c---d---|
		//  |---------------a------b|
		//  |----------------------c|
		//  |----------------------d|

		if (c === d && crossT1) {
			return [];
		} else {
			return [tRange];
		}
	} else if (a <= c && b >= d) {
		//  |---a---c-------d---b---|
		return [];
	} else if (c <= a && d >= b) {
		//  |---c---a-------b---d---|
		var res = [];
		if (c !== a) {
			res.push([c, a]);
		}
		if (b !== d) {
			res.push([b, d]);
		}
		return res;
	} else if (a <= c && b <= d) {
		//  |---a---c-------b---d---|
		return [[b, d]];
	} else if (c <= a && d <= b) {
		//  |---c---a-------d---b---|
		return [[c, a]];
	}
}

Geometry.closestSquaredDistanceToRotatedRect = function (bezier, p) {
	var tightBoundingBox = bezier.getBoundingBoxTight();

	var ds = [0, 1, 2, 3].map(function (i) {
		return Vector.squaredDistanceBetweenPointAndLineSegment(p, [tightBoundingBox[i], tightBoundingBox[(i + 1) % 4]]);
	});

	return Util.bestBy(ds);
};

Geometry.getClosestSquareDistanceToRect = function (box, p) {

	var x0 = box[0][0];
	var y0 = box[0][1];
	var x1 = box[1][0];
	var y1 = box[1][1];

	var xp = p[0];
	var yp = p[1];

	if (xp < x0) {
		if (yp < y0) {
			return Vector.squaredDistanceBetween(box[0], p);
		} else if (yp > y1) {
			return Vector.squaredDistanceBetween([x0, y1], p);
		} else {
			var d = x0 - xp;
			return d * d;
		}
	} else if (xp > x1) {
		if (yp < y0) {
			return Vector.squaredDistanceBetween([x1, y0], p);
		} else if (yp > y1) {
			return Vector.squaredDistanceBetween(box[1], p);
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
};

Geometry.getShapeRightMostInfo = function (bezierArr, _debug_) {

	var maxX = Number.NEGATIVE_INFINITY;
	var maxBezier = undefined;
	for (var i = 0; i < bezierArr.length; i++) {
		var bezier = bezierArr[i];

		var rightMost = bezier.getBoundingBox()[1][0];
		if (rightMost > maxX) {
			maxX = rightMost;
			maxBezier = bezier;
		}
	}

	return { maxX: maxX, maxBezier: maxBezier };
};

/**
 * Checks if a shape is positively orientated or not. 
 */
Geometry.isShapePositivelyOrientated = function (bezierArr, _debug_) {
	// TODO - must still handle the case where the rightmost point
	// is sharp.

	//console.log(bezierArr)

	var _Geometry$getShapeRig = Geometry.getShapeRightMostInfo(bezierArr, _debug_),
	    maxX = _Geometry$getShapeRig.maxX,
	    maxBezier = _Geometry$getShapeRig.maxBezier;

	//console.log(maxX, maxBezier.tAtMaxX);

	var tan = maxBezier.tangent(maxBezier.tAtMaxX);

	//console.log(tan);

	return tan[1] > 0;
};

var prevBezier = undefined; // Cache
var prevP = undefined;
var prevT = undefined;
var memClosestPoint = undefined; // ...
var prevTRange = undefined;
var prevTouchedBezier = undefined;
var iii = 0;
Geometry.closestPointBetween_PointAndBezier = function (bezierNode, p, tRange, touchedBezierNode, t, _debug_, slog) {

	var bezier = bezierNode.item;
	var touchedBezier = touchedBezierNode ? touchedBezierNode.item : undefined;

	if (prevBezier === bezier && prevP === p && prevT === t && tRange[0] === prevTRange[0] && tRange[1] === prevTRange[1] && prevTouchedBezier === touchedBezier) {
		return memClosestPoint;
	}
	prevBezier = bezier;
	prevP = p;
	prevT = t;
	prevTRange = tRange;
	prevTouchedBezier = touchedBezier;

	// TODO The site at http://jazzros.blogspot.ca/2011/03/projecting-point-on-bezier-curve.html
	// may hint at requiring much fewer assignments?

	var _bezier$bezierPoints = _slicedToArray(bezier.bezierPoints, 4),
	    _bezier$bezierPoints$ = _slicedToArray(_bezier$bezierPoints[0], 2),
	    x0 = _bezier$bezierPoints$[0],
	    y0 = _bezier$bezierPoints$[1],
	    _bezier$bezierPoints$2 = _slicedToArray(_bezier$bezierPoints[1], 2),
	    x1 = _bezier$bezierPoints$2[0],
	    y1 = _bezier$bezierPoints$2[1],
	    _bezier$bezierPoints$3 = _slicedToArray(_bezier$bezierPoints[2], 2),
	    x2 = _bezier$bezierPoints$3[0],
	    y2 = _bezier$bezierPoints$3[1],
	    _bezier$bezierPoints$4 = _slicedToArray(_bezier$bezierPoints[3], 2),
	    x3 = _bezier$bezierPoints$4[0],
	    y3 = _bezier$bezierPoints$4[1];

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

	if (bezier === touchedBezier) {
		var deflatedPoly = Poly.deflate(poly, t);
		//console.log('def-poly(t): ' + Poly.evaluate(deflatedPoly)(t));
		//console.log('    poly(t): ' + Poly.evaluate(poly)(t));
		//console.log('pol', t, Poly.allRoots01(poly));
		//console.log('def', t, Poly.allRoots01(deflatedPoly));
		poly = deflatedPoly;
	}

	//let allRoots = allRootsVAS(poly, tRange, _debug_);
	var allRoots = Poly.allRoots01(poly);
	var roots = allRoots.filter(function (root) {
		return root >= tRange[0] && root <= tRange[1];
	});

	if (slog) {
		//console.log('a') 
	}

	var push0 = true;
	var push1 = true;
	if (t === 1 && bezierNode === touchedBezierNode.next || bezier === touchedBezier && t === 0) {
		push0 = false;
	}
	if (t === 0 && bezierNode === touchedBezierNode.prev || bezier === touchedBezier && t === 1) {
		push1 = false;
	}

	/*
 roots.push(tRange[0]);
 roots.push(tRange[1]);
 */

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

	var ps = roots.map(function (root) {
		return { p: bezier.evaluate(root), t: root };
	});
	var closestPoint = Vector.getClosestTo(p, ps, function (p1, p2) {
		return Vector.squaredDistanceBetween(p1, p2.p);
	});

	memClosestPoint = closestPoint;
	return closestPoint;
};

Geometry.degAngleFromSinCos = function (sinAngle, cosAngle) {

	var toRad = function toRad(a) {
		return a * (Math.PI / 180);
	};
	var toDeg = function toDeg(a) {
		return a * (180 / Math.PI);
	};

	if (cosAngle === 0) {
		if (sinAngle > 0) {
			return 90;
		}
		return 270;
	}
	if (cosAngle > 0) {
		return toDeg(Math.atan(sinAngle / cosAngle));
	}
	return 180 + toDeg(Math.atan(sinAngle / cosAngle));
};

/** 
 * Returns the closest point on the arc.
 * 
 * @returns { p, position } where position is either 0, 1 or 2 
 *          indicating if the closest point is at either endpoint 
 *          (1 or 2) or interior to the arc (0). 
 * 
 * Note: Needs to be quite fast 
 */
Geometry.closestPointOnArc = function (p, arc) {
	// arc ->def  [circle, startpoint, endpoint, sin_angle1, cos_angle1, sin_angle2, cos_angle2]

	if (arc.circle !== null) {
		// else the arc is degenerate into a line
		// First move arc circle onto origin
		var x = arc.circle.center[0];
		var y = arc.circle.center[1];

		var arco = new Arc(new Circle([0, 0], arc.circle.radius), Vector.translate(arc.startpoint, [-x, -y]), Vector.translate(arc.endpoint, [-x, -y]), arc.sin_angle1, arc.cos_angle1, arc.sin_angle2, arc.cos_angle2);

		var pp = Vector.translate(p, [-x, -y]);
		var l = Vector.length(pp);
		var sin_pp = -pp[1] / l;
		var cos_pp = pp[0] / l;

		if (Geometry.isAngleBetween(sin_pp, cos_pp, arco.sin_angle1, arco.cos_angle1, arco.sin_angle2, arco.cos_angle2)) {
			var r_o_l = arco.circle.radius;
			var res = { p: Vector.translate([r_o_l * cos_pp, r_o_l * -sin_pp], [x, y]), position: 0 };
			return res;
		} else {
			var asp = arc.startpoint;
			var aep = arc.endpoint;

			var d1 = Vector.distanceBetween(asp, p);
			var d2 = Vector.distanceBetween(aep, p);

			if (d1 < d2) {
				return { p: asp, position: 1 };
			}
			return { p: aep, position: 2 };
		}
	}

	// Line degenerate case - this is exactly a routine for 
	// distance (and closest point) between point and line segment.
	var asp = arc.startpoint;
	var aep = arc.endpoint;

	var d1 = Vector.distanceBetween(asp, p);
	var d2 = Vector.distanceBetween(aep, p);
	var ds = Math.sqrt(Vector.distanceBetweenPointAndLineSegment(p, [asp, aep]));

	if (d1 <= d2 && d1 <= ds) {
		return { p: asp, position: 1 };
	} else if (d2 <= d1 && d2 <= ds) {
		return { p: aep, position: 2 };
	}

	// else ds is shortest
	var v = Vector.fromTo(asp, aep);

	var l1p2 = [p[0] + v[1], p[1] + -v[0]];
	var res = {
		p: Geometry.lineLineIntersection([p, l1p2], [asp, aep]),
		position: 0
	};

	return res;
};

/** 
 * @return A directional arc from 3 ordered points. 
 */
Geometry.arcFrom3Points = function (circlePoints) {
	var midPoint1 = Vector.mean([circlePoints[0], circlePoints[1]]);
	var midPoint2 = Vector.mean([circlePoints[1], circlePoints[2]]);

	var chord1 = Vector.fromTo(circlePoints[0], circlePoints[1]);
	var chord2 = Vector.fromTo(circlePoints[1], circlePoints[2]);

	var perpendicular1 = [chord1[1], -chord1[0]];
	var perpendicular2 = [chord2[1], -chord2[0]];

	var line1 = [midPoint1, Vector.translate(perpendicular1, midPoint1)];
	var line2 = [midPoint2, Vector.translate(perpendicular2, midPoint2)];

	var circleCenter = Geometry.lineLineIntersection(line1, line2);

	var arc;
	if (circleCenter === null) {
		// If the circle is in effect a line segment
		if (Vector.equal(circlePoints[0], circlePoints[2])) {
			return null;
		}
		arc = new Arc(null, circlePoints[0], circlePoints[2]);
		return arc;
	}

	var sideVector1 = Vector.fromTo(circleCenter, circlePoints[0]);
	var midVector = Vector.fromTo(circleCenter, circlePoints[1]);
	var sideVector2 = Vector.fromTo(circleCenter, circlePoints[2]);
	var radius = Vector.length(sideVector1);
	var sin_angle1 = -sideVector1[1] / radius;
	var cos_angle1 = sideVector1[0] / radius;
	var sin_angle2 = -sideVector2[1] / radius;
	var cos_angle2 = sideVector2[0] / radius;
	var sin_midangle = -midVector[1] / radius;
	var cos_midangle = midVector[0] / radius;

	if (Geometry.isAngleBetween(sin_midangle, cos_midangle, sin_angle1, cos_angle1, sin_angle2, cos_angle2)) {
		arc = new Arc(new Circle(circleCenter, radius), circlePoints[0], circlePoints[2], sin_angle1, cos_angle1, sin_angle2, cos_angle2);
	} else {
		arc = new Arc(new Circle(circleCenter, radius), circlePoints[2], circlePoints[0], sin_angle2, cos_angle2, sin_angle1, cos_angle1);
	}

	return arc;
};

Geometry.quadrant = function (sin_angle, cos_angle) {
	if (sin_angle >= 0) {
		if (cos_angle >= 0) {
			return 1;
		}
		return 2;
	}
	if (cos_angle >= 0) {
		return 4;
	}
	return 3;
};

Geometry.isAngle1LargerOrEqual = function (sin_angle1, cos_angle1, sin_angle2, cos_angle2) {
	var q1 = Geometry.quadrant(sin_angle1, cos_angle1);
	var q2 = Geometry.quadrant(sin_angle2, cos_angle2);

	if (q1 > q2) {
		return true;
	}
	if (q1 < q2) {
		return false;
	}

	// Same quadrant
	if (q1 === 1 || q1 === 4) {
		return sin_angle1 >= sin_angle2;
	}
	return sin_angle1 <= sin_angle2;
};

/** 
 * Returns true if angle1 < angle < angle2 in the non-trivial sense.
 */
Geometry.isAngleBetween = function (sin_angle, cos_angle, sin_angle1, cos_angle1, sin_angle2, cos_angle2) {
	var t1_larger_t2 = Geometry.isAngle1LargerOrEqual(sin_angle1, cos_angle1, sin_angle2, cos_angle2);
	var a_larger_t2 = Geometry.isAngle1LargerOrEqual(sin_angle, cos_angle, sin_angle2, cos_angle2);
	var a_larger_t1 = Geometry.isAngle1LargerOrEqual(sin_angle, cos_angle, sin_angle1, cos_angle1);

	var res;
	if (t1_larger_t2) {
		res = a_larger_t1 || !a_larger_t2;
	} else {
		res = a_larger_t1 && !a_larger_t2;
	}

	return res;
};

/**
 * Find point where two lines intersect.
 *  
 * @param line1 The first line - given as 2 points 
 * @param line2 The first line - given as 2 points
 * @returns Point where two lines intersect or null if they don't or intersect everywhere. 
 */
Geometry.lineLineIntersection = function (line1, line2) {
	var p1x = line1[0][0];
	var p1y = line1[0][1];
	var p2x = line1[1][0];
	var p2y = line1[1][1];
	var p3x = line2[0][0];
	var p3y = line2[0][1];
	var p4x = line2[1][0];
	var p4y = line2[1][1];
	var v1x = p2x - p1x;
	var v1y = p2y - p1y;
	var v2x = p4x - p3x;
	var v2y = p4y - p3y;

	var cross = v2x * v1y - v2y * v1x;
	if (cross === 0) {
		//console.log('parallel')
		return undefined;
	}

	var b = ((p3y - p1y) * v1x - (p3x - p1x) * v1y) / cross;

	return [p3x + b * v2x, p3y + b * v2y];
};

Geometry.lineThroughPointAtRightAngleTo = function (p, v) {
	var vv = [-v[1], v[0]];
	var p20 = p[0] + vv[0];
	var p21 = p[1] + vv[1];

	return [p, [p20, p21]];
};

/**
 * Get all intersection points between a line and a bezier within a certain t range.
 * 
 * @returns An array of { p, t } 
 */
Geometry.getLineBezierIntersectionPoints = function (line, bezier, tRange) {
	var t = [-line[0][0], -line[0][1]];
	var p = [line[1][0] + t[0], line[1][1] + t[1]];

	//---- Cache
	var lineLength = Vector.length(p);
	var sinAngle = -p[1] / lineLength;
	var cosAngle = p[0] / lineLength;

	var bezierPoints = Vector.translateThenRotatePoints(bezier.bezierPoints, t, sinAngle, cosAngle);

	var x0 = bezierPoints[0][0];
	var y0 = bezierPoints[0][1];
	var x1 = bezierPoints[1][0];
	var y1 = bezierPoints[1][1];
	var x2 = bezierPoints[2][0];
	var y2 = bezierPoints[2][1];
	var x3 = bezierPoints[3][0];
	var y3 = bezierPoints[3][1];

	var x = [x3 - 3 * x2 + 3 * x1 - x0, // t^3
	3 * x2 - 6 * x1 + 3 * x0, // t^2
	3 * x1 - 3 * x0, // t^1
	x0];
	var y = [y3 - 3 * y2 + 3 * y1 - y0, // t^3
	3 * y2 - 6 * y1 + 3 * y0, // t^2
	3 * y1 - 3 * y0, // t^1
	y0];

	var roots = Poly.findCubicRoots01(y);

	var res = roots
	/*.filter(function(t) {
 	return ((t >= tRange[0]) && (t <= tRange[1]));
 })*/
	.map(function (t) {
		return { p: bezier.evaluate(t), t: t };
	});

	return res;
};

/**
 * Given a circle, bound it tightly by an axes-aligned box (i.e. circle box). 
 * And given a bezier, bound tightly by a rectangle (not necessarily axes aligned) (i.e. bezier box).
 *  
 *  @return True if bezier box is entirely outside circle box
 *  
 */
function isBezierBoxWhollyOutsideCircleBox(bezier, circle) {

	//---- Cache
	var r = circle.radius;
	var ox = circle.center[0];
	var oy = circle.center[1];
	var radius_2 = r * r;

	//---- Translate bezier tight bounding box (4 point rectangle) so that circle center is at origin. 
	var boxTight = Vector.translatePoints(bezier.getBoundingBoxTight(), [-ox, -oy]);

	//---- Rotate circle and rectangle together so that box rectangle is aligned with axes.
	var boxDiagonal = Vector.fromTo(boxTight[0], boxTight[1]);
	var l = Vector.length(boxDiagonal);
	var sinAngle = boxDiagonal[1] / l;
	var cosAngle = boxDiagonal[0] / l;
	var b0 = Vector.rotate(boxTight[0], sinAngle, -cosAngle);
	var b1 = Vector.rotate(boxTight[2], sinAngle, -cosAngle);

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
 * Checks if circle intersects the shape. 
 * 
 * @param shape
 * @param circle
 * @param exclPoint {PointOnShape} Exclude this point and a small t gap around it.
 * 
 * NOTE: Circle can only intercept shape an even number of times (counting duplicate roots).
 */
// TODO - change tGap to a gap in pixels if possible
Geometry.doesCircleIntersectShape = function (shape, circle, exclPoint) {

	// A t gap within the shape that should not be checked.
	// TODO - rather remove point from quintic as a poly factor (watch out for double roots).
	var tGap = 0.02;

	//---- Trivial case: osculating point, i.e. sharp corner
	if (circle.radius === 0) {
		return false;
	}

	//---- Readability cache
	var radius = circle.radius;
	var ox = circle.center[0];
	var oy = circle.center[1];

	//---- Initialization
	var candidateBeziers = [];
	var pointsCounts = {};
	var node = shape.beziers.head;

	var ps = PointOnShape.split(exclPoint, tGap);

	do {
		var bezier = node.item;

		//---- If bezier [tight box] is wholly contained in osculating circle then:
		// bezier is wholly contained in circle => some part of circle is outside shape boundary
		if (!isBezierBoxWhollyOutsideCircleBox(bezier, circle)) {
			candidateBeziers.push(bezier);
		}

		node = node.next;
	} while (node !== shape.beziers.head);

	for (var i = 0; i < candidateBeziers.length; i++) {

		// We can provide an additional stage in future as an optimization, i.e.
		// Check if circle intersects tighter bounding boxes - it can either:
		// a: not intersect -> either: 
		//    i:  bezier is contained in circle - return true immediately
		//    ii: else bezier is eliminated
		// b: intersect in 1 point (unlikely) -> bezier is eliminated
		// c: intersect in 3 points -> return true immediately
		// d: intersect in 2 points -> either:
		//    i: parallel sides -> return true immediately
		//    ii: non-parallel sides -> further check is required (as below)


		//---- Test if circle literally intersects bezier

		//---- First translate circle and bezier together so circle is centered on origin
		var candidateBezier = candidateBeziers[i];
		var bezierPoints = Vector.translatePoints(candidateBezier.bezierPoints, [-ox, -oy]);

		//---- Cache
		var x0 = bezierPoints[0][0];
		var y0 = bezierPoints[0][1];
		var x1 = bezierPoints[1][0];
		var y1 = bezierPoints[1][1];
		var x2 = bezierPoints[2][0];
		var y2 = bezierPoints[2][1];
		var x3 = bezierPoints[3][0];
		var y3 = bezierPoints[3][1];

		//** To get the intersection points we need to solve: 
		//   (see http://math.stackexchange.com/questions/436216/intersection-of-cubic-bezier-curve-and-circle)
		//         Bx(t)^2 + By(t)^2 - r^2 = 0   (t = [0..1])
		//      => a6*t^6 + a5*t^5 +  a4*t^4 + a3*t^3 + a2*t^2 + a1*t + a0 = 0
		var x0_2 = x0 * x0;var x1_2 = x1 * x1;
		var x2_2 = x2 * x2;var x3_2 = x3 * x3;
		var y0_2 = y0 * y0;var y1_2 = y1 * y1;
		var y2_2 = y2 * y2;var y3_2 = y3 * y3;

		var t6 = y3_2 - 6 * y2 * y3 + 6 * y1 * y3 - 2 * y0 * y3 + 9 * y2_2 - 18 * y1 * y2 + 6 * y0 * y2 + 9 * y1_2 - 6 * y0 * y1 + y0_2 + x3_2 - 6 * x2 * x3 + 6 * x1 * x3 - 2 * x0 * x3 + 9 * x2_2 - 18 * x1 * x2 + 6 * x0 * x2 + 9 * x1_2 - 6 * x0 * x1 + x0_2;
		var t5 = 6 * y2 * y3 - 12 * y1 * y3 + 6 * y0 * y3 - 18 * y2_2 + 54 * y1 * y2 - 24 * y0 * y2 - 36 * y1_2 + 30 * y0 * y1 - 6 * y0_2 + 6 * x2 * x3 - 12 * x1 * x3 + 6 * x0 * x3 - 18 * x2_2 + 54 * x1 * x2 - 24 * x0 * x2 - 36 * x1_2 + 30 * x0 * x1 - 6 * x0_2;
		var t4 = 6 * y1 * y3 - 6 * y0 * y3 + 9 * y2_2 - 54 * y1 * y2 + 36 * y0 * y2 + 54 * y1_2 - 60 * y0 * y1 + 15 * y0_2 + 6 * x1 * x3 - 6 * x0 * x3 + 9 * x2_2 - 54 * x1 * x2 + 36 * x0 * x2 + 54 * x1_2 - 60 * x0 * x1 + 15 * x0_2;
		var t3 = 2 * y0 * y3 + 18 * y1 * y2 - 24 * y0 * y2 - 36 * y1_2 + 60 * y0 * y1 - 20 * y0_2 + 2 * x0 * x3 + 18 * x1 * x2 - 24 * x0 * x2 - 36 * x1_2 + 60 * x0 * x1 - 20 * x0_2;
		var t2 = 6 * y0 * y2 + 9 * y1_2 - 30 * y0 * y1 + 15 * y0_2 + 6 * x0 * x2 + 9 * x1_2 - 30 * x0 * x1 + 15 * x0_2;
		var t1 = 6 * y0 * y1 - 6 * y0_2 + 6 * x0 * x1 - 6 * x0_2;
		var t0 = y0_2 + x0_2 - radius * radius;

		var poly = [t6, t5, t4, t3, t2, t1, t0];

		var tRanges = getTRanges(ps, candidateBezier, undefined, true, false);

		var peval = Poly.evaluate(poly);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = tRanges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var tRange = _step.value;

				// First check if left and right endpoints at t=0 and t=1 have different signs - this quick check
				// will eliminate most cases where there is only a single root.
				// In future also check Budan's method again for max number of roots since we rarely expect 3 or more roots
				// this may speed things up.

				if (peval(tRange[0]) / peval(tRange[1]) < 0) {
					return true;
				}

				// Important Note: Number of sturm tests can drastically be reduced by eliminating
				// most neighbouring beziers by using tight bounding box overlapped with control point convex hull
				// test to see if it intesects with cirlce - should improve algorithm speed

				// Note: Another method apart from sturm is possible by doing a cascade of differentiation and
				//       checking where zeros lies at each stage starting from quadratic - at most 9 zeros need to be found
				//       in this case - probably faster than Sturm!

				// TODO - Note: we must really still test endpoints here
				var totalRoots = Poly.rootsWithin(poly, tRange[0], tRange[1]);
				if (totalRoots > 0) {
					return true; // else check next circle
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

	return false;
};

module.exports = Geometry;

},{"../polynomial/functions/all-roots-vas.js":37,"../polynomial/polynomial.js":39,"../utils.js":42,"../vector/vector.js":43,"./classes/arc.js":3,"./classes/bezier.js":4,"./classes/circle.js":5,"./classes/point-on-shape.js":6}],14:[function(require,module,exports){
'use strict';

var LlRbTree = require('../ll-rb-tree/ll-rb-tree.js');
var ListNode = require('./list-node.js');

/**
 * Represents a two-way linked loop. 
 * @constructor 
 *
 * @param comparator Tree item comparator
 *
 * NOTE: Must be called with a *sorted* array if comparator is not 
 * given. 
 */
function LinkedLoop(array, comparator) {
	if (comparator) {
		this.cptree = new LlRbTree(comparator);
	}

	this.addAllFromScratch(array || []);
}

/**
 * Insert an item into the linked loop after specified point 
 * 
 * @param item  {*} - Item to insert.
 * @param prev - Insert new item right after this item.
 * @param coupledNode
 */
LinkedLoop.insert = function (loop, item, prev_, coupledNode) {

	var node = new ListNode(item, undefined, undefined);

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
		LlRbTree.insert(loop.cptree, node);
	};

	return node;
};

LinkedLoop.remove = function (loop, item) {

	var prev = item.prev;
	var next = item.next;

	if (item === loop.head) {
		loop.head = next;
	}

	prev.next = next;
	next.prev = prev;

	if (loop.cptree) {
		// TODO - could be made faster by removing on item directly
		//loop.cptree.remove(item); 
		LlRbTree.remove(loop.cptree, item);
	};
};

/**
 * Returns the item at the specified index position..
 * 
 * NOTE: This is slow ( O(n) ); use in debugging code only.
 */
LinkedLoop.getByIndx = function (linkedLoop, n) {
	return ListNode.advanceNSteps(linkedLoop.head, n);
};

LinkedLoop.prototype.addAllFromScratch = function (arr) {

	if (arr.length === 0) {
		return;
	}

	// TODO Remove nodeArr occurences and put them in debug parts only.
	var nodeArr = [];

	var head;
	var prevNode = null;
	var node = void 0;

	for (var i = 0; i < arr.length; i++) {

		node = new ListNode(arr[i], prevNode, null, i);

		nodeArr.push(node);

		if (prevNode) {
			prevNode.next = node;
		}
		prevNode = node;

		if (i === 0) {
			head = node;
		}

		if (this.cptree) {
			LlRbTree.insert(this.cptree, node);
		};
	}

	// Close loop
	head.prev = node;
	node.next = head;

	this.head = head;
	this.nodeArr = nodeArr; // This is a hash cache in shape of array		
};

module.exports = LinkedLoop;

},{"../ll-rb-tree/ll-rb-tree.js":16,"./list-node.js":15}],15:[function(require,module,exports){
"use strict";

/**
 * Representation of a linked loop vertex (i.e. node) having various  
 * edges, two of which enforce an ordering on the nodes, i.e. 'prev'
 * and 'next'.
 *  
 * @constructor
 * @param {*} item - The actual item stored at a node.
 * @param {ListNode} prev - The previous item.
 * @param {ListNode} next - The next item.
 */
function ListNode(item, prev, next) {

  this.item = item;
  this.prev = prev;
  this.next = next;
}

/**
 * Advances the node by the given number of steps.
 * 
 * NOTE: This is slow ( O(n) ); use in debugging code only.
 */
ListNode.advanceNSteps = function (node, n) {
  for (var i = 0; i < n; i++) {
    node = node.next;
  }

  return node;
};

module.exports = ListNode;

},{}],16:[function(require,module,exports){
'use strict';

/**
 * Concise, Destructive, Left Leaning Red Black Tree implementation.
 * See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
 * See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 
 */

var LEFT = false;
var RIGHT = true;

var RED = true;
var BLACK = false;

/**
 * Red Black Tree node.
 * @constructor 
 * @param {*} data
 */
function Node(data) {
	this.data = data;
	this.red = true;
}

Node.isRed = function (node) {
	return node && node.red;
};

/** 
 * @constructor 
 */
function LlRbTree(comparator) {
	this.comparator = comparator;
	this.root = null;
}

function getMinOrMaxNode(dir, node) {
	return function (node) {
		while (node[dir]) {
			node = node[dir];
		}
		return node;
	};
}

LlRbTree.getMinNode = getMinOrMaxNode(LEFT);
LlRbTree.getMaxNode = getMinOrMaxNode(RIGHT);

LlRbTree.min = function (node) {
	return LlRbTree.getMinNode(node).data;
};

LlRbTree.max = function (node) {
	return LlRbTree.getMaxNode(node).data;
};

/**
 * @return The 2 nodes bounding the data. If overflow occurs, min is 
 * returned as the second one. If bounds cannot be found (tree is empty 
 * or contains 1 item) returns null. If the data falls on a node, that 
 * node and the next (to the right) is returned. 
 */
LlRbTree.findBounds = function (tree, data) {
	var node = tree.root;

	if (node === null) {
		return null;
	}

	var bounds = [];
	while (node) {
		var c = tree.comparator(data, node.data);
		if (c >= 0) {
			bounds[0] = node;
		} else {
			bounds[1] = node;
		}

		node = node[c >= 0];
	}

	return bounds;
};

/**
 * Find the node in the tree with the given data using ===. 
 * 
 * @return {Node} node or null if not found.
 */
LlRbTree.find = function (tree, data) {
	var node = tree.root;

	while (node) {
		var c = tree.comparator(data, node.data);
		if (c === 0) {
			return node;
		} else {
			node = node[c > 0];
		}
	}

	return null;
};

/**
 * Inserts a node with given data into the tree.
 */
LlRbTree.insert = function (tree, data) {
	tree.root = insert(tree.root, data);
	tree.root.red = false;

	function insert(h, data) {
		if (h == null) {
			return new Node(data);
		}

		if (Node.isRed(h[LEFT]) && Node.isRed(h[RIGHT])) {
			flipColors(h);
		}

		var cmp = tree.comparator(data, h.data);
		if (cmp === 0) {
			h.data = data;
		} else if (cmp < 0) {
			h[LEFT] = insert(h[LEFT], data);
		} else {
			h[RIGHT] = insert(h[RIGHT], data);
		}

		if (Node.isRed(h[RIGHT]) && !Node.isRed(h[LEFT])) {
			h = rotate(LEFT, h);
		}
		if (Node.isRed(h[LEFT]) && Node.isRed(h[LEFT][LEFT])) {
			h = rotate(RIGHT, h);
		}

		return h;
	}
};

function rotate(dir, h) {
	var x = h[!dir];
	h[!dir] = x[dir];
	x[dir] = h;
	x.red = h.red;
	h.red = true;

	return x;
}

function flipColors(h) {
	h.red = !h.red;
	h[LEFT].red = !h[LEFT].red;
	h[RIGHT].red = !h[RIGHT].red;
}

function moveRedLeft(h) {
	flipColors(h);
	if (Node.isRed(h[RIGHT][LEFT])) {
		h[RIGHT] = rotate(RIGHT, h[RIGHT]);
		h = rotate(LEFT, h);
		flipColors(h);
	}

	return h;
}

function moveRedRight(h) {
	flipColors(h);
	if (Node.isRed(h[LEFT][LEFT])) {
		h = rotate(RIGHT, h);
		flipColors(h);
	}

	return h;
}

/**
 * Removes an item from the tree based on the given data (using ===). 
 * 
 * Note: Currently, a precondition is that the data must exist in the 
 * tree. In the future we can easily modify the code to relax this 
 * requirement. 
 */
LlRbTree.remove = function (tree, data) {
	tree.root = remove(tree.root, data);
	if (tree.root) {
		tree.root.red = false;
	}

	function remove(h, data) {
		if (tree.comparator(data, h.data) < 0) {
			if (!Node.isRed(h[LEFT]) && !Node.isRed(h[LEFT][LEFT])) {
				h = moveRedLeft(h);
			}
			h[LEFT] = remove(h[LEFT], data);

			return fixUp(h);
		}

		if (Node.isRed(h[LEFT])) {
			h = rotate(RIGHT, h);
		}

		if (!h[RIGHT] && tree.comparator(data, h.data) === 0) {
			return null;
		}
		if (!Node.isRed(h[RIGHT]) && !Node.isRed(h[RIGHT][LEFT])) {
			h = moveRedRight(h);
		}

		if (tree.comparator(data, h.data) === 0) {
			h.data = LlRbTree.min(h[RIGHT]);
			h[RIGHT] = removeMin(h[RIGHT]);
		} else {
			h[RIGHT] = remove(h[RIGHT], data);
		}

		return fixUp(h);
	}

	function removeMin(h) {
		if (!h[LEFT]) {
			return null;
		}
		if (!Node.isRed(h[LEFT]) && !Node.isRed(h[LEFT][LEFT])) {
			h = moveRedLeft(h);
		}
		h[LEFT] = removeMin(h[LEFT]);

		return fixUp(h);
	}
};

/**
 * Fix right-leaning red nodes.
 */
function fixUp(h) {
	if (Node.isRed(h[RIGHT])) {
		h = rotate(LEFT, h);
	}

	if (Node.isRed(h[LEFT]) && Node.isRed(h[LEFT][LEFT])) {
		h = rotate(RIGHT, h);
	}

	// Split 4-nodes.
	if (Node.isRed(h[LEFT]) && Node.isRed(h[RIGHT])) {
		flipColors(h);
	}

	return h;
}

module.exports = LlRbTree;

},{}],17:[function(require,module,exports){
'use strict';

var MAT_CONSTANTS = {
		// TODO - should be dynamic and of order of shape dimensions.
		maxOsculatingCircleRadius: 200,
		pointType: {
				'osculating': 0, // Osculating - Max curvatre inward,   
				'sharp': 1, // Sharp corner, 
				'dull': 2, // dull corner, 
				'reverseOsculating': 3, // Osculating - Max curvature outward, 
				'standard': 4 }
};

module.exports = MAT_CONSTANTS;

},{}],18:[function(require,module,exports){
'use strict';

//---- Constants
var MAT_CONSTANTS = require('./mat-constants.js');

//---- Functions 
var smoothen = require('./mat/functions/smoothen.js');
var findMat = require('./mat/functions/find-mat.js');
var toScaleAxis = require('./mat/functions/to-scale-axis.js');

//---- Classes - can be instantiated
var MatDebug = require('./debug.js');
var Bezier = require('./geometry/classes/bezier.js');
var MatNode = require('./mat/classes/mat-node.js');
var Mat = require('./mat/classes/mat.js');
var MatCircle = require('./mat/classes/mat-circle.js');
var ContactPoint = require('./mat/classes/contact-point.js');
var PointOnShape = require('./geometry/classes/point-on-shape.js');
var LinkedLoop = require('./linked-loop/linked-loop.js');
var LlRbTree = require('./ll-rb-tree//ll-rb-tree.js');
var Shape = require('./geometry/classes/shape.js');
var Svg = require('./svg/svg.js');

//---- Namespaced utilities
var Geometry = require('./geometry/geometry.js');
var Util = require('./utils.js');
var Vector = require('./vector/vector.js');
var Poly = require('./polynomial/polynomial.js');

//---- Expose our library to the global scope for browsers
// See: http://www.mattburkedev.com/export-a-global-to-the-window-object-with-browserify/

var MatLib = window.MatLib || {};

MatLib = Object.assign(MatLib, {
	findMat: findMat,
	smoothen: smoothen,
	toScaleAxis: toScaleAxis,

	Bezier: Bezier,
	Mat: Mat,
	MatCircle: MatCircle,
	ContactPoint: ContactPoint,
	PointOnShape: PointOnShape,
	LinkedLoop: LinkedLoop,
	LlRbTree: LlRbTree,
	Shape: Shape,
	Svg: Svg,

	MatDebug: MatDebug,

	Geometry: Geometry,
	Util: Util,
	Vector: Vector,
	Poly: Poly
});

//Replace/Create the global namespace
window.MatLib = MatLib;

},{"./debug.js":1,"./geometry/classes/bezier.js":4,"./geometry/classes/point-on-shape.js":6,"./geometry/classes/shape.js":7,"./geometry/geometry.js":13,"./linked-loop/linked-loop.js":14,"./ll-rb-tree//ll-rb-tree.js":16,"./mat-constants.js":17,"./mat/classes/contact-point.js":19,"./mat/classes/mat-circle.js":20,"./mat/classes/mat-node.js":21,"./mat/classes/mat.js":22,"./mat/functions/find-mat.js":29,"./mat/functions/smoothen.js":32,"./mat/functions/to-scale-axis.js":33,"./polynomial/polynomial.js":39,"./svg/svg.js":41,"./utils.js":42,"./vector/vector.js":43}],19:[function(require,module,exports){
'use strict';

var PointOnShape = require('../../geometry/classes/point-on-shape.js');
var Vector = require('../../vector/vector.js');

/** 
 * Class representing a single contact point of a MatCircle instance. 
 * @onstructor
 *  
 * @param {MatCircle} matCircle 
 * @param {PointOnShape} pointOnShape  
 */
function ContactPoint(pointOnShape, matCircle) {
	this.pointOnShape = pointOnShape;
	this.matCircle = matCircle;
	this.key = PointOnShape.toHumanString(pointOnShape);
	this.simpleKey = pointOnShape.simpleKey;

	this[0] = pointOnShape[0]; // Shortcut
	this[1] = pointOnShape[1]; // ...
}

ContactPoint.compare = function (a, b) {
	return PointOnShape.compare(a.pointOnShape, b.pointOnShape);
};

ContactPoint.equal = function (a, b) {
	return Vector.equal(a, b);
};

module.exports = ContactPoint;

},{"../../geometry/classes/point-on-shape.js":6,"../../vector/vector.js":43}],20:[function(require,module,exports){
'use strict';

var Circle = require('../../geometry/classes/circle.js');

/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class, 
 * i.e. a representative data point of the MAT.
 * 
 * @constructor
 * @param {Circle} circle - If null we consider it a virtual circle.
 * @param {ListNode<ContactPoint>[]} cpNodes - The contact points of this circle on the shape.
 */
var MatCircle = function MatCircle(circle, cpNodes) {
	this.circle = circle;
	this.cpNodes = cpNodes;
	this.visited = 0; // TODO - does not belong inside the class
};

MatCircle.copy = function (matCircle) {
	return new MatCircle(matCircle.circle, matCircle.cpNodes);
};

/** 
 * MatCircle creator.
 * @param {Circle} circle 
 * @param {ListNode<ContactPoint>[]} cpNodes An array of 'orphaned' 
 *        (i.e. without belonging to a MatCircle) contact points.
 * Notes: Due to the mutual dependency between the matCircle and 
 * contactPoints fields, a normal constructor can not instantiate a
 * MatCircle in one step - hence this creator.
 */
MatCircle.create = function (circle, cpNodes) {
	var matCircle = new MatCircle(circle, undefined);

	for (var i = 0; i < cpNodes.length; i++) {
		cpNodes[i].item.matCircle = matCircle;
	}
	matCircle.cpNodes = cpNodes;

	return matCircle;
};

module.exports = MatCircle;

},{"../../geometry/classes/circle.js":5}],21:[function(require,module,exports){
'use strict';

/**
 * Representation of a node in the MAT structure.
 * 
 * @param {MatCircle} matCircle
 * @param branches
 * @returns
 */

var MatCircle = require('./mat-circle.js');

function MatNode(matCircle, branches) {
	this.matCircle = matCircle;
	this.branches = branches;
}

MatNode.copy = function (node) {

	return helper(node, undefined);

	function helper(matNode, priorNode, newPriorNode) {

		var branches = [];
		//let newNode = new MatNode(MatCircle.copy(matNode.matCircle), branches);
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

				branches.push(helper(_node, matNode, newNode));
			}

			//if (!priorNode) { console.log(newNode)}
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
};

module.exports = MatNode;

},{"./mat-circle.js":20}],22:[function(require,module,exports){
'use strict';

var traverse = require('../../mat/functions/traverse.js');

/**
 * The Mat class represents the end product, the Medial Axis Transform. 
 * It is defined recursively as an unrooted tree with each node  
 * containing a point, a radius and 1, 2 or 3 branches.
 * 
 * @constructor
 * @param {MatNode} node - A handle on the MAT tree structure.
 */
function Mat(node) {
  this.startNode = node;
}

//function createFromShape

Mat = Object.assign(Mat, {
  traverse: traverse
});

module.exports = Mat;

},{"../../mat/functions/traverse.js":34}],23:[function(require,module,exports){
'use strict';

var Circle = require('../../geometry/classes/circle.js');
var ContactPoint = require('../../mat/classes/contact-point.js');
var LinkedLoop = require('../../linked-loop/linked-loop.js');
var MatCircle = require('../../mat/classes/mat-circle.js');
var Shape = require('../../geometry/classes/shape.js');

/**
 * Adds a 2-prong contact circle to the shape.
 * 
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param cp1 First contact point on shape
 * @param p2 Second point on shape
 * @param delta The boundary piece within which the new contact point should be placed
 * 
 * NOTES: 
 *   - Assume p1 is an element of delta.
 *   - Assume delta contains no other contact points.
 *   - Assume p2 cannot be an element of delta. 
 */
function add2Prong(shape, circle, cp1Node, p2, _debug_) {

	var cp1 = cp1Node.item;
	var cp2 = new ContactPoint(p2, undefined);

	var delta = Shape.getNeighbouringPoints(shape, p2);

	var cmp1 = ContactPoint.compare(delta[0].item, cp2);
	var cmp2 = ContactPoint.compare(cp2, delta[1].item);

	if (_debug_) {
		if (cmp1 > 0 || cmp2 > 0) {
			console.log('2-PRONG Order is wrong 2: ' + cmp1 + ', ' + cmp2);
			//console.log(delta[0].item);
			//console.log(cp2);
		}
	}

	if (cmp1 >= 0 || cmp2 >= 0) {
		LinkedLoop.remove(shape.contactPoints, cp1Node);
		return undefined;
	}

	var newCpNode = LinkedLoop.insert(shape.contactPoints, cp2, delta[0]);

	var matCircle = MatCircle.create(circle, [cp1Node, newCpNode]);

	cp1Node.prevOnCircle = newCpNode;
	newCpNode.prevOnCircle = cp1Node;

	cp1Node.nextOnCircle = newCpNode;
	newCpNode.nextOnCircle = cp1Node;

	if (_debug_) {
		// Add points so when we alt-click shape point is logged.
		prepForDebug(cp1Node, _debug_);
		prepForDebug(newCpNode, _debug_);
	}

	return newCpNode;
}

function prepForDebug(contactPoint, _debug_) {
	//---- Prepare debug info for the ContactPoint
	var cpKey = contactPoint.item.pointOnShape.simpleKey;
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

module.exports = add2Prong;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/shape.js":7,"../../linked-loop/linked-loop.js":14,"../../mat/classes/contact-point.js":19,"../../mat/classes/mat-circle.js":20}],24:[function(require,module,exports){
'use strict';

var MatCircle = require('../../mat/classes/mat-circle.js');
var ContactPoint = require('../../mat/classes/contact-point.js');
var LinkedLoop = require('../../linked-loop/linked-loop.js');

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
var kkk = 0;
function add3Prong(shape, threeProng, _debug_) {
	var circle = threeProng.circle,
	    ps = threeProng.ps,
	    delta3s = threeProng.delta3s;


	var cps = [];
	for (var i = 0; i < 3; i++) {
		cps.push(new ContactPoint(ps[i], undefined));
	}

	if (_debug_) {
		var cmp1 = ContactPoint.compare(cps[0], cps[1]);
		var cmp2 = ContactPoint.compare(cps[1], cps[2]);
		//if (cmp1 >= 0 || cmp2 >= 0) {
		if (cmp1 > 0 || cmp2 > 0) {
			//kkk++;
			//if (kkk < 2) {
			//console.log(`3-PRONG Order is wrong: cmp1: ${cmp1}, cmp2: ${cmp2}`);
			//console.log(threeProng);
			//}
		}
	}

	if (_debug_) {
		var cmps = [];
		for (var _i = 0; _i < 3; _i++) {
			cmps.push(ContactPoint.compare(delta3s[_i][0].item, cps[_i]));

			if (cmps[_i] > 0) {
				console.log('3-PRONG Order is wrong : i: ' + _i + ' - cmp: ' + cmps[_i]);
				console.log(threeProng);
			}
		}
	}

	var cpNodes = [];
	for (var _i2 = 0; _i2 < 3; _i2++) {
		cpNodes.push(LinkedLoop.insert(shape.contactPoints, cps[_i2], delta3s[_i2][0]));
	}

	var matCircle = MatCircle.create(circle, cpNodes);

	var idxsPrev = [2, 0, 1];
	var idxsNext = [1, 2, 0];
	for (var _i3 = 0; _i3 < 3; _i3++) {
		cpNodes[_i3].prevOnCircle = cpNodes[idxsPrev[_i3]];
		cpNodes[_i3].nextOnCircle = cpNodes[idxsNext[_i3]];
	}

	return matCircle;
}

module.exports = add3Prong;

},{"../../linked-loop/linked-loop.js":14,"../../mat/classes/contact-point.js":19,"../../mat/classes/mat-circle.js":20}],25:[function(require,module,exports){
'use strict';

var find3Prong = require('./find-3-prong.js');
var add3Prong = require('./add-3-prong.js');
var MatNode = require('../../mat/classes/mat-node.js');
var ContactPoint = require('../../mat/classes/contact-point.js');
var PointOnShape = require('../../geometry/classes/point-on-shape.js');

/**
 * Recursively builds the MAT tree.
 * 
 * @param {ListNode<ContactPoint>} cpNodeStart
 * @returns {MatNode}
 */
function buildMat(shape, cpNodeStart, fromNode, fromCpNode, isRetry, _debug_) {

	// return;

	var visitedPoints = void 0;
	do {
		visitedPoints = traverseShape(cpNodeStart);
		if (_debug_) {
			// Oops - fix
			// cpHashDebugObj.visitedPointsArr.push(visitedPoints);
		}

		if (visitedPoints.length > 2) {
			findAndAdd3Prong(shape, visitedPoints, _debug_);
		}
	} while (visitedPoints.length > 2);

	if (cpNodeStart.item.matCircle.cpNodes.length === 1 && fromCpNode.nextOnCircle === cpNodeStart.next) {

		//console.log('terminal 1-prong');

		var matNode = createMatNode(cpNodeStart, fromNode ? [fromNode] : [], _debug_);
		return matNode;
	}

	if (visitedPoints.length === 1) {
		// Terminating 2-prong - should mostly have been eliminated
		// by osculating circles and points, but can still occur
		// due to floating point incaccuracies.

		// console.log('terminal 2-prong');

		var _matNode = createMatNode(cpNodeStart, fromNode ? [fromNode] : [], _debug_);

		return _matNode;
	} else if (visitedPoints.length === 2) {

		var branches = fromNode ? [fromNode] : [];
		var _matNode2 = createMatNode(cpNodeStart, branches, _debug_);

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

			var bm = buildMat(shape, cpNext, _matNode2, cpBranches, false, _debug_);

			branches.push(bm);

			cpBranches = cpBranches.nextOnCircle;
		}

		return _matNode2;
	}
}

function createMatNode(cp, branches, _debug_) {
	var matNode = new MatNode(cp.item.matCircle, branches);

	if (_debug_) {
		prepDebugHashes(cp, matNode, _debug_);
	}

	return matNode;
}

function traverseShape(cpNodeStart) {
	var visitedPoints = void 0;
	var cpNode = cpNodeStart;

	visitedPoints = [];
	do {
		visitedPoints.push(cpNode);

		var next = cpNode.next;
		cpNode = next.prevOnCircle; // Take last exit
	} while (cpNode !== cpNodeStart);

	return visitedPoints;
}

/**
 * Finds and add a 3-prong MAT circle to the given shape.
 * 
 * @param {Shape}
 *            shape
 * @param {[ListNode
 *            <ContactPoint>]} visitedPoints
 * @returns
 * 
 * MODIFIES: shape
 */
function findAndAdd3Prong(shape, visitedPoints, _debug_) {
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
		if (ContactPoint.equal(endP, startP)) {
			// console.log(_debug_.deltasToNiceStr(deltas));
			continuous = true;
			break;
		}
	}

	if (continuous) {
		// aaa
	}

	var threeProng = find3Prong(shape, deltas, _debug_);

	for (var _i2 = 0; _i2 < 3; _i2++) {
		PointOnShape.setPointOrder(shape, threeProng.circle, threeProng.ps[_i2], _debug_);
	}

	add3Prong(shape, threeProng, _debug_);
}

function prepDebugHashes(cpNodeStart, matNode, _debug_) {
	// ---- Prepare debug info for the MatCircle
	var circle = cpNodeStart.item.matCircle.circle;
	var key = PointOnShape.makeSimpleKey(circle.center);
	var nodeHash = _debug_.generated.nodeHash;
	nodeHash[key] = nodeHash[key] || {};
	nodeHash[key].matNode = matNode;

	// ---- Prepare debug info for the ContactPoint
	var cpKey = cpNodeStart.item.pointOnShape.simpleKey;
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

module.exports = buildMat;

},{"../../geometry/classes/point-on-shape.js":6,"../../mat/classes/contact-point.js":19,"../../mat/classes/mat-node.js":21,"./add-3-prong.js":24,"./find-3-prong.js":28}],26:[function(require,module,exports){
'use strict';

var MatNode = require('../../mat/classes/mat-node.js');
var Mat = require('../classes/mat.js');

function copyMat(mat) {
	return new Mat(MatNode.copy(mat.startNode));
}

module.exports = copyMat;

},{"../../mat/classes/mat-node.js":21,"../classes/mat.js":22}],27:[function(require,module,exports){
'use strict';

var MAX_ITERATIONS = 50;
//TODO Change tolerances to take shape dimension into 
// account, e.g. shapeDim / 10000 for SEPERATION_TOLERANCE;
//CONST SEPERATION_TOLERANCE = 1e-3;
var SEPERATION_TOLERANCE = 1e-2;
var SQUARED_SEPERATION_TOLERANCE = SEPERATION_TOLERANCE * SEPERATION_TOLERANCE;
//const ERROR_TOLERANCE = 1e-3;
var ERROR_TOLERANCE = SEPERATION_TOLERANCE / 10;
var SQUARED_ERROR_TOLERANCE = ERROR_TOLERANCE * ERROR_TOLERANCE;

var Circle = require('../../geometry/classes/circle.js');
var Geometry = require('../../geometry/geometry.js');
var Shape = require('../../geometry/classes/shape.js');
var LinkedLoop = require('../../linked-loop/linked-loop.js');
var getClosestBoundaryPointToPoint = require('../../geometry/functions/get-closest-boundary-point-to-point.js');
var Vector = require('../../vector/vector.js');
var PointOnShape = require('../../geometry/classes/Point-on-shape.js');

/**
 * Adds a 2-prong to the MAT. The first point is given and the second
 * one is found by the algorithm.
 * 
 * A 2-prong is a MAT circle that touches the shape in 2 points.
 * 
 * @param shape
 * @param {ListNode<ContactPoint>} cpNode The first point of the 2-prong.
 * @param _debug_ Used for debugging only.
 * 
 * Before any 2-prongs are added the entire shape is our d-Omega δΩ
 * (1-prongs does not reduce the boundary),
 * 
 * As per the paper by Choi, Choi, Moon and Wee: 
 *   "The starting point of this algorithm is a choice of a circle
 *    Br(x) centered at an interior point x which contains two boundary
 *    portions c and d of d-Omega as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary
 * beforehand. 
 */
function find2Prong(shape, cpNode, _debug_) {

	// The first point on the shape of the 2-prong.
	var y = cpNode.item.pointOnShape;

	/* The boundary piece that should contain the other point of 
  * the 2-prong circle. (Defined by start and end points).
  */
	var δ = [cpNode, cpNode];

	/* The failed flag is set if a 2-prong cannot be found. This occurs
  * when the 2 points are too close together and the 2-prong 
  * becomes, in the limit, a 1-prong. We do not want these 2-prongs
  * as they push the floating point precision limits when finding
  * their circle center causing too much inaccuracy. Of course, our
  * entire algorithm's precision is limited by floating point 
  * doubles.
  */
	var failed = false;

	/* 
  * The shortest distance so far between the first contact point and
  * the circle center - we require this to get shorter on each 
  * iteration as convergence occurs. If it does not, oscillation
  * of the algorithm has occured due to floating point inaccuracy
  * and the algorithm must terminate.
  */
	var shortestSquaredDistance = Number.POSITIVE_INFINITY;

	var pos = cpNode.item.pointOnShape;
	var bezierNode = pos.bezierNode;
	var t = pos.t;

	var x = cpNode.item.matCircle.circle.center;
	var bezierPieces = Geometry.getBoundaryPieceBeziers(shape, δ);
	var xs = void 0; // Trace the convergence.
	var z = void 0;
	var squaredError = void 0;
	//
	//let slog = _debug_.twoProngs.length === 16;
	var i = 0;
	/*if (slog) { 
 	console.log('a')
 }*/
	//
	do {
		//
		i++;
		//
		var r = Vector.squaredDistanceBetween(x, y);
		bezierPieces = cullBezierPieces(bezierPieces, x, r, _debug_);

		z = getClosestBoundaryPointToPoint(bezierPieces, x, y, bezierNode, t, _debug_ /*,
                                                                                slog && i > 3*/
		);

		//if (_debug_) { xs = xs || []; xs.push({ x, y, z, t });	}

		var squaredChordDistance = Vector.squaredDistanceBetween(y, z);

		//if (slog) { console.log('sqd: ' + squaredChordDistance); }

		if (squaredChordDistance <= SQUARED_SEPERATION_TOLERANCE) {
			failed = true;
			//console.log(_debug_.twoProngs.length);
			break;
		}

		/*
   * Find the point on the line connecting y with x that is  
   * equidistant from y and z. This will be our next x.
   */
		var nextX = findEquidistantPointOnLine(x, y, z);

		squaredError = Vector.squaredDistanceBetween(x, nextX);

		/*
   * Prevent oscillation of calculated x (due to floating point
   * inaccuracies). See comment above decleration of 
   * shortestSquaredDistance.
   */
		var squaredDistance = Vector.squaredDistanceBetween(y, nextX);
		if (squaredDistance < shortestSquaredDistance) {
			shortestSquaredDistance = squaredDistance;
		} else {
			//failed = true;
			//break;
		}

		x = nextX;

		if (_debug_) {
			xs = xs || [];xs.push({ x: x, y: y, z: z, t: t });
		}
	} while (squaredError > SQUARED_ERROR_TOLERANCE && i < MAX_ITERATIONS);

	if (i === MAX_ITERATIONS) {
		// This is simply a case of convergence being too slow. The
		// gecko, for example, takes a max of 21 iterations.
		failed = true;
	}

	var circle = new Circle(x, Vector.distanceBetween(x, z));

	if (_debug_) {
		recordForDebugging(_debug_, failed, cpNode, circle, y, z, δ, xs);
	}

	if (failed) {
		// Remove failed point.
		LinkedLoop.remove(shape.contactPoints, cpNode);
		return undefined;
	}

	PointOnShape.setPointOrder(shape, circle, z, _debug_);
	return { circle: circle, z: z };
}

function recordForDebugging(_debug_, failed, cpNode, circle, y, z, δ, xs) {

	// This is a medial axis point.
	if (failed) {
		//_debug_.draw.dot(cpNode.item, 0.6, 'black');
		_debug_.draw.dot(cpNode.item, 1, 'black');
		_debug_.draw.dot(cpNode.item, 0.1, 'yellow');
		//_debug_.draw.dot(cpNode.item, 0.01, 'black');
		//_debug_.draw.dot(cpNode.item, 0.001, 'yellow');
		//_debug_.draw.dot(cpNode.item, 0.0001, 'black');
	} else {
		_debug_.draw.dot(circle.center, 0.5, 'yellow');
		if (_debug_.drawStuff) {
			_debug_.draw.circle(circle, 'red thin2 nofill');
			_debug_.draw.dot(cpNode.item, 0.55, 'red');
			_debug_.draw.dot(z, 0.7, 'red');
		}
	}

	_debug_.twoProngs.push({
		twoProng: cpNode,
		δ: δ,
		y: y,
		x: circle.center,
		xs: xs,
		failed: failed
	});
}

/**
 * Cull all bezierPieces not within given radius of a given point.
 * 
 * @param {BezierPieces} bezierPieces
 * @param {[Number]} p
 * @param {Number} r
 * @returns
 */
function cullBezierPieces(bezierPieces, p, rSquared, _debug_) {
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

			var bezier = bezierPiece.bezierNode.item;

			var rect = bezier.getBoundingBox();
			var bd = Geometry.getClosestSquareDistanceToRect(rect, p);
			if (bd <= rSquared) {
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
		x1 = x[1];x2 = x[0];
		y1 = y[1];y2 = y[0];
		z1 = z[1];z2 = z[0];
	} else {
		x1 = x[0];x2 = x[1];
		y1 = y[0];y2 = y[1];
		z1 = z[0];z2 = z[1];
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

module.exports = find2Prong;

// 318

},{"../../geometry/classes/Point-on-shape.js":2,"../../geometry/classes/circle.js":5,"../../geometry/classes/shape.js":7,"../../geometry/functions/get-closest-boundary-point-to-point.js":10,"../../geometry/geometry.js":13,"../../linked-loop/linked-loop.js":14,"../../vector/vector.js":43}],28:[function(require,module,exports){
'use strict';

var Util = require('../..//utils.js');
var Circle = require('../../geometry/classes/circle.js');
var Geometry = require('../../geometry/geometry.js');
var Vector = require('../../vector/vector.js');
var getClosestBoundaryPointToPoint = require('../../geometry/functions/get-closest-boundary-point-to-point.js');
var PointOnShape = require('../../geometry/classes/point-on-shape.js');

var calcVectorToZeroV_StraightToIt = Vector.fromTo;

function calcVectorToZeroV_AlongMedial(circleCenter, ps, _debug_) {
	var v1 = Vector.fromTo(ps[0], ps[2]);
	var v2 = [-v1[1], v1[0]]; // Rotate by 90 degrees
	var l1 = Vector.length(Vector.fromTo(x, circleCenter));
	var v3 = Vector.toUnitVector(v2);
	var v4 = Vector.scale(v3, l1);
	if (_debug_) {
		_debug_.draw.line([x, Vector.translate(x, vectorToZeroV)], 'thin10 red');
		_debug_.draw.line([x, Vector.translate(x, v4)], 'thin10 blue');
	}

	return v4;
}

/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param {Shape} shape
 * @param {[ContactPoint]} deltas
 * 
 */
function find3Prong(shape, deltas, _debug_) {

	var bezierPiecess = deltas.map(function (δ) {
		return Geometry.getBoundaryPieceBeziers(shape, δ);
	});

	var bps = void 0; // Best ps
	var bx = void 0;

	var dbgInfo = void 0;
	if (_debug_) {
		dbgInfo = { cs: [] };
	}

	var iindx = void 0;
	var smallestRadiusDelta = Number.POSITIVE_INFINITY;
	for (var i = 1; i < deltas.length - 1; i++) {
		var _find3ProngForDelta3s = find3ProngForDelta3s(shape, deltas, i, bezierPiecess, dbgInfo, _debug_),
		    radiusDelta = _find3ProngForDelta3s.radiusDelta,
		    ps = _find3ProngForDelta3s.ps,
		    _x = _find3ProngForDelta3s.x;

		if (radiusDelta < smallestRadiusDelta) {
			smallestRadiusDelta = radiusDelta;
			iindx = i;
			bps = ps;
			bx = _x;
		}
	}

	var totDist = Vector.distanceBetween(bx, bps[0]) + Vector.distanceBetween(bx, bps[1]) + Vector.distanceBetween(bx, bps[2]);

	var circle = new Circle(bx, totDist / 3);

	var delta3s = [deltas[0], deltas[iindx], deltas[deltas.length - 1]];

	var threeProng = { delta3s: delta3s, circle: circle, ps: bps };

	if (_debug_) {
		add3ProngForDebugging(threeProng, deltas, iindx, dbgInfo, bps, _debug_);
	}

	return threeProng;
}

/**
 * Finds a 3-prong using only the 3 given delta's.
 * 
 * @param i - Specific delta indx.
 * @returns
 */
function find3ProngForDelta3s(shape, deltas, idx, bezierPiecess, dbgInfo, _debug_) {

	// TODO - Choose a tolerance relative to shape size.
	var TOLERANCE = 1e-7;

	var delta3s = [deltas[0], deltas[idx], deltas[deltas.length - 1]];

	var bezierPiece3s = [bezierPiecess[0], bezierPiecess[idx], bezierPiecess[deltas.length - 1]];

	var ps = void 0;
	var circleCenter = void 0;
	var ii = 0; // Safeguard
	var x = calcInitial3ProngPoint(shape, delta3s, bezierPiece3s, _debug_);
	var tolerance = Number.POSITIVE_INFINITY;
	// TODO 10 below is magic, fix or add somewhere as a constant
	while (tolerance > TOLERANCE && ii < 10) {
		ii++;

		ps = getClosestPoints(x, bezierPiece3s, _debug_);
		circleCenter = myCircumCenter(ps, _debug_);

		var _vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circleCenter);
		//let vectorToZeroV = calcVectorToZeroV_AlongMedial (x, circleCenter, ps);

		var upds = calcBetterX(bezierPiece3s, x, _vectorToZeroV, _debug_);
		x = upds.newX;

		var V = Vector.length(_vectorToZeroV);
		ps = upds.newPs;

		tolerance = Math.abs(V - upds.newV);
	}

	// CircumCircle radius
	var radius = Vector.length(Vector.fromTo(ps[0], circleCenter));

	var closestDs = [];
	for (var i = 0; i < bezierPiecess.length; i++) {
		var p = getClosestBoundaryPointToPoint(bezierPiecess[i], circleCenter, undefined, // exclPoint,
		undefined, // bezierNode
		undefined, // t
		_debug_);

		closestDs.push(Vector.length(Vector.fromTo(p, circleCenter)));
	}

	var closestD = Util.bestBy(closestDs);
	var radiusDelta = radius - closestD;

	if (_debug_) {
		dbgInfo.cs.push({ ps: ps, x: x, ccr: radius, indxi: idx });
	}

	return { radiusDelta: radiusDelta, ps: ps, x: x };
}

/**
 * Find new x and ps that are a better estimate of the 3-prong  
 * circle.
 * 
 * The potential function, V, is defined as the distance to the 
 * actual 3 prong circle center.
 */
function calcBetterX(bezierPiece3s, x, vectorToZeroV, _debug_) {

	var V = Vector.length(vectorToZeroV);

	var nu = 1;
	var better = void 0;
	var newX = void 0;
	var newPs = void 0;
	var newV = void 0;
	var i = 0; // Safeguard
	do {
		var shift = Vector.scale(vectorToZeroV, nu);
		newX = Vector.translate(x, shift);

		newPs = getClosestPoints(newX, bezierPiece3s, _debug_);

		// Point of zero V
		var newCircleCenter = myCircumCenter(newPs, _debug_);
		var newVectorToZeroV = Vector.fromTo(newX, newCircleCenter);
		newV = Vector.length(newVectorToZeroV);

		better = newV < V;

		nu = nu / 2;

		i++;
	} while (!better && i < 3);
	//console.log(i); 

	return { newX: newX, newV: newV, newPs: newPs };
}

/**
 * Finds an initial 3-prong circle center point from which to iterate.
 * The point must be within the shape. 
 * 
 * @param {[ContactPoint]} delta3s - The three boundary pieces of which
 *        we need to find the three 3-prong points.
 * @returns
 */
function calcInitial3ProngPoint(shape, delta3s, bezierPiece3s, _debug_) {

	// TODO - No need to calculate, we already have this info somewhere.
	var twoProngCircleCenter = Vector.mean([delta3s[0][0].item, delta3s[2][1].item]);
	var point1 = getClosestBoundaryPointToPoint(bezierPiece3s[1], twoProngCircleCenter, undefined, // exclPoint,
	undefined, // bezierNode
	undefined, // t
	_debug_);

	var meanPoints = [delta3s[0][0].item,
	//Vector.mean([delta3s[1][0].item, delta3s[1][1].item]),
	point1, delta3s[2][1].item];

	var p = void 0;
	if (delta3s[0][0].item.pointOnShape.type === 1) {
		// delta3s start and end at sharp corner.
		// If delta3s start at a sharp corner it will end there also
		// so no need to check for end point as well.
		p = Vector.mean([meanPoints[0], meanPoints[1]]);
	} else {
		p = Vector.circumCenter(meanPoints);
	}

	if (!Number.isFinite(p[0])) {
		if (_debug_) {
			// TODO - check why this actuall happens sometimes
			//console.log(_debug_.pointsToNiceStr(meanPoints));
			//console.log(_debug_.deltasToNiceStr(delta3s));
			//console.log(p, meanPoints);
		}
	}
	if (!Number.isFinite(p[0])) {
		var sames = whichNotSame(meanPoints);
		return Vector.mean([meanPoints[sames[0]], meanPoints[sames[1]]]);
	}

	return p;
}

function add3ProngForDebugging(threeProng, deltas, iindx, dbgInfo, bps, _debug_) {

	_debug_.nProngs.push(threeProng);

	dbgInfo.deltas = deltas;
	dbgInfo.deltasSimple = deltas.map(function (delta) {
		return [PointOnShape.toHumanString(delta[0].item.pointOnShape), PointOnShape.toHumanString(delta[1].item.pointOnShape)];
	});
	dbgInfo.iindx = iindx;

	if (_debug_.drawStuff) {
		for (var i = 0; i < bps.length; i++) {
			var p = bps[i];
			_debug_.draw.dot(p, 0.1 * (i + 1), 'blue');
		}
	}

	if (_debug_.drawStuff) {
		// This is a MAT point!
		_debug_.draw.dot(threeProng.circle.center, 0.3, 'blue');

		_debug_.draw.circle(threeProng.circle, 'blue thin1 nofill');
	}
}

function whichNotSame(ps) {
	if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
		return [0, 2];
	} else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
		return [0, 2];
	} else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
		return [1, 2];
	};

	return [];
}

function getClosestPoints(x, bezierPiece3s, _debug_) {

	return bezierPiece3s.map(function (bezierPieces) {

		var p = getClosestBoundaryPointToPoint(bezierPieces, x, undefined, // exclPoint,
		undefined, // bezierNode
		undefined, // t
		_debug_);

		return p;
	});
}

/**
 * 
 * @param ps
 * @param _debug_
 * @returns
 * 
 * NOTES: Intead of using splitBack, split and splitForward, we should
 *        use the tangents at the inward cone.
 */
function myCircumCenter(ps, _debug_) {
	//return Vector.circumCenter(ps);


	var minD = 0.0005; // Keep this smaller than 2-prong gaps?
	var tGap = 0.0005;

	var l1 = Vector.distanceBetween(ps[0], ps[1]);
	var l2 = Vector.distanceBetween(ps[1], ps[2]);
	var l3 = Vector.distanceBetween(ps[2], ps[0]);

	var indxs = void 0;
	if (l1 < minD) {
		indxs = [0, 1, 2];
	} else if (l2 < minD) {
		indxs = [1, 2, 0];
	} else if (l3 < minD) {
		indxs = [2, 0, 1];
	}

	if (indxs) {

		var newPs = [PointOnShape.splitBack(ps[indxs[0]], tGap), PointOnShape.split(ps[indxs[0]], tGap), PointOnShape.splitForward(ps[indxs[0]], tGap)];

		//return Vector.circumCenter([newPs[0][0], newPs[0][1], ps[indxs[2]]]);


		var ccs = newPs.map(function (newP) {
			return Vector.circumCenter([newP[0], newP[1], ps[indxs[2]]]);
		});

		var idx = 0;
		var _minD = Number.POSITIVE_INFINITY;
		for (var i = 0; i < 3; i++) {
			var d = Vector.distanceBetween(ccs[i], ps[indxs[2]]);
			if (d < _minD) {
				_minD = d;
				idx = i;
			}
		}

		return ccs[idx];
	}

	return Vector.circumCenter(ps);
}

function myCircumCenter1(ps, _debug_) {
	//return Vector.circumCenter(ps);


	var minD = 0.0005; // Keep this smaller than 2-prong gaps?
	var tGap = 0.0005;

	var l1 = Vector.distanceBetween(ps[0], ps[1]);
	var l2 = Vector.distanceBetween(ps[1], ps[2]);

	var indxs = void 0;
	//if (l1 < minD) {
	if (l1 === 0) {
		var newPs = PointOnShape.splitForward(ps[0], tGap);
		return Vector.circumCenter([newPs[0], newPs[1], ps[2]]);
		//} else if (l2 < minD) {
	} else if (l2 === 0) {
		var _newPs = PointOnShape.splitBack(ps[0], tGap);
		return Vector.circumCenter([_newPs[0], _newPs[1], ps[2]]);
	}

	return Vector.circumCenter(ps);
}

/*
function whichSame(ps) {
	if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
		return [0,1];
	} else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
		return [1,2];
	} else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
		return [2,0];
	};
	
	return []; 
}
*/

/** 
 * Resolve ps (as in stellar) if they are too close together, 
 * i.e. same point.
 */
/*
function resolvePs(ps) {
	
	let sames = whichSame(ps);
	if (sames.length === 0) {
		return ps;
	}
	

	let pps = [];
	let s0 = sames[0];
	let s1 = sames[1];
	let abit = 0.0000001; 
	//let abit = 0.01; 
	
	pps = ps.slice();
	
	if (pps[s0].t < abit) {
		if (pps[s1].t + abit > 1) {
			[s0,s1] = [s1,s0];
		}
		pps[s1] = PointOnShape.shift(ps[s1], abit);
	} else {
		if (pps[s0].t < abit) {
			[s0,s1] = [s1,s0];
		}
		pps[s0] = PointOnShape.shift(ps[s0], -abit);
	}
	
	return pps;
}
*/

module.exports = find3Prong;

// 459

},{"../..//utils.js":42,"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../geometry/functions/get-closest-boundary-point-to-point.js":10,"../../geometry/geometry.js":13,"../../vector/vector.js":43}],29:[function(require,module,exports){
'use strict';

var add2Prong = require('./add-2-prong.js');
var find2Prong = require('./find-2-prong.js');
var buildMat = require('./build-mat.js');
var Mat = require('../classes/mat.js');

/**
 * Find the MAT from the given Shape.
 */
function findMat(shape, _debug_) {

	// TODO - run KILL_HOMOLOGY - this step will allow for shapes 
	// with homology (i.e. with holes in them) to work as well.

	var t0 = void 0;
	//if (_debug_) {
	t0 = performance.now();
	//}

	add2Prongs(shape, _debug_);
	//return;

	//if (_debug_) { 
	var t1 = performance.now();

	if (_debug_) {
		_debug_.add2ProngsDuration = t1 - t0;
	}
	console.log('    2-prongs took ' + (t1 - t0).toFixed(0) + ' milliseconds.');
	//}

	/*
  * Connect the dots and add the 3-prongs.
  * 
  * 1. Start with any 2-prong (might not be neccessary, we might be able
  * to start with any contact-point
  * 
  */

	/* ---- 
  * Find a good starting point for our tree structure 
  * e.g. (first 2-prong).
  * TODO Check if this step is really necessary.  
  */

	var ta0 = void 0;
	ta0 = performance.now();

	var contactPoints = shape.contactPoints;
	var cpNode = contactPoints.head;
	do {
		if (cpNode.item.matCircle.cpNodes.length === 2) {
			break;
		}

		cpNode = cpNode.next;
	} while (cpNode !== contactPoints.head);

	var cptest = cpNode.prevOnCircle;

	var branchBack = buildMat(shape, cptest.prevOnCircle, undefined, undefined, false, _debug_);
	var branchForth = buildMat(shape, cptest, undefined, undefined, false, _debug_);

	branchForth.branches.push(branchForth.branches[0]);
	branchForth.branches[0] = branchBack.branches[0];
	branchBack.branches[0].branches[0] = branchForth;

	var mat = new Mat(branchForth);

	var ta1 = performance.now();
	if (_debug_) {
		_debug_.add2ProngsDuration = ta1 - ta0;
	}
	console.log('    3-prongs took ' + (ta1 - ta0).toFixed(0) + ' milliseconds.');

	//return mat;

	var matFixed = fixMat(mat);

	return matFixed;
}

/** 
 * Add 2 prongs.
 * 
 * See comments on the add2Prong function.
 */
var failCount = 0;
function add2Prongs(shape, _debug_) {

	var for2Prongs = shape.for2Prongs;

	var len = for2Prongs.length;

	//let index = indexInterlaced(len); // Keep for debuggin.
	var index = indexLinear(len);

	//console.log(len);
	for (var i = 0; i < len; i++) {
		var cpNode = for2Prongs[index[i]];
		var twoProngInfo = find2Prong(shape, cpNode, _debug_);

		if (twoProngInfo) {
			var circle = twoProngInfo.circle,
			    z = twoProngInfo.z;

			var newCpNode = add2Prong(shape, circle, cpNode, z, _debug_);
			/*if (!newCpNode) {
   	
   }*/
		} else {
			failCount++;
		}
	}

	console.log('2-prong fails: ' + failCount);
}

/** 
 * This is unfortunately currently required since I can't get the
 * buildMat recursive algorithm right on the first pass.
 * @param mat
 * @returns
 */
var lll = 0;
function fixMat(mat) {

	helper(mat.startNode, undefined);

	function helper(matNode, priorNode) {

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

				helper(node, matNode);
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
 * @returns
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
 * @returns
 */
function indexLinear(n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr.push(i);
	}
	return arr;
}

module.exports = findMat;

},{"../classes/mat.js":22,"./add-2-prong.js":23,"./build-mat.js":25,"./find-2-prong.js":27}],30:[function(require,module,exports){
'use strict';

var traverse = require('./traverse.js');

function getNodesAsArray(mat) {
	var nodes = [];

	traverse(mat, function (node) {
		nodes.push(node);
	});

	return nodes;
}

module.exports = getNodesAsArray;

},{"./traverse.js":34}],31:[function(require,module,exports){
'use strict';

var PointOnShape = require('../../geometry/classes/point-on-shape.js');

var traverse = require('./traverse.js');

function getNodesAsHash(mat) {
	var nodes = {};

	traverse(mat, function (node) {
		var key = PointOnShape.makeSimpleKey(node.matCircle.circle.center);
		nodes[key] = node;
	});

	return nodes;
}

module.exports = getNodesAsHash;

},{"../../geometry/classes/point-on-shape.js":6,"./traverse.js":34}],32:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Geometry = require('../../geometry/geometry.js');
var Vector = require('../../vector/vector.js');
var Mat = require('../classes/mat.js');
var MAT_CONSTANTS = require('../../mat-constants.js');

var DRAW_CLASS_LINE = 'nofill thin20 blue';
var DRAW_CLASS_QUAD = 'nofill thin20 blue';
var DRAW_CLASS_CUBE = 'nofill thin20 blue';
//const DRAW_CLASS_CUBE = 'thin20 blue';

/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers. 
 */

function smoothen(mat, _debug_) {

	/**
  * Get the linked contact points. TODO This information to be
  * stored in the MatCircle in the future then there is no need
  * to actually search for it! 
  */
	function getLinkedCps(_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    prevCpNodes = _ref2[0],
		    currCpNodes = _ref2[1];

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

	Mat.traverse(mat, function (currNode, prevNode) {
		if (!prevNode) {
			return;
		}

		var prevMatCircle = prevNode.matCircle;
		var prevCc = prevMatCircle.circle.center;
		var prevCpNodes = prevMatCircle.cpNodes;

		var currMatCircle = currNode.matCircle;
		var currCc = currMatCircle.circle.center;
		var currCpNodes = currMatCircle.cpNodes;

		var _getLinkedCps = getLinkedCps([prevCpNodes, currCpNodes]),
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
				var spanner = Vector.fromTo(cp1, cp2);
				vDir = Vector.rotateBy90Degrees(spanner);
			} else {
				if (cp1.pointOnShape.type === MAT_CONSTANTS.pointType.sharp) {
					var bezierNode1 = void 0;
					var bezierNode2 = void 0;
					if (cp1.pointOnShape.t === 0) {
						bezierNode1 = cp1.pointOnShape.bezierNode;
						bezierNode2 = cp1.pointOnShape.bezierNode.prev;
					} else if (cp1.pointOnShape.t === 1) {
						bezierNode1 = cp1.pointOnShape.bezierNode.next;
						bezierNode2 = cp1.pointOnShape.bezierNode;
					}

					var tan1 = bezierNode1.item.tangent(0);
					var tan2 = Vector.reverse(bezierNode2.item.tangent(1));

					var x = Vector.dot(tan1, tan2);
					// Recall the identities sin(acos(x)) = sqrt(1-x^2),
					// etc. Also recall the half angle formulas. Then 
					// the rotation matrix, R, can be calculated.
					var cosθ = Math.sqrt((1 + x) / 2);
					var sinθ = Math.sqrt((1 - x) / 2);

					vDir = Vector.rotate(tan2, sinθ, cosθ);
				} else {
					vDir = Vector.fromTo(cp1, circleCenter);
				}
			}
			var v = Vector.translate(circleCenter, Vector.toLength(vDir, 1));
			var l = [circleCenter, v];

			return l;
		}

		var mid = Geometry.lineLineIntersection(prevL, currL);
		var twisted = void 0;
		if (mid) {
			var a = Vector.fromTo(prevCc, mid);
			var b = Vector.fromTo(currCc, mid);
			var c = Vector.fromTo(prevCc, currCc);

			var dot1 = Vector.dot(a, c);
			var dot2 = Vector.dot(b, c);

			twisted = dot1 < 0 || dot2 > 0;
		}

		if (!mid) {
			if (_debug_) {
				_debug_.draw.line([prevCc, currCc], DRAW_CLASS_LINE);
			}
		} else if (twisted) {
			var lp1 = Vector.mean([prevCc, currCc]);
			var vv1 = Vector.fromTo(prevCc, currCc);
			var vvv1 = Vector.rotateBy90Degrees(vv1);
			var lpp1 = Vector.translate(lp1, vvv1);
			var l = [lp1, lpp1];
			var mid1 = Geometry.lineLineIntersection(prevL, l);
			var mid2 = Geometry.lineLineIntersection(currL, l);
			if (_debug_) {
				_debug_.draw.bezier({ bezierPoints: [prevCc, mid1, mid2, currCc] }, DRAW_CLASS_CUBE);
			}
		} else {
			//console.log(prevCc, mid, currCc);
			if (_debug_) {
				_debug_.draw.quadBezier([prevCc, mid, currCc], DRAW_CLASS_QUAD);
			}
		}
	});
}

module.exports = smoothen;

},{"../../geometry/geometry.js":13,"../../mat-constants.js":17,"../../vector/vector.js":43,"../classes/mat.js":22}],33:[function(require,module,exports){
'use strict';

var Circle = require('../../geometry/classes/circle.js');
var copyMat = require('./copy-mat.js');
var getNodesAsHash = require('./get-nodes-as-hash.js');
var Geometry = require('../../geometry/geometry.js');
var PointOnShape = require('../../geometry/classes/point-on-shape.js');
var Mat = require('../classes/mat.js');

var width = 620; // TODO change to actual shape coordinates
var height = 560; // ...


/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * 
 * @param {Mat} mat The Medial Axis Transform (MAT) on which to 
 *        apply the SAT. 
 * @param {Number} s The scale factor >= 1 (e.g. 1.3)
 * @returns {Sat}
 */
function toScaleAxis(mat_, s, _debug_) {
	/*
  * This algorithm might be made somewhat faster by building tree  
     * to a depth where there is say less than 4 other circles and then 
     * only split the branch once this threshold has been exceeded.
     * 
     * Also, when searching, search only in relevant branches even
     * when circle overlaps more than one group.
  */

	var mat = copyMat(mat_);
	/*
  * Start with the biggest circle (since it is the most likely
  * to eclipse other circles), multiply its radius by s and see
  * which circles are fully contained in it and trim it away in
  * the MAT tree.
  */

	var nodeHash = getNodesAsHash(mat);

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

	var t0 = performance.now();
	var tree = createSpacialTree(s, nodeHash);
	var t1 = performance.now();
	//console.log((t1 - t0).toFixed(0) + ' milliseconds.');

	if (_debug_) {
		if (_debug_.shouldDrawSATTree) {
			_debug_.drawSATTree(tree);
		}
	}

	// Grab the MAT tree at its biggest node.
	var sat = new Mat(biggestNode);

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

function cullem(node, key, _ref) {
	var s = _ref.s,
	    tree = _ref.tree,
	    cullHash = _ref.cullHash;


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
			//for (let i=0; i<tree.length; i++)
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

	var c1 = Circle.scale(testNode.matCircle.circle, s);

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
			var c2 = Circle.scale(node.matCircle.circle, s);
			if (Geometry.doesCircleEngulfCircle(c1, c2)) {
				cullNodes[key] = node;

				branch.delete(key);
			}
		});
	}

	function helper(tree, coordinate, limits, depth) {

		if (limits === null) {
			// If we already reached a circle which spans multiple
			// groups previously, then check all circles in the 
			// tree.
			cullBranch5(tree);

			for (var i = 0; i <= 4; i++) {
				var branch = tree[i];
				if (branch) {
					helper(branch, 0, null, depth + 1);
					//helper(branch, newCoordinate, null, depth+1);
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
				//helper(branch, newCoordinate, null, depth+1);
				helper(_branch4, 0, null, depth + 1);
			}
		}
	}
}

/**
 * @returns {Boolean} true if a node should NOT be culled. 
 */
function cullIt(cullHash, cullNodes, satNode, priorNode) {

	var key = PointOnShape.makeSimpleKey(satNode.matCircle.circle.center);

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
 * @param {Number} coordinate - 0 -> horizontal or 1 -> vertical.
 * @param {[Number]} limits - The limits within which the circle 
 *        bounds can fall.
 * @param {Circle} circle - The circle to categorize into a group. 
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

module.exports = toScaleAxis;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../geometry/geometry.js":13,"../classes/mat.js":22,"./copy-mat.js":26,"./get-nodes-as-hash.js":31}],34:[function(require,module,exports){
'use strict';

var PointOnShape = require('../../geometry/classes/point-on-shape.js');

/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 * 
 * @param {Mat} mat
 * @returns undefined
 */
function traverse(mat, f) {

	helper(mat.startNode, undefined, undefined);

	function helper(matNode, priorNode /*, priorIndx*/) {
		f(matNode, priorNode /*, priorIndx*/);

		//for (let node of matNode.branches) {
		for (var i = 0; i < matNode.branches.length; i++) {
			var node = matNode.branches[i];
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}

			helper(node, matNode, i);
		}
	}
}

module.exports = traverse;

},{"../../geometry/classes/point-on-shape.js":6}],35:[function(require,module,exports){
'use strict';

var Poly = require('../polynomial/polynomial.js');

/** 
 * Mobius class
 * @constructor
 * 
 * The below parameters are the coefficients of the Mobius 
 * transformation (ax + b) / (cx + d).
 * @param a {Number}
 * @param b {Number}
 * @param c {Number}
 * @param d {Number}
 */
function Mobius(numer, denom) {
	this.numer = numer; //[a,b]; // Represents the numerator polynomial
	this.denom = denom; //[c,d]; // ... denominator ...
}

Mobius.changeVariables = function (mobius, a, b) {
	return new Mobius(Poly.changeVariables(mobius.numer, a, b), Poly.changeVariables(mobius.denom, a, b));
};

Mobius.invert = function (mobius) {
	return new Mobius([mobius.numer[1], mobius.numer[0]], [mobius.denom[1], mobius.denom[0]]);
};

Mobius.evaluateAt0 = function (mobius) {
	return mobius.numer[1] / mobius.denom[1];
};

Mobius.evaluateAtInf = function (mobius) {
	return mobius.numer[0] / mobius.denom[0];
};

Mobius.evaluate = function (mobius, t) {
	return Poly.evaluate(mobius.numer)(t) / Poly.evaluate(mobius.denom)(t);
};

module.exports = Mobius;

},{"../polynomial/polynomial.js":39}],36:[function(require,module,exports){
'use strict';

/** 
 * The Gaussian Quadrature method to integrate the given
 * function. The integral limits are between 0 and 1.
 * 
 * @param {Number} order Can be 2, 4 or 8. 
 *        Higher values are more accurate. 
 *        
 * See https://en.wikipedia.org/wiki/Gaussian_quadrature
 * See http://pomax.github.io/bezierinfo/#arclength
 * 
 * Notes: 
 * 
 * - A future improvement can be to use the Gauss–Kronrod rules
 * to estimate the error and thus choose a number of constants based
 * on the error and not just thumb-suck.
 * 
 * - In future, the constants can be calculated and cached so we can
 * chooce any number of constants.
 * 
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function gaussQuadrature(f, interval, order_) {
	var order = order_ || 16;

	var constants = GAUSS_CONSTANTS[order];
	var weights = constants.weights;
	var abscissas = constants.abscissas;

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

//The Gaussian Legendre Quadrature method constants. 
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

},{}],37:[function(require,module,exports){
'use strict';

var Poly = require('../../polynomial/polynomial.js');
var Mobius = require('../../mobius/mobius.js');

/** Finds all roots using the VAS algorithm followed by Brent's method 
 * @param p {Array[Number]} The polynomial from highest to lowest coefficient
 * 
 **/
function allRootsVAS(p, tRange, _debug_) {
	// TODO - First remove all zero roots - The VAS method can't handle them
	var zeroRoots = void 0;
	if (tRange[0] <= 0 && tRange[1] >= 0) {
		zeroRoots = Poly.zeroRoots(p);
	} else {
		zeroRoots = { p: p, numZeros: 0 };
	}

	var p_ = zeroRoots.p;
	var numZeros = zeroRoots.numZeros;

	// TODO - Next, remove all multiple roots ... - VAS doesn't like them either

	var vasRoots = Poly.vasRootIntervals(p_, tRange).filter(function (interval) {
		var notOverlap = interval[1] < tRange[0] || interval[0] > tRange[1];
		if (notOverlap) {
			if (_debug_) {
				_debug_.rootsSkipped++;
			}
		}
		return !notOverlap;
	}).map(function (interval) {
		// TODO - 0.0001 was emperically chosen
		if (_debug_) {
			_debug_.rootsNotSkipped++;
		}

		return Poly.brent(Poly.evaluate(p_), interval[0], interval[1], 0.0000001);
	});

	for (var i = 0; i < numZeros; i++) {
		vasRoots.push(0);
	}

	/*
 if (_debug_) {
 	_debug_.rootsNotSkipped++;
 }
 */

	return vasRoots;
}

/** 
 * Use VAS (Vincent–Akritas–Strzeboński) method to find intervals 
 * for roots. 
 * See: http://www.e-ce.uth.gr/wp-content/uploads/formidable/phd_thesis_vigklas.pdf 
 * TODO - Square-free factorization ignored for now - duplicate roots will cause an issue
 * TODO - Optimize later for intervals between 0 and 1 only
 * 0.085 millis per poly of degree 6 - 10000 polies
 */
Poly.vasRootIntervals = function (p, tRange) {

	var positiveIntervals = Poly.vasRootIntervalsHelper(
	//p.slice(),
	p, new Mobius([1, 0], [0, 1]), tRange);

	// ONLY COMMENTED BECAUSE IN *OUR* CASE WE DONT CARE ABOUT NEGATIVE ROOTS!!
	/*
 var negativeIntervals = Poly.vasRootIntervalsHelper(
 	Poly.changeVariables(p.slice(), -1, 0), 
 	new Mobius([1,0],[0,1]),
 	tRange
 )
 .map(function(interval) {
 	return Poly.negate(Poly.invert(interval));
 });
 */

	var intervals = [].concat(
	//negativeIntervals, 
	positiveIntervals);

	return intervals;
};

/** 
 * Helper - aa,bb,cc,dd are the Mobius transformation coefficients
 * The initial mobius must be new Mobius([1,0],[0,1]) -> M(x) = x. 
 */
Poly.vasRootIntervalsHelper = function (p, mobius, tRange) {

	// In the Vigklas paper the steps are marked as below:

	// STEP 1
	var intervals = [];
	var signVariations = Poly.signChanges(p);

	// STEP 2
	if (signVariations === 0) {
		// Descartes' rule of signs y'all
		return [];
	}

	// STEP 3
	if (signVariations === 1) {
		var M0 = Mobius.evaluateAt0(mobius);
		var MI = Mobius.evaluateAtInf(mobius);
		var MM0 = Math.min(M0, MI);
		var MMI = Math.max(M0, MI);
		if (MMI === Number.POSITIVE_INFINITY) {
			MMI = Mobius.evaluate(mobius, Poly.positiveRootUpperBound(p));
		}

		return [[MM0, MMI]];
	}

	// STEP 4
	var lb = Poly.positiveRootLowerBound(p);

	// STEP 5
	/*if (lb > tRange[1]) {
 	return [];
 }*/

	if (lb > 1) {
		// p ← p(x + lb)
		p = Poly.changeVariables(p, 1, lb);

		// M ← M(x + lb)
		mobius = Mobius.changeVariables(mobius, 1, lb);
	}

	// TODO - Rember factor of 16 improvement

	// STEP 6 - Look for real roots in (0, 1)

	// p01 ← (x + 1)^(deg(p)) *  p(1/(x+1))
	var p01 = Poly.changeVariables(Poly.invert(p), 1, 1);

	// M01 ← M(1/(x+1))
	var M01 = Mobius.changeVariables(Mobius.invert(mobius), 1, 1);

	// STEP 7 - Is 1 a root?
	var m = Mobius.evaluate(mobius, 1);

	// STEP 8 - Look for real roots in (1, ∞)

	// p1∞ ← p(x + 1)
	var p1inf = Poly.changeVariables(p, 1, 1);

	// M1∞ ← M(x + 1)
	var M1inf = Mobius.changeVariables(mobius, 1, 1);

	// STEPS 9 -> 13
	var intervals1 = Poly.vasRootIntervalsHelper(p01, M01, tRange);
	var intervals3 = Poly.vasRootIntervalsHelper(p1inf, M1inf, tRange);

	if (Poly.evaluate(p)(1) === 0) {
		intervals1.push([m, m]);
	}

	return [].concat(intervals1, intervals3);
};

module.exports = allRootsVAS;

},{"../../mobius/mobius.js":35,"../../polynomial/polynomial.js":39}],38:[function(require,module,exports){
'use strict';

/**
 * Find the cube roots of the given polynomial between 0 and 1.
 * 
 * This code is from the Pomax guide found at
 * https://pomax.github.io/bezierinfo/#extremities
 * Given cubic coordinates {pa, pb, pc, pd} find all
 * roots.
 * 
 * TODO Later to be replaced by a more numerically stable version.
 */

function findCubicRoots01(poly) {

	// A real-cuberoots-only function:
	function cuberoot(v) {
		if (v < 0) {
			return -Math.pow(-v, 1 / 3);
		}
		return Math.pow(v, 1 / 3);
	}

	function rootFilter01(root) {
		return root >= 0 && root <= 1;
	}

	var d = poly[0];
	var a = poly[1] / d;
	var b = poly[2] / d;
	var c = poly[3] / d;

	var p = (3 * b - a * a) / 3,
	    p3 = p / 3,
	    q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
	    q2 = q / 2,
	    discriminant = q2 * q2 + p3 * p3 * p3;

	// and some variables we're going to use later on:
	var u1, v1, root1, root2, root3;

	// three possible real roots:
	if (discriminant < 0) {
		var mp3 = -p / 3,
		    mp33 = mp3 * mp3 * mp3,
		    r = Math.sqrt(mp33),
		    t = -q / (2 * r),
		    cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
		    phi = Math.acos(cosphi),
		    crtr = cuberoot(r),
		    t1 = 2 * crtr;
		root1 = t1 * Math.cos(phi / 3) - a / 3;
		root2 = t1 * Math.cos((phi + 2 * Math.PI) / 3) - a / 3;
		root3 = t1 * Math.cos((phi + 4 * Math.PI) / 3) - a / 3;
		return [root1, root2, root3].filter(rootFilter01);
	} else if (discriminant === 0) {
		// three real roots, but two of them are equal:
		u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
		root1 = 2 * u1 - a / 3;
		root2 = -u1 - a / 3;
		return [root1, root2].filter(rootFilter01);
	} else {
		// one real root, two complex roots
		var sd = Math.sqrt(discriminant);
		u1 = cuberoot(sd - q2);
		v1 = cuberoot(sd + q2);
		root1 = u1 - v1 - a / 3;
		return [root1].filter(rootFilter01);
	}
}

module.exports = findCubicRoots01;

},{}],39:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Poly;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var findCubicRoots01 = require('./functions/find-cubic-roots.js');
var Util = require('../utils.js');

/**
* Functional univariate polynomial library functions.
*
* All polinomials are represented as a simple array starting with the 
* highest power, e.g. 
*   10x^4 + 3x^3 + 5x^2 + 7x + 0 -> [10,3,5,7,0]
*/
var Poly = (_Poly = {
	// Roots
	findQuadraticRoots01: findQuadraticRoots01,
	findCubicRoots01: findCubicRoots01,
	brent: brent,
	positiveRootLowerBound: positiveRootLowerBound,
	positiveRootUpperBound: positiveRootUpperBound,
	zeroRoots: zeroRoots,
	rootsWithin: rootsWithin,
	allRoots01: allRoots01,
	newton: newton
}, _defineProperty(_Poly, 'rootsWithin', rootsWithin), _defineProperty(_Poly, 'multiplyByConst', multiplyByConst), _defineProperty(_Poly, 'negate', negate), _defineProperty(_Poly, 'minus', minus), _defineProperty(_Poly, 'multiply', multiply), _defineProperty(_Poly, 'differentiate', differentiate), _defineProperty(_Poly, 'sturmChain', sturmChain), _defineProperty(_Poly, 'degree', degree), _defineProperty(_Poly, 'evaluate', evaluate), _defineProperty(_Poly, 'evaluateAt0', evaluateAt0), _defineProperty(_Poly, 'signChanges', signChanges), _defineProperty(_Poly, 'invert', invert), _defineProperty(_Poly, 'changeVariables', changeVariables), _defineProperty(_Poly, 'deflate', deflate), _defineProperty(_Poly, 'remainder', remainder), _Poly);

/**  
 * Differentiation the given polynomial.
 **/
function differentiate(p) {

	var result = [];

	var d = p.length - 1;
	for (var i = d; i !== 0; i--) {
		var coeff = p[d - i] * i;
		if (i === d && coeff === 0) {
			continue;
		}

		result.push(coeff);
	}

	return result;
}

/** 
 * Multiplies 2 polynomials 
 */
function multiplyByConst(c, p) {
	if (c === 0) {
		return [];
	}

	var d = p.length - 1;
	var result = [];
	for (var i = d; i >= 0; i--) {
		result.push(c * p[d - i]);
	}
	return result;
};

function negate(poly) {
	return Poly.multiplyByConst(-1, poly);
}

/** 
 * Subtracts second from first polynomial 
 */
// TODO - ugly code - improve
function minus(poly1, poly2) {
	var d1 = poly1.length - 1;
	var d2 = poly2.length - 1;
	var dr = Math.max(d1, d2);
	var result = [];
	for (var i = 0; i < dr + 1; i++) {
		result.push(0);
	}

	for (var i = dr; i >= 0; i--) {
		var v1 = poly1[dr - i];
		var v2 = poly2[dr - i];
		result[dr - i] = (v1 ? v1 : 0) - (v2 ? v2 : 0);
	}

	return result;
}

/** 
 * Multiplies poly1 and poly2 
 * 
 * Inefficient O(n^2) 
 * see https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Polynomial_multiplication
 * 
 **/
function multiply(poly1, poly2) {
	var d1 = poly1.length - 1;
	var d2 = poly2.length - 1;
	var dr = d1 + d2;
	var result = [];
	for (var i = 0; i < dr + 1; i++) {
		result.push(0);
	}

	for (var i = d1; i >= 0; i--) {
		for (var j = d2; j >= 0; j--) {
			result[dr - (i + j)] += poly1[d1 - i] * poly2[d2 - j];
		}
	}
	return result;
}

/** Returns degree of polynomial **/
// TODO - If leading coefficients are 0 this gives the wrong result
function degree(p) {
	return p.length - 1;
}

/** 
 * Evaluates a univariate polynomial using Horner's method  
 * See: https://en.wikipedia.org/wiki/Horner%27s_method 
 **/
function evaluate(p) {
	return function (t) {
		var bn = p[0];
		for (var i = 1; i < p.length; i++) {
			bn = p[i] + bn * t;
		}

		return bn;
	};
};

/** 
 * Evaluates a polynomial at 0 
 * - this is much faster than at an arbitrary point 
 */
function evaluateAt0(p) {
	return p[p.length - 1];
};

/** 
 * Returns the number of sign changes in the polynomial coefficents 
 * when order in descending order; zeros are ignored 
 */
function signChanges(p) {

	var result = 0;

	var d = p.length - 1;
	var curSign = 0;
	for (var i = d; i >= 0; i--) {
		var newSign = Math.sign(p[d - i]);
		if (newSign === 0) continue;
		if (curSign !== 0 && curSign !== newSign) {
			result++;
		}
		curSign = newSign;
	}

	return result;
}

/** 
 * Returns the remainder when dividing poly1 by poly2 
 * ASSUMING poly1 is one degree higher than poly2.
 */
// See: https://en.wikipedia.org/wiki/Sturm%27s_theorem
function remainder(p1, p2) {
	//console.log(p1,p2)

	var d1 = p1.length - 1; // Degree of p1
	var d2 = p2.length - 1; // Degree of p2
	var d = d1 - d2;
	for (var i = 0; i < d - 1; i++) {
		p2.unshift(0);
	}
	d2 = d1 - 1;

	var pre1 = p1[1] / p1[0] - p2[1] / p2[0];
	var pre2 = p1;
	var pre3 = Poly.multiplyByConst(p1[0] / p2[0], p2);
	var pre4 = Poly.multiply(pre3, [1, pre1]);
	var pre5 = Poly.minus(pre4, pre2);

	return pre5.slice(2);
}

function deflate(poly, root) {
	// Implement as a shortcut (can root === 1 also be a shortcut?)
	if (root === 0) {}

	var d = poly.length - 1;
	var bs = [poly[0]];
	for (var i = 1; i < poly.length - 1; i++) {
		bs.push(poly[i] + root * bs[i - 1]);
	}

	//console.log(bs);
	return bs;
}

/** 
 * Generates a sturm chain for the given polynomial 
 */
function sturmChain(p) {
	var m = []; // Sturm chain
	m.push(p);
	m.push(Poly.differentiate(p));

	var i = 1;

	while (Poly.degree(m[i]) > 0) {
		m.push(Poly.remainder(m[i - 1], m[i]));
		i++;
	}

	return m;
}

/** 
 * Returns the number of roots in the interval (a,b) of a 
 * polynomial 
 */
function rootsWithin(p, a, b) {

	var sturmChain = Poly.sturmChain(p);
	var as = sturmChain.map(function (p) {
		return Poly.evaluate(p)(a);
	});
	var bs = sturmChain.map(function (p) {
		return Poly.evaluate(p)(b);
	});

	return Poly.signChanges(as) - Poly.signChanges(bs);
}

/** 
 * Newton's method - tuned for polynomials 
 * Currently just doing 10 iterations - only for testing at the
 * moment. 
 */
function newton(p, initialGuess) {
	var dp = Poly.differentiate(p);
	var val = initialGuess;
	for (var i = 1; i <= 10; i++) {
		val -= Poly.evaluate(p)(val) / Poly.evaluate(dp)(val);
	}

	return val;
}

/** 
 * See algoritm 6 - Vigklas
 * Note: Only polynomials that has at least 1 sign change can be 
 *       used in this algorithm. This is not a problem since if 
 *       there are no sign changes then there are no roots! 
 */
function positiveRootUpperBound(p) {
	var deg = p.length - 1;
	if (deg < 1) {
		return 0;
	}

	if (p[0] < 0) {
		p = Poly.negate(p);
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
			if (p[k] <= 0) continue;

			// TODO - Both these pows can easily be replaced with a lookup that will speed things up a lot
			// since (for low order polys) it will most of the time be a square, cube... root or multiplication by 1,2,4,8,...
			// TODO - not 100% sure the timesUsed[k] is used correctly here but seems to give reasonable results
			var temp = Math.pow(-p[m] / (p[k] / Math.pow(2, timesUsed[k])), 1 / (m - k));

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
 * p(x) -> x^deg(p) * p(1/x)
 */
function invert(p) {
	var len = p.length;
	var newP = [];

	for (var i = len - 1; i >= 0; i--) {
		newP.push(p[i]);
	}

	return newP;
}

/** 
 * See http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system 
 * This is basically just a change of variables (type of Mobius transform) of the type: 
 *   p(x) <- p(ax + b)
 * Currently limited to degree 6 or so (due to binomial coeff lookup), but easiliy extensible to any degree with 1 line of code :)
 * 
 * We let the coefficients of p(ax + b) =def= d_i in the code below. d_i is calculated as d = T*c, where c is the original coefficients 
 **/
function changeVariables(p, a, b) {
	var deg = p.length - 1;

	var d = new Array(deg + 1).fill(0);
	//let d = [];
	// TODO - better way to fill a matrix with zeros?
	var t = [];
	for (var i = 0; i < deg + 1; i++) {
		t.push(new Array(deg + 1).fill(0));
		//d.push(0);
		/*t.push([]);
  for (let j=0; j<deg+1; j++) {
  	t[i].push(0);
  }*/
	}

	// Calculate the triangular matrix T
	t[0][0] = 1;
	for (var j = 1; j <= deg; j++) {
		t[0][j] = b * t[0][j - 1];
		for (var _i = 1; _i <= j; _i++) {
			t[_i][j] = b * t[_i][j - 1] + a * t[_i - 1][j - 1];
		}
	}

	// Multiply
	for (var _i2 = 0; _i2 <= deg; _i2++) {
		d[deg - _i2] = 0;
		for (var _j = _i2; _j <= deg; _j++) {
			var acc = t[_i2][_j] * p[deg - _j];
			d[deg - _i2] += acc;
		}
	}

	return d;
}

function positiveRootLowerBound(p) {
	return 1 / Poly.positiveRootUpperBound(Poly.invert(p));
}

/**
 * @return { Number, Array } The number of zero roots together with the 
 * deflated polynomial
 *       
 */
function zeroRoots(p) {
	var p_ = p.slice();
	var i = 0;
	while (Poly.evaluateAt0(p_) === 0) {
		var len = p_.length;
		p_.splice(len - 1, 1);
		i++;
	}
	return {
		p: p_,
		numZeros: i
	};
}

/**
 * Find 2nd order or higher polynomial roots within the 
 * *specific interval** [0,1]. 
 */
function allRoots01(poly) {

	var deg = poly.length - 1;

	if (deg === 2) {
		return Poly.findQuadraticRoots01(poly);
	} else if (deg === 3) {
		return Poly.findCubicRoots01(poly).sort(function (a, b) {
			return a - b;
		});
	}

	var diff = Poly.differentiate(poly);
	var roots = allRoots01(diff);
	if (roots[0] !== 0) {
		roots.unshift(0);
	}
	if (roots[roots.length - 1] !== 1) {
		roots.push(1);
	}

	return rootsWithin(poly, roots);
}

function rootsWithin(poly, intervals) {

	//let TOL = 1e-13;

	var len = intervals.length;
	/*if (len < 2) {
 	return [];
 }*/

	var roots = [];

	var peval = Poly.evaluate(poly);

	for (var i = 0; i < len - 1; i++) {
		var a = intervals[i];
		var b = intervals[i + 1];

		//if (trace) {
		//console.log(a,b);
		//}

		var evA = peval(a);
		var evB = peval(b);

		if (evA === 0 || evB === 0) {
			if (evA === 0) {
				roots.push(a);
			}
			if (evB === 0) {
				roots.push(b);
			}

			return roots;
		}

		var sgn = evA / evB;
		if (sgn < 0) {
			var root = Poly.brent(peval, a, b /*,
                                     TOL*/
			);
			roots.push(root);
		}
	}

	return roots;
}

/**
 * Returns <em>ordered</em> quadratic roots.
 */
function findQuadraticRoots01(_ref) {
	var _ref2 = _slicedToArray(_ref, 3),
	    a = _ref2[0],
	    b = _ref2[1],
	    c = _ref2[2];

	var root1;
	var root2;
	var delta = b * b - 4 * a * c;
	if (delta < 0) {
		// No real roots;
		return [];
	}
	if (delta === 0) {
		root1 = -b / (2 * a);
		if (root1 >= 0 && root1 <= 1) {
			return [root1];
		} else {
			return [];
		}
	}
	delta = Math.sqrt(delta);
	if (b >= 0) {
		root1 = (-b - delta) / (2 * a);
		root2 = 2 * c / (-b - delta);
	} else {
		root1 = 2 * c / (-b + delta);
		root2 = (-b + delta) / (2 * a);
	}

	var root1InRange = root1 >= 0 && root1 <= 1;
	var root2InRange = root2 >= 0 && root2 <= 1;
	if (root1InRange) {
		if (root2InRange) {
			if (root1 < root2) {
				return [root1, root2];
			}
			return [root2, root1];
		}
		return [root1];
	}
	if (root2InRange) {
		return [root2];
	}
	return [];
}

/**
 * Searches the interval from the given lower limit to the given 
 * upper limit for a root (i.e., zero) of the given function with 
 * respect to its first argument using the Brent's Method 
 * root-finding algorithm.
 * 
 * See: https://en.wikipedia.org/wiki/Brent%27s_method
 *
 * @param {Function} f function for which the root is sought.
 * @param {Number} a the lower point of the interval to be searched.
 * @param {Number} b the upper point of the interval to be searched.
 * @param {Number} errorTol the desired accuracy (convergence tolerance).
 * @return An estimate for the root within accuracy.
 * 
 * Notes: Brent's Method is optimized for general functions. A more 
 * specialzed algorithm targeted at polynomials using for example a
 * combination of the Secant and Newton methods might be much faster. 
 */
var uuu = 0;
var TOLERANCE = 1e-15;
function brent(f, a, b, errorTol) {

	uuu++;

	if (a === b) {
		return a;
	} // Root already found

	var fa = f(a);
	var fb = f(b);

	if (fa * fb >= 0) {
		// Root is not bracketed - this is a precondition.
		throw 'Root not bracketed';
	}

	var c = void 0;
	if (Math.abs(fa) < Math.abs(fb)) {
		// Swap a,b
		c = a;a = b;b = c;
	}

	c = a;

	var mflag = true;
	var i = 0;

	var prevError = void 0;
	while (true) {
		i++;

		var fc = f(c);
		var s = void 0;

		fa = f(a);
		fb = f(b);

		if (fa !== fc && fb !== fc) {
			// Inverse quadratic interpolation
			var fac = fa - fc;
			var fab = fa - fb;
			var fbc = fb - fc;

			// The below has been multiplied out to speed up the algorithm.
			/*s = ((a * fb * fc) / ( fab * fac)) +
   	((b * fa * fc) / (-fab * fbc)) +
   	((c * fa * fb) / ( fac * fbc));*/
			s = ((a * fb * fbc - b * fa * fac) * fc + c * fa * fab * fb) / (fab * fac * fbc);
		} else {
			// Secant method
			s = b - fb * ((b - a) / (fb - fa));
		}

		var t1 = (3 * a + b) / 4;
		var b_c = Math.abs(b - c);
		var s_b = Math.abs(s - b);
		var c_d = Math.abs(c - d);
		//let tol1 = Math.abs(b-c); 
		//let tol2 = Math.abs(c-d);

		if (!( // s < t1 || s > b
		s > t1 && s < b || s < t1 && s > b) || // condition 1
		mflag && (s_b >= b_c / 2 || // condition 2
		/*tol1*/b_c < errorTol // condition 4
		) || !mflag && (s_b >= c_d / 2 || // condition 3
		/*tol2*/c_d < errorTol // condition 5
		)) {
			// Bisection method
			s = (a + b) / 2;
			mflag = true;
		} else {
			mflag = false;
		}

		var fs = f(s);

		var d = c;
		c = b;

		if (fa * fs < 0) {
			b = s;
		} else {
			a = s;
		}

		if (Math.abs(fa) < Math.abs(fb)) {
			// Swap a,b
			var t3 = a;a = b;b = t3;
		}

		if (fb === 0) {
			// or fs === 0
			return b; // or return s!; can be used to select side!  
		} else if (fs === 0) {
			return s;
		}

		var error = Math.abs(a - b);
		if (error / a + error / b < TOLERANCE || error === 0 || prevError <= error) {
			return b; // or return s!; can be used to select side!
		}
		prevError = error;

		/*
  if (error < errorTol) {
  	return b; // or return s!; can be used to select side!
  }*/
	}
}

module.exports = Poly;

// 1052 - 675 -

},{"../utils.js":42,"./functions/find-cubic-roots.js":38}],40:[function(require,module,exports){
'use strict';

// @info
//   Polyfill for SVG 2 getPathData() and setPathData() methods. Based on:
//   - SVGPathSeg polyfill by Philip Rogers (MIT License)
//     https://github.com/progers/pathseg
//   - SVGPathNormalizer by Tadahisa Motooka (MIT License)
//     https://github.com/motooka/SVGPathNormalizer/tree/master/src
//   - arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
//     https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.core.js#L1837
// @author
//   Jarosław Foksa
// @license
//   MIT License

function svgGetAndSetPathDataPolyFill() {

			if (!SVGPathElement.prototype.getPathData || !SVGPathElement.prototype.setPathData) {

						applyPolyFill();
			}
}

function applyPolyFill() {

			var commandsMap = {
						Z: "Z", M: "M", L: "L", C: "C", Q: "Q", A: "A", H: "H", V: "V", S: "S", T: "T",
						z: "Z", m: "m", l: "l", c: "c", q: "q", a: "a", h: "h", v: "v", s: "s", t: "t"
			};

			var Source = function Source(string) {
						this._string = string;
						this._currentIndex = 0;
						this._endIndex = this._string.length;
						this._prevCommand = null;
						this._skipOptionalSpaces();
			};

			var isIE = window.navigator.userAgent.indexOf("MSIE ") !== -1;

			Source.prototype = {
						parseSegment: function parseSegment() {
									var char = this._string[this._currentIndex];
									var command = commandsMap[char] ? commandsMap[char] : null;

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
												this._currentIndex++;
									}

									this._prevCommand = command;

									var values = null;
									var cmd = command.toUpperCase();

									if (cmd === "H" || cmd === "V") {
												values = [this._parseNumber()];
									} else if (cmd === "M" || cmd === "L" || cmd === "T") {
												values = [this._parseNumber(), this._parseNumber()];
									} else if (cmd === "S" || cmd === "Q") {
												values = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()];
									} else if (cmd === "C") {
												values = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()];
									} else if (cmd === "A") {
												values = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseArcFlag(), this._parseArcFlag(), this._parseNumber(), this._parseNumber()];
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
						},

						hasMoreData: function hasMoreData() {
									return this._currentIndex < this._endIndex;
						},

						peekSegmentType: function peekSegmentType() {
									var char = this._string[this._currentIndex];
									return commandsMap[char] ? commandsMap[char] : null;
						},

						initialCommandIsMoveTo: function initialCommandIsMoveTo() {
									// If the path is empty it is still valid, so return true.
									if (!this.hasMoreData()) {
												return true;
									}

									var command = this.peekSegmentType();
									// Path must start with moveTo.
									return command === "M" || command === "m";
						},

						_isCurrentSpace: function _isCurrentSpace() {
									var char = this._string[this._currentIndex];
									return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
						},

						_skipOptionalSpaces: function _skipOptionalSpaces() {
									while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
												this._currentIndex += 1;
									}

									return this._currentIndex < this._endIndex;
						},

						_skipOptionalSpacesOrDelimiter: function _skipOptionalSpacesOrDelimiter() {
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
						},

						// Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
						// Source/core/svg/SVGParserUtilities.cpp.
						// Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
						_parseNumber: function _parseNumber() {
									var exponent = 0;
									var integer = 0;
									var frac = 1;
									var decimal = 0;
									var sign = 1;
									var expsign = 1;
									var startIndex = this._currentIndex;

									this._skipOptionalSpaces();

									// Read the sign.
									if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "+") {
												this._currentIndex += 1;
									} else if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "-") {
												this._currentIndex += 1;
												sign = -1;
									}

									if (this._currentIndex === this._endIndex || (this._string[this._currentIndex] < "0" || this._string[this._currentIndex] > "9") && this._string[this._currentIndex] !== ".") {
												// The first character of a number must be one of [0-9+-.].
												return null;
									}

									// Read the integer part, build right-to-left.
									var startIntPartIndex = this._currentIndex;

									while (this._currentIndex < this._endIndex && this._string[this._currentIndex] >= "0" && this._string[this._currentIndex] <= "9") {
												this._currentIndex += 1; // Advance to first non-digit.
									}

									if (this._currentIndex !== startIntPartIndex) {
												var scanIntPartIndex = this._currentIndex - 1;
												var multiplier = 1;

												while (scanIntPartIndex >= startIntPartIndex) {
															integer += multiplier * (this._string[scanIntPartIndex] - "0");
															scanIntPartIndex -= 1;
															multiplier *= 10;
												}
									}

									// Read the decimals.
									if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ".") {
												this._currentIndex += 1;

												// There must be a least one digit following the .
												if (this._currentIndex >= this._endIndex || this._string[this._currentIndex] < "0" || this._string[this._currentIndex] > "9") {
															return null;
												}

												while (this._currentIndex < this._endIndex && this._string[this._currentIndex] >= "0" && this._string[this._currentIndex] <= "9") {
															decimal += (this._string[this._currentIndex] - "0") * (frac *= 0.1);
															this._currentIndex += 1;
												}
									}

									// Read the exponent part.
									if (this._currentIndex !== startIndex && this._currentIndex + 1 < this._endIndex && (this._string[this._currentIndex] === "e" || this._string[this._currentIndex] === "E") && this._string[this._currentIndex + 1] !== "x" && this._string[this._currentIndex + 1] !== "m") {
												this._currentIndex += 1;

												// Read the sign of the exponent.
												if (this._string[this._currentIndex] === "+") {
															this._currentIndex += 1;
												} else if (this._string[this._currentIndex] === "-") {
															this._currentIndex += 1;
															expsign = -1;
												}

												// There must be an exponent.
												if (this._currentIndex >= this._endIndex || this._string[this._currentIndex] < "0" || this._string[this._currentIndex] > "9") {
															return null;
												}

												while (this._currentIndex < this._endIndex && this._string[this._currentIndex] >= "0" && this._string[this._currentIndex] <= "9") {
															exponent *= 10;
															exponent += this._string[this._currentIndex] - "0";
															this._currentIndex += 1;
												}
									}

									var number = integer + decimal;
									number *= sign;

									if (exponent) {
												number *= Math.pow(10, expsign * exponent);
									}

									if (startIndex === this._currentIndex) {
												return null;
									}

									this._skipOptionalSpacesOrDelimiter();

									return number;
						},

						_parseArcFlag: function _parseArcFlag() {
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
			};

			var parsePathDataString = function parsePathDataString(string) {
						if (!string || string.length === 0) return [];

						var source = new Source(string);
						var pathData = [];

						if (source.initialCommandIsMoveTo()) {
									while (source.hasMoreData()) {
												var pathSeg = source.parseSegment();

												if (pathSeg === null) {
															break;
												} else {
															pathData.push(pathSeg);
												}
									}
						}

						return pathData;
			};

			var setAttribute = SVGPathElement.prototype.setAttribute;
			var removeAttribute = SVGPathElement.prototype.removeAttribute;
			var symbols;

			if (window.Symbol) {
						symbols = { cachedPathData: Symbol(), cachedNormalizedPathData: Symbol() };
			} else {
						symbols = { cachedPathData: "__cachedPathData", cachedNormalizedPathData: "__cachedNormalizedPathData" };
			}

			// @info
			//   Get an array of corresponding cubic bezier curve parameters for given arc curve paramters.
			var arcToCubicCurves = function arcToCubicCurves(x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, _recursive) {
						var degToRad = function degToRad(degrees) {
									return Math.PI * degrees / 180;
						};

						var rotate = function rotate(x, y, angleRad) {
									var X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
									var Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
									return { x: X, y: Y };
						};

						var angleRad = degToRad(angle);
						var params = [];
						var f1, f2, cx, cy;

						if (_recursive) {
									f1 = _recursive[0];
									f2 = _recursive[1];
									cx = _recursive[2];
									cy = _recursive[3];
						} else {
									var p1 = rotate(x1, y1, -angleRad);
									x1 = p1.x;
									y1 = p1.y;

									var p2 = rotate(x2, y2, -angleRad);
									x2 = p2.x;
									y2 = p2.y;

									var x = (x1 - x2) / 2;
									var y = (y1 - y2) / 2;
									var h = x * x / (r1 * r1) + y * y / (r2 * r2);

									if (h > 1) {
												h = Math.sqrt(h);
												r1 = h * r1;
												r2 = h * r2;
									}

									var sign;

									if (largeArcFlag === sweepFlag) {
												sign = -1;
									} else {
												sign = 1;
									}

									var r1Pow = r1 * r1;
									var r2Pow = r2 * r2;

									var left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
									var right = r1Pow * y * y + r2Pow * x * x;

									var k = sign * Math.sqrt(Math.abs(left / right));

									cx = k * r1 * y / r2 + (x1 + x2) / 2;
									cy = k * -r2 * x / r1 + (y1 + y2) / 2;

									f1 = Math.asin(((y1 - cy) / r2).toFixed(9));
									f2 = Math.asin(((y2 - cy) / r2).toFixed(9));

									if (x1 < cx) {
												f1 = Math.PI - f1;
									}
									if (x2 < cx) {
												f2 = Math.PI - f2;
									}

									if (f1 < 0) {
												f1 = Math.PI * 2 + f1;
									}
									if (f2 < 0) {
												f2 = Math.PI * 2 + f2;
									}

									if (sweepFlag && f1 > f2) {
												f1 = f1 - Math.PI * 2;
									}
									if (!sweepFlag && f2 > f1) {
												f2 = f2 - Math.PI * 2;
									}
						}

						var df = f2 - f1;

						if (Math.abs(df) > Math.PI * 120 / 180) {
									var f2old = f2;
									var x2old = x2;
									var y2old = y2;

									if (sweepFlag && f2 > f1) {
												f2 = f1 + Math.PI * 120 / 180 * 1;
									} else {
												f2 = f1 + Math.PI * 120 / 180 * -1;
									}

									x2 = cx + r1 * Math.cos(f2);
									y2 = cy + r2 * Math.sin(f2);
									params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
						}

						df = f2 - f1;

						var c1 = Math.cos(f1);
						var s1 = Math.sin(f1);
						var c2 = Math.cos(f2);
						var s2 = Math.sin(f2);
						var t = Math.tan(df / 4);
						var hx = 4 / 3 * r1 * t;
						var hy = 4 / 3 * r2 * t;

						var m1 = [x1, y1];
						var m2 = [x1 + hx * s1, y1 - hy * c1];
						var m3 = [x2 + hx * s2, y2 - hy * c2];
						var m4 = [x2, y2];

						m2[0] = 2 * m1[0] - m2[0];
						m2[1] = 2 * m1[1] - m2[1];

						if (_recursive) {
									return [m2, m3, m4].concat(params);
						} else {
									params = [m2, m3, m4].concat(params).join().split(",");

									var curves = [];
									var curveParams = [];

									params.forEach(function (param, i) {
												if (i % 2) {
															curveParams.push(rotate(params[i - 1], params[i], angleRad).y);
												} else {
															curveParams.push(rotate(params[i], params[i + 1], angleRad).x);
												}

												if (curveParams.length === 6) {
															curves.push(curveParams);
															curveParams = [];
												}
									});

									return curves;
						}
			};

			var clonePathData = function clonePathData(pathData) {
						return pathData.map(function (seg) {
									return { type: seg.type, values: Array.prototype.slice.call(seg.values) };
						});
			};

			// @info
			//   Takes any path data, returns path data that consists only from absolute commands.
			var absolutizePathData = function absolutizePathData(pathData) {
						var absolutizedPathData = [];

						var currentX = null;
						var currentY = null;

						var subpathX = null;
						var subpathY = null;

						pathData.forEach(function (seg) {
									var type = seg.type;

									if (type === "M") {
												var x = seg.values[0];
												var y = seg.values[1];

												absolutizedPathData.push({ type: "M", values: [x, y] });

												subpathX = x;
												subpathY = y;

												currentX = x;
												currentY = y;
									} else if (type === "m") {
												var x = currentX + seg.values[0];
												var y = currentY + seg.values[1];

												absolutizedPathData.push({ type: "M", values: [x, y] });

												subpathX = x;
												subpathY = y;

												currentX = x;
												currentY = y;
									} else if (type === "L") {
												var x = seg.values[0];
												var y = seg.values[1];

												absolutizedPathData.push({ type: "L", values: [x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "l") {
												var x = currentX + seg.values[0];
												var y = currentY + seg.values[1];

												absolutizedPathData.push({ type: "L", values: [x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "C") {
												var x1 = seg.values[0];
												var y1 = seg.values[1];
												var x2 = seg.values[2];
												var y2 = seg.values[3];
												var x = seg.values[4];
												var y = seg.values[5];

												absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "c") {
												var x1 = currentX + seg.values[0];
												var y1 = currentY + seg.values[1];
												var x2 = currentX + seg.values[2];
												var y2 = currentY + seg.values[3];
												var x = currentX + seg.values[4];
												var y = currentY + seg.values[5];

												absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "Q") {
												var x1 = seg.values[0];
												var y1 = seg.values[1];
												var x = seg.values[2];
												var y = seg.values[3];

												absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "q") {
												var x1 = currentX + seg.values[0];
												var y1 = currentY + seg.values[1];
												var x = currentX + seg.values[2];
												var y = currentY + seg.values[3];

												absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "A") {
												var x = seg.values[5];
												var y = seg.values[6];

												absolutizedPathData.push({
															type: "A",
															values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
												});

												currentX = x;
												currentY = y;
									} else if (type === "a") {
												var x = currentX + seg.values[5];
												var y = currentY + seg.values[6];

												absolutizedPathData.push({
															type: "A",
															values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
												});

												currentX = x;
												currentY = y;
									} else if (type === "H") {
												var x = seg.values[0];
												absolutizedPathData.push({ type: "H", values: [x] });
												currentX = x;
									} else if (type === "h") {
												var x = currentX + seg.values[0];
												absolutizedPathData.push({ type: "H", values: [x] });
												currentX = x;
									} else if (type === "V") {
												var y = seg.values[0];
												absolutizedPathData.push({ type: "V", values: [y] });
												currentY = y;
									} else if (type === "v") {
												var y = currentY + seg.values[0];
												absolutizedPathData.push({ type: "V", values: [y] });
												currentY = y;
									} else if (type === "S") {
												var x2 = seg.values[0];
												var y2 = seg.values[1];
												var x = seg.values[2];
												var y = seg.values[3];

												absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "s") {
												var x2 = currentX + seg.values[0];
												var y2 = currentY + seg.values[1];
												var x = currentX + seg.values[2];
												var y = currentY + seg.values[3];

												absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "T") {
												var x = seg.values[0];
												var y = seg.values[1];

												absolutizedPathData.push({ type: "T", values: [x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "t") {
												var x = currentX + seg.values[0];
												var y = currentY + seg.values[1];

												absolutizedPathData.push({ type: "T", values: [x, y] });

												currentX = x;
												currentY = y;
									} else if (type === "Z" || type === "z") {
												absolutizedPathData.push({ type: "Z", values: [] });

												currentX = subpathX;
												currentY = subpathY;
									}
						});

						return absolutizedPathData;
			};

			// @info
			//   Takes path data that consists only from absolute commands, returns path data that consists only from
			//   "M", "L", "C" and "Z" commands.
			var reducePathData = function reducePathData(pathData) {
						var reducedPathData = [];
						var lastType = null;

						var lastControlX = null;
						var lastControlY = null;

						var currentX = null;
						var currentY = null;

						var subpathX = null;
						var subpathY = null;

						pathData.forEach(function (seg) {
									if (seg.type === "M") {
												var x = seg.values[0];
												var y = seg.values[1];

												reducedPathData.push({ type: "M", values: [x, y] });

												subpathX = x;
												subpathY = y;

												currentX = x;
												currentY = y;
									} else if (seg.type === "C") {
												var x1 = seg.values[0];
												var y1 = seg.values[1];
												var x2 = seg.values[2];
												var y2 = seg.values[3];
												var x = seg.values[4];
												var y = seg.values[5];

												reducedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });

												lastControlX = x2;
												lastControlY = y2;

												currentX = x;
												currentY = y;
									} else if (seg.type === "L") {
												var x = seg.values[0];
												var y = seg.values[1];

												reducedPathData.push({ type: "L", values: [x, y] });

												currentX = x;
												currentY = y;
									} else if (seg.type === "H") {
												var x = seg.values[0];

												reducedPathData.push({ type: "L", values: [x, currentY] });

												currentX = x;
									} else if (seg.type === "V") {
												var y = seg.values[0];

												reducedPathData.push({ type: "L", values: [currentX, y] });

												currentY = y;
									} else if (seg.type === "S") {
												var x2 = seg.values[0];
												var y2 = seg.values[1];
												var x = seg.values[2];
												var y = seg.values[3];

												var cx1, cy1;

												if (lastType === "C" || lastType === "S") {
															cx1 = currentX + (currentX - lastControlX);
															cy1 = currentY + (currentY - lastControlY);
												} else {
															cx1 = currentX;
															cy1 = currentY;
												}

												reducedPathData.push({ type: "C", values: [cx1, cy1, x2, y2, x, y] });

												lastControlX = x2;
												lastControlY = y2;

												currentX = x;
												currentY = y;
									} else if (seg.type === "T") {
												var x = seg.values[0];
												var y = seg.values[1];

												var x1, y1;

												if (lastType === "Q" || lastType === "T") {
															x1 = currentX + (currentX - lastControlX);
															y1 = currentY + (currentY - lastControlY);
												} else {
															x1 = currentX;
															y1 = currentY;
												}

												var cx1 = currentX + 2 * (x1 - currentX) / 3;
												var cy1 = currentY + 2 * (y1 - currentY) / 3;
												var cx2 = x + 2 * (x1 - x) / 3;
												var cy2 = y + 2 * (y1 - y) / 3;

												reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });

												lastControlX = x1;
												lastControlY = y1;

												currentX = x;
												currentY = y;
									} else if (seg.type === "Q") {
												var x1 = seg.values[0];
												var y1 = seg.values[1];
												var x = seg.values[2];
												var y = seg.values[3];

												var cx1 = currentX + 2 * (x1 - currentX) / 3;
												var cy1 = currentY + 2 * (y1 - currentY) / 3;
												var cx2 = x + 2 * (x1 - x) / 3;
												var cy2 = y + 2 * (y1 - y) / 3;

												reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });

												lastControlX = x1;
												lastControlY = y1;

												currentX = x;
												currentY = y;
									} else if (seg.type === "A") {
												var r1 = seg.values[0];
												var r2 = seg.values[1];
												var angle = seg.values[2];
												var largeArcFlag = seg.values[3];
												var sweepFlag = seg.values[4];
												var x = seg.values[5];
												var y = seg.values[6];

												if (r1 === 0 || r2 === 0) {
															reducedPathData.push({ type: "C", values: [currentX, currentY, x, y, x, y] });

															currentX = x;
															currentY = y;
												} else {
															if (currentX !== x || currentY !== y) {
																		var curves = arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag);

																		curves.forEach(function (curve) {
																					reducedPathData.push({ type: "C", values: curve });

																					currentX = x;
																					currentY = y;
																		});
															}
												}
									} else if (seg.type === "Z") {
												reducedPathData.push(seg);

												currentX = subpathX;
												currentY = subpathY;
									}

									lastType = seg.type;
						});

						return reducedPathData;
			};

			SVGPathElement.prototype.setAttribute = function (name, value) {
						if (name === "d") {
									this[symbols.cachedPathData] = null;
									this[symbols.cachedNormalizedPathData] = null;
						}

						setAttribute.call(this, name, value);
			};

			SVGPathElement.prototype.removeAttribute = function (name, value) {
						if (name === "d") {
									this[symbols.cachedPathData] = null;
									this[symbols.cachedNormalizedPathData] = null;
						}

						removeAttribute.call(this, name);
			};

			SVGPathElement.prototype.getPathData = function (options) {
						if (options && options.normalize) {
									if (this[symbols.cachedNormalizedPathData]) {
												return clonePathData(this[symbols.cachedNormalizedPathData]);
									} else {
												var pathData;

												if (this[symbols.cachedPathData]) {
															pathData = clonePathData(this[symbols.cachedPathData]);
												} else {
															pathData = parsePathDataString(this.getAttribute("d") || "");
															this[symbols.cachedPathData] = clonePathData(pathData);
												}

												var normalizedPathData = reducePathData(absolutizePathData(pathData));
												this[symbols.cachedNormalizedPathData] = clonePathData(normalizedPathData);
												return normalizedPathData;
									}
						} else {
									if (this[symbols.cachedPathData]) {
												return clonePathData(this[symbols.cachedPathData]);
									} else {
												var pathData = parsePathDataString(this.getAttribute("d") || "");
												this[symbols.cachedPathData] = clonePathData(pathData);
												return pathData;
									}
						}
			};

			SVGPathElement.prototype.setPathData = function (pathData) {
						if (pathData.length === 0) {
									if (isIE) {
												// @bugfix https://github.com/mbostock/d3/issues/1737
												this.setAttribute("d", "");
									} else {
												this.removeAttribute("d");
									}
						} else {
									var d = "";

									for (var i = 0, l = pathData.length; i < l; i += 1) {
												var seg = pathData[i];

												if (i > 0) {
															d += " ";
												}

												d += seg.type;

												if (seg.values) {
															d += " " + seg.values.join(" ");
												}
									}

									this.setAttribute("d", d);
						}
			};
}

module.exports = svgGetAndSetPathDataPolyFill;

// 1014

},{}],41:[function(require,module,exports){
'use strict';

var Bezier = require('../geometry/classes/bezier.js');
var svgGetAndSetPathDataPolyFill = require('./path-data-polyfill/path-data-polyfill.js');
var LinkedLoop = require('../linked-loop/linked-loop.js');
var Geometry = require('../geometry/geometry.js');

var Svg = {};

/**
 * 
 */
Svg.getBeziersFromSvgElem = function (elem) {
	svgGetAndSetPathDataPolyFill(); // Ensure polyfill is applied.

	var paths = elem.getPathData();

	//console.log(paths);

	var bezierArray = [];

	var x0 = paths[0].values[0];
	var y0 = paths[0].values[1];

	var j = 0;
	for (var i = 0; i < paths.length; i++) {
		var path = paths[i];
		if (path.type !== 'C' && path.type !== 'c') {
			continue; // TODO - add other curve types
		}

		var bezierPoints = [[x0, y0], [path.values[0], path.values[1]], [path.values[2], path.values[3]], [path.values[4], path.values[5]]];
		var bezier = new Bezier(bezierPoints, j);

		bezierArray.push(bezier);

		x0 = path.values[4];
		y0 = path.values[5];
		j++;
	}

	var bezArray = void 0;
	if (Geometry.isShapePositivelyOrientated(bezierArray)) {
		// We want all shapes to be negatively orientated.
		bezArray = reverseBeziersOrientation(bezierArray);
	} else {
		bezArray = bezierArray;
	}

	return new LinkedLoop(bezArray);
};

function reverseBeziersOrientation(bezArr) {
	var bezies = [];

	var idx = 0;
	for (var i = bezArr.length - 1; i >= 0; i--) {
		bezies.push(reverseBez(bezArr[i], idx));
		idx++;
	}

	return bezies;
}

function reverseBez(bezier, idx) {
	var bezierPoints = [];
	for (var i = 3; i >= 0; i--) {
		bezierPoints.push(bezier.bezierPoints[i]);
	}
	var newBezier = new Bezier(bezierPoints, idx);

	//console.log(bezier);
	//console.log(newBezier);

	return newBezier;
}

module.exports = Svg;

},{"../geometry/classes/bezier.js":4,"../geometry/geometry.js":13,"../linked-loop/linked-loop.js":14,"./path-data-polyfill/path-data-polyfill.js":40}],42:[function(require,module,exports){
'use strict';

/**
 * Utililty class
 */

var Util = {};

/**
 * General function to get best item in array and return it. Best is
 * defined as the lowest value returned by the supplied binary function.
 */
Util.bestBy = function (xs, f_) {
	var result = void 0;
	var f = f_ || function (x) {
		return x;
	};

	var best = Number.POSITIVE_INFINITY;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = xs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var x = _step.value;

			var d = f(x);
			if (d < best) {
				result = x;
				best = d;
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

	return result;
};

Util.min = function (xs) {
	return Math.min.apply(null, xs);
};

Util.max = function (xs) {
	return Math.max.apply(null, xs);
};

module.exports = Util;

},{}],43:[function(require,module,exports){
"use strict";

/**
 * Vector utilities, mostly 2-vectors (represented as arrays).
 */

var Vector = {};

/** 
 * @return The dot (inner) product between 2 2-vectors 
 */

Vector.dot = function (a, b) {
	return a[0] * b[0] + a[1] * b[1];
};

/** 
 * @return The cross product magnitude between 2 2-vectors 
 */
Vector.cross = function (a, b) {
	return a[0] * b[1] - a[1] * b[0];
},

/** 
 * @return {Number} The squared distance between 2 points.
 */
Vector.squaredDistanceBetween = function (p1, p2) {
	var x = p2[0] - p1[0];
	var y = p2[1] - p1[1];

	return x * x + y * y;
};

Vector.scale = function (p, factor) {
	return [p[0] * factor, p[1] * factor];
};

Vector.reverse = function (p) {
	return [p[0] * -1, p[1] * -1];
};

Vector.toUnitVector = function (p) {
	var scaleFactor = 1 / Vector.length(p);

	return [p[0] * scaleFactor, p[1] * scaleFactor];
};

Vector.toLength = function (p, length) {
	var scaleFactor = length / Vector.length(p);

	return [p[0] * scaleFactor, p[1] * scaleFactor];
};

/** 
 * @return The vector from one point to another. 
 */
Vector.fromTo = function (p1, p2) {
	return [p2[0] - p1[0], p2[1] - p1[1]];
};

/** 
 * @param {[[Number, Number]]} ps 
 * 
 * @return The mean value of the provided array of points.
 */
Vector.mean = function (ps) {
	var p1 = ps[0];
	var p2 = ps[1];

	return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
};

/** 
 * @return The distance between 2 points 
 */
Vector.distanceBetween = function (p1, p2) {
	return Math.sqrt(Vector.squaredDistanceBetween(p1, p2));
};

/** 
 * Returns the distance from the origin. 
 */
Vector.length = function (p) {
	return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
};

Vector.lengthSquared = function (p) {
	return p[0] * p[0] + p[1] * p[1];
};

/**
 * @return The distance between the given point and line. 
 * 
 * See https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points 
 */
Vector.distanceBetweenPointAndLine = function (p, l) {
	var x0 = p[0];
	var y0 = p[1];
	var x1 = l[0][0];
	var y1 = l[0][1];
	var x2 = l[1][0];
	var y2 = l[1][1];

	var y2_y1 = y2 - y1;
	var x2_x1 = x2 - x1;

	var numerator = y2_y1 * x0 - x2_x1 * y0 + x2 * y1 - y2 * x1;
	var denominator = Math.sqrt(y2_y1 * y2_y1 + x2_x1 * x2_x1);

	return Math.abs(numerator / denominator);
};

/**
 * @return The distance between the given point and line. 
 */
Vector.squaredDistanceBetweenPointAndLineSegment = function (p, l) {
	var v = l[0];
	var w = l[1];

	var l2 = Vector.squaredDistanceBetween(v, w);
	if (l2 == 0) {
		return Vector.squaredDistanceBetween(p, v);
	}

	var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	t = Math.max(0, Math.min(1, t));

	var d2 = Vector.squaredDistanceBetween(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);

	//return Math.sqrt(d2);
	return d2;
};

Vector.circumCenter = function (triangle) {
	// See wikipedia
	var p1 = triangle[0];
	var p2 = triangle[1];
	var p3 = triangle[2];

	var Sx = 0.5 * det3([squaredNorm(p1), p1[1], 1], [squaredNorm(p2), p2[1], 1], [squaredNorm(p3), p3[1], 1]);

	var Sy = 0.5 * det3([p1[0], squaredNorm(p1), 1], [p2[0], squaredNorm(p2), 1], [p3[0], squaredNorm(p3), 1]);

	var a = det3([p1[0], p1[1], 1], [p2[0], p2[1], 1], [p3[0], p3[1], 1]);

	var b = det3([p1[0], p1[1], squaredNorm(p1)], [p2[0], p2[1], squaredNorm(p2)], [p3[0], p3[1], squaredNorm(p3)]);

	return [Sx / a, Sy / a];
};

// TODO - CUT unused
/** 
 * Returns the in-center of 3 given points (seen as a triangle) 
 */
//See https://en.wikipedia.org/wiki/Incenter
Vector.inCenter = function (triangle) {
	var p1 = triangle[0];
	var p2 = triangle[1];
	var p3 = triangle[2];

	var l1 = Vector.distanceBetween(p2, p3);
	var l2 = Vector.distanceBetween(p1, p3);
	var l3 = Vector.distanceBetween(p1, p2);
	var lengthSum = l1 + l2 + l3;
	return [(l1 * p1[0] + l2 * p2[0] + l3 * p3[0]) / lengthSum, (l1 * p1[1] + l2 * p2[1] + l3 * p3[1]) / lengthSum];
};

Vector.centroid = function (polygon) {
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

	// First calculate A def Area of polygon

	var A = 0;
	for (var i = 0; i < polygon.length; i++) {
		var p0 = polygon[i];
		var _p = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];

		A = A + (p0[0] * _p[1] - _p[0] * p0[1]);
	}
	A = A / 2;

	var C = [0, 0];
	for (var _i = 0; _i < polygon.length; _i++) {
		var _p2 = polygon[_i];
		var _p3 = _i === polygon.length - 1 ? polygon[0] : polygon[_i + 1];

		C[0] = C[0] + (_p2[0] + _p3[0]) * (_p2[0] * _p3[1] - _p3[0] * _p2[1]);
		C[1] = C[1] + (_p2[1] + _p3[1]) * (_p2[0] * _p3[1] - _p3[0] * _p2[1]);
	}

	return [C[0] / (6 * A), C[1] / (6 * A)];
};
//TODO - CUT END unused


/**
 * Calculate the determinant of 3 3-vectors, i.e. 3x3 matrix
 * 
 * @param x
 * @param y
 * @param z
 * @returns
 */
function det3(x, y, z) {
	return x[0] * (y[1] * z[2] - y[2] * z[1]) - x[1] * (y[0] * z[2] - y[2] * z[0]) + x[2] * (y[0] * z[1] - y[1] * z[0]);
}

function squaredNorm(x) {
	return x[0] * x[0] + x[1] * x[1];
}

Vector.translate = function (p, t) {
	return [p[0] + t[0], p[1] + t[1]];
};

Vector.equal = function (p1, p2) {
	return p1[0] === p2[0] && p1[1] === p2[1];
};

Vector.rotate = function (p, sinAngle, cosAngle) {
	return [p[0] * cosAngle - p[1] * sinAngle, p[0] * sinAngle + p[1] * cosAngle];
};

Vector.reverseRotate = function (p, sinAngle, cosAngle) {
	return [+p[0] * cosAngle + p[1] * sinAngle, -p[0] * sinAngle + p[1] * cosAngle];
};

Vector.rotateBy90Degrees = function (p) {
	return [-p[1], p[0]];
};

Vector.rotateByNeg90Degrees = function (p) {
	return [p[1], -p[0]];
};

Vector.transform = function (p, f) {
	return [f(p[0]), f(p[1])];
};

/**
 * @param point        The point
 * @param points       The points 
 * @param distanceFunc Distance function - if null, uses Vector.squaredDistanceBetween
 */
Vector.getClosestTo = function (point, points, distanceFunc) {
	var f = distanceFunc || Vector.squaredDistanceBetween;
	//var cp = null;
	var cp = undefined;
	var bestd = Number.POSITIVE_INFINITY;
	for (var i = 0; i < points.length; i++) {
		var p = points[i];

		var d = f(point, p);
		if (d < bestd) {
			cp = p;
			bestd = d;
		}
	}

	return cp;
};

/*
Vector.transformPoints = function(ps, f) {
	var newpoints = [];
	for (var i=0; i<points.length; i++) {
		newpoints.push(f(points[i]));
	}
	return newpoints;
}
*/

Vector.translatePoints = function (ps, v) {
	// SLOW!
	/*return ps.map(function(p) {
 	//return Vector.translate(p, v);
 	return [p[0]+v[0], p[1]+v[1]]; 
 });*/

	// FAST! (at least on V8, BUT WHAAY?!?!)
	var result = [];
	for (var i = 0; i < ps.length; i++) {
		result.push([ps[i][0] + v[0], ps[i][1] + v[1]]);
	}

	return result;
};

Vector.rotatePoints = function (ps, sinAngle, cosAngle) {
	return ps.map(function (p) {
		return Vector.rotate(p, sinAngle, cosAngle);
	});
};

/** Applies translation + rotation to bezier
 * @returns transformed points 
 **/
Vector.translateThenRotatePoints = function (ps, trans, sinAngle, cosAngle) {
	return ps.map(function (p) {
		return Vector.rotate(Vector.translate(p, trans), sinAngle, cosAngle);
	});
};

/** Applies translation + rotation to bezier
 * @returns transformed points 
 **/
Vector.rotateThenTranslatePoints = function (ps, trans, sinAngle, cosAngle) {
	return ps.map(function (p) {
		return Vector.translate(Vector.rotate(p, sinAngle, cosAngle), trans);
	});
};

module.exports = Vector;

},{}]},{},[18]);
