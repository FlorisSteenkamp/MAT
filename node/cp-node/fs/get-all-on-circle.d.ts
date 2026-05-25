import type { CpNode } from "../cp-node.js";
/**
 * Return this (except if exclThis is truthy) and the the other CpNodes
 * around the maximal disk vertex circle in an anti-clockwise order.
 * @param exclThis If true the returned array does not include this
 * `CpNode`.
 */
declare function getAllOnCircle(cpNode: CpNode, exclThis?: boolean): CpNode[];
export { getAllOnCircle };
