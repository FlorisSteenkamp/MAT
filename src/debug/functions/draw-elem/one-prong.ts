
import { PointOnShape } from '../../../point-on-shape';
import { Circle } from '../../../circle';
import { drawFs } from 'flo-draw';


/** @hidden */
const scaleFactor = 0.5;


/** @hidden */
function drawOneProng(g: SVGGElement, pos: PointOnShape) {
    let circle = Circle.scale(
        PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos),
        1
    );

    let $center = drawFs.dot(g, pos.p, 0.1*scaleFactor, 'gray');
    let $circle = drawFs.dot(g, circle.center, 0.25*scaleFactor, 'gray');
    let $pos    = drawFs.circle(g, circle, 'gray thin10 nofill');
        
	return [...$center, ...$circle, ...$pos];
}


export { drawOneProng }
