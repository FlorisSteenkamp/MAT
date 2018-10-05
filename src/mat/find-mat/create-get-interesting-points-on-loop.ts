
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface';
import { getBezierCurvatureExtrema } from '../get-bezier-curvature-extrema';

import { Loop } from '../../loop';

import { PointOnShape } from '../../point-on-shape';


/**
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

            let { maxCurvaturePoss, maxNegativeCurvaturePoss } = 
                getBezierCurvatureExtrema(curve);

            allPoints.push(
                ...getContactCirclesAtInterface(curve), 
                ...maxCurvaturePoss,
                ...maxNegativeCurvaturePoss
            );

            let n = additionalPointCount+1;

            for (let i=1; i<n; i++) {
                allPoints.push( new PointOnShape(curve, i/n) );
            }
        }

        allPoints.sort(PointOnShape.compare);

        return allPoints;
    }
}


export { createGetInterestingPointsOnLoop }
