import { getCurvatureExtrema, splitByCurvatureAndLength, controlPointLinesLength } from 'flo-bezier3';
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface.js';
import { Loop } from '../../loop.js';
import { PointOnShape, comparePoss, IPointOnShape } from '../../point-on-shape.js';


/**
 * @hidden
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 * @param additionalPointCount 
 */
function getInterestingPointsOnLoop(
        minBezLength: number,
        maxFlatness: number,
        maxLength: number) {

    return function(loop: Loop) {
        let allPoints: IPointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            let curve = loop.curves[i];

            // qqq if (lengthSquaredUpperBound(curve.ps) < minBezLength) {
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            

            /*
            let { maxCurvatureTs, maxNegativeCurvatureTs } = 
                getCurvatureExtrema(curve.ps);
            let maxCurvatures = maxCurvatureTs.map(t => new PointOnShape(curve, t));
            let maxNegativeCurvatures = maxNegativeCurvatureTs.map(t => new PointOnShape(curve, t));

            allPoints.push(
                ...getContactCirclesAtInterface(curve), 
                ...maxCurvatures,
                ...maxNegativeCurvatures
            );
            */

            // let { maxima } = getCurvatureExtrema(curve.ps);
            // qqq let { maxCurvatureTs, maxNegativeCurvatureTs } = getCurvatureExtrema(curve.ps);
            let { maxima } = getCurvatureExtrema(curve.ps);
            // let maxAbsCurvatures = maxima.map(t => new PointOnShape(curve, t));
            // qqq let maxAbsCurvatures = [...maxCurvatureTs, ...maxNegativeCurvatureTs].map(t => new PointOnShape(curve, t));
            let maxAbsCurvatures = [...maxima].map(t => new PointOnShape(curve, t));

            allPoints.push(
                ...getContactCirclesAtInterface(curve), 
                ...maxAbsCurvatures,
            );

            let ts = splitByCurvatureAndLength(curve.ps, maxFlatness, maxLength);
            if (ts.length === 2) {
                ts = [0, 0.5, 1];
            }

            for (let i=1; i<ts.length-1; i++) {
                allPoints.push( new PointOnShape(curve, ts[i]) );
            }
        }

        allPoints.sort(comparePoss);

        return allPoints;
    }
}


export { getInterestingPointsOnLoop }
