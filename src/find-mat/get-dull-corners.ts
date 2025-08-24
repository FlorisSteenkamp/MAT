import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Loop } from 'flo-boolean';
import { createPos } from '../point-on-shape/create-pos.js';
import { getCornerAtEnd } from '../curve/curve.js';
import { controlPointLinesLength } from 'flo-bezier3';


/** @internal */
function getDullCornersOnLoop(
        minBezLength: number) {

    return (loop: Loop) => {
        const dullCorners: PointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            
            if (getCornerAtEnd(curve).isQuiteDull) {
                dullCorners.push(createPos(curve, 1, true));
                dullCorners.push(createPos(curve.next, 0, true));
            }
        }

        return dullCorners;
    }
}



export { getDullCornersOnLoop }
