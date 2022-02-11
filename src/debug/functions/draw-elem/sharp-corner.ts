import { drawFs } from 'flo-draw';
import { Curve } from '../../../curve.js';


/** @hidden */
function sharpCorner(g: SVGGElement, curve: Curve) {
	const scaleFactor = 1;
		
	let p = curve.ps[curve.ps.length-1];
	let $pos = drawFs.dot(g, p, 0.6*scaleFactor, 'green');
		
	return $pos;
}


export { sharpCorner }
