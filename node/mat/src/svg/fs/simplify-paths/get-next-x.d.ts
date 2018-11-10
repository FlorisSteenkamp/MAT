import { X } from '../../../x/x';
/**
 *
 * @param xs An array of intersections on the curve
 * @param curT The current t value
 * @param forwards If true go forwards else go backwards
 */
declare function getNextX(xs: X[], curT: number, forwards: boolean, wasOnX: boolean): X;
/**
 *
 * @param xs An array of intersections on the curve
 * @param t The current t value
 */
declare function getThisX(xs: X[], t: number): X;
export { getNextX, getThisX };
