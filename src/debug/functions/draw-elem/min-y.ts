
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { evaluate } from 'flo-bezier3';

import { PointOnShape } from '../../../point-on-shape';


function minY(g: SVGGElement, pos: PointOnShape) {	
    let p = evaluate(pos.curve.ps, pos.t) ;

    let $elems = _debug_.fs.draw.crossHair( 
            g, p, 'red thin10 nofill'
	);  
	
    return $elems;
}


export { minY }
