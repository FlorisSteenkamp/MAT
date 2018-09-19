
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { PointOnShape } from '../../../point-on-shape';


function sharpCorner(g: SVGGElement, pos: PointOnShape) {
	const scaleFactor = 0.1;
		
	let $pos = _debug_.fs.draw.dot(g, pos.p, 0.6*scaleFactor, 'green');
		
	return $pos;
}


export { sharpCorner }
