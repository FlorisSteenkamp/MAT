
import { drawCirclePercent } from './draw-circle-percent';
import { X } from '../../../x/x';


function intersection(g: SVGGElement, x: X) {	
    return [drawCirclePercent(g, x.pos.p, 0.7, 'purple thin2 nofill')];
}


export { intersection }
