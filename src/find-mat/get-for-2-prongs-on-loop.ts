import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { splitByCurvatureAndLength, controlPointLinesLength, getInflections } from 'flo-bezier3';
import { toP } from '../point-on-shape/create-pos.js';


/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 * @param additionalPointCount 
 */
function getFor2ProngsOnLoop(
        minBezLength: number,
        maxCurviness: number,
        maxLength: number) {

    return function(loop: Loop) {
        const for2Prongs: PrePointOnShape[] = [];

        const curves = loop.curves;
        for (let i=0; i<curves.length; i++) {
            const curve = curves[i];
            const ps = curve.ps;

            if (controlPointLinesLength(ps) < minBezLength) {
                continue;
            }
            
            let ts = splitByCurvatureAndLength(ps, maxCurviness, maxLength);

            ts = ts.length === 2 ? [0.5] : ts;
            ts.push(...getInflections(ps));
            ts = ts.filter(t => t !== 0 && t !== 1);

            const byCurvatureAndLength: PrePointOnShape[] = 
                ts.map(t => ({ curve, t, isSource: true, p: toP(curve.ps, t) }));

            for2Prongs.push(...byCurvatureAndLength);
        }

        return for2Prongs;
    }
}


export { getFor2ProngsOnLoop }
