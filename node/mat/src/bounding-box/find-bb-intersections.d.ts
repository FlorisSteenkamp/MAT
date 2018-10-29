/**
 * Find and return axis-aligned open boxes that intersect via a sweepline
 * algorithm.
 */
declare function findBbIntersections(boxes: number[][][]): {
    box1: number[][];
    box2: number[][];
}[];
export { findBbIntersections };
