import type { CpNode } from '../cp-node/cp-node.js';
import type { MatchedBeziers } from './matched-beziers.js';
/**
 * Returns a correspondence between boundary bezier curves and a medial axis
 * bezier curve. They will later be interpolated.
 *
 * @param cpNode the start `CpNode`
 */
declare function getMatchingBeziers(cpNode: CpNode): MatchedBeziers[] | undefined;
export { getMatchingBeziers };
