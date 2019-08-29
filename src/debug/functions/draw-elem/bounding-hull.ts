
import { drawFs } from 'flo-draw';


/** @hidden */
function boundingHull(
        g: SVGGElement,
        hull: number[][], 
        style: string = 'thin5 black nofill') {
            
	let $polygon = drawFs.polygon(g, hull, style);

	return $polygon;
}


export { boundingHull }
