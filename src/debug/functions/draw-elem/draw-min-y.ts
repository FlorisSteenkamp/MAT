import type { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { evalDeCasteljau } from 'flo-bezier3';
import { drawFs } from 'flo-draw';


/** @internal */
function minY(g: SVGGElement, pos: PointOnShape) {
    const p = evalDeCasteljau(pos.curve.ps, pos.t);

    const $elems = drawFs.crossHair( 
            g, p, 'red thin10 nofill'
    );  
    
    return $elems;
}


export { minY }
