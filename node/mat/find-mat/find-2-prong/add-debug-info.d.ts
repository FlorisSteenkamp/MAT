import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { Circle } from '../../../circle.js';
import { CpNode } from '../../../cp-node/cp-node.js';
import { BezierPiece } from '../../bezier-piece.js';
import { TXForDebugging } from './x-for-debugging.js';
/** @internal */
declare function addDebugInfo(bezierPieces: BezierPiece[], failed: boolean, pos: PointOnShape, circle: Circle, z: PointOnShape, δ: CpNode[], xs: TXForDebugging[], holeClosing: boolean): void;
export { addDebugInfo };
