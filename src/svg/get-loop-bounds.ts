import type { Curve, Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { memoize } from 'flo-memoize';
import { getBounds } from 'flo-bezier3';
import { toP } from '../point-on-shape/to-p.js';


type Extreme = {
    curve: Curve;
    t: number;
    val: number;
};


function toPrePoint(extreme: Extreme): PrePointOnShape {
    return {
        curve: extreme.curve,
        t: extreme.t,
        isSource: true,
        p: toP(extreme.curve.ps, extreme.t)
    };
}


function updateExtreme(
        extreme: Extreme,
        curve: Curve,
        t: number,
        val: number,
        isMax: boolean): void {

    if (
        (isMax && (val > extreme.val || (val === extreme.val && t > extreme.t))) ||
        (!isMax && (val < extreme.val || (val === extreme.val && t > extreme.t)))
    ) {
        extreme.curve = curve;
        extreme.t = t;
        extreme.val = val;
    }
}


/** 
 * @internal 
 */
const getLoopBounds$ = memoize(function(
        loop: Loop): {
        minX: PrePointOnShape;
        minY: PrePointOnShape;
        maxX: PrePointOnShape;
        maxY: PrePointOnShape } {

    const mins: Extreme[] = [
        { curve: undefined!, t: undefined!, val: Infinity },
        { curve: undefined!, t: undefined!, val: Infinity }
    ];

    const maxs: Extreme[] = [
        { curve: undefined!, t: undefined!, val: -Infinity },
        { curve: undefined!, t: undefined!, val: -Infinity }
    ];


    loop.curves.forEach(function(curve: Curve): void {
        const ps = curve.ps; 
        const bounds = getBounds(ps);

        for (let axis = 0; axis < 2; axis++) {
            updateExtreme(mins[axis], curve, bounds.ts[0][axis], bounds.box[0][axis], false);
            updateExtreme(maxs[axis], curve, bounds.ts[1][axis], bounds.box[1][axis], true);
        }
    });

    return {
        minX: toPrePoint(mins[0]),
        minY: toPrePoint(mins[1]),
        maxX: toPrePoint(maxs[0]),
        maxY: toPrePoint(maxs[1])
    };
});


export { getLoopBounds$ }
