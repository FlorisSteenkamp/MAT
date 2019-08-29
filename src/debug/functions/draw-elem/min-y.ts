
import { evaluate } from 'flo-bezier3';

import { PointOnShape } from '../../../point-on-shape';
import { drawFs } from 'flo-draw';


/** @hidden */
function minY(g: SVGGElement, pos: PointOnShape) {	
    let p = evaluate(pos.curve.ps, pos.t) ;

    let $elems = drawFs.crossHair( 
            g, p, 'red thin10 nofill'
	);  
	
    return $elems;
}


export { minY }
