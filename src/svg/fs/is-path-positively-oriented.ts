
import { tangent } from 'flo-bezier3';
import { cross } from 'flo-vector2d';
import { memoize } from 'flo-memoize';

import { Loop } from '../../loop';
import { Curve } from '../../curve';

import { getLoopBounds } from './get-loop-bounds';


/**
 * Returns true if the given beizer loop is positively orientated, false 
 * otherwise. Careful! Checks leftmost part of loop so twisted complex paths
 * may give an ambiguous orientation.
 */
let isPathPositivelyOrientated = memoize(function(bezierLoop: Loop) {
    let extreme = getLoopBounds(bezierLoop).minX;

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
        return tan[1] < 0;
    }

    let psNext = curve.next.ps;	
    let tanNext = tangent(psNext)(0);

    if (tan[1] * tanNext[1] > 0) {
        // Both tangents points up or both points down.
        return tan[1] < 0;
    }

    // One tangent points up and the other down.
    let c = cross(tan, tanNext);

    return c > 0;

    // We don't check for the very special case where the cross === 0. 
});


export { isPathPositivelyOrientated }
