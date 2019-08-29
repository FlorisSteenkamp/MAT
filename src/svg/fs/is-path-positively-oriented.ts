
import { tangent } from 'flo-bezier3';
import { memoize } from 'flo-memoize';
import { Loop } from '../../loop/loop';
import { Curve, getCorner } from '../../curve';
import { getLoopBounds } from './get-loop-bounds';


/**
 * @hidden
 * Returns true if the given beizer loop is positively orientated, false 
 * otherwise. Careful! Checks leftmost part of loop so twisted complex paths
 * may give an ambiguous orientation.
 */
let isPathPositivelyOrientated = memoize(function(loop: Loop) {
    let extreme = getLoopBounds(loop).minY;

    let t = extreme.t;
    let curve: Curve;

    if (t === 0) {
        curve = extreme.curve.prev;
        t = 1;
    } else {
        curve = extreme.curve;
    }

    let ps = curve.ps;
    
    let tan = tangent(ps)(t);

    if (t !== 1) {
        // Not a sharp corner
        return tan[0] > 0;
    }

    let psNext = curve.next.ps;	
    let tanNext = tangent(psNext)(0);

    if (tan[0] * tanNext[0] > 0) {
        // Both tangents points left or both points right.
        return tan[0] > 0;
    }

    let corner = getCorner(ps, psNext);

    return corner.isDull;
});


export { isPathPositivelyOrientated }
