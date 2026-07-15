import type { Curve, Loop } from 'flo-boolean';
import type { PointOnShape, PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { memoize } from 'flo-memoize';
import { getBounds } from 'flo-bezier3';
import { toP } from '../point-on-shape/create-pos.js';


/** @internal */
const INF = Infinity;


/** 
 * @internal 
 */
const getLoopBounds = memoize(function(loop: Loop): {
        minX: PrePointOnShape;
        minY: PrePointOnShape;
        maxX: PrePointOnShape;
        maxY: PrePointOnShape } {

    const extremes: { 
        curve: Curve, 
        t: number, 
        val: number 
    }[][] = [
        [
            { curve: undefined!, t: undefined!, val: INF}, 
            { curve: undefined!, t: undefined!, val: INF}
        ], 
        [
            { curve: undefined!, t: undefined!, val: -INF}, 
            { curve: undefined!, t: undefined!, val: -INF}
        ]
    ];
    
    loop.curves.forEach(function(curve: Curve): void {
        const ps = curve.ps; 
        const bounds = getBounds(ps);

        {    
            {
                const v = bounds.box[0][0];
                const x = extremes[0][0].val;
                if (v < x || (v === x && bounds.ts[0][0] > extremes[0][0].t)) { 
                    extremes[0][0] = { 
                        curve : curve, 
                        t      : bounds.ts[0][0],
                        val    : v
                    };
                }
            }

            {
                const v = bounds.box[0][1];
                const x = extremes[0][1].val;
                if (v < x || (v === x && bounds.ts[0][1] > extremes[0][1].t)) { 
                    extremes[0][1] = { 
                        curve : curve, 
                        t      : bounds.ts[0][1],
                        val    : v
                    };
                }
            }
        }

        {    
            {
                const v = bounds.box[1][0];
                const x = extremes[1][0].val;
                if (v > x || (v === x && bounds.ts[1][0] > extremes[1][0].t)) { 
                    extremes[1][0] = { 
                        curve : curve, 
                        t      : bounds.ts[1][0],
                        val    : v
                    };
                }
            }

            {
                const v = bounds.box[1][1];
                const x = extremes[1][1].val;
                if (v > x || (v === x && bounds.ts[1][1] > extremes[1][1].t)) { 
                    extremes[1][1] = { 
                        curve : curve, 
                        t      : bounds.ts[1][1],
                        val    : v
                    };
                }
            }
        }
    });

    // TODO - simplify!
    return {
        // minY : createPos(extremes[0][1].bezier, extremes[0][1].t, true),
        // minX : createPos(extremes[0][0].bezier, extremes[0][0].t, true),
        // maxX : createPos(extremes[1][0].bezier, extremes[1][0].t, true),
        // maxY : createPos(extremes[1][1].bezier, extremes[1][1].t, true)
        minY : { curve: extremes[0][1].curve, t: extremes[0][1].t, isSource: true, p: toP(extremes[0][1].curve.ps, extremes[0][1].t) },
        minX : { curve: extremes[0][0].curve, t: extremes[0][0].t, isSource: true, p: toP(extremes[0][0].curve.ps, extremes[0][0].t) },
        maxX : { curve: extremes[1][0].curve, t: extremes[1][0].t, isSource: true, p: toP(extremes[1][0].curve.ps, extremes[1][0].t) },
        maxY : { curve: extremes[1][1].curve, t: extremes[1][1].t, isSource: true, p: toP(extremes[1][1].curve.ps, extremes[1][1].t) },
    };
});


export { getLoopBounds }
