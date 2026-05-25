import { CpNode } from "../cp-node.js";
/**
 * Returns true if this `CpNode` represents a sharp corner, i.e. the
 * limiting case of a two-prong having zero radius.
 *
 * Note that two `CpNode`s are stored for each sharp corner, one being
 * terminating and one not. See `isTerminating` for more details.
 */
declare function isSharp(cpNode: CpNode): boolean;
export { isSharp };
