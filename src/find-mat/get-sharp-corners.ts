import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Loop } from 'flo-boolean';
import { createPos } from '../point-on-shape/create-pos.js';
import { getCornerAtEnd } from '../curve/curve.js';
import { controlPointLinesLength } from 'flo-bezier3';


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
            
            if (getCornerAtEnd(curve).isQuiteSharp) {
                sharpCorners.push(createPos(curve, 1, true));
            }
        }

        return sharpCorners;
    }
}



export { getSharpCornersOnLoop }
