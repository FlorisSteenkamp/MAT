import { controlPointLinesLength } from 'flo-bezier3';
import { getCorner } from '../corner/get-corner.js';
/** @internal */
function getDullCornersOnLoop(minBezLength) {
    return (loop) => {
        const dullCorners = [];
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            const { next, ps } = curve;
            if (getCorner(ps, next.ps).isQuiteDull) {
                const p = ps[ps.length - 1];
                dullCorners.push({ curve, t: 1, isSource: true, p });
                dullCorners.push({ curve: next, t: 0, isSource: true, p });
            }
        }
        return dullCorners;
    };
}
export { getDullCornersOnLoop };
//# sourceMappingURL=get-dull-corners-on-loop.js.map