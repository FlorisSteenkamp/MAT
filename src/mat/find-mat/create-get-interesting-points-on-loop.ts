
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface';
import { getCurvatureExtrema, splitByCurvatureAndLength, length, lengthSquaredUpperBound } from 'flo-bezier3';
import { Loop } from '../../loop';
import { PointOnShape, comparePoss, IPointOnShape } from '../../point-on-shape';


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

            if (lengthSquaredUpperBound(curve.ps) < minBezLength) {
                continue;
            }
            

            let { maxCurvatureTs, maxNegativeCurvatureTs } = 
                getCurvatureExtrema(curve.ps);
            let maxCurvatures = maxCurvatureTs.map(t => new PointOnShape(curve, t));
            let maxNegativeCurvatures = maxNegativeCurvatureTs.map(t => new PointOnShape(curve, t));

            allPoints.push(
                ...getContactCirclesAtInterface(curve), 
                ...maxCurvatures,
                ...maxNegativeCurvatures
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
