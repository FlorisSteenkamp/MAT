
import { getOsculatingCircle, IPointOnShape } from '../../../point-on-shape';
import { Circle, scaleCircle } from '../../../circle';
import { drawFs } from 'flo-draw';


/** @hidden */
const scaleFactor = 0.5;


/** @hidden */
function drawOneProng(g: SVGGElement, pos: IPointOnShape, classes: string, delay = 0) {
    let circle = scaleCircle(
        //PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos),
        getOsculatingCircle(Number.POSITIVE_INFINITY, pos),
        1
    );

    let $center = drawFs.dot(g, pos.p, 0.1*scaleFactor, 'gray', delay);
    let $circle = drawFs.dot(g, circle.center, 0.25*scaleFactor, 'gray', delay);
    let $pos    = drawFs.circle(g, circle, 'gray thin10 nofill', delay);
        
	return [...$center, ...$circle, ...$pos];
}


export { drawOneProng }
