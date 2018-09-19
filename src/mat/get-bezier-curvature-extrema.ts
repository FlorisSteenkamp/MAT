
declare var _debug_: MatDebug;

import { MatDebug } from '../debug/debug';

import Poly    from 'flo-poly';

import { κ, dκMod } from 'flo-bezier3';

import { Curve        } from '../curve';
import { PointOnShape } from '../point-on-shape';

import { calcBezierCurvatureExtremaBrackets } from 
	'./get-bezier-curvature-extrema-brackets';


/**
 * Finds the osculating circles and inflection points for the given bezier. 
 * @param curve 
 */
function getBezierCurvatureExtrema(curve: Curve) {

	let maxCurvaturePoss = [];
	let maxNegativeCurvaturePoss = [];
	
	let ps = curve.ps;
	let brackets = calcBezierCurvatureExtremaBrackets(ps);
	let κPs = κ(ps); // The curvature function
	 
	let lenb = brackets.length;
	for (let k=0; k<lenb; k++) {
		let bracket = brackets[k];
		if (!bracket) { continue; }
		
		let root = lookForRoot(ps, bracket);
		if (!root) { continue; }
		
		let κ_ = -κPs(root);
		// Check if local extrema is a maximum or minimum.
		let κAtMinsd = -κPs(bracket[0]);
		let κAtMaxsd = -κPs(bracket[1]);
		
		if (κ_ > κAtMinsd && κ_ > κAtMaxsd) {
			// maximum
			if (κ_ > 0) {
				maxCurvaturePoss.push(new PointOnShape(curve, root));
			}
			//_debug_.fs.draw.crossHair((new PointOnShape(curve, root).p), 'blue thin2 nofill')
		} else if (κ_ <= κAtMinsd && κ_ <= κAtMaxsd) {
			// minimum
			if (κ_ < 0) {
				maxNegativeCurvaturePoss.push(new PointOnShape(curve, root));
				//_debug_.fs.draw.crossHair((new PointOnShape(curve, root).p), 'red thin2 nofill')
			}
		}
	}

	return { maxCurvaturePoss, maxNegativeCurvaturePoss };
}


function lookForRoot(ps: number[][], [minsd, maxsd]: number[]) {
    
	// At this point there can be exactly 0 or 1 roots within 
	// [minsd, maxsd]
	let dκMod_ = dκMod(ps);
	let c0 = dκMod_(minsd);
	let c1 = dκMod_(maxsd);
	
	if (c0*c1 >= 0) { return; }
	
	// There is exactly one root in the interval.
	let root = Poly.brent(dκMod_, minsd, maxsd);
	
	return root;
}


export { getBezierCurvatureExtrema };
