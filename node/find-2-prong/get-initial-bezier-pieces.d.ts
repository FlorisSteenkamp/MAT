import type { Loop } from 'flo-boolean';
import type { CurvePiece } from '../mat/curve-piece.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/** @internal */
declare function getInitialCurvePieces(angle: number, isHoleClosing: boolean, loop: Loop, loops: Loop[], meta: MatMeta, yPos: PrePointOnShape, xO: number[]): CurvePiece[];
export { getInitialCurvePieces };
