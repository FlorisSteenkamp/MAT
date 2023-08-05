import { toCubic, evalDeCasteljau } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';


/** @internal */
function minY(g: SVGGElement, pos: PointOnShape) {
    const p = evalDeCasteljau(pos.curve.ps, pos.t);

    const $elems = drawFs.crossHair( 
            g, p, 'red thin10 nofill'
	);  
	
    return $elems;
}


export { minY }
