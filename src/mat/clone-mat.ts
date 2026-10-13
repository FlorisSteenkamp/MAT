import type { Mat } from "./mat.js";
import { clone } from "../cp-node/fs/clone.js";
import { cloneMeta } from "./clone-meta.js";


/**
 * Returns a deep clone of the given `Mat` (its `CpNode`s are cloned and its
 * `meta` rebuilt for the clones; the boundary loops are shared).
 *
 * @param mat the `Mat` to clone
 */
function cloneMat(
        mat: Mat): Mat {

    const cpNode = clone(mat.cpNode);

    return {
        cpNode,
        meta: cloneMeta(cpNode, mat.meta)
    }
}


export { cloneMat }
