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
let kkk=0;
function add3Prong(shape, threeProng, _debug_) {
	
	let { circle, ps, delta3s } = threeProng;

	let cps = [];
	for (let i=0; i<3; i++) {
		cps.push(new ContactPoint(ps[i], undefined));
	}
	

	if (_debug_) {
		let cmp1 = ContactPoint.compare(cps[0], cps[1]); 
		let cmp2 = ContactPoint.compare(cps[1], cps[2]);
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
		let cmps = [];
		for (let i=0; i<3; i++) {
			cmps.push( 
					ContactPoint.compare(delta3s[i][0].item, cps[i])
			);
			
			if (cmps[i] > 0) {
				console.log(`3-PRONG Order is wrong : i: ${i} - cmp: ${cmps[i]}`);
				console.log(threeProng);
			}
		}
	}
	
	
	let cpNodes = [];
	for (let i=0; i<3; i++) {
		cpNodes.push(
			LinkedLoop.insert(
				shape.contactPoints, 
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