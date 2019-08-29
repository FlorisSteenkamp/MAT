import LlRbTree from 'flo-ll-rb-tree';
import { Loop } from "../../loop";
import { CpNode } from '../../cp-node';
import { PointOnShape } from '../../point-on-shape';
/**
 * @hidden
 * Find and add two-prongs.
 * @param loops
 * @param cpGraphs
 * @param k
 * @param for2Prongs
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAdd2Prongs(loops: Loop[], cpGraphs: Map<Loop, LlRbTree<CpNode>>, k: number, for2Prongs: PointOnShape[], extreme: number): CpNode;
export { findAndAdd2Prongs };
