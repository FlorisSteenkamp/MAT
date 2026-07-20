import type { Loop } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import type { Curve } from 'flo-boolean';
import { RbTree } from 'flo-ll-rb-tree';
interface MatMeta {
    /** The minimum power of 2 such that `2**maxCoordPowerOf2 >= "the max coordinate"` */
    readonly maxCoordPowerOf2: number;
    readonly squaredDiagonalLength: number;
    readonly looseBoundingBoxes: number[][][];
    readonly tightBoundingBoxes: number[][][];
    readonly boundingHulls: number[][][];
    readonly sharpCorners: Curve[];
    readonly dullCorners: Curve[];
    readonly loops: Loop[];
    /**
     * Primarily for internal use. A tree structure storing the
     * `CpNode`s of the MAT by their compare order, i.e. their cyclic order
     * around the shape boundary.
     */
    readonly cpTrees: Map<Loop, RbTree<CpNode>>;
    /** A map from a bezier and t value to a `PointOnShape` */
    /**
     * Stores the last insert id so each `CpNode` can have a unique id for
     * debugging purposes
     */
    readonly lastInsertId: {
        id: number;
    };
}
export { MatMeta };
