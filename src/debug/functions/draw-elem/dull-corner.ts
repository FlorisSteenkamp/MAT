import { drawFs } from 'flo-draw';
import { Curve } from '../../../curve.js';


/** @internal */
function dullCorner(
		g: SVGGElement,
		curve: Curve, 
        classes = 'orange',
        delay = 0,
        scaleFactor = 1) {

	const ps = curve.ps; 
	const p = curve.ps[ps.length-1];
	const $pos = drawFs.dot(g, p, 0.01*0.5*scaleFactor, classes, delay);
	
	return $pos;
}


export { dullCorner }
