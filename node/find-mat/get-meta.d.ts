import type { Loop } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import type { TriMap } from '../utils/tri-map.js';
import type { MatMeta } from '../mat/mat-meta.js';
import { RbTree } from 'flo-ll-rb-tree';
/** @internal */
declare function getPointToCpNode(loops: Loop[], cpTrees: Map<Loop, RbTree<CpNode>>): TriMap<Loop, number, number, CpNode>;
/** @internal */
declare function getPartialMeta(loops: Loop[]): Omit<MatMeta, 'cpTrees' | 'loops' | 'maxCoordPowerOf2' | 'squaredDiagonalLength' | 'lastInsertId'>;
/** @internal */
declare function addDebugInfo2(): void;
declare function addDebugInfo3(): void;
declare function addDebugInfo4(): void;
export { getPointToCpNode, getPartialMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
