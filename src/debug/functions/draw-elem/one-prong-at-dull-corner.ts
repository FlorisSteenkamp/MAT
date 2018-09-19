
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { PointOnShape } from '../../../point-on-shape';


function oneProngAtDullCorner(g: SVGGElement, pos: PointOnShape) {
    let oCircle = PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);

    let $center = _debug_.fs.draw.dot(g, pos.p, 0.1, 'orange');
    let $circle = _debug_.fs.draw.dot(g, oCircle.center, 0.25, 'orange');
    let $pos    = _debug_.fs.draw.circle(g, oCircle, 'orange thin10 nofill');
        
	return [...$center, ...$circle, ...$pos];
}


export { oneProngAtDullCorner }
