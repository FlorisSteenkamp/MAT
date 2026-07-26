import type { Loop } from 'flo-boolean';
import type { MatMeta } from '../mat/mat-meta.js';
/** @internal */
declare function getPartialMeta(loops: Loop[]): Omit<MatMeta, 'cpTrees' | 'loops' | 'maxCoordPowerOf2' | 'squaredDiagonalLength' | 'lastInsertId'>;
declare function addDebugInfo1(): void;
/** @internal */
declare function addDebugInfo2(): void;
/** @internal */
declare function addDebugInfo3(): void;
/** @internal */
declare function addDebugInfo4(): void;
export { getPartialMeta, addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
