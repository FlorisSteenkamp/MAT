import { memoize } from 'flo-memoize';
import { getBounds } from 'flo-bezier3';
import { toP } from '../point-on-shape/to-p.js';
function toPrePoint(extreme) {
    return {
        curve: extreme.curve,
        t: extreme.t,
        isSource: true,
        p: toP(extreme.curve.ps, extreme.t)
    };
}
function updateExtreme(extreme, curve, t, val, isMax) {
    if ((isMax && (val > extreme.val || (val === extreme.val && t > extreme.t))) ||
        (!isMax && (val < extreme.val || (val === extreme.val && t > extreme.t)))) {
        extreme.curve = curve;
        extreme.t = t;
        extreme.val = val;
    }
}
/**
 * @internal
 */
const getLoopBounds$ = memoize(function (loop) {
    const mins = [
        { curve: undefined, t: undefined, val: Infinity },
        { curve: undefined, t: undefined, val: Infinity }
    ];
    const maxs = [
        { curve: undefined, t: undefined, val: -Infinity },
        { curve: undefined, t: undefined, val: -Infinity }
    ];
    loop.curves.forEach(function (curve) {
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
export { getLoopBounds$ };
//# sourceMappingURL=get-loop-bounds.js.map