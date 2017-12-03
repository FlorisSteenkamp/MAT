
import MAT_CONSTANTS from '../../mat-constants';

import MatTree      from '../classes/mat-tree';
import MatNode      from '../classes/mat-node';
import ContactPoint from '../classes/contact-point';
import LinkedLoop   from '../../linked-list/linked-loop';
import Circle       from '../../geometry/classes/circle';
import PointOnShape from '../../geometry/classes/Point-on-shape';
import Shape        from '../../geometry/classes/shape';

import add2Prong    from './add-2-prong';
import find2Prong   from './find-2-prong';
import buildMat     from './build-mat';
import ListNode     from '../../linked-list/list-node';


/**
 * Find the MAT from the given Shape.
 * @param shape
 */
function findMat(shape: Shape): MatTree {
	findAndAddHoleClosing2Prongs(shape);
	findAndAdd2ProngsOnAllPaths(shape);
	
	
	if (typeof window !== 'undefined' && (window as any)._debug_) {
		const _debug_ = (window as any)._debug_;
		_debug_.generated.timing.after2Prongs = 
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
	
	let mat = new MatTree(branchForth);
	
	if (typeof window !== 'undefined' && (window as any)._debug_) {
		const _debug_ = (window as any)._debug_;
		_debug_.generated.timing.after3Prongs = 
			performance.now(); 
	}
	
	return fixMat(mat)
}


/**
 * Finds and adds two-prongs that removes any holes in the shape.
 * @param {Shape} shape
 * @returns {undefined}
 */
function findAndAddHoleClosing2Prongs(shape: Shape) {
	let extremes = shape.extremes;
	
	for (let k=1; k<extremes.length; k++) {
		let extreme = extremes[k];
		
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
		
		let key = PointOnShape.makeSimpleKey(posA2.p);
		if (shape.straightUpHash[key]) {
			// Skip these when doing normal 2-prong procedure.
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
function findAndAdd2ProngsOnAllPaths(shape: Shape) {
	let for2ProngsArray = shape.for2ProngsArray;
	
	for (let k=0; k<for2ProngsArray.length; k++) {
		let for2Prongs = for2ProngsArray[k];
		
		findAndAdd2Prongs(shape, k, for2Prongs);
	}
}


function findAndAdd2Prongs(
		shape: Shape, 
		k: number, 
		for2Prongs: ListNode<PointOnShape>[]) {

	let len = for2Prongs.length;
	//let index = indexInterlaced(len); // Keep for debuggin.
	let index = indexLinear(len);

	for (let i=0; i<len; i++) {
		
		let posNode = for2Prongs[index[i]];
		let pos = posNode.item;
		
		let key = PointOnShape.makeSimpleKey(pos.p);
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
function fixMat(mat: MatTree) {
		
	f(mat.startNode, undefined);
		
	function f(matNode: MatNode, priorNode: MatNode) {
		
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
			
			f(node, matNode);
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
function indexInterlaced(n: number) {
	
	let source: { [index:number]: boolean } = {};
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
 * @returns {number[]}
 */
function indexLinear(n: number) {
	let arr = [];
	for (let i=0; i<n; i++) {
		arr.push(i);
	}
	return arr;
}

export default findMat;