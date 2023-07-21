import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../../../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
declare function findAndAdd3Prongs(cpGraphs: Map<Loop, LlRbTree<CpNode>>, cpStart: CpNode, extreme: number): CpNode[];
export { findAndAdd3Prongs };
