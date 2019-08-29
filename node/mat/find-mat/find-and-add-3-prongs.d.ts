import LlRbTree from 'flo-ll-rb-tree';
import { CpNode } from '../../cp-node';
import { Loop } from '../../loop';
/**
 * @hidden
 * Finds and adds all 3-prongs.
 * @param cpGraphs
 * @param cpStart The CpNode to start traversing from.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAddAll3Prongs(cpGraphs: Map<Loop, LlRbTree<CpNode>>, cpStart: CpNode, extreme: number): void;
export { findAndAddAll3Prongs };
