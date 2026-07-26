import { controlPointLinesLength } from 'flo-bezier3';
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
                const { ps } = curve;
                const p = ps[ps.length - 1];
                const pDd = [[0, p[0]], [0, p[1]]];
                sharpCorners.push({ curve, t: 1, isSource: true, p, pDd });
            }
        }
        return sharpCorners;
    };
}
export { getSharpCornersOnLoop };
//# sourceMappingURL=get-sharp-corners.js.map