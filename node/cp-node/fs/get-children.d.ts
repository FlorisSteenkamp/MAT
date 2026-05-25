import { CpNode } from "../cp-node.js";
/**
 * Returns the children of this `CpNode` when seen as a MAT edge. Only
 * children in a 'forward' direction are returned. These include all edges
 * except the 'backward' edge given by `prevOnCircle`, even terminating
 * edges.
 */
declare function getChildren(cpNode: CpNode): CpNode[];
export { getChildren };
