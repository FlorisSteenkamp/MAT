import type { CpNode } from '../cp-node.js';
/**
 * Returns all `CpNode`s on the MAT that this `CpNode` is part of
 * starting from the current one and going anti-clockwise around the shape
 * going loop by loop.
 *
 * * sometimes more useful than `getAllOnLoop` since this function returns an
 *   array of `CpNode`s for each loop seperately.
 */
declare function getAllOnLoop_ByLoop(cpNode: CpNode): CpNode[][];
export { getAllOnLoop_ByLoop };
