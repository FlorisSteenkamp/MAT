/**
 * Returns an array of loops with each loop consisting of an array of beziers
 * and each bezier in turn consisting of an array of control points from the
 * given SVG path string. An array of loops are returned (as opposed to a single
 * loop) since an SVG path may have sub-paths.
 * @param str The SVG path string, e.g. 'M1 1 C 5 1 5 2 4 2 C 3 3 1 3 1 1 z'
 */
declare function getPathsFromStr(str: string): number[][][][];
export { getPathsFromStr };
