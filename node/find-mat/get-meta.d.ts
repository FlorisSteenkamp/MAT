import { Loop } from 'flo-boolean';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node/cp-node.js';
import { MatMeta } from '../mat/mat-meta.js';
/** @internal */
declare function getMeta(maxCoordinate: number, squaredDiagonalLength: number, loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>): MatMeta;
/** @internal */
declare function addDebugInfo2(): void;
declare function addDebugInfo3(): void;
declare function addDebugInfo4(): void;
export { getMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
