import LlRbTree from 'flo-ll-rb-tree';
import { BezierPiece } from '../../bezier-piece';
import { Loop } from '../../../loop';
import { CpNode } from '../../../cp-node';
import { IPointOnShape } from '../../../point-on-shape';
/** @hidden */
declare function getInitialBezierPieces(isHoleClosing: boolean, k: number, loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, y: IPointOnShape): {
    bezierPieces: BezierPiece[];
    δ: CpNode[];
};
export { getInitialBezierPieces };
