
import MAT_CONSTANTS from '../../mat-constants';

import ListNode     from '../../linked-list/list-node';
import Bezier3      from 'flo-bezier3';
import Poly         from 'flo-poly';
import Circle       from '../../geometry/classes/circle';
import PointOnShape from '../../geometry/classes/point-on-shape';
import PathCurve    from '../classes/path-curve';


import calcBezierCurvatureExtremaBrackets from './calc-bezier-curvature-extrema';


/** 
 * Finds the osculating circles for the given bezier. 
 */
function getBezierOsculatingCircles(
        bezierNode: ListNode<PathCurve>): PointOnShape[] {

	let pointsOnShape = [];
	
	let root;
	let ps = bezierNode.item.bezier3;
	let brackets = calcBezierCurvatureExtremaBrackets(ps);
	let κPs = Bezier3.κ(ps);
	 
	let lenb = brackets.length;
	for (let k=0; k<lenb; k++) {
		let bracket = brackets[k];
		if (!bracket) { continue; }
		
		let root = lookForRoot(ps, bracket);
		if (!root) { continue; }
		
		let κ = -κPs(root);
		// Check if local extrema is a maximum or minimum.
		let κAtMinsd = -κPs(bracket[0]);
		let κAtMaxsd = -κPs(bracket[1]);
		
		if (κ > κAtMinsd && κ > κAtMaxsd) {
			// maximum
		} else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
			// minimum
			continue; 
		}
		
		let pos = new PointOnShape(
			bezierNode, 
			root, 
			MAT_CONSTANTS.pointType.standard, 
			0,
			0
		);
			
		pointsOnShape.push(pos);
	}

	pointsOnShape.sort(PointOnShape.compare);
	
	return pointsOnShape;
}


function lookForRoot(ps: number[][], [minsd, maxsd]: number[]) {
    
	// At this point there can be exactly 0 or 1 roots within 
	// [minsd, maxsd]
	let c0 = Bezier3.dκMod(ps)(minsd);
	let c1 = Bezier3.dκMod(ps)(maxsd);
	
	if (c0*c1 >= 0) { return; }
	
	// There is exactly one root in the interval.
	let root = Poly.brent(
			Bezier3.dκMod(ps), 
			minsd, maxsd
	);
	
	return root;
}


export default getBezierOsculatingCircles;
