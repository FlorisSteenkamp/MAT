
import * as Bezier3 from 'flo-bezier3';
import Memoize from 'flo-memoize';
import * as Vector from 'flo-vector2d';

import { Loop } from '../../loop';
import { Curve } from '../../curve';

import { getLoopBounds } from './get-loop-bounds';

let { m1: memoize } = Memoize;


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
    
    let tan = Bezier3.tangent(ps)(t);

    if (t !== 1) {
        // Not a sharp corner
        return tan[1] < 0;
    }

    let psNext = curve.next.ps;	
    let tanNext = Bezier3.tangent(psNext)(0);

    if (tan[1] * tanNext[1] > 0) {
        // Both tangents points up or both points down.
        return tan[1] < 0;
    }

    // One tangent points up and the other down.
    let c = Vector.cross(tan, tanNext);

    return c > 0;

    // We don't check for the very special case where the cross === 0. 
});


/*
let isPathPositivelyOrientated = memoize(function(bezierLoop: Loop) {
    const extremes = getLoopBounds(bezierLoop);

    const minXBezierNode = extremes.minX.curve;

    const ps = minXBezierNode.ps;

    
    const ts = Bezier3.getBounds(ps).ts;
    const tAtMinX = ts[0][0];

    const tan = Bezier3.tangent(ps)(tAtMinX);

    if (tAtMinX !== 1) {
        // Not a sharp corner
        return tan[1] < 0;
    }

    const psNext = minXBezierNode.next.ps;	
    const tanNext = Bezier3.tangent(psNext)(0);

    if (tan[1] * tanNext[1] > 0) {
        // Both tangents points up or both points down.
        return tan[1] < 0;
    }

    // One tangent points up and the other down.
    let c = Vector.cross(tan, tanNext);

    return c > 0;

    // We don't check for the very special case where the cross === 0. 
});
*/


export { isPathPositivelyOrientated }
