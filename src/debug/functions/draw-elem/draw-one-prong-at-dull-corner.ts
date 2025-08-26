
import { drawFs } from 'flo-draw';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { getOsculatingCircle } from '../../../point-on-shape/get-osculating-circle.js';


/** @hidden */
function oneProngAtDullCorner(
        g: SVGGElement,
        pos: PointOnShape,
        classes?: string,
        delay = 1000,
        scaleFactor = 1) {

    //let oCircle = PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    const oCircle = getOsculatingCircle(Number.POSITIVE_INFINITY, pos);

    const $center = drawFs.dot(g, pos.p, 0.1, 'orange');
    const $circle = drawFs.dot(g, oCircle.center, 0.25, 'orange');
    const $pos    = drawFs.circle(g, oCircle, 'orange thin10 nofill');
        
	return [...$center, ...$circle, ...$pos];
}


export { oneProngAtDullCorner }
