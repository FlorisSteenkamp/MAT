import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
import { CpNode } from '../cp-node/cp-node.js';
import { BezierPiece } from '../mat/bezier-piece.js';
import { TXForDebugging } from './x-for-debugging.js';
/** @internal */
declare function addDebugInfo(bezierPieces: BezierPiece[], failed: boolean, x: number[], y: PointOnShape, z: PointOnShape, circle: Circle, δ: CpNode[], xs: TXForDebugging[], holeClosing: boolean): void;
export { addDebugInfo };
