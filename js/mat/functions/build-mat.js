'use strict'

let find3Prong   = require('./find-3-prong.js');
let add3Prong    = require('./add-3-prong.js');
let MatNode      = require('../../mat/classes/mat-node.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let PointOnShape = require('../../geometry/classes/point-on-shape.js');


/**
 * Recursively builds the MAT tree.
 * 
 * @param {ListNode<ContactPoint>} cpNodeStart
 * @returns {MatNode}
 */
function buildMat(
		shape, cpNodeStart,	fromNode, fromCpNode,
		isRetry, _debug_) {
	
	
	// return;
	
	let visitedPoints;
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
	
	
	if ((cpNodeStart.item.matCircle.cpNodes.length === 1) &&
		(fromCpNode.nextOnCircle === cpNodeStart.next)) {
		
		 //console.log('terminal 1-prong');
		
		let matNode = createMatNode(
				cpNodeStart, fromNode ? [fromNode] : [], _debug_
		);
		return matNode;
	} 
	
	if (visitedPoints.length === 1) {
		// Terminating 2-prong - should mostly have been eliminated
		// by osculating circles and points, but can still occur
		// due to floating point incaccuracies.
		
		// console.log('terminal 2-prong');
		
		let matNode = createMatNode(
				cpNodeStart, fromNode ? [fromNode] : [], _debug_
		);
		
		return matNode;
	} else if (visitedPoints.length === 2) {
		
		let branches = fromNode ? [fromNode] : [];
		let matNode = createMatNode(
				cpNodeStart, branches, _debug_
		);
		
		let cpBranches = cpNodeStart;
		let i = 0; 
		while ((cpBranches.nextOnCircle !== cpNodeStart) &&
				cpBranches.next !== cpBranches.nextOnCircle) {
			
			i++;
			
			let cpNext;
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
			
			
			let bm = buildMat(
					shape, 
					cpNext, matNode, cpBranches, 
					false, _debug_
			);
			
			branches.push( bm );
			
			cpBranches = cpBranches.nextOnCircle;
		}
		
		return matNode;
	}
}


function createMatNode(cp, branches, _debug_) {
	let matNode = new MatNode(
			cp.item.matCircle,
			branches
	);
	
	if (_debug_) { prepDebugHashes(cp, matNode, _debug_); }
	
	return matNode;
}


function traverseShape(cpNodeStart) {
	let visitedPoints; 
	let cpNode = cpNodeStart;

	visitedPoints = [];
	do {
		visitedPoints.push(cpNode);
		
		let next = cpNode.next;
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
	
	let deltas = [];
	for (let i=0; i<visitedPoints.length; i++) {
		let visitedPoint = visitedPoints[i];
		deltas.push([visitedPoint, visitedPoint.next]);
	}
	
	// Check if any deltas are continuous (they should rather be
	// disjoint). It should be quite safe to consider points 'equal'
	// if they are within a certain threshold of each other, but is it
	// necessary? Maybe not.
	let continuous = false;
	for (let i=0; i<deltas.length; i++) {
		let idxi = i+1;
		if (idxi === deltas.length) { idxi = 0; }
		
		let endP   = deltas[i][1].item;
		let startP = deltas[idxi][0].item;
		if (ContactPoint.equal(endP, startP)) {
			// console.log(_debug_.deltasToNiceStr(deltas));
			continuous = true;
			break;
		}
	}
	
	if (continuous) {
		// aaa
	}
	
	let threeProng = find3Prong(shape, deltas, _debug_);
	
	for (let i=0; i<3; i++) {
		PointOnShape.setPointOrder(
				shape, threeProng.circle, threeProng.ps[i], _debug_
		);	
	}
	
	add3Prong(shape, threeProng, _debug_);
}


function prepDebugHashes(cpNodeStart, matNode, _debug_) {
	// ---- Prepare debug info for the MatCircle
	let circle = cpNodeStart.item.matCircle.circle;
	let key = PointOnShape.makeSimpleKey(circle.center);
	let nodeHash = _debug_.generated.nodeHash;
	nodeHash[key] = nodeHash[key] || {};
	nodeHash[key].matNode = matNode;
	
	// ---- Prepare debug info for the ContactPoint
	let cpKey = cpNodeStart.item.pointOnShape.simpleKey;
	let cpHash = _debug_.generated.cpHash;
	let cpArr = _debug_.generated.cpArr;
	if (!cpHash[cpKey]) {
		cpHash[cpKey] = {
			cp: cpNodeStart,
			arrIndx: cpArr.length	
		};
		cpArr.push(cpNodeStart);
	}
	
	let cpHashDebugObj = cpHash[cpKey];
	cpHashDebugObj.visitedPointsArr = 
		cpHashDebugObj.visitedPointsArr || [];
}


module.exports = buildMat;