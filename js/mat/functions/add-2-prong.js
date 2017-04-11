'use strict'

let Circle       = require('../../geometry/classes/circle.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let MatCircle    = require('../../mat/classes/mat-circle.js');
let Shape        = require('../../geometry/classes/shape.js');

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
	
	
	let cmp1 = ContactPoint.compare(delta[0].item, cp2); 
	let cmp2 = ContactPoint.compare(cp2, delta[1].item);
	
	if (_debug_) {
		if (cmp1 > 0 || cmp2 > 0) {
			console.log(`2-PRONG Order is wrong 2: ${cmp1}, ${cmp2}`);
			//console.log(delta[0].item);
			//console.log(cp2);
		}
	}
	
	if (cmp1 >= 0 || cmp2 >= 0) {
		LinkedLoop.remove(shape.contactPoints, cp1Node);
		return undefined;
	}
	
	
	var newCpNode = LinkedLoop.insert(
			shape.contactPoints, 
			cp2, 
			delta[0]
	);
	
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
	let cpKey = contactPoint.item.pointOnShape.simpleKey;
	let cpHash = _debug_.generated.cpHash;
	let cpArr = _debug_.generated.cpArr;
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

