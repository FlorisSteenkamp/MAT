import { Curve } from '../../../curve';
import { IXInfo } from './i-x-info';
/**
 *
 * @param intersections A mapping of intersections to curves
 * @param curBez The current curve
 * @param curT The current t on the current curve
 * @param endBez The end of the loop
 * @param endT The end t of the loop
 */
declare function getNextX(xInfos: IXInfo[], curBez: Curve, curT: number, endBez: Curve, endT: number): number;
export { getNextX };
