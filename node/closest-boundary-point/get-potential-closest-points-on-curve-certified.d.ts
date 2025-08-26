import { Curve } from "../curve/curve.js";
import { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
/**
 * @internal
 * @param curve The curve
 * @param x The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
declare function getPotentialClosestPointsOnCurveCertified(pow: number, curve: Curve, x: number[], [tS, tE]?: number[], touchedCurve?: Curve | undefined, t?: number | undefined, for1Prong?: boolean, angle?: number): FootAndEndpointInfo[];
export { getPotentialClosestPointsOnCurveCertified };
