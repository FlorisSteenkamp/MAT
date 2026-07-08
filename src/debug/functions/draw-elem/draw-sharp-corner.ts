import type { Curve } from 'flo-boolean';
import { drawFs } from 'flo-draw';


/** @internal */
function sharpCorner(
        g: SVGGElement,
        curve: Curve, 
        classes = 'green',
        delay = 0,
        scaleFactor = 1) {

    const { ps } = curve;
    const p = ps[ps.length-1];
    const $pos = drawFs.dot(g, p, 0.6*scaleFactor, 'green', delay);

    return $pos;
}


export { sharpCorner }
