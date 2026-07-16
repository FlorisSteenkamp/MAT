import type { DualSet } from "../utils/dual-set.js";
import type { CpNode } from "../cp-node/cp-node.js";
declare function getSatCulls(cpNode: CpNode, s: number): DualSet<number, number>;
export { getSatCulls };
