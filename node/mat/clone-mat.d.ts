import type { Mat } from "./mat.js";
/**
 * Returns a deep clone of the given `Mat` (its `CpNode`s are cloned and its
 * `meta` rebuilt for the clones; the boundary loops are shared).
 *
 * @param mat the `Mat` to clone
 */
declare function cloneMat(mat: Mat): Mat;
export { cloneMat };
