/**
 * Returns order 1, 2 and 3 beziers from the given SVG DOM element. If a path
 * data tag is not "C, Q or L, etc", i.e. if it is not an absolute bezier
 * coordinate then it is converted into one.
 * @param paths An SVG element
 */
declare function getBeziersFromRawPaths(paths: {
    type: string;
    values: number[];
}[]): number[][][][];
export { getBeziersFromRawPaths };
