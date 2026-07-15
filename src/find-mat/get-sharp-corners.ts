import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { Loop } from 'flo-boolean';
import { controlPointLinesLength } from 'flo-bezier3';
import { toP } from '../point-on-shape/create-pos.js';
import { getCorner } from '../corner/get-corner.js';


/** @internal */
function getSharpCornersOnLoop(
        minBezLength: number) {

    return (loop: Loop): PrePointOnShape[] => {
        const sharpCorners: PrePointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            
            if (getCorner(curve.ps, curve.next.ps).isQuiteSharp) {
                sharpCorners.push({ curve, t: 1, isSource: true, p: toP(curve.ps, 1) });
            }
        }

        return sharpCorners;
    }
}



export { getSharpCornersOnLoop }
