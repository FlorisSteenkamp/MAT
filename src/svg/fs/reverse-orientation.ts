
import { reverse } from 'flo-bezier3';

import { Loop } from '../../loop/loop';


/**
 * Returns a completely reversed loop of the given bezier loop.
 * @param loop
 */
function reverseOrientation(loop: Loop) {

    let beziers = [];

    let curves = loop.curves;

    for (let i=curves.length-1; i>=0; i--) {
        let curve = reverse(curves[i].ps);
        
        beziers.push(curve);
    }

    return Loop.fromCubicBeziers(beziers);
}


export { reverseOrientation }
