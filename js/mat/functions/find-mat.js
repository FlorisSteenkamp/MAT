'use strict'


let add2Prong    = require('./add-2-prong.js');
let find2Prong   = require('./find-2-prong.js');
let buildMat     = require('./build-mat.js');
let Mat          = require('../classes/mat.js');

/**
 * Find the MAT from the given Shape.
 */
function findMat(shape, _debug_) {

	// TODO - run KILL_HOMOLOGY - this step will allow for shapes 
	// with homology (i.e. with holes in them) to work as well.
	
	let t0;
	//if (_debug_) {
		t0 = performance.now(); 
	//}
	
	add2Prongs(shape, _debug_);
	//return;
	
	//if (_debug_) { 
		let t1 = performance.now();
		
		if (_debug_) {
			_debug_.add2ProngsDuration = (t1 - t0);
		}
		console.log('    2-prongs took '  + 
				(t1 - t0).toFixed(0) + ' milliseconds.');
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
		
	let ta0;
	ta0 = performance.now(); 
	
	let contactPoints = shape.contactPoints;
	let cpNode = contactPoints.head;
	do {
		if (cpNode.item.matCircle.cpNodes.length === 2) {
			break;
		}
		
		cpNode = cpNode.next;
	} while (cpNode !== contactPoints.head);			


	let cptest = cpNode.prevOnCircle;
	
	let branchBack  = buildMat(
			shape, cptest.prevOnCircle,	undefined, undefined,
			false, _debug_
	);
	let branchForth = buildMat(
			shape, cptest, undefined, undefined,
			false, _debug_
	);
	
	branchForth.branches.push(branchForth.branches[0]);
	branchForth.branches[0] = branchBack.branches[0]; 
	branchBack.branches[0].branches[0] = branchForth;
	
	let mat = new Mat(branchForth);
	
	let ta1 = performance.now();
	if (_debug_) {
		_debug_.add2ProngsDuration = (ta1 - ta0);
	}
	console.log('    3-prongs took '  + 
			(ta1 - ta0).toFixed(0) + ' milliseconds.');
	
	
	//return mat;
	
	let matFixed = fixMat(mat)
	
	return matFixed;
}


/** 
 * Add 2 prongs.
 * 
 * See comments on the add2Prong function.
 */ 
let failCount = 0; 
function add2Prongs(shape, _debug_) {
	
	let for2Prongs = shape.for2Prongs;
	
	let len = for2Prongs.length;
	
	//let index = indexInterlaced(len); // Keep for debuggin.
	let index = indexLinear(len);

	//console.log(len);
	for (let i=0; i<len; i++) {
		let cpNode = for2Prongs[index[i]];
		let twoProngInfo = find2Prong(shape, cpNode, _debug_);
		
		if (twoProngInfo) {
			let { circle, z } = twoProngInfo;
			let newCpNode = add2Prong(shape, circle, cpNode, z, _debug_);
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