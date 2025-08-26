import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Loop } from 'flo-boolean';
import { createPos } from '../point-on-shape/create-pos.js';
import { controlPointLinesLength } from 'flo-bezier3';
import { getCorner } from '../corner/get-corner.js';


/** @internal */
function getSharpCornersOnLoop(
        minBezLength: number) {
            
    return (loop: Loop) => {
        const sharpCorners: PointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            
            if (getCorner(curve.ps, curve.next.ps).isQuiteSharp) {
                sharpCorners.push(createPos(curve, 1, true));
            }
        }

        return sharpCorners;
    }
}



export { getSharpCornersOnLoop }
