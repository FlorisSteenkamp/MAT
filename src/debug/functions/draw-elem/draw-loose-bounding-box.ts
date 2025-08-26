import { drawFs } from "flo-draw";


/** @internal */
function looseBoundingBox(
		g: SVGGElement,
		box: number[][], 
        classes = 'thin5 brown nofill',
        delay = 0,
        scaleFactor = 1) {

	const [[x0, y0],[x1, y1]] = box;
	box = [[x0, y0],[x1, y0],[x1,y1],[x0,y1]];

	const $box = drawFs.polygon(g, box, classes, delay);
	
	return $box;
}


export { looseBoundingBox }
