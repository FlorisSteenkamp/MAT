import type { Mat } from '../mat/mat.js';
/**
 * In-place removes trivial 3-prongs from the SAT graph; just to simplify
 * subsequent processing.
 *
 * * **mutates** the given `Mat` (its `CpNode`s are relinked and `cpNode` is
 *   reassigned; `meta.cpTrees` is left stale) - pass a clone if the original
 *   must be kept
 *
 * These are 3-prongs that are induced by the SAT construction, and do
 * not correspond to actual 3-prongs in the shape.
 *
 * @param sat the SAT
 */
declare function removeSatInducedTrivial3Prongs(sat: Mat): Mat;
export { removeSatInducedTrivial3Prongs };
