import { createPos } from '../point-on-shape/create-pos.js';
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
                sharpCorners.push(createPos(curve, 1, true));
            }
        }
        // console.log(sharpCorners)
        return sharpCorners;
    };
}
export { getSharpCornersOnLoop };
//# sourceMappingURL=get-sharp-corners.js.map