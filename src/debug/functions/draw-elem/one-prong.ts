import { drawFs } from 'flo-draw';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { getOsculatingCircle } from '../../../point-on-shape/get-osculating-circle.js';
import { Circle, scaleCircle } from '../../../circle.js';


/** @internal */
function drawOneProng(
        g: SVGGElement,
        pos: PointOnShape,
        classes?: string,
        delay = 0,
        scaleFactor = 0.5) {

    const circle = scaleCircle(
        getOsculatingCircle(Number.POSITIVE_INFINITY, pos),
        1
    );

    const $center = drawFs.dot(g, pos.p, 0.1*scaleFactor, 'gray', delay);
    const $circle = drawFs.dot(g, circle.center, 0.25*scaleFactor, 'gray', delay);
    const $pos    = drawFs.circle(g, circle, 'gray thin10 nofill', delay);
        
	return [...$center, ...$circle, ...$pos];
}


export { drawOneProng }
