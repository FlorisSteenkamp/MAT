import { Curve } from '../curve';
import { PointOnShape } from '../point-on-shape';
/**
 * Finds the osculating circles and inflection points for the given bezier.
 * @param curve
 */
declare function getBezierCurvatureExtrema(curve: Curve): {
    maxCurvaturePoss: PointOnShape[];
    maxNegativeCurvaturePoss: PointOnShape[];
};
export { getBezierCurvatureExtrema };
