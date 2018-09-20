
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface';
import { getBezierCurvatureExtrema } from '../get-bezier-curvature-extrema';

import { Loop } from '../../loop';

import { PointOnShape } from '../../point-on-shape';

//const EXTRA_POINTS = 0;
//const EXTRA_POINTS = 1;
const EXTRA_POINTS = 3;
//const EXTRA_POINTS = 7;
//const EXTRA_POINTS = 15;
//const EXTRA_POINTS = 31;

/**
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 */
function getInterestingPointsOnLoop(loop: Loop) {

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

        for (let i=1; i<EXTRA_POINTS+1; i++) {
            allPoints.push( new PointOnShape(curve, i/(EXTRA_POINTS+1)) );
        }
    }

    allPoints.sort(PointOnShape.compare);

    return allPoints;
}


export { getInterestingPointsOnLoop }
