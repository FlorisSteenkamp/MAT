import { CpNode } from '../../../linked-list/cp-node';
import { CpGraph } from '../../../linked-list/cp-graph';
import { Loop } from '../../../linked-list/loop';
/**
 * Finds and adds all 3-prongs.
 * @param cpStart The CpNode to start traversing from.
 */
declare function findAndAdd3Prongs(cpGraphs: Map<Loop, CpGraph>, cpStart: CpNode): void;
export { findAndAdd3Prongs };
