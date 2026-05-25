import type { CpNode } from "../cp-node/cp-node.js";
/**
 *
 * @param holeClosers
 * @returns
 */
declare function getHoleCloserPairs(holeClosers: CpNode[]): Map<CpNode, CpNode>;
export { getHoleCloserPairs };
