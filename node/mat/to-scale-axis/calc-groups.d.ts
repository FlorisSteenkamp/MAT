import { Circle } from '../../circle';
/**
 * @hidden
 * Spacially divide into 5 special groups as follows:
 *
 *   *******||*******|*******|*******|*******||*******
 * 0 <--------------->
 * 1         <--------------->
 * 2                 <--------------->
 * 3                         <--------------->
 * 4                                 <--------------->
 * 5 - If the circle does not fall in any of above 5 groups.
 *
 * Note: In the above, the double pipes denote the limits for
 *       a coordinate, so as can be seen groups 0 and 4 go outside
 *       the limits. Also, groups 1 and 3 are preferred and checked
 *       first.
 *
 * @param s Scale parameter, e.g. 1.1
 * @param coordinate - 0 -> horizontal or 1 -> vertical.
 * @param limits - The limits within which the circle bounds can fall.
 * @param circle - The circle to categorize into a group.
 */
declare function calcGroups(s: number, coordinate: number, limits: number[][], circle: Circle): {
    groups: number[];
    newLimits: number[][];
};
export { calcGroups };
