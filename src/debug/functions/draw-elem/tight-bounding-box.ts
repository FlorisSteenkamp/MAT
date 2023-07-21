import { drawFs } from 'flo-draw';


/** @internal */
function tightBoundingBox(
		g: SVGGElement,
		box: number[][], 
        classes = 'thin5 pinker nofill',
        delay = 0,
        scaleFactor = 1) {

	const $box = drawFs.polygon(g, box, 'thin5 pinker nofill', delay);

	return $box;
}


export { tightBoundingBox }
