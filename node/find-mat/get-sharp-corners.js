import { controlPointLinesLength } from 'flo-bezier3';
import { toP } from '../point-on-shape/to-p.js';
import { getCorner } from '../corner/get-corner.js';
/** @internal */
function getSharpCornersOnLoop(minBezLength) {
    return (loop) => {
        const sharpCorners = [];
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            if (getCorner(curve.ps, curve.next.ps).isQuiteSharp) {
                sharpCorners.push({ curve, t: 1, isSource: true, p: toP(curve.ps, 1) });
            }
        }
        return sharpCorners;
    };
}
export { getSharpCornersOnLoop };
//# sourceMappingURL=get-sharp-corners.js.map