import type { Mat } from "./mat.js";
import { clone } from "../cp-node/fs/clone.js";
import { cloneMeta } from "./clone-meta.js";


function cloneMat(
        mat: Mat): Mat {

    const { cpNode, meta } = mat;

    return {
        cpNode: clone(cpNode),
        meta: cloneMeta(cpNode, meta)
    }
}


export { cloneMat }
