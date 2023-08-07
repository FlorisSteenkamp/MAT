import { createPos } from '../point-on-shape/create-pos.js';
import { getCornerAtEnd } from '../curve/curve.js';
import { controlPointLinesLength } from 'flo-bezier3';
/** @internal */
function getSharpCornersOnLoop(minBezLength) {
    return (loop) => {
        const sharpCorners = [];
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            if (getCornerAtEnd(curve).isQuiteSharp) {
                sharpCorners.push(createPos(curve, 1, true));
            }
        }
        return sharpCorners;
    };
}
export { getSharpCornersOnLoop };
//# sourceMappingURL=get-sharp-corners.js.map