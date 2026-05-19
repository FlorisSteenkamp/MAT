import { Loop } from 'flo-boolean';
import { CurvePiece } from '../mat/curve-piece.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
import { MatMeta } from '../index.js';
/** @internal */
declare function getInitialBezierPieces(angle: number, isHoleClosing: boolean, loop: Loop, loops: Loop[], meta: MatMeta, y: PointOnShape, circle: Circle): CurvePiece[];
export { getInitialBezierPieces };
