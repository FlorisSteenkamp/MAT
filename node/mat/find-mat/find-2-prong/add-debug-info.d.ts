import { IPointOnShape } from "../../../point-on-shape";
import { Circle } from "../../../circle";
import { CpNode } from "../../../cp-node";
import { BezierPiece } from '../../bezier-piece';
import { TXForDebugging } from './x-for-debugging';
/** @hidden */
declare function addDebugInfo(bezierPieces: BezierPiece[], failed: boolean, pos: IPointOnShape, circle: Circle, z: IPointOnShape, δ: CpNode[], xs: TXForDebugging[], holeClosing: boolean): void;
export { addDebugInfo };
