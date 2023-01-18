// TODO - move to another library
import { tangent } from 'flo-bezier3';
import { dot, cross, toUnitVector } from 'flo-vector2d';
import { Curve } from '../curve.js';


/**
 * @hidden
 * Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param curve
 */
function getCurvatureAtInterface(curve: Curve) {	
	const pss = [
		curve.ps,
		curve.next.ps
	];
	
	const tans = [ 
		toUnitVector(tangent(pss[0], 1)), 
		toUnitVector(tangent(pss[0], 0))
	];
	
	// The integral of a kind of Dirac Delta function.
	const cosθ = dot  (tans[0], tans[1]);
	const sinθ = cross(tans[0], tans[1]);
	const θ = acos(cosθ);
	
	const result = sinθ >= 0 ? θ : -θ;
	
	return result;
}


/**
 * @hidden
 * Floating-point 'safer' version of acos. If x is larger than 1 (or smaller 
 * than -1), still returns 0 (or Math.PI) instead of NAN.
 * @param x
 * @example 
 * 		acos(1);  //=> 0
 *      acos(2);  //=> 0
 */
function acos(x: number): number {
	if (x > 1) {
		return 0;
	} else if (x < -1) {
		return Math.PI;
	}
	
	return Math.acos(x);
}


export { getCurvatureAtInterface }
