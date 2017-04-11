'use strict'

let Circle          = require('./geometry/classes/circle.js');
let getNodesAsArray = require('./mat/functions/get-nodes-as-array.js')
let ListNode        = require('./linked-loop/list-node.js');
let LinkedLoop      = require('./linked-loop/linked-loop.js');
let Vector          = require('./vector/vector.js');
let PointOnShape    = require('./geometry/classes/point-on-shape.js');


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
function MatDebug(
		draw, 
		drawStuff, 
		run, 
		setViewBox, 
		Vector, 
		beziersToDraw, 
		shouldDrawSATTree) {

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
			stage3: 0,
	};
	this.notSkipped = {
			stage0: 0,
			stage1: 0,
			stage2: 0,
			stage3: 0,
	};
	
	this.generated = {
		nodeHash: {},
		cpHash: {},
		cpArr: [],
	};
	
	this.mat; 
	this.sat; 
	
	this.state = {
		selectedCp: undefined,
	}
	
	//---- Namespaced functions
	this.fs = { 
		threeProng: {
			drawSpokes: function(n) {
				return drawSpokes(this, n);
			}
		},
		cp: {
			log: cp.log(this),
			draw: cp.draw(this),
			selectNext: cp.next(this),
			selectPrevOnCircle: cp.prevOnCircle(this),
			
		}
	};
	
	this.deltasToNiceStr = deltasToNiceStr;
	this.pointsToNiceStr = pointsToNiceStr;
}


