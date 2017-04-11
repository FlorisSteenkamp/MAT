'use strict'

let Bezier = require('../classes/bezier.js');


/** 
 * NOTE: Finding osculating circles requires finding local maxima of parametric cubic curves
 *    which involves extensive tedious algebra. 
 *    
 * See the paper at: http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
 * Lets get cracking (in finding these extrema).
 * We will use variable naming conventions as in the paper above
 */
function calcCurvatureExtremaBrackets(bezier) {
	
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezier.bezierPoints;
		
	let brackets = [];
	
	// Bezier points translated to origin;
	var P_1x = x1 - x0; 
	var P_1y = y1 - y0;
	var P_2x = x2 - x0; 
	var P_2y = y2 - y0;
	var P_3x = x3 - x0; 
	var P_3y = y3 - y0;
	
	// Distance to consecutive points
	var W_0x = P_1x;
	var W_1x = P_2x-P_1x;
	var W_2x = P_3x-P_2x;
	var W_0y = P_1y;
	var W_1y = P_2y-P_1y;
	var W_2y = P_3y-P_2y;
	
	//******** Check for degenerate case in which cubic parametric curve becomes quadratic
	if ((W_0x - 2*W_1x + W_2x === 0) && (W_0y - 2*W_1y + W_2y === 0)) {
		// TODO - This case is simpler due to being quadratic but we're lazy now and will skip it for the moment
		// and just make the curvature extremum search between -10 and 10 - FIX!!!!!! 
		//extrema_intervals = [-10,10]; 
	}

	
	// See : http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
	//******** Rotate curve so that W0 - 2W1 + W2 = (0, (1/3)a), a != 0
	var atan_numer = P_3x - 3*P_2x + 3*P_1x;
	var atan_denom = P_3y - 3*P_2y + 3*P_1y;
	var atan_numer_squared = atan_numer * atan_numer;
	var atan_denom_squared = atan_denom * atan_denom;
	var radpre = (atan_numer_squared / atan_denom_squared) + 1;
	var rad = Math.sqrt(radpre);
	var cos_theta = 1/rad;
	var sin_theta;
	if (cos_theta === 0) { // edge case
		sin_theta = 1;
	} else {
		sin_theta = atan_numer / (atan_denom * rad);	
	}
	
	
	// For next rotated points see Maxima file bez5 - here we skip expensive trig evaluations
	var R_0x = 0;
	var R_0y = 0;
	var R_1x = P_1x*cos_theta - P_1y*sin_theta;
	var R_1y = P_1x*sin_theta + P_1y*cos_theta; 
	var R_2x = P_2x*cos_theta - P_2y*sin_theta;
	var R_2y = P_2x*sin_theta + P_2y*cos_theta;			
	var R_3x = P_3x*cos_theta - P_3y*sin_theta;
	var R_3y = P_3x*sin_theta + P_3y*cos_theta;
	
	// Modify W_0x, etc. to be correct for new rotated curve 
	W_0x = R_1x;
	W_1x = R_2x-R_1x;
	W_2x = R_3x-R_2x;
	W_0y = R_1y;
	W_1y = R_2y-R_1y;
	W_2y = R_3y-R_2y;
	
	var a_ =  3 * (W_0y - 2*W_1y + W_2y);
	var dif = R_2x - 2*R_1x;  // which = W_1x - W_0x;
	if (dif === 0) {
		// Case 1 (special) - W_1x - W_0x === 0
		// Degenerate to cubic function	
		
		if (W_0x !== 0) { // Otherwise we have a straight line x=0 ! 
			// TODO - FINISH!!!
			// TODO - we also still need to check for degenerate cubic (see start of paper)
		}

	} else {
		// Case 2 (usual) - W_1x - W_0x !== 0
		
		if (dif < 0) {
			// Reflect curve accross y-axis to make dif > 0
			R_1x = -R_1x;
			R_2x = -R_2x;
			R_3x = -R_3x;
			
			// Modify W_0x, etc. to be correct for new reflected 
			W_0x = -W_0x;
			W_1x = -W_1x;
			W_2x = -W_2x;
			
			dif = -dif; 
		}
		
		//console.log(W_0x, W_1x, W_2x);
		
		// From the paper:
		// All curves has exactly one of 4 cases
		// 1. It has a single inflection point and exactly 2 curvature maxima (symmetrically positioned about inflection point)
		//    This is the case if dif === 0 in above code
		// 2. It has a single cusp - we ignore this case for now - but we must still do it!
		// 3. It has a point of self-intersection - occurs if d < 0 in paper (in code d is called sigd_) 
		// 4. It has 2 inflection points, no cusps, no self-intersections
		//    It can have either 3 or 5 curvature extrema
		//    a. The case of 5 curvature extrema is ignored for now - in the paper it is mentioned to even find such a curve is difficult 
		//       and it seems such curves have very sharp curvature at one point which should not usually occur in an SVG shape. 
		//       But this case should later be included or we'll miss some points.
		//    b. There are 3 curvature extrema:
		//       Extrema occur in the range (-inf, -sqrt(d)), (-sqrt(d), sqrt(d)), (sqrt(d), inf)
		//       Since we dont know how to select -inf and inf we will just choose them to be -10 and 11 
		//       (remember bezier runs from t=0 to t=1). If Brent's method runs out of the (0,1) interval we stop and use
		//       0 or 1 as the extremum? Remember extrema can also occur at t=0 and t=1!
		//
		// At the moment we only test for case 1 and 4b, but in future we can test and eliminate the other cases
		
		
		var mu = 6*dif;
		var lambda = (3 * a_ * W_0x) / (mu*mu);
		var gamma1 = (3 * a_ * W_0y) / (mu*mu); 
		var gamma2 = (3 * (W_1y - W_0y)) / (mu);
		var sigd_ = lambda*lambda - 2*gamma2*lambda + gamma1; // This d in the paper
		var b_ = 2*(gamma2 - lambda);
		
		
		/** Returns t **/
		let deReParameterize = function(sigma) {
			return (sigma - lambda) * (mu / a_);  
		};

		let deReParameterizeBoundary = function(boundary) {
			return [
				deReParameterize(boundary[0]), 
				deReParameterize(boundary[1])
			];
		};
		
		
		/**  and clips to [0,1] or returns false if not within [0,1] **/
		let fixBoundary = function(bound) {
			var b0 = bound[0];
			var b1 = bound[1];
			
			if ((b0 < 0 && b1 < 0) || (b0 > 1 && b1 > 1)) {
				return false;
			}
			
			if (b0 < 0) { b0 = 0; }
			if (b0 > 1) { b0 = 1; }				
			if (b1 < 0) { b1 = 0; }
			if (b1 > 1) { b1 = 1; }				
			
			return [b0,b1];
		}
		
		if (sigd_ > 0) {
			var ssigd_ = Math.sqrt(sigd_);
			
			//console.log(ssigd_);
			// de-reparametize
			// Note: the sda and sdb here are the inflection points for a case iv !!!!!
			//       there are easier ways to calculate these
			var sda = -ssigd_;  
			var sdb = ssigd_;
			//var sd = order(sda,sdb);

			brackets = 
				[
					[Number.NEGATIVE_INFINITY, sda], 
					[sda,sdb], 
					[sdb,Number.POSITIVE_INFINITY]
				]
				.map(deReParameterizeBoundary)
				.map(fixBoundary);

		} else if (sigd_ < 0) {
			// Loop 
			// Note: The loop intersection may be outside t=[0,1]. In fact, for a well behaved shape this is always the case.
			//       But, curvature maxima may still occur inside t=[0,1] of course
			//
			// There can be 1 or 3 maxima of curvature
			
			var ksi_pre1 = 2*b_*b_ - 8*sigd_ - 3;
			
			if (ksi_pre1 < 0) {
				brackets = [
				    [0, Math.sqrt(-3*sigd_)]  
				]
				.map(deReParameterizeBoundary)
				.map(fixBoundary);

			} else {
			
				var ksi_pre2 =  Math.sqrt(5*ksi_pre1);
				var ksi1 = (-5*b_ - ksi_pre2) / 10; 				
				var ksi2 = (-5*b_ + ksi_pre2) / 10;
				
				brackets = [
				    [Number.NEGATIVE_INFINITY, ksi1], 
				    [ksi1, Math.min(0, ksi2)], 
				    [Math.max(0, ksi2), Math.sqrt(-3*sigd_)]  
				]
				.map(deReParameterizeBoundary)
				.map(fixBoundary);
			}
		} else if (sigd_ === 0) {
			// TODO Cusp - ignore for now - lazy
		}
	}	
	
	return brackets;
}


module.exports = calcCurvatureExtremaBrackets;