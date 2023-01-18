import { totalAbsoluteCurvature } from 'flo-bezier3';
import { getCurvatureAtInterface } from '../../svg/get-curvature-at-interface.js';
import { getTotalBy } from './get-total-by.js';


/**
 * @hidden
 */
const getTotalAbsoluteCurvature = getTotalBy(
    curve => (
        totalAbsoluteCurvature(curve.ps, [0,1]) + 
        Math.abs(getCurvatureAtInterface(curve))
    )
);


export { getTotalAbsoluteCurvature }
