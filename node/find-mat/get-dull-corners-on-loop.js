import { createPos } from '../point-on-shape/create-pos.js';
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
            if (getCorner(curve.ps, curve.next.ps).isQuiteDull) {
                dullCorners.push(createPos(curve, 1, true));
                dullCorners.push(createPos(curve.next, 0, true));
            }
        }
        return dullCorners;
    };
}
export { getDullCornersOnLoop };
//# sourceMappingURL=get-dull-corners-on-loop.js.map