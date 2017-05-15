let MatCircle    = require('../../mat/classes/mat-circle.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');

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
	
	let { circle, ps, delta3s } = threeProng;

	let cps = [0,1,2].map(i => new ContactPoint(ps[i], undefined))
	
	if (MatLib._debug_) {
		// Keep for possible future debugging.
		/*
		for (let i=0; i<3; i++) {
			let cmpBef = ContactPoint.compare(delta3s[i][0].item, cps[i]);
			let cmpAft = ContactPoint.compare(delta3s[i][1].item, cps[i]); 

			let len = MatLib._debug_.generated.threeProngs.length-1; // Used by debug functions to reference a particular three-prong
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
	
	
	let cpNodes = [];
	for (let i=0; i<3; i++) {
		let pos = ps[i];
		let k = pos.bezierNode.loop.indx;
		cpNodes.push(
			LinkedLoop.insert(
				shape.contactPointsPerLoop[k], 
				cps[i], 
				delta3s[i][0]
			)
		);
	}
	
	
	let matCircle = MatCircle.create(circle, cpNodes);
	
	
	let idxsPrev = [2,0,1];
	let idxsNext = [1,2,0];
	for (let i=0; i<3; i++) {
		cpNodes[i].prevOnCircle = cpNodes[idxsPrev[i]];
		cpNodes[i].nextOnCircle = cpNodes[idxsNext[i]];
	}
	
	return matCircle;
}


module.exports = add3Prong;