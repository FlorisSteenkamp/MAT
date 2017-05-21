'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Mat          = require('../classes/mat.js');
let ContactPoint = require('../classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let Circle       = require('../../geometry/classes/circle.js');
let PointOnShape = require('../../geometry/classes/Point-on-shape.js');

let add2Prong    = require('./add-2-prong.js');
let find2Prong   = require('./find-2-prong.js');
let buildMat     = require('./build-mat.js');


/**
 * Find the MAT from the given Shape.
 */
function findMat(shape) {

	findAndAddHoleClosing2Prongs(shape);
	findAndAdd2ProngsOnAllPaths(shape);
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.after2Prongs = 
			performance.now(); 
	}
	
	
	//---- Connect the n-prong centers and add the 3-prongs.
 
	let contactPoints = shape.contactPointsPerLoop[0];
	
	let cpNode = contactPoints.head;
	do {
		if ((cpNode.item.matCircle.cpNodes.length === 2) &&
			!(cpNode.next.prevOnCircle === cpNode)) {
			
			break;
		}
		
		cpNode = cpNode.next;
	} while (cpNode !== contactPoints.head);			


	let cptest = cpNode.prevOnCircle;

	let branchForth = buildMat(
			shape, cptest, undefined, undefined, false
	);
	let branchBack  = buildMat(
			shape, cptest.prevOnCircle,	undefined, undefined, false
	);
	
	branchForth.branches.push(branchBack.branches[0]);
	branchBack.branches[0].branches[0] = branchForth;
	
	let mat = new Mat(branchForth);
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.after3Prongs = 
			performance.now(); 
	}
	
	return fixMat(mat)
}


/**
 * @description Finds and adds two-prongs that removes any holes in the
 * shape.
 * @param shape
 * @returns
 */
function findAndAddHoleClosing2Prongs(shape) {
	let extremes = shape.extremes;
	
	for (let k=1; k<extremes.length; k++) {
		
		let extreme = extremes[k];
		//console.log(extreme.p)
		let r = MAT_CONSTANTS.maxOsculatingCircleRadius;
		let p = [extreme.p[0], extreme.p[1] - r];
		let osculatingCircle = new Circle(p, r);
		let posA2 = new PointOnShape(
				extreme.bezierNode, 
				extreme.t, 
				MAT_CONSTANTS.pointType.extreme, 
				0, //order 
				0
		);
		
		// A normal traversal should give (cyclically) A1->A2->B1->B2
		let twoProngInfo = find2Prong(shape, posA2, true);
		let { circle, z } = twoProngInfo;
		let posA1 = z;
		
		let key = PointOnShape.makeSimpleKey(posA2);
		if (shape.straightUpHash[key]) {
			// Skip these when doing normal 2-prong procedure
			shape.skip2ProngHash[key] = posA2;	
		}

		
		add2Prong(shape, circle, posA2, posA1, true);
	}	
}


/** 
 * Add 2 prongs.
 * 
 * See comments on the add2Prong function.
 */ 
function findAndAdd2ProngsOnAllPaths(shape) {
	let for2ProngsArray = shape.for2ProngsArray;
	
	for (let k=0; k<for2ProngsArray.length; k++) {
		let for2Prongs = for2ProngsArray[k];
		
		findAndAdd2Prongs(shape, k, for2Prongs);
	}
}


function findAndAdd2Prongs(shape, k, for2Prongs) {
	let len = for2Prongs.length;
	//let index = indexInterlaced(len); // Keep for debuggin.
	let index = indexLinear(len);

	for (let i=0; i<len; i++) {
		
		let posNode = for2Prongs[index[i]];
		let pos = posNode.item;
		
		let key = PointOnShape.makeSimpleKey(pos);
		if (shape.skip2ProngHash[key]) {
			continue;
		}
		
		let twoProngInfo = find2Prong(shape, pos, false);
		
		if (twoProngInfo) {
			let { circle, z } = twoProngInfo;
			add2Prong(shape, circle, pos, z, false);
		} else {
			// failed
		}
	}
	

	/* 
	 * Don't delete - keep for future debugging.
	 * Check if point orders follow each other - they absolutely must.
	 */
	/* 
	if (MatLib._debug_) {
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
 * This is unfortunately currently required since I can't get the
 * buildMat recursive algorithm right on the first pass.
 * @param mat
 * @returns
 */
let lll = 0;
function fixMat(mat) {
		
	helper(mat.startNode, undefined);
		
	function helper(matNode, priorNode) {
		
		if (matNode.branches.length === 3 && 
			(matNode.branches[2].matCircle === matNode.matCircle)) {

			let firstRight = matNode.branches[2];
			let secondRight = firstRight.branches[1];
			matNode.branches[2] = secondRight;
			secondRight.branches[0] = matNode;
		}
		
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			helper(node, matNode);
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
	
	let source = {};
	let arr = [];
	// l <=> the lowest power of 2 so that 2^l > n
	let l = Math.pow(2, Math.floor(Math.log2(n)));
	
	while (l >= 1) {
		let k = 0;
		while (k < n) {
			if (!source[k]) {
				arr.push(k);
				source[k] = true;
			}
			k = k + l; 
		}
		l = l/2;
	}
	
	return arr;
}


/**
 * Simple linear array indexing.
 * @param n
 * @returns
 */
function indexLinear(n) {
	let arr = [];
	for (let i=0; i<n; i++) {
		arr.push(i);
	}
	return arr;
}

module.exports = findMat;