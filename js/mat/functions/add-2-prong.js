'use strict'

let Circle       = require('../../geometry/classes/circle.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let MatCircle    = require('../../mat/classes/mat-circle.js');
let Shape        = require('../../geometry/classes/shape.js');
let PointOnShape = require('../../geometry/classes/point-on-shape.js');

/**
 * Adds a 2-prong contact circle to the shape.
 * 
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param {ListNode<ContactPoint>} cp1 - First point
 * @param {PointOnShape} pos2 - Second point
 * @param delta The boundary piece within which the new contact point should be placed
 */
function add2Prong(shape, circle, pos1, pos2, holeClosing) {

	if (holeClosing) {
		pos1.order2 = 1;
		pos2.order2 = -1;
	}
	
	let cp2 = new ContactPoint(pos2, undefined);
	let delta2 = Shape.getNeighbouringPoints(shape, pos2); 
	let cmp3 = delta2[0] === undefined ? undefined : ContactPoint.compare(delta2[0].item, cp2); 
	let cmp4 = delta2[1] === undefined ? undefined : ContactPoint.compare(cp2, delta2[1].item);
	if (MatLib._debug_) {
		if (cmp3 > 0 || cmp4 > 0) {
			//console.log(`2-PRONG 2 Order is wrong 2: ${cmp3}, ${cmp4}`);
		}
	}
	if (cmp3 === 0 || cmp4 === 0) {
		// Should not really be possible with hole-closing 2-prongs.
		return undefined;
	}
	let k2 = pos2.bezierNode.loop.indx;
	let newCp2Node = LinkedLoop.insert(
			shape.contactPointsPerLoop[k2],  
			cp2, 
			delta2[0]
	);
	
	
	let cp1 = new ContactPoint(pos1, undefined);
	let delta1 = Shape.getNeighbouringPoints(shape, pos1);
	let cmp1 = delta1[0] === undefined ? undefined : ContactPoint.compare(delta1[0].item, cp1);
	let cmp2 = delta1[1] === undefined ? undefined : ContactPoint.compare(cp1, delta1[1].item);
	if (MatLib._debug_) {
		if (cmp1 > 0 || cmp2 > 0) {
			//console.log(`2-PRONG 1 Order is wrong 2: ${cmp1}, ${cmp2}`);
		}
	}
	// If they are so close together, don't add it - there's already 1
	if (cmp1 === 0 || cmp2 === 0) {
		// Should not be possible with hole-closing 2-prongs.
		LinkedLoop.remove(shape.contactPointsPerLoop[k2], newCp2Node);
		return undefined;
	}
	let k1 = pos1.bezierNode.loop.indx;
	let newCp1Node = LinkedLoop.insert(
			shape.contactPointsPerLoop[k1],  
			cp1, 
			delta1[0]
	);
	
	let matCircle = MatCircle.create(circle, [newCp1Node, newCp2Node]);
	
	newCp1Node.prevOnCircle = newCp2Node;
	newCp1Node.nextOnCircle = newCp2Node;
	
	newCp2Node.prevOnCircle = newCp1Node;
	newCp2Node.nextOnCircle = newCp1Node;
	
	
	
	if (holeClosing) {
		let posA1 = pos2;
		let posB2 = PointOnShape.copy(posA1);
		posB2.order2 = 1;
		let cpB2 = new ContactPoint(posB2, undefined);
		let newCpB2Node = LinkedLoop.insert(
				shape.contactPointsPerLoop[k2],  
				cpB2, 
				newCp2Node
		);
		
		
		let posA2 = pos1;
		let posB1 = PointOnShape.copy(posA2);
		posB1.order2 = -1;
		let cpB1 = new ContactPoint(posB1, undefined);
		let newCpB1Node = LinkedLoop.insert(
				shape.contactPointsPerLoop[k1],  
				cpB1, 
				newCp1Node.prev
		);
		
		
		MatCircle.create(circle, [newCpB1Node, newCpB2Node]);
		
		newCpB1Node.prevOnCircle = newCpB2Node;
		newCpB1Node.nextOnCircle = newCpB2Node;
		newCpB2Node.prevOnCircle = newCpB1Node;
		newCpB2Node.nextOnCircle = newCpB1Node;
		
		newCp2Node.next = newCp1Node;
		newCp1Node.prev = newCp2Node;
		
		newCpB1Node.next = newCpB2Node;
		newCpB2Node.prev = newCpB1Node;
	}
	
	
	if (MatLib._debug_) {
		// Add points so when we alt-click shape point is logged.
		prepForDebug(newCp1Node);
		prepForDebug(newCp2Node);
	}
	
	return;
}


function prepForDebug(contactPoint) {
	//---- Prepare debug info for the ContactPoint
	let cpKey = PointOnShape.makeSimpleKey(
			contactPoint.item.pointOnShape
	);
	let cpHash = MatLib._debug_.generated.cpHash;
	let cpArr = MatLib._debug_.generated.cpArr;
	if (!cpHash[cpKey]) {
		cpHash[cpKey] = {
			cp: contactPoint,
			arrIndx: cpArr.length	
		};
		cpArr.push(contactPoint);
	}	
	
	let cpHashDebugObj = cpHash[cpKey];
	
	cpHashDebugObj.visitedPointsArr = 
		cpHashDebugObj.visitedPointsArr || [];
}


module.exports = add2Prong;
