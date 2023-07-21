import { drawFs } from 'flo-draw';


/** @internal */
function boundingHull(
        g: SVGGElement,
        hull: number[][], 
        classes = 'thin5 black nofill',
        delay = 0,
        scaleFactor = 1) {
            
	const $polygon = drawFs.polygon(g, hull, classes, delay);

	return $polygon;
}


export { boundingHull }
