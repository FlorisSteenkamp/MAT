import { drawFs } from "flo-draw";

/** @internal */
function drawCull(
        g: SVGGElement,
        cull: number[],
        classes = 'thin10 cyan nofill',
        delay = 0,
        scaleFactor = 1) {	

    const $elems: SVGElement[] = [];

    $elems.push(...drawFs.crossHair(
        g, cull, classes, 0.1*scaleFactor, delay)
    )
    
	return $elems;
}


export { drawCull }
