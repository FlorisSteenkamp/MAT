'use strict'

let Poly = require('../../polynomial/polynomial.js'); 
let Mobius = require('../../mobius/mobius.js');

/** Finds all roots using the VAS algorithm followed by Brent's method 
 * @param p {Array[Number]} The polynomial from highest to lowest coefficient
 * 
 **/
function allRootsVAS(p, tRange) {
	// TODO - First remove all zero roots - The VAS method can't handle them
	let zeroRoots;
	if (tRange[0] <= 0 && tRange[1] >= 0) {
		zeroRoots = Poly.zeroRoots(p);
	} else {
		zeroRoots = { p, numZeros: 0 };
	}
	
	let p_ = zeroRoots.p;
	let numZeros = zeroRoots.numZeros;

	// TODO - Next, remove all multiple roots ... - VAS doesn't like them either
	
	let vasRoots = Poly.vasRootIntervals(p_, tRange)
	.filter(function(interval) {
		let notOverlap = (interval[1] < tRange[0] || interval[0] > tRange[1])
		if (notOverlap) { 
			if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
				MatLib._debug_.generated.rootsSkipped++; 
			} 
		}
		return !notOverlap;
	})
	.map(function(interval) {
		// TODO - 0.0001 was emperically chosen
		if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
			MatLib._debug_.generated.rootsNotSkipped++; 
		}
		
		return Poly.brent(
				Poly.evaluate(p_), 
				interval[0], 
				interval[1], 
				0.0000001
		); 
	});
	
	for (let i=0; i<numZeros; i++) {
		vasRoots.push(0);	
	}
	
	/*
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		MatLib._debug_.generated.rootsNotSkipped++;
	}
	*/
	 
	return vasRoots;
}


/** 
 * Use VAS (Vincent–Akritas–Strzeboński) method to find intervals 
 * for roots. 
 * See: http://www.e-ce.uth.gr/wp-content/uploads/formidable/phd_thesis_vigklas.pdf 
 * TODO - Square-free factorization ignored for now - duplicate roots will cause an issue
 * TODO - Optimize later for intervals between 0 and 1 only
 * 0.085 millis per poly of degree 6 - 10000 polies
 */
Poly.vasRootIntervals = function(p, tRange) {

	var positiveIntervals = Poly.vasRootIntervalsHelper(
		//p.slice(),
		p,
		new Mobius([1,0],[0,1]),
		tRange
	);
	
	// ONLY COMMENTED BECAUSE IN *OUR* CASE WE DONT CARE ABOUT NEGATIVE ROOTS!!
	/*
	var negativeIntervals = Poly.vasRootIntervalsHelper(
		Poly.changeVariables(p.slice(), -1, 0), 
		new Mobius([1,0],[0,1]),
		tRange
	)
	.map(function(interval) {
		return Poly.negate(Poly.invert(interval));
	});
	*/
	
	let intervals = [].concat(
			//negativeIntervals, 
			positiveIntervals
	);
	
	return intervals;
}


/** 
 * Helper - aa,bb,cc,dd are the Mobius transformation coefficients
 * The initial mobius must be new Mobius([1,0],[0,1]) -> M(x) = x. 
 */
Poly.vasRootIntervalsHelper = function(p, mobius, tRange) {
	
	// In the Vigklas paper the steps are marked as below:
	
	// STEP 1
	let intervals = [];
	let signVariations = Poly.signChanges(p);
	
	// STEP 2
	if (signVariations === 0) { // Descartes' rule of signs y'all
		return []; 
	}
	
	// STEP 3
	if (signVariations === 1) {
		var M0 = Mobius.evaluateAt0(mobius);  
		var MI = Mobius.evaluateAtInf(mobius); 
		var MM0 = Math.min(M0, MI);
		var MMI = Math.max(M0, MI);
		if (MMI === Number.POSITIVE_INFINITY) {
			MMI = Mobius.evaluate(mobius, Poly.positiveRootUpperBound(p));
		}

		return [[MM0,MMI]];
	}


	// STEP 4
	var lb = Poly.positiveRootLowerBound(p);
	
	// STEP 5
	/*if (lb > tRange[1]) {
		return [];
	}*/
	
	if (lb > 1)  {	
		// p ← p(x + lb)
		p = Poly.changeVariables(p, 1, lb);
		
		// M ← M(x + lb)
		mobius = Mobius.changeVariables(mobius, 1, lb);
	}


	// TODO - Rember factor of 16 improvement
	
	// STEP 6 - Look for real roots in (0, 1)
	
	// p01 ← (x + 1)^(deg(p)) *  p(1/(x+1))
	var p01 = Poly.changeVariables(Poly.invert(p), 1, 1); 
	
	// M01 ← M(1/(x+1))
	var M01 = Mobius.changeVariables(Mobius.invert(mobius), 1, 1);

	// STEP 7 - Is 1 a root?
	var m = Mobius.evaluate(mobius, 1);
	
	// STEP 8 - Look for real roots in (1, ∞)
	
	// p1∞ ← p(x + 1)
	var p1inf = Poly.changeVariables(p, 1, 1);
	
	// M1∞ ← M(x + 1)
	var M1inf = Mobius.changeVariables(mobius, 1, 1); 
	
	// STEPS 9 -> 13
	let intervals1 = Poly.vasRootIntervalsHelper(p01, M01, tRange);	
	let intervals3 = Poly.vasRootIntervalsHelper(p1inf, M1inf, tRange);	
	
	
	if (Poly.evaluate(p)(1) === 0) {
		intervals1.push([m,m]);
	}
	
	return [].concat(intervals1, intervals3); 
}


module.exports = allRootsVAS;



















