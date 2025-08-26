import { CpNode } from "../cp-node/cp-node.js";
import { DualSet } from "../utils/dual-set.js";
declare function getSatCulls(cpNode: CpNode, s: number): DualSet<number, number>;
export { getSatCulls };
