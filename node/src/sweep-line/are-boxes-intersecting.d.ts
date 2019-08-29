/**
 * @hidden
 * Returns true if the 2 given (closed) boxes intersect. At this stage we already
 * know their x-axis intersect.
 * @param a A rectangular box
 * @param a Another rectangular box
 * @param closed (defaults to true) Interpret boxes as being closed (i.e. they
 * contain their border) or open.
 */
declare function areBoxesIntersecting(closed: boolean): (a: number[][], b: number[][]) => boolean;
export { areBoxesIntersecting };