function deltaToNiceString(delta) {
	return delta.map(function(cpNode) {
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


let cp = {
	log: function(_debug_) {
		return function() {
			let cpNode = _debug_.state.selectedCp;
			let cp = cpNode.item;
			console.log(cpNode);
			console.log(PointOnShape.toString(cp.pointOnShape));
		}
	},
	next: function(_debug_) {
		return function() {
			_debug_.state.selectedCp = _debug_.state.selectedCp.next;
		}
	},
	prevOnCircle: function(_debug_) {
		return function() {
			_debug_.state.selectedCp = _debug_.state.selectedCp.prevOnCircle;
		}
	},
	draw: function(_debug_) {
		return function() {
			_debug_.draw.crossHair(_debug_.state.selectedCp.item, 'blue thin5 nofill', 1);
		}
	}
}


function getHashCount(hash) {
	let c = 0;
	
	for (key in hash) { c++; }
	
	return c;
}


MatDebug.prototype.drawSATTree = function(tree) {
		
	let bucketSizes = [];
	
	function getNodeStructure(key, t) {
		
		let type = key === '5' ? 'M' : key;
		
		if (type === 'M') {
			type = 'M-' + t.size;
			
			bucketSizes.push(t.size);
		} 
		
		let node = {
			text: { name: type },
			children: [],
		};
		
		for (let key in t) {
			let n = t[key];
			
			node.children.push(getNodeStructure(key, n));
		}
		
		return node;
	}
	
	var cfg = {
			chart: { container: "#mat-tree"	},
			nodeStructure: getNodeStructure('root', tree),
	};
	
	
	// Treant tree drawer removed so we can use d3 in the future.
	//new Treant( cfg ); // Draw the tree
	
	bucketSizes.sort(function(a,b) { return a-b; } );
}


MatDebug.prototype.getDistanceBetween = function(...args) {
	return Vector.distanceBetween(args);
}

MatDebug.prototype.drawDot = function(p, r, color) { 
	return this.draw.dot(p, r, color);
}



MatDebug.prototype.testNProng_1 = function() {
	this.setViewBox([65, 287, 85, 72]);
	//d.highlightBeziers('36,37,430,431')	
}


MatDebug.prototype.test2Prong_2 = function() {
	this.traceNProng(13);
	this.drawDot([118.83, 333.59], 0.3, 'green');
	this.drawDot([122.26, 332.36], 0.3, 'green');
	this.drawDot([103.9345546632512, 292.8475727546303], 0.3, 'green');
	this.drawDot([102.28082651515273, 293.73728721662496], 0.3, 'green');
	
	this.drawDot([102.28082651515273, 293.73728721662496], 0.1, 'yellow');
	this.drawDot([118.83, 333.59], 0.1, 'yellow');
}


MatDebug.prototype.test2Prong_1 = function() {
	this.setViewBox([126, 201, 179, 146]);
	d.trace2ProngConvergence(46);
			
	let p1 = [198.71, 308.17];
	let p2 = [186.1136043817149, 278.1427194133067];
	let p3 = [156.89,263.78];
	
	$timeout();
}


/**
 * @param n The bezier indx.
 * Only logs the bezier at this stage, if working at all.
 */
MatDebug.prototype.drawBezierArcs = function(n) {
	let shape = this.shape;
	
	let bezArr = beziers.nodeArr;
	let bezier = bezArr[n];
	
	console.log(bezier);
}


MatDebug.prototype.logBezierInterfaceAngles = function() {
	// TODO Incomplete
	var tan1 = bezier.tangent(1);
	var tan2 = node.next.item.tangent(0);
	var crossTangents = Vector.cross(tan1, tan2);
	
	var str = "tangents (degrees): " + (Util.radToDeg(Math.asin(crossTangents))).toFixed(8);
}


MatDebug.prototype.remove = function(n) {
	this.elems[n].remove();
}


MatDebug.prototype.log2ProngDelta = function(n) {
	let delta = this.twoProngs[n].delta;
	
	console.log(delta);
}


MatDebug.prototype.log2Prong = function(n) {
	let twoProng = this.twoProngs[n];
	
	console.log(twoProng);
}


MatDebug.prototype.draw2ProngNormal = function(n) {
	// If not specified which, draw all
	if (n === undefined) {
		for (let i=0; i<this.twoProngs.length; i++) {
			this.draw2ProngNormal(i);
		}
	}
	
	let twoProng = this.twoProngs[n];
	
	if (!twoProng) { return; }
	
	this.draw.line([twoProng.y, twoProng.x], 'thin10 blue');
}


MatDebug.prototype.log2ProngDeltaBasic = function(n) {
	let delta = this.twoProngs[n].delta;

	let f = function(x) {
		return {
			bez: x.item.pointOnShape.bezierNode.item.indx,
			t: x.item.pointOnShape.t,
			order: x.item.pointOnShape.order,
		}
	}
	
	console.log(f(delta[0]));
	console.log(f(delta[1]));
}


MatDebug.prototype.traceNProng = function(n) {
	//console.log(this.nProngs[n])
	//console.log(this.threeProngs[n])
	//let nProng = this.nProngs[n];
	let threeProng = this.nProngs[n];
	//let threeProng = nProng;
	let dbgInfo = threeProng.dbgInfo;
	let cs = dbgInfo.cs; 
	
	console.log(threeProng);
	for (let c of cs) {
		this.draw.dot(c.x, 0.2, 'cyan');
		c.radius = c.ccr;
		c.center = c.x;
		this.draw.circle(c, 'cyan thin20 nofill');
		//bps.map(function(p) { draw.dot(p, 0.03, 'blue'); });	
	}
}


MatDebug.prototype.logNProngDelta = function(n) {
	let nProng = this.nProngs[n];
	
	console.log(nProng.deltas);		
}


MatDebug.prototype.logNProngDeltaBasic = function(n) {
	let nProng = this.nProngs[n];

	let f = function(x) {
		return {
			bez: x.item.pointOnShape.bezierNode.item.indx,
			t: x.item.pointOnShape.t,
			order: x.item.pointOnShape.order,
		}
	}
	
	
	for (let i=0; i<nProng.deltas.length; i++) {
		let delta = nProng.deltas[i];
		
		console.log(f(delta[0]), f(delta[1]));
		//console.log();	
	}
	
			
}

MatDebug.prototype.testNProng_2 = function() {
	this.setViewBox([68, 290, 85, 56]);
	
	d.draw2ProngNormal(41);
	d.draw2ProngNormal(42);
	d.logNProngDeltaBasic(0);
	
	$timeout();
}


MatDebug.prototype.testNProng_3 = function() {
	this.run();
	this.setViewBox([10, 286, 84, 90]);
	//d.draw2Prong(34, 'thin10')
	//d.highlightBeziers('36,37,430,431')
	//d.draw2ProngNormal(34);
	//d.draw2ProngNormal(42);
	d.logNProngDeltaBasic(1);
	
	$timeout();
}


function drawSpokes(debug, n) {
	let nProng = debug.nProngs[n];
	let threeProng = nProng.threeProng;
	
	console.log(threeProng)
	let cc = threeProng.circle.center;
	let ps = threeProng.ps;
	debug.draw.line([ps[0], cc], 'thin5 red');
	debug.draw.line([ps[1], cc], 'thin5 red');
	debug.draw.line([ps[2], cc], 'thin5 red');
};


MatDebug.prototype.highlightBeziers = function(rangeStr) {
	const COLORS = ['red', 'green', 'blue'];
	
	let indxs = Util.rangeStrToIndxArray(rangeStr);
	
	let i = 0;
	for (let indx of indxs) {
		i++;
		
		let bezier = LinkedLoop.getByIndx(shape.beziers, indx);
		
		let color = COLORS[i % COLORS.length]
		draw.bezier(bezier, 'nofill thin20 ' + color);

	}
}


MatDebug.prototype.drawSomeStuff = function(shape) {
	//this.draw.bezierArcs(shape);
	
	this.draw.looseBoundingBoxes(shape, 'thin2 brown nofill');
	this.draw.tightBoundingBoxes(shape, 'thin2 black nofill');
	
	let beziersToDraw = this.beziersToDraw;

	let nodeStart = LinkedLoop.getByIndx(
			shape.beziers, beziersToDraw[0]);
	let nodeEnd   = LinkedLoop.getByIndx(
			shape.beziers, beziersToDraw[1] + 1);
		
	this.draw.beziers(shape, nodeStart, nodeEnd);
}



MatDebug.prototype.trace2ProngConvergence = function(n_, failedOnly) {

	let n;
	if (failedOnly) {
		let j = 0;
		for (let i=0; i<this.twoProngs.length; i++) {
			let twoProngInfo = this.twoProngs[i];
			if (twoProngInfo.failed) {
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
	
	if (!n) { return; }
	
	let twoProngInfo = this.twoProngs[n];
	let twoProng = twoProngInfo.twoProng;
	
	for (let x of twoProngInfo.xs) {
		this.draw.crossHair(x.x, 'blue thin10 nofill');
		let circle = new Circle(x.x, Vector.distanceBetween(x.x, x.y));
		this.draw.circle(circle, 'blue thin10 nofill');
		this.draw.crossHair(x.z, 'yellow thin10 nofill', 2);
	}
	
	console.log(
			twoProngInfo.xs.map(function(x) { 
				return { 
					x: x.x,
					y: x.y,
					z: x.z, 
					d: Vector.squaredDistanceBetween(x.y,x.z),
					t: x.t,
				} 
			})
	);
	
	this.draw2ProngNormal(n);
	
	return 'Failed: ' + twoProngInfo.failed;
}



MatDebug.prototype.logNearestNProng = function(p, twoProngsOnly) {
	let matNodes = getNodesAsArray(this.mat);
	
	let ps = matNodes.filter(function(node) {
		if (twoProngsOnly) { 
			return node.matCircle.cpNodes.length === 2; 
		} else {
			return node.matCircle.cpNodes.length !== 2;
		}
	})
	.map(function(node) {
		return node.matCircle.circle.center;
	});
	let q = getClosestPointToPoints(ps, p);
	
	let key = PointOnShape.makeSimpleKey(q);
	let nodeHashDebugObj = this.generated.nodeHash[key]; 
	let matNode = nodeHashDebugObj.matNode;
	let matCircle = matNode.matCircle;
	
	let cpHashDebugObjs = matCircle.cpNodes.map(
		cpNode => this.generated.cpHash[cpNode.item.simpleKey]
	);

	
	console.log(nodeHashDebugObj);
	console.log(cpHashDebugObjs);
	console.log(
			cpHashDebugObjs
			.map(function(x) {
				if (!x) { return; }
				return x.visitedPointsArr.map(function(x) {
					return x.map(function(x) {
						return {
							cpNode: x,
							cp: x.item,
							pos: x.item.pointOnShape,
							0: x.item.pointOnShape[0],
							1: x.item.pointOnShape[1],
						}
					});
				});
			})
	);
	
	console.log(
			cpHashDebugObjs
			.map(function(x) {
				if (!x) { return; }
				return x.visitedPointsArr.map(function(x) {
					return x.map(function(x) {
						return MatLib.PointOnShape.toString(x.item.pointOnShape);
					});
				});
			})
	);
	
	
	
	let circle = new Circle(
			matCircle.circle.center,
			matCircle.circle.radius || 1
	);

	//this.draw.circle(circle, 'green thin10 nofill');
	
	
	if (twoProngsOnly) {
		let n;
		for (let i=0; i<this.twoProngs.length; i++) {
			let twoProngInfo = this.twoProngs[i];
			let twoProng = twoProngInfo.twoProng;
			let cc = twoProng.item.matCircle.circle.center;
			//console.log(twoProngInfo);
			if (q[0] === cc[0] && q[1] === cc[1]) {
				n = i;
				break;
			}
		}
		
		if (n) { this.trace2ProngConvergence(n); }
	}
}


/**
 * Simple O(n^2) implementation.
 */
function getClosestPointToPoints(ps, p) {
	let minD = Number.POSITIVE_INFINITY;
	let closestPoint;
	
	for (let q of ps) {
		let d = Vector.distanceBetween(q, p);
		
		if (d < minD) {
			minD = d;
			
			closestPoint = q;
		}
	}
	
	return closestPoint;
}



module.exports = MatDebug;













