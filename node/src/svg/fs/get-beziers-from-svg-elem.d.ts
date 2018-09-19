/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
declare function getBeziersFromSvgElem(elem: SVGElement): number[][][][];
export { getBeziersFromSvgElem };
