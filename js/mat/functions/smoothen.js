'use strict'

let Geometry      = require('../../geometry/geometry.js');
let Bezier        = require('../../geometry/classes/bezier.js');
let Vector        = require('../../vector/vector.js');
let Mat           = require('../classes/mat.js');
let MAT_CONSTANTS = require('../../mat-constants.js');

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
	function getLinkedCps([prevCpNodes, currCpNodes]) {

		for (let i=0; i<prevCpNodes.length; i++) {
			let prevCpNode = prevCpNodes[i];
			
			for (let j=0; j<currCpNodes.length; j++) {
				let currCpNode = currCpNodes[j];
				
				if (prevCpNode.next === currCpNode) {
					return [prevCpNode, currCpNode];
				}	
			}
		}		
	}
	
	
	let lines = [];
	let quads = [];
	let cubes = [];
	
	
	Mat.traverse(mat, function(currNode, prevNode) {
		if (!prevNode) { return; }
		
		let prevMatCircle = prevNode.matCircle;
		let prevCc = prevMatCircle.circle.center;
		let prevCpNodes = prevMatCircle.cpNodes;
		
		let currMatCircle = currNode.matCircle;
		let currCc = currMatCircle.circle.center;
		let currCpNodes = currMatCircle.cpNodes;
		
		let [prevCpNode, currCpNode] = 
			getLinkedCps([prevCpNodes, currCpNodes]);
		
		
		let prevL = getDirectionToNextMatCircle(prevCpNode, prevCc, true);
		let currL = getDirectionToNextMatCircle(currCpNode, currCc, false);
		
		function getDirectionToNextMatCircle(cpNode, circleCenter, isPrev) {
			let cp1 = cpNode.item;
			
			let cp2 = isPrev ? 
				cpNode.nextOnCircle.item: 
				cpNode.prevOnCircle.item;
			
			let vDir;
			if (cp1 !== cp2) {
				// Not a 1-prong.
				let spanner = Vector.fromTo(cp1, cp2);
				vDir = Vector.rotateBy90Degrees(spanner);
			} else {
				if (cp1.pointOnShape.type === MAT_CONSTANTS.pointType.sharp) {
					let bezierNode1;
					let bezierNode2;
					if (cp1.pointOnShape.t === 0) {
						bezierNode1 = cp1.pointOnShape.bezierNode;
						bezierNode2 = cp1.pointOnShape.bezierNode.prev;
					} else if (cp1.pointOnShape.t === 1) {
						bezierNode1 = cp1.pointOnShape.bezierNode.next; 
						bezierNode2 = cp1.pointOnShape.bezierNode;
					}

					let tan1 = Bezier.tangent(bezierNode1.item)(0);
					let tan2 = Vector.reverse(
							Bezier.tangent(bezierNode2.item)(1)
					);
					
					let x = Vector.dot(tan1, tan2);
					// Recall the identities sin(acos(x)) = sqrt(1-x^2),
					// etc. Also recall the half angle formulas. Then 
					// the rotation matrix, R, can be calculated.
					let cosθ = Math.sqrt((1+x)/2); 					
					let sinθ = Math.sqrt((1-x)/2);
					
					vDir = Vector.rotate(tan2, sinθ, cosθ);
				} else {
					vDir = Vector.fromTo(cp1, circleCenter);	
				}
			}
			let v = Vector.translate(
					circleCenter, 
					Vector.toLength(vDir, 1)
			);
			let l = [circleCenter, v];
			
			return l;
		}

		
		let mid = Geometry.lineLineIntersection(prevL, currL);
		let twisted;
		if (mid) {
			let a = Vector.fromTo(prevCc, mid);
			let b = Vector.fromTo(currCc, mid);
			let c = Vector.fromTo(prevCc, currCc);
			
			let dot1 = Vector.dot(a,c);
			let dot2 = Vector.dot(b,c);
			
			twisted = (dot1 < 0 || dot2 > 0);
		}
		 

		if (!mid) {
			lines.push([prevCc, currCc]);
		} else if (twisted) {
			let lp1 = Vector.mean([prevCc,currCc]);
			let vv1 = Vector.fromTo(prevCc,currCc);
			let vvv1 = Vector.rotateBy90Degrees(vv1);
			let lpp1 = Vector.translate(lp1, vvv1);
			let l = [lp1,lpp1];
			let mid1 = Geometry.lineLineIntersection(prevL,l);
			let mid2 = Geometry.lineLineIntersection(currL,l);

			cubes.push([prevCc, mid1, mid2, currCc]);
		} else {
			//console.log(prevCc, mid, currCc);
			quads.push([prevCc, mid, currCc]);
		}
	});
	
	return {
		lines,
		quads,
		cubes,
	}
}


module.exports = smoothen;













