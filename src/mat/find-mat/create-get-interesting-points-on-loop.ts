
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface';
import { getCurvatureExtrema, splitByCurvatureAndLength } from 'flo-bezier3';
import { Loop } from '../../loop';
import { PointOnShape } from '../../point-on-shape';


/**
 * @hidden
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 * @param additionalPointCount 
 */
function createGetInterestingPointsOnLoop(additionalPointCount = 3) {

    return function(loop: Loop) {

        let allPoints: PointOnShape[] = [];

        for (let i=0; i<loop.curves.length; i++) {
            let curve = loop.curves[i];

            let { maxCurvatureTs, maxNegativeCurvatureTs } = 
                getCurvatureExtrema(curve.ps);
            let maxCurvatures = maxCurvatureTs.map(t => new PointOnShape(curve, t));
            let maxNegativeCurvatures = maxNegativeCurvatureTs.map(t => new PointOnShape(curve, t));

            allPoints.push(
                ...getContactCirclesAtInterface(curve), 
                ...maxCurvatures,
                ...maxNegativeCurvatures
            );

            let ts = splitByCurvatureAndLength(curve.ps, 1.001, 10);
            if (ts.length === 2) {
                ts = [0, 0.5, 1];
            }

            for (let i=1; i<ts.length-1; i++) {
                allPoints.push( new PointOnShape(curve, ts[i]) );
            }
        }

        allPoints.sort(PointOnShape.compare);

        return allPoints;
    }
}


export { createGetInterestingPointsOnLoop }
