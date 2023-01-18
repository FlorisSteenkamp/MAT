import { drawFs } from 'flo-draw';
import { Curve } from '../../../curve.js';


/** @hidden */
function dullCorner(g: SVGGElement, curve: Curve) {
	const scaleFactor = 1;
		
	const ps = curve.ps; 
	const p = curve.ps[ps.length-1];
	const $pos = drawFs.dot(g, p, 0.5*scaleFactor, 'orange');
	
	return $pos;
}


export { dullCorner }
