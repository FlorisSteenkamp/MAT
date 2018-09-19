
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';


function tightBoundingBox(g: SVGGElement, box: number[][]) {
	let $box = _debug_.fs.draw.polygon(g, box, 'thin5 black nofill');

	return $box;
}


export { tightBoundingBox }
