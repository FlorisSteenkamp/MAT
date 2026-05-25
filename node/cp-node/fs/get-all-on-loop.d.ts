import type { CpNode } from "../cp-node.js";
/**
 * Returns all `CpNode`s on the MAT that this `CpNode` is part of
 * starting from the current one and going anti-clockwise around the shape.
 */
declare function getAllOnLoop(cpNode: CpNode): CpNode[];
export { getAllOnLoop };
