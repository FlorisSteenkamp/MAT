
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { PointOnShape } from '../../../point-on-shape';


function dullCorner(g: SVGGElement, pos: PointOnShape) {
	const scaleFactor = 0.1;
		
	let $pos = _debug_.fs.draw.dot(g, pos.p, 0.5*scaleFactor, 'orange');
	
	return $pos;
}


export { dullCorner }
