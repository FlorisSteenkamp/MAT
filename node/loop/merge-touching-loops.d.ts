import type { Loop } from 'flo-boolean';
/**
 * @internal
 * Returns the given loops (of a single shape) with loops that touch at a point
 * (i.e. share a vertex) merged into a single boundary walk, e.g. a hole
 * touching the outer loop.
 *
 * Loops that touch at a point are returned separately (by `simplifyPaths`)
 * even when the material near the point lies in thin wedges each bounded by a
 * curve of *both* loops. The boundary walk must then go from the incoming curve
 * of one loop to the outgoing curve of the other so that every pair of
 * consecutive curves is a real corner of the material (and so that a touching
 * hole doesn't need a hole-closer; the medial axis has no cycle around it).
 *
 * At each such point the curves are sorted (exactly) by angle and each
 * incoming curve is followed by the next curve anti-clockwise, i.e. the one on
 * the other side of the material sector. If the loops' own pairing is already
 * correct (e.g. a material island inside a hole touching the hole's boundary)
 * nothing changes.
 *
 * Merges that would split a walk (e.g. a hole touching the outer loop at 2
 * points, which splits the material into 2 parts) are not supported - in that
 * case (or if the pairing cannot be determined) the loops are returned as is.
 *
 * Precondition: the loops are ordered by their topmost points (the order is
 * kept, a merged loop taking the place of its first constituent loop).
 *
 * @param loops
 */
declare function mergeTouchingLoops(loops: Loop[]): Loop[];
export { mergeTouchingLoops };
