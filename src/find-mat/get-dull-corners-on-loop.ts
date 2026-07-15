import { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { Loop } from 'flo-boolean';
import { toP } from '../point-on-shape/create-pos.js';
import { controlPointLinesLength } from 'flo-bezier3';
import { getCorner } from '../corner/get-corner.js';


/** @internal */
function getDullCornersOnLoop(
        minBezLength: number) {

    return (loop: Loop): PrePointOnShape[] => {
        const dullCorners: PrePointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            
            if (getCorner(curve.ps, curve.next.ps).isQuiteDull) {
                const p = toP(curve.ps, 1);
                // dullCorners.push(createPos(curve, 1, true));
                // dullCorners.push(createPos(curve.next, 0, true));
                dullCorners.push({ curve, t: 1, isSource: true, p });
                dullCorners.push({ curve: curve.next, t: 0, isSource: true, p });
            }
        }

        return dullCorners;
    }
}



export { getDullCornersOnLoop }
