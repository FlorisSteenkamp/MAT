import { CpNode } from '../cp-node/cp-node.js';
import { MatMeta } from './mat-meta.js';
/**
 * Represents a complete Medial Axis Transform (MAT).
 *
 * The MAT is fully described through its [[CpNode]] property. The [[cpTrees]]
 * property is only added to facilitate extension of the MAT, e.g. by adding
 * extra maximal disks and is typically not used. See [[CpNode]] for more
 * details.
 */
interface Mat {
    /** A complete representation of the MAT. See [[CpNode]]. */
    cpNode: CpNode;
    /**
     * Stores additional info about the shape that could be useful for various
     * purposes in post-processing.
     *
     * Most meta items have a CpNode property to link back to the MAT.
     */
    meta: MatMeta;
}
export { Mat };
