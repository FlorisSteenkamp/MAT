
import { Curve } from '../../../curve';
import { drawFs } from 'flo-draw';


/** @hidden */
function dullCorner(g: SVGGElement, curve: Curve) {
	const scaleFactor = 1;
		
	let ps = curve.ps; 
	let p = curve.ps[ps.length-1];
	let $pos = drawFs.dot(g, p, 0.5*scaleFactor, 'orange');
	
	return $pos;
}


export { dullCorner }
