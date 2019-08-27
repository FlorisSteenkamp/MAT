
import { Curve } from '../../../curve';
import { drawFs } from 'flo-draw';


function dullCorner(g: SVGGElement, curve: Curve) {
	const scaleFactor = 1;
		
	let p = curve.ps[3];
	let $pos = drawFs.dot(g, p, 0.5*scaleFactor, 'orange');
	
	return $pos;
}


export { dullCorner }
