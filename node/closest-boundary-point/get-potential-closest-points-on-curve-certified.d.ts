import type { Curve } from "flo-boolean";
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
/**
 * @internal
 *
 * @param maxCoordPowerOf2
 * @param curve the curve
 * @param x the point from which to check
 * @param tRange The allowed t range
 */
declare function getPotentialClosestPointsOnCurveCertified(maxCoordPowerOf2: number, curve: Curve, x: number[], tRange: [number, number]): FootAndEndpointInfo[];
export { getPotentialClosestPointsOnCurveCertified };
