import { CpNode } from '../cp-node.js';
/**
 * Returns the bezier curve from the maximal disk of one [[CpNode]] to another
 * [[CpNode]]'s maximal disk.
 * @param cpNodeFrom
 * @param cpNodeTo
 */
declare function getCurveBetween(cpNodeFrom: CpNode, cpNodeTo: CpNode): number[][];
export { getCurveBetween };
