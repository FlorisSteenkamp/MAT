import { getBounds } from 'flo-bezier3';
import { memoize } from 'flo-memoize';
import { createPos } from '../point-on-shape/create-pos.js';
/** @internal */
const INF = Number.POSITIVE_INFINITY;
/**
 * @internal
 */
const getLoopBounds = memoize(function (loop) {
    const extremes = [
        [
            { bezier: undefined, t: undefined, val: INF },
            { bezier: undefined, t: undefined, val: INF }
        ],
        [
            { bezier: undefined, t: undefined, val: -INF },
            { bezier: undefined, t: undefined, val: -INF }
        ]
    ];
    loop.curves.forEach(function (curve) {
        const ps = curve.ps;
        // const bounds = getBounds_(ps);
        const bounds = getBounds(ps);
        {
            {
                const v = bounds.box[0][0];
                const x = extremes[0][0].val;
                if (v < x || (v === x && bounds.ts[0][0] > extremes[0][0].t)) {
                    extremes[0][0] = {
                        bezier: curve,
                        t: bounds.ts[0][0],
                        val: v
                    };
                }
            }
            {
                const v = bounds.box[0][1];
                const x = extremes[0][1].val;
                if (v < x || (v === x && bounds.ts[0][1] > extremes[0][1].t)) {
                    extremes[0][1] = {
                        bezier: curve,
                        t: bounds.ts[0][1],
                        val: v
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
                        bezier: curve,
                        t: bounds.ts[1][0],
                        val: v
                    };
                }
            }
            {
                const v = bounds.box[1][1];
                const x = extremes[1][1].val;
                if (v > x || (v === x && bounds.ts[1][1] > extremes[1][1].t)) {
                    extremes[1][1] = {
                        bezier: curve,
                        t: bounds.ts[1][1],
                        val: v
                    };
                }
            }
        }
    });
    return {
        // minX : new PointOnShape(extremes[0][0].bezier, extremes[0][0].t),
        // minY : new PointOnShape(extremes[0][1].bezier, extremes[0][1].t),
        // maxX : new PointOnShape(extremes[1][0].bezier, extremes[1][0].t),
        // maxY : new PointOnShape(extremes[1][1].bezier, extremes[1][1].t)
        minY: createPos(extremes[0][1].bezier, extremes[0][1].t),
        minX: createPos(extremes[0][0].bezier, extremes[0][0].t),
        maxX: createPos(extremes[1][0].bezier, extremes[1][0].t),
        maxY: createPos(extremes[1][1].bezier, extremes[1][1].t)
    };
});
export { getLoopBounds };
//# sourceMappingURL=get-loop-bounds.js.map