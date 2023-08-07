import { getCurvatureExtremaDd, getCurvatureExtremaE, controlPointLinesLength, getCurvatureExtrema } from 'flo-bezier3';
import { Loop } from 'flo-boolean';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';


/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 * @param additionalPointCount 
 */
function getFor1ProngsOnLoop(
        minBezLength: number) {

    return function(loop: Loop) {
        const for1Prongs: PointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            
            // const { minima, maxima } = getCurvatureExtrema(curve.ps);
            const { minima, maxima } = getCurvatureExtremaDd(curve.ps);
            // const { minima, maxima } = getCurvatureExtremaE(curve.ps);
            const maxAbsCurvatures = [...minima, ...maxima].map(t => createPos(curve, t, true));

            for1Prongs.push(...maxAbsCurvatures);
        }

        return for1Prongs;
    }
}


export { getFor1ProngsOnLoop }
