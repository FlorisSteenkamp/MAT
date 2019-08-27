
import { drawFs } from 'flo-draw';


function tightBoundingBox(g: SVGGElement, box: number[][]) {
	let $box = drawFs.polygon(g, box, 'thin5 black nofill');

	return $box;
}


export { tightBoundingBox }
