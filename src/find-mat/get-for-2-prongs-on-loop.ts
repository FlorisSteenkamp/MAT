import { splitByCurvatureAndLength, controlPointLinesLength, fitQuadsToCubic, getInflections } from 'flo-bezier3';
import { Loop } from 'flo-boolean';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { fitQuadsToCubicTsOnly } from '../bezier/fit-quads-to-cubic.js';


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
        const for2Prongs: PointOnShape[] = [];

        const curves = loop.curves;
        for (let i=0; i<curves.length; i++) {
            const curve = curves[i];
            const ps = curve.ps;

            if (controlPointLinesLength(ps) < minBezLength) {
                continue;
            }
            
            let ts = splitByCurvatureAndLength(ps, maxCurviness, maxLength);
            // let ts = [0,0.25,0.5,0.75,1];
            // let ts = [0,0.5 + 2**-20,1];
            // let ts = ps.length <= 3 ? [0,1] : fitQuadsToCubicTsOnly(ps, 1);

            ts = ts.length === 2 ? [0.5] : ts;
            ts.push(...getInflections(ps));
            ts = ts.filter(t => t !== 0 && t !== 1);

            const byCurvatureAndLength = 
                ts.map(t => createPos(curve, t, true));

            for2Prongs.push(...byCurvatureAndLength);
        }

        return for2Prongs;
    }
}


export { getFor2ProngsOnLoop }
