import { clone } from "../cp-node/fs/clone.js";
import { cloneMeta } from "./clone-meta.js";
import { Mat } from "./mat.js";


function cloneMat(mat: Mat): Mat {
    return {
        cpNode: clone(mat.cpNode),
        meta: cloneMeta(mat.meta)
    }
}


export { cloneMat }
