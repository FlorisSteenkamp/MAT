import { CpNode } from "../../cp-node";
/**
 * Returns a deep clone of this [[CpNode]]. Can be used to copy the MAT
 * since cloning a single [[CpNode]] necessarily implies cloning all
 * [[CpNode]]s on the same MAT tree.
 */
declare function clone(cpNode: CpNode): CpNode;
export { clone };
