
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';


function boundingHull(
        g: SVGGElement,
        hull: number[][], 
        style: string = 'thin5 black nofill') {
            
	let $polygon = _debug_.fs.draw.polygon(g, hull, style);

	return $polygon;
}


export { boundingHull }
