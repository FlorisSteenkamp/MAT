/**
 * Generalized sweepline algorithm.
 *
 * Typically used to turn O(n^2) algorithms into roughly O(n logn) algorithms.
 *
 * @param items An array of items that are to be compared. Items should
 * typically be geometric objects in 2d space with well-defined left and right
 * endpoints.
 * @param getLeftmostPoint A function that returns the leftmost point of the
 * geometric object of interest.
 * @param getRightmostPoint A function that returns the rightmost point of the
 * geometric object of interest.
 * @param predicate A predicate that takes two geometric objects and returns
 * true if they are of interest or false otherwise.
 */
declare function sweepLine<T>(items: T[], getLeftmost: (item: T) => number, getRightmost: (item: T) => number, predicate: (item1: T, item2: T) => boolean): T[][];
export { sweepLine };
