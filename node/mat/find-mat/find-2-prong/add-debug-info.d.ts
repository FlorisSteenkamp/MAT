import { IPointOnShape } from '../../../point-on-shape.js';
import { Circle } from '../../../circle.js';
import { CpNode } from '../../../cp-node.js';
import { BezierPiece } from '../../bezier-piece.js';
import { TXForDebugging } from './x-for-debugging.js';
/** @hidden */
declare function addDebugInfo(bezierPieces: BezierPiece[], failed: boolean, pos: IPointOnShape, circle: Circle, z: IPointOnShape, δ: CpNode[], xs: TXForDebugging[], holeClosing: boolean): void;
export { addDebugInfo };
