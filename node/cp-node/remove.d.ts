import LlRbTree from "flo-ll-rb-tree";
import { CpNode } from "./cp-node";
/**
 * TODO: description very wrong
 * Removes a cpNode from the Mat. Returns true if successful, false if the
 * [[CpNode]] has contact point count !== 2. 3-prongs and above cannot be
 * removed since it would cause a change in MAT topology. Leaves are also not
 * removed. Even if there are >= 3 contact points and some are terminating such
 * that it is effectively a two-prong, it is not removed.
 *
 * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
 * @param cpNode The [[CpNode]] to remove.
 */
declare function removeCpNode(cpNode: CpNode, cpTree?: LlRbTree<CpNode>): void;
export { removeCpNode };
