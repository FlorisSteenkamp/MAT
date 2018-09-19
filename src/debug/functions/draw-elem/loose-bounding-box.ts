
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';


function looseBoundingBox(g: SVGGElement, box: number[][]) {
	let $box = _debug_.fs.draw.rect(g, box, 'thin5 brown nofill');
	
	return $box;
}


export { looseBoundingBox }
