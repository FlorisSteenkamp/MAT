import type { Loop } from 'flo-boolean';
import type { MatMeta } from '../mat/mat-meta.js';
/** @internal */
declare function getPartialMeta(loops: Loop[]): Omit<MatMeta, 'cpTrees' | 'loops' | 'maxCoordPowerOf2' | 'squaredDiagonalLength' | 'lastInsertId'>;
/** @internal */
declare function addDebugInfo2(): void;
declare function addDebugInfo3(): void;
declare function addDebugInfo4(): void;
export { getPartialMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
