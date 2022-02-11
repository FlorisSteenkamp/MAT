import { drawFs } from 'flo-draw';


/** @hidden */
function tightBoundingBox(g: SVGGElement, box: number[][]) {
	let $box = drawFs.polygon(g, box, 'thin5 pinker nofill');

	return $box;
}


export { tightBoundingBox }
