import { CpNode } from "../cp-node.js";
/**
 * Similar to `getChildren` but returns the child nodes of the tree when
 * `CpNode` is seen as a MAT vertex point (as opposed to edge). In this
 * way the dual graph of the tree can easily be traversed - see e.g.
 * `traverseVertices`. Generally, however, traversing the edges is
 * preferred as it returns the entire Medial Axis (by utilizing
 * `getMatCurveToNext` on each returned edge).
 */
declare function getVertexForwardChildren(cpNode: CpNode): CpNode[];
export { getVertexForwardChildren };
