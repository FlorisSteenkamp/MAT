import { Curve } from '../../curve';
/**
 * Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param curve
 */
declare function getCurvatureAtInterface(curve: Curve): number;
export { getCurvatureAtInterface };
