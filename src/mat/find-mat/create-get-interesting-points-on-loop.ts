import { getCurvatureExtrema, splitByCurvatureAndLength, controlPointLinesLength } from 'flo-bezier3';
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface.js';
import { Loop } from 'flo-boolean';
import { PointOnShape } from '../../point-on-shape/point-on-shape.js';
import { comparePoss } from '../../point-on-shape/compare-poss.js';
import { createPos } from '../../point-on-shape/create-pos.js';


/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 * @param additionalPointCount 
 */
function getInterestingPointsOnLoop(
        minBezLength: number,
        maxCurviness: number,
        maxLength: number) {

    return function(loop: Loop) {
        const allPoints: PointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            const curve = loop.curves[i];

            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            

            const { minima, maxima } = getCurvatureExtrema(curve.ps);
            // const maxAbsCurvatures = [...minima, ...maxima].map(t => createPos(curve, t));
            const maxAbsCurvatures = [...maxima].map(t => createPos(curve, t));

            let ts = splitByCurvatureAndLength(curve.ps, maxCurviness, maxLength);
            // add at least one in the middle
            if (ts.length === 2) { ts = [0, 0.5, 1]; }

            const byCurvatureAndLength = 
                ts.slice(1,ts.length-1).map(t => createPos(curve, t));

            allPoints.push(
                ...getContactCirclesAtInterface(curve), 
                ...maxAbsCurvatures,
                ...byCurvatureAndLength
            );
        }

        allPoints.sort(comparePoss);

        return allPoints;
    }
}


export { getInterestingPointsOnLoop }
