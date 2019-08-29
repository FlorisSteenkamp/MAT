
import { totalAbsoluteCurvature } from 'flo-bezier3';
import { getCurvatureAtInterface } from '../../svg/fs/get-curvature-at-interface';
import { getTotalBy } from './get-total-by';


/**
 * @hidden
 */
let getTotalAbsoluteCurvature = getTotalBy(
    curve => (
        totalAbsoluteCurvature(curve.ps, [0,1]) + 
        Math.abs(getCurvatureAtInterface(curve))
    )
);


export { getTotalAbsoluteCurvature }
