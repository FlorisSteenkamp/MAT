import { Loop } from 'flo-boolean';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node/cp-node.js';
import { TriMap } from '../utils/tri-map.js';
import { MatMeta } from '../mat/mat-meta.js';
/** @internal */
declare function getPointToCpNode(loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>): TriMap<Loop, number, number, CpNode>;
/** @internal */
declare function getPartialMeta(loops: Loop[]): Omit<MatMeta, 'cpTrees' | 'pointToCpNode' | 'loops' | 'maxCoordinate' | 'squaredDiagonalLength' | 'lastInsertId'>;
/** @internal */
declare function addDebugInfo2(): void;
declare function addDebugInfo3(): void;
declare function addDebugInfo4(): void;
export { getPointToCpNode, getPartialMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
