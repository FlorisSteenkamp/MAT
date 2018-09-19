
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { PointOnShape } from '../../../point-on-shape';
import { Circle } from '../../../circle';

const scaleFactor = 0.5;


function oneProng(g: SVGGElement, pos: PointOnShape) {
	let draw = _debug_.fs.draw;

    let circle = Circle.scale(
        PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos),
        1
    );

    let $center = draw.dot(g, pos.p, 0.1*scaleFactor, 'gray');
    let $circle = draw.dot(g, circle.center, 0.25*scaleFactor, 'gray');
    let $pos    = draw.circle(g, circle, 'gray thin10 nofill');
        
	return [...$center, ...$circle, ...$pos];
}


export { oneProng }
